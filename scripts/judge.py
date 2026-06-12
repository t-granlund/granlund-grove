#!/usr/bin/env python3
"""Launch-readiness judge for Granlund Grove (tylergranlund.com).

Evaluates the repo + live site against GOALS.md criteria and reports a score.
Mirrors the HTT Control Tower judge convention, adapted for a TanStack Start /
Cloudflare Workers portfolio.

Two classes of check:
  * repo-local  -- always runnable; probe the source tree / build output.
  * live-site   -- HTTP probes against https://tylergranlund.com. These FAIL
                   until the site ships, which is the whole point: driving the
                   P0 release gate to green == the site is live.

Usage:
    python scripts/judge.py                # human report + release gate
    python scripts/judge.py --json         # machine-readable
    python scripts/judge.py --skip-live    # repo-only (fast, offline)

Stdlib only -- no third-party deps by design (YAGNI).
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
PUBLIC = ROOT / "public"
SITE = SRC / "components" / "site"
DOMAIN = "https://tylergranlund.com"
HTTP_TIMEOUT = 15
UA = {"User-Agent": "granlund-grove-judge/1.0"}

# The four employment rows the Career section must mirror (from the resume).
CAREER_ROWS = [
    "Systems Engineer",
    "IT Director",
    "Outdoor Cap",
    "School of Rock",
]


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------
@dataclass
class Check:
    id: str
    pillar: str
    description: str
    fn: Callable[[], "tuple[bool, str]"]
    severity: str = "P1"
    live: bool = False
    result: bool = False
    detail: str = ""
    elapsed_ms: float = 0.0


@dataclass
class Pillar:
    name: str
    checks: "list[Check]" = field(default_factory=list)
    passed: int = 0
    failed: int = 0


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _run(cmd: "list[str]", timeout: int = 240, env: "dict | None" = None) -> "tuple[int, str]":
    """Run a command in the repo root; return (exit_code, combined_output)."""
    import os

    run_env = {**os.environ, **env} if env else None
    try:
        r = subprocess.run(
            cmd,
            cwd=ROOT,
            capture_output=True,
            text=True,
            timeout=timeout,
            env=run_env,
        )
        return r.returncode, (r.stdout + r.stderr)
    except subprocess.TimeoutExpired:
        return 124, "timeout"
    except Exception as exc:  # noqa: BLE001
        return 1, str(exc)


def _beads_env() -> "dict":
    """Locate the shared .beads dir by walking up from the repo root.

    bd stops auto-discovery at the git root, but the kennel-wide beads DB lives
    higher up (e.g. ~/dev/.beads). Point BEADS_DIR at it explicitly.
    """
    for parent in [ROOT, *ROOT.parents]:
        candidate = parent / ".beads"
        if candidate.is_dir():
            return {"BEADS_DIR": str(candidate)}
    return {}


def _src_text() -> str:
    """Concatenate all .ts/.tsx source for cheap content greps (cached)."""
    global _SRC_CACHE
    if _SRC_CACHE is None:
        parts = []
        for p in SRC.rglob("*.ts*"):
            try:
                parts.append(p.read_text(encoding="utf-8", errors="ignore"))
            except Exception:  # noqa: BLE001
                pass
        _SRC_CACHE = "\n".join(parts)
    return _SRC_CACHE


_SRC_CACHE: "str | None" = None


def _http(url: str, method: str = "GET") -> "tuple[int, dict, str]":
    """Return (status, headers, body[:4096]). status 0 == connection failed."""
    req = urllib.request.Request(url, headers=UA, method=method)
    try:
        with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:
            body = resp.read(4096).decode("utf-8", "ignore") if method == "GET" else ""
            return resp.status, dict(resp.headers), body
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers or {}), ""
    except Exception:  # noqa: BLE001
        return 0, {}, ""


def _read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception:  # noqa: BLE001
        return ""


# ---------------------------------------------------------------------------
# Pillar 1 -- Build & Quality Gates (repo-local, P0)
# ---------------------------------------------------------------------------
def check_typecheck() -> "tuple[bool, str]":
    code, out = _run(["npm", "run", "typecheck"])
    return code == 0, "tsc clean" if code == 0 else out.strip().splitlines()[-1:][0] if out.strip() else "fail"


def check_unit_tests() -> "tuple[bool, str]":
    code, out = _run(["npm", "run", "test"])
    m = re.search(r"Tests\s+(\d+)\s+passed", out)
    n = m.group(1) if m else "?"
    return code == 0, f"{n} passed" if code == 0 else "vitest failures"


def check_build() -> "tuple[bool, str]":
    code, _ = _run(["npm", "run", "build"])
    wrangler_out = (ROOT / "dist" / "server" / "wrangler.json").exists()
    ok = code == 0 and wrangler_out
    return ok, "build OK + Workers output" if ok else f"build exit={code}, wrangler.json={wrangler_out}"


def check_a11y() -> "tuple[bool, str]":
    code, out = _run(["npm", "run", "test:a11y"])
    m = re.search(r"(\d+)\s+passed", out)
    return code == 0, f"{m.group(1) if m else '?'} passed (no serious/critical)" if code == 0 else "axe violations"


def check_e2e() -> "tuple[bool, str]":
    code, out = _run(["npm", "run", "test:e2e"])
    m = re.search(r"(\d+)\s+passed", out)
    return code == 0, f"{m.group(1) if m else '?'} passed" if code == 0 else "e2e failures"


def check_lint() -> "tuple[bool, str]":
    code, out = _run(["npm", "run", "lint"])
    errs = re.search(r"(\d+)\s+error", out)
    n = int(errs.group(1)) if errs else (0 if code == 0 else 1)
    return n == 0, "0 errors" if n == 0 else f"{n} lint errors"


# ---------------------------------------------------------------------------
# Pillar 2 -- Deploy Readiness (P0; G2.1-2.2 repo, G2.3-2.5 live)
# ---------------------------------------------------------------------------
def check_deploy_script() -> "tuple[bool, str]":
    pkg = json.loads(_read(ROOT / "package.json") or "{}")
    scripts = pkg.get("scripts", {})
    deploy = scripts.get("deploy", "")
    ok = "wrangler" in deploy and "deploy" in deploy
    return ok, f"deploy='{deploy}'" if deploy else "no 'deploy' script in package.json"


def check_wrangler_config() -> "tuple[bool, str]":
    raw = _read(ROOT / "wrangler.jsonc")
    need = ["\"name\"", "\"main\"", "compatibility_date", "nodejs_compat"]
    missing = [k for k in need if k not in raw]
    return len(missing) == 0, "name+main+compat+nodejs_compat present" if not missing else f"missing {missing}"


def check_site_live() -> "tuple[bool, str]":
    status, _, _ = _http(DOMAIN)
    return status == 200, f"HTTP {status}" + (" (not live yet)" if status != 200 else "")


def check_www_redirect() -> "tuple[bool, str]":
    status, _, _ = _http("https://www.tylergranlund.com")
    return status in (200, 301, 308), f"www HTTP {status}"


def check_sitemap_robots() -> "tuple[bool, str]":
    s1, _, _ = _http(f"{DOMAIN}/sitemap.xml")
    s2, _, _ = _http(f"{DOMAIN}/robots.txt")
    ok = s1 == 200 and s2 == 200
    return ok, f"sitemap={s1}, robots={s2}"


# ---------------------------------------------------------------------------
# Pillar 3 -- Content Integrity (P1, repo-local)
# ---------------------------------------------------------------------------
PLACEHOLDER_RX = re.compile(r"\b(lorem ipsum|dolor sit amet|placeholder text|TODO:? copy|FIXME copy)\b", re.I)


def check_no_placeholder_copy() -> "tuple[bool, str]":
    hits = PLACEHOLDER_RX.findall(_src_text())
    return len(hits) == 0, "clean" if not hits else f"{len(hits)} placeholder strings found"


def check_number_gate_signed() -> "tuple[bool, str]":
    """The number-verification gate (bd dev-kxh) is signed when this marker
    file exists with a confirmed checklist. Until then, metric copy is unsafe."""
    marker = ROOT / "docs" / "NUMBER_VERIFICATION.md"
    if not marker.exists():
        return False, "docs/NUMBER_VERIFICATION.md missing (bd dev-kxh open)"
    txt = _read(marker)
    ok = "VERIFIED" in txt and "[ ]" not in txt
    return ok, "all numbers verified" if ok else "unchecked items remain"


def check_career_matches_resume() -> "tuple[bool, str]":
    txt = _read(SITE / "Career.tsx")
    missing = [r for r in CAREER_ROWS if r not in txt]
    return len(missing) == 0, "all 4 roles present" if not missing else f"missing: {missing}"


def check_resume_pdfs() -> "tuple[bool, str]":
    pdfs = list(PUBLIC.rglob("*.pdf"))
    names = " ".join(p.name.lower() for p in pdfs)
    variants = sum(k in names for k in ("master", "ai-pm", "fde"))
    ok = variants >= 3
    return ok, f"{len(pdfs)} PDFs, {variants}/3 variants" if pdfs else "no resume PDFs in public/"


# ---------------------------------------------------------------------------
# Pillar 4 -- Case Studies (P1, repo-local) -- the differentiator
# ---------------------------------------------------------------------------
CASE_KEYS = ["Control Tower", "Knowledge Fabric", "Estate Trace", "Zero-secret", "Mysa Mail", "Group Management"]
BEATS = ["Problem", "Architecture", "Outcome"]  # subset of the 5-beat narrative


def check_case_study_model() -> "tuple[bool, str]":
    txt = _read(SITE / "Projects.tsx")
    # A content-driven model: an array/typed shape of case studies, not inline JSX cards.
    ok = bool(re.search(r"(caseStud|CaseStud|const\s+\w+\s*[:=].*\[)", txt)) and "Problem" in txt
    return ok, "structured case-study model present" if ok else "Projects.tsx still shallow cards"


def check_case_study_count() -> "tuple[bool, str]":
    txt = _read(SITE / "Projects.tsx")
    present = [k for k in CASE_KEYS if k in txt]
    ok = len(present) >= 4
    return ok, f"{len(present)}/6 flagship cases ({', '.join(present) or 'none'})"


def check_case_study_beats() -> "tuple[bool, str]":
    # The five-beat narrative labels live in CaseStudyModal.tsx (the cards in
    # Projects.tsx open it); scan both so the model can be split for cohesion.
    txt = _read(SITE / "Projects.tsx") + _read(SITE / "CaseStudyModal.tsx")
    missing = [b for b in BEATS if b not in txt]
    return len(missing) == 0, "narrative beats present" if not missing else f"missing beats: {missing}"


# ---------------------------------------------------------------------------
# Pillar 5 -- SEO / Open Graph / Structured Data (P2, repo-local)
# ---------------------------------------------------------------------------
def check_meta_tags() -> "tuple[bool, str]":
    txt = _src_text()
    have_desc = "description" in txt and re.search(r"name:\s*['\"]description['\"]", txt)
    have_canon = "canonical" in txt
    ok = bool(have_desc) and bool(have_canon)
    return ok, "description+canonical present" if ok else f"desc={bool(have_desc)} canonical={bool(have_canon)}"


def check_og_tags() -> "tuple[bool, str]":
    txt = _src_text()
    have_og = "og:title" in txt or "og:image" in txt
    have_tw = "twitter:card" in txt
    ok = have_og and have_tw
    return ok, "OG + twitter card present" if ok else f"og={have_og} twitter={have_tw}"


def check_jsonld() -> "tuple[bool, str]":
    txt = _src_text()
    ok = "application/ld+json" in txt and '"Person"' in txt
    return ok, "JSON-LD Person present" if ok else "no JSON-LD Person schema"


# ---------------------------------------------------------------------------
# Pillar 6 -- Functionality (P2, repo-local)
# ---------------------------------------------------------------------------
def check_contact_backend() -> "tuple[bool, str]":
    txt = _read(SITE / "Contact.tsx")
    server_files = list(SRC.rglob("*.ts"))
    has_post = "fetch(" in txt and ("/api/" in txt or "POST" in txt)
    has_fn = any("contact" in p.name.lower() and "server" not in p.name.lower() for p in server_files)
    ok = has_post or has_fn
    return ok, "contact POST/Workers fn wired" if ok else "still mailto-only"


def check_analytics() -> "tuple[bool, str]":
    txt = _src_text()
    ok = "cloudflareinsights" in txt.lower() or "beacon.min.js" in txt.lower()
    return ok, "CF Web Analytics beacon present" if ok else "no analytics snippet"


def check_dark_mode_persist() -> "tuple[bool, str]":
    txt = _src_text()
    ok = "localStorage" in txt and re.search(r"theme|color-scheme|dark", txt, re.I) is not None
    return ok, "localStorage theme persistence present" if ok else "no dark-mode persistence"


# ---------------------------------------------------------------------------
# Pillar 7 -- Process (P1)
# ---------------------------------------------------------------------------
def check_bd_no_cycles() -> "tuple[bool, str]":
    env = _beads_env()
    if not env:
        return False, "no .beads dir found"
    code, out = _run(["bd", "dep", "cycles"], timeout=30, env=env)
    if "No dependency cycles" in out:
        return True, "no dependency cycles"
    if "no beads database" in out.lower():
        return False, "bd DB not resolved"
    return code == 0, "no cycles" if code == 0 else "cycle detected"


def check_bd_label_tracked() -> "tuple[bool, str]":
    env = _beads_env()
    if not env:
        return False, "no .beads dir found"
    code, out = _run(["bd", "count", "-l", "granlund-grove"], timeout=30, env=env)
    m = re.search(r"(\d+)", out)
    n = int(m.group(1)) if m else 0
    return n > 0, f"{n} granlund-grove issues tracked"


# ---------------------------------------------------------------------------
# Registry
# ---------------------------------------------------------------------------
def build_checks() -> "list[Check]":
    return [
        # Pillar 1 -- Build & Quality Gates (P0, repo)
        Check("G1.1", "Build & Gates", "TypeScript typecheck clean", check_typecheck, "P0"),
        Check("G1.2", "Build & Gates", "Unit tests pass", check_unit_tests, "P0"),
        Check("G1.3", "Build & Gates", "Build OK + Workers output", check_build, "P0"),
        Check("G1.4", "Build & Gates", "E2E tests pass", check_e2e, "P0"),
        Check("G1.5", "Build & Gates", "A11y (axe) clean", check_a11y, "P0"),
        Check("G1.6", "Build & Gates", "Lint: 0 errors", check_lint, "P1"),
        # Pillar 2 -- Deploy Readiness (P0)
        Check("G2.1", "Deploy", "deploy script present (wrangler)", check_deploy_script, "P0"),
        Check("G2.2", "Deploy", "wrangler config complete", check_wrangler_config, "P0"),
        Check("G2.3", "Deploy", "tylergranlund.com returns 200", check_site_live, "P0", live=True),
        Check("G2.4", "Deploy", "www resolves/redirects", check_www_redirect, "P1", live=True),
        Check("G2.5", "Deploy", "sitemap.xml + robots.txt live", check_sitemap_robots, "P1", live=True),
        # Pillar 3 -- Content Integrity (P1)
        Check("G3.1", "Content", "No placeholder/template copy", check_no_placeholder_copy, "P1"),
        Check("G3.2", "Content", "Number-verification gate signed", check_number_gate_signed, "P1"),
        Check("G3.3", "Content", "Career matches resume", check_career_matches_resume, "P1"),
        Check("G3.4", "Content", "Resume PDFs hosted (3 variants)", check_resume_pdfs, "P1"),
        # Pillar 4 -- Case Studies (P1)
        Check("G4.1", "Case Studies", "Structured case-study model", check_case_study_model, "P1"),
        Check("G4.2", "Case Studies", ">= 4 flagship case studies", check_case_study_count, "P1"),
        Check("G4.3", "Case Studies", "5-beat narrative present", check_case_study_beats, "P1"),
        # Pillar 5 -- SEO / OG (P2)
        Check("G5.1", "SEO", "Meta description + canonical", check_meta_tags, "P2"),
        Check("G5.2", "SEO", "OG + Twitter card tags", check_og_tags, "P2"),
        Check("G5.3", "SEO", "JSON-LD Person schema", check_jsonld, "P2"),
        # Pillar 6 -- Functionality (P2)
        Check("G6.1", "Functionality", "Contact backend (not mailto-only)", check_contact_backend, "P2"),
        Check("G6.2", "Functionality", "Analytics snippet present", check_analytics, "P2"),
        Check("G6.3", "Functionality", "Dark-mode persistence", check_dark_mode_persist, "P2"),
        # Pillar 7 -- Process (P1)
        Check("G7.1", "Process", "No bd dependency cycles", check_bd_no_cycles, "P1"),
        Check("G7.2", "Process", "granlund-grove issues tracked", check_bd_label_tracked, "P2"),
    ]


# ---------------------------------------------------------------------------
# Runner / report
# ---------------------------------------------------------------------------
def run(skip_live: bool) -> "list[Pillar]":
    checks = build_checks()
    pillars: "dict[str, Pillar]" = {}
    for c in checks:
        if skip_live and c.live:
            c.result, c.detail = False, "skipped (--skip-live)"
        else:
            start = time.perf_counter()
            try:
                c.result, c.detail = c.fn()
            except Exception as exc:  # noqa: BLE001
                c.result, c.detail = False, f"check error: {exc}"
            c.elapsed_ms = (time.perf_counter() - start) * 1000
        p = pillars.setdefault(c.pillar, Pillar(c.pillar))
        p.checks.append(c)
        p.passed += int(c.result)
        p.failed += int(not c.result)
    return list(pillars.values())


def print_report(pillars: "list[Pillar]", skip_live: bool) -> int:
    total_pass = sum(p.passed for p in pillars)
    total = sum(len(p.checks) for p in pillars)
    bar = "=" * 70
    print(f"\n{bar}")
    print("  GRANLUND GROVE (tylergranlund.com) -- LAUNCH READINESS JUDGE")
    print(f"  Evaluated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}")
    if skip_live:
        print("  Mode: REPO-ONLY (live-site checks skipped)")
    print(f"{bar}\n")

    for p in pillars:
        emoji = "" if p.failed == 0 else ""
        print(f"{emoji} {p.name} -- {p.passed}/{len(p.checks)} passed")
        for c in p.checks:
            mark = "" if c.result else ""
            print(f"   {mark} {c.id} [{c.severity}] {c.description:<38s} {c.detail}")
        print()

    pct = (total_pass / total * 100) if total else 0
    print("-" * 70)
    print(f"  TOTAL: {total_pass}/{total} passed ({pct:.0f}%)")

    p0_fail = [c for p in pillars for c in p.checks if c.severity == "P0" and not c.result]
    p1_fail = [c for p in pillars for c in p.checks if c.severity == "P1" and not c.result]

    if p0_fail:
        print(f"   LAUNCH BLOCKED: {len(p0_fail)} P0 criterion(s) failed")
        for c in p0_fail:
            print(f"      {c.id}: {c.description} -- {c.detail}")
        return 1
    if len(p1_fail) > 2:
        print(f"   CONDITIONAL: {len(p1_fail)} P1 criteria failed (max 2)")
        return 2
    print("   READY -- launch gate clear")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="Granlund Grove launch-readiness judge")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--skip-live", action="store_true", help="repo-only, skip HTTP probes")
    ap.add_argument(
        "--base-url",
        default=None,
        help="override the live-probe origin (e.g. http://127.0.0.1:4173 to test a local production build)",
    )
    args = ap.parse_args()

    if args.base_url:
        global DOMAIN
        DOMAIN = args.base_url.rstrip("/")

    pillars = run(args.skip_live)

    if args.json:
        out = {
            "domain": DOMAIN,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "skip_live": args.skip_live,
            "pillars": [
                {
                    "name": p.name,
                    "passed": p.passed,
                    "total": len(p.checks),
                    "checks": [
                        {
                            "id": c.id,
                            "description": c.description,
                            "severity": c.severity,
                            "live": c.live,
                            "result": c.result,
                            "detail": c.detail,
                        }
                        for c in p.checks
                    ],
                }
                for p in pillars
            ],
        }
        print(json.dumps(out, indent=2))
        return 1 if any(c.severity == "P0" and not c.result for p in pillars for c in p.checks) else 0

    return print_report(pillars, args.skip_live)


if __name__ == "__main__":
    sys.exit(main())
