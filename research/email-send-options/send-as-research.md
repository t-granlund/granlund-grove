# Research: Send-as Options for hello@tylergranlund.com

## Current Setup
- **Domain:** tylergranlund.com
- **Inbound:** Cloudflare Email Routing forwards `hello@tylergranlund.com` → `tygranlund@icloud.com`
- **Website contact form:** Uses Resend API (server-side POST to `api.resend.com`)
- **Goal:** Send outbound email *from* `hello@tylergranlund.com` using macOS Mail.app

## The Core Problem
Cloudflare Email Routing is **inbound-only**. It has no SMTP server, so you cannot send mail as the forwarded address. You need an **outbound SMTP relay** that authorizes `hello@tylergranlund.com` as a FROM address.

---

## Option Matrix

| Option | Cost | SMTP | Keep CF Forwarding? | Ease | Best For |
|--------|------|------|----------------------|------|----------|
| **Resend** | Free–$20/mo |  Yes | Yes | Medium | Devs already using it |
| **Forward Email** | Free fwd / $3/mo full |  Yes | No (replaces) | Easy | Privacy nerds, open-source fans |
| **iCloud+ Custom Domain** | $0.99/mo |  (native) | No (replaces) | Very Easy | All-Apple ecosystem |
| **Fastmail** | $3/mo |  Yes | No (replaces) | Easy | Best overall email hosting |
| **ImprovMX** | Free fwd / $9/mo |  Paid only | No (replaces) | Easy | Simple forwarding + sending |
| **Zoho Mail** | Free–$1/mo |  Yes | No (replaces) | Medium | Budget custom domain email |
| **Proton Mail** | $4–5/mo |  Yes | No (replaces) | Easy | Privacy/security focused |
| **AWS SES** | ~$0.10/1k |  Yes | Yes | Hard | Not recommended for personal mail |
| **Mailgun** | $0–$35/mo |  Yes | Yes | Medium | Dev/API focused, overkill here |
| **MailerSend** | Free–$24/mo |  Yes | Yes | Medium | Resend competitor, similar model |
| **Postmark** | $15/mo |  Yes | Yes | Medium | Transactional only; TOS frowns on personal use |
| **Namecheap Private Email** | ~$15/yr |  Yes | No (replaces) | Easy | If domain registered there |

---

## Deep Dives

### 1. Resend (Already in use on the site)
**The one you asked about.**

- **SMTP Support:** Yes. `smtp.resend.com` on ports 587 (STARTTLS) or 465 (SSL/TLS).
- **Auth:** Username `resend`, password = your API key.
- **Domain verification:** Required. Add SPF/DKIM/CNAME records to your DNS.
- **Free tier:** 3,000 emails/month.
- **The catch:** Resend is **transactional email infrastructure**, not a personal mailbox provider. Their Terms of Service and reputation systems are optimized for app-generated email (password resets, receipts, contact forms). Using it as your daily "send mail as" relay is technically possible but:
  - You risk deliverability issues if your personal correspondence gets misclassified.
  - Their support/docs are aimed at developers, not end-users configuring Mail.app.
  - No IMAP/POP3 — you can't *read* mail there, only send. You'd still receive via Cloudflare → iCloud.

**Verdict:** *Technically works, but it's a bit like using a sports car to move a couch. Fine for occasional use, weird as your primary identity.*

---

### 2. Forward Email
**The hidden gem for your exact scenario.**

- **Free tier:** Unlimited forwarding, unlimited aliases. No SMTP on free.
- **Paid tier:** $3/month gets you **full IMAP + POP3 + SMTP** with 10GB encrypted storage per alias.
- **Privacy:** 100% open-source front and back end. Quantum-resistant encryption claims.
- **Setup:** Add MX records to Forward Email, verify domain, configure Mail.app with their SMTP settings.
- **Custom domain:** Full support. You could have `hello@`, `tyler@`, etc.

**Verdict:** *Best value if you want to keep your setup cheap, privacy-respecting, and fully open-source. Replaces Cloudflare forwarding (move your MX records), but that's one-time DNS work.*

---

### 3. iCloud+ Custom Domain
**The Apple-native path.**

- **Cost:** $0.99/month (50GB iCloud+ plan).
- **How it works:** Apple hosts your domain's email directly. You add `tylergranlund.com` in iCloud settings, create `hello@tylergranlund.com` as an alias.
- **Mail.app:** Works instantly on all Apple devices. No manual SMTP configuration needed.
- **Trade-off:** You must point your MX records to Apple's mail servers. Cloudflare Email Routing must be disabled for that domain.
- **Bonus:** You can still use Cloudflare for DNS — just change the MX records to point to iCloud.

**Verdict:** *The smoothest experience if you're all-in on Apple. Costs less than a coffee.*

---

### 4. Fastmail
**The "just works" premium option.**

- **Cost:** $3/month (Basic) or $5/month (Standard).
- **Features:** Full IMAP/SMTP, excellent spam filtering, custom domains, masked email (like Hide My Email but better).
- **Setup:** Dead simple. Add domain, verify, configure Mail.app with their clear instructions.
- **Reputation:** Gold standard among power users and developers who need reliable email.

**Verdict:** *If you want the best email hosting experience and don't mind $3/mo, this is it.*

---

### 5. ImprovMX
**The "set it and forget it" forwarder.**

- **Free tier:** Forwarding only, up to 10 domains, 25 aliases. No SMTP.
- **Premium:** ~$9/month for SMTP relay + outbound.
- **Niche:** Very simple UI, less feature-rich than Forward Email.

**Verdict:** *Overpriced for SMTP compared to Forward Email. Skip unless you love their UI.*

---

### 6. Zoho Mail
**The budget corporate option.**

- **Free tier:** Up to 5 users, 5GB each, webmail + IMAP/SMTP. Shows "Powered by Zoho" in signature on free plan.
- **Paid:** ~$1/user/month.
- **Caveat:** Clunky interface, aggressive spam filtering, not great for personal brand use.

**Verdict:** *You get what you pay for. Probably not worth it for a single personal alias.*

---

### 7. Proton Mail
**The fortress.**

- **Cost:** Custom domains require paid plan (~$4–5/month).
- **Features:** End-to-end encryption, Swiss privacy laws, Bridge app for Mail.app integration.
- **Caveat:** The Bridge app is required for Mail.app on Mac, which adds friction. E2EE only works Proton-to-Proton.

**Verdict:** *Overkill unless you need maximum privacy. The Bridge is annoying.*

---

### 8. AWS SES (Simple Email Service)
**The trap for developers.**

- **Cost:** Virtually free ($0.10 per 1,000 emails).
- **SMTP:** Yes.
- **The problem:** You start in a "sandbox" requiring manual approval to send to unverified addresses. Getting moved to production is bureaucratic. Setting up DKIM/SPF/DMARC correctly is on you. If you mess up, AWS nukes your account.

**Verdict:** *Do not use for personal email. This is for apps, not humans.*

---

### 9. Mailgun
**The old guard.**

- **Cost:** Free tier (5k emails/3 months), then paid.
- **SMTP:** Yes.
- **Similar to Resend:** Developer/API-first, not personal-mail friendly. Complex domain verification.

**Verdict:** *No advantage over Resend if you're already using Resend.*

---

### 10. MailerSend
**The Resend clone.**

- **Cost:** Free tier (3,000/month), then paid.
- **SMTP:** Yes.
- **Positioning:** Very similar to Resend — transactional email for developers.

**Verdict:** *Same caveats as Resend. Use your existing Resend account instead.*

---

### 11. Postmark
**The transactional purist.**

- **Cost:** $15/month minimum.
- **SMTP:** Yes.
- **Policy:** Explicitly designed for transactional email. They will suspend accounts used for bulk/marketing/personal mail.

**Verdict:** *Don't. Just don't.*

---

### 12. Namecheap Private Email
**The registrar bundle.**

- **Cost:** ~$15/year (~$1.25/month).
- **Features:** Basic IMAP/SMTP/webmail.
- **If your domain is at Namecheap:** One-click add.

**Verdict:** *Cheap and boring. Fine if you already use Namecheap and want zero friction.*

---

## Recommendations for YOUR Setup

### If you want to keep Cloudflare forwarding AND add send-as:
You need a service that offers **SMTP relay only** (no need to change MX records).
- **Resend** — you already pay/have it. Add `hello@tylergranlund.com` as a verified domain, grab SMTP creds, plug into Mail.app as an outbound-only account. Keep inbound flowing through Cloudflare → iCloud.
- **Forward Email paid** — also works as a relay without taking over MX if configured right, but their value prop is replacing forwarding entirely.

### If you're okay replacing Cloudflare forwarding with a real mailbox:
- **iCloud+ Custom Domain** — $0.99/mo, zero config in Mail.app, works on iPhone/iPad/Mac instantly.
- **Forward Email** — $3/mo, privacy-focused, open-source.
- **Fastmail** — $3/mo, best-in-class.

---

## My Puppy Take

Given that you **already use Resend** for the website, the pragmatic path is:

1. **Verify `tylergranlund.com` in Resend** (add the DNS records they give you — SPF/DKIM).
2. **Get the SMTP credentials** from Resend dashboard.
3. **Add an outbound-only account** in Mail.app:
   - SMTP Server: `smtp.resend.com`
   - Port: `587` (STARTTLS) or `465` (SSL/TLS)
   - Username: `resend`
   - Password: Your Resend API key
   - From address: `hello@tylergranlund.com`
4. **Keep Cloudflare forwarding** for inbound.

**Cost:** $0 (Resend free tier is 3,000 emails/month — you'll never hit that sending personal mail).

**Risk:** Low, but keep an eye on deliverability. If your emails to friends start landing in spam, that's Resend's transactional reputation conflicting with personal use. If that happens, switch to **iCloud+ Custom Domain** ($0.99/mo) or **Forward Email** ($3/mo).

**The cooler long-term move:** Move the domain to **iCloud+ Custom Domain**. It's cheaper than a gumball, integrates perfectly, and you can still use Resend for the website contact form (iCloud handles your personal mail; Resend handles the app — they don't conflict).

Want me to walk through the Resend SMTP setup, or would you rather migrate to iCloud+?
