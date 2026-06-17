import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { LOCATIONS, TYPE_COLORS } from "./data";

/**
 * Label legibility strategy (fixes the "blob mess"):
 *   1. Front-face cull — a city only shows a label while its point on the globe
 *      faces the camera (surface-normal · vector-to-camera). Back-of-globe
 *      labels no longer bleed through.
 *   2. Screen-space collision — among the front-facing labels, project each to
 *      pixels and greedily keep the highest-priority ones (root > hub > intl,
 *      then most camera-centered), suppressing any that would overlap.
 *   3. Limb fade + lerp — labels fade smoothly as they round the horizon and as
 *      the de-clutter set changes, so nothing pops. Every city still gets its
 *      turn over a full rotation.
 *   4. Hard cap — never more than MAX_LABELS on screen at once, so even a head-on
 *      cluster stays calm.
 */
const MAX_LABELS = 9;
const FACING_MIN = 0.18; // dot-product floor: below this the point is near/behind the limb
const FACING_RAMP = 0.22; // limb fade width
const PAD = 7; // px breathing room between label boxes
const CHAR_HALF = 3.15; // ~half px per char at the label font size
const BOX_HALF_H = 8; // half label height in px

const PRIORITY: Record<"root" | "hub" | "intl", number> = { root: 0, hub: 1, intl: 2 };

function MarkerDot({
  position,
  type,
  onClick,
  isSelected,
}: {
  position: THREE.Vector3;
  type: "root" | "hub" | "intl";
  onClick: () => void;
  isSelected: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const baseSize = type === "root" ? 0.035 : type === "hub" ? 0.028 : 0.022;
  const color = TYPE_COLORS[type];

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const pulse = isSelected
      ? 1.3 + Math.sin(t * 4) * 0.15
      : 1 + Math.sin(t * 2 + position.x * 3) * 0.12;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <group ref={ref} position={position} onClick={onClick}>
      {isSelected && (
        <mesh>
          <ringGeometry args={[baseSize * 3, baseSize * 3.5, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh>
        <sphereGeometry args={[baseSize * 2.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[baseSize, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

export function Markers({
  positions,
  selectedIndex,
  onSelect,
}: {
  positions: THREE.Vector3[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const opacities = useRef<number[]>(positions.map(() => 0));

  // Static per-marker metadata used by the label manager.
  const meta = useMemo(
    () =>
      LOCATIONS.map((loc) => ({
        priority: PRIORITY[loc.type],
        // half-width estimate for the rendered label box, in CSS px
        halfW: loc.name.length * CHAR_HALF + 6,
      })),
    [],
  );

  // Scratch objects — never allocate inside the frame loop.
  const scratch = useMemo(
    () => ({ wp: new THREE.Vector3(), normal: new THREE.Vector3(), toCam: new THREE.Vector3() }),
    [],
  );

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    g.updateWorldMatrix(true, false);
    const M = g.matrixWorld;
    const cam = state.camera;
    const { width, height } = state.size;

    type Item = { i: number; facing: number; sx: number; sy: number };
    const items: Item[] = [];

    for (let i = 0; i < positions.length; i++) {
      const wp = scratch.wp.copy(positions[i]).applyMatrix4(M);
      const normal = scratch.normal.copy(wp).normalize();
      const toCam = scratch.toCam.copy(cam.position).sub(wp).normalize();
      const facing = normal.dot(toCam);
      // project world position -> normalized device coords -> screen px
      const ndc = wp.project(cam); // mutates scratch.wp; fine, we're done with it
      const sx = (ndc.x * 0.5 + 0.5) * width;
      const sy = (-ndc.y * 0.5 + 0.5) * height;
      items.push({ i, facing, sx, sy });
    }

    // Front-facing candidates, ranked: priority first, then most camera-centered.
    const candidates = items
      .filter((it) => it.facing > FACING_MIN)
      .sort((a, b) => {
        const pa = meta[a.i].priority;
        const pb = meta[b.i].priority;
        if (pa !== pb) return pa - pb;
        return b.facing - a.facing;
      });

    const placed: { sx: number; sy: number; halfW: number }[] = [];
    const visible = new Set<number>();
    for (const it of candidates) {
      if (visible.size >= MAX_LABELS) break;
      const halfW = meta[it.i].halfW;
      let collides = false;
      for (const q of placed) {
        if (
          Math.abs(it.sx - q.sx) < halfW + q.halfW + PAD &&
          Math.abs(it.sy - q.sy) < BOX_HALF_H * 2 + PAD
        ) {
          collides = true;
          break;
        }
      }
      if (!collides) {
        placed.push({ sx: it.sx, sy: it.sy, halfW });
        visible.add(it.i);
      }
    }

    // Drive each label's opacity toward its target with a limb fade + lerp.
    for (let i = 0; i < positions.length; i++) {
      const facing = items[i].facing;
      const limb = THREE.MathUtils.clamp((facing - FACING_MIN) / FACING_RAMP, 0, 1);
      const target = visible.has(i) ? limb : 0;
      const cur = opacities.current[i] ?? 0;
      const next = cur + (target - cur) * 0.16;
      opacities.current[i] = next;
      const el = labelEls.current[i];
      if (el) {
        el.style.opacity = next.toFixed(3);
        el.style.visibility = next < 0.02 ? "hidden" : "visible";
      }
    }
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <MarkerDot
          key={LOCATIONS[i].name}
          position={pos}
          type={LOCATIONS[i].type}
          onClick={() => onSelect(i)}
          isSelected={selectedIndex === i}
        />
      ))}

      {positions.map((pos, i) => {
        const color = `#${TYPE_COLORS[LOCATIONS[i].type].getHexString()}`;
        return (
          <group key={`label-${LOCATIONS[i].name}`} position={pos.clone().multiplyScalar(1.058)}>
            <Html
              center
              zIndexRange={[6, 0]}
              style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}
            >
              <div
                ref={(el) => {
                  labelEls.current[i] = el;
                }}
                className="font-mono"
                style={{
                  opacity: 0,
                  visibility: "hidden",
                  color,
                  fontSize: "9.5px",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "1px 7px",
                  borderRadius: "999px",
                  background: "oklch(0.13 0.012 150 / 0.55)",
                  border: "1px solid oklch(0.78 0.12 55 / 0.16)",
                  backdropFilter: "blur(2px)",
                  WebkitBackdropFilter: "blur(2px)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.85)",
                  willChange: "opacity",
                  transition: "none",
                }}
              >
                {LOCATIONS[i].name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
