# AutoClaim — Automatisation intelligente des sinistres

**AutoClaim** is an AI-powered **automobile** insurance claims automation prototype.

Built for the **AUTOMATE OR DIE 2026** hackathon.

> Frontend-only prototype. No backend, no real API, no n8n yet. Everything uses realistic mock data and a simulated multi-agent analysis.

Tagline: *De la déclaration à la décision en 7 minutes, au lieu de 7 jours.*

Scope: **automobile claims only** (collision, glass, theft, etc.).

---

## What is AutoClaim?

AutoClaim automates the automobile claims lifecycle with a shared AI backend and two complementary spaces:

### Espace Assuré
- Declare a claim in a few clicks
- Upload photos & documents
- Track status in real time
- See the final decision (no fraud internals)

### Espace Assurance
- Review incoming claims
- Launch intelligent multi-agent analysis
- See fraud risks, incoherences, and AI reasoning
- Decide: accept / refuse / request documents / escalate fraud

---

## The 5-step journey

1. **Declaration** — insured submits claim + documents (&lt; 3 min)
2. **Intelligent analysis** — 6 specialized AI agents
3. **Automation** — report, status updates, notifications (n8n later)
4. **Manager decision** — risk score, evidence, recommendations
5. **Insured tracking** — real-time status, no sensitive fraud data

---

## AI Agents

| Agent | Role |
|--------|------|
| **OCR** | Extract data from constat, invoices, contract |
| **Vision** | Analyze damage photos & coherence |
| **Contrat** | Check coverage, deductibles, exclusions |
| **Fraude** | Detect inconsistencies & suspicious patterns |
| **Risque** | Confidence score & risk level |
| **Rapport** | Generate analysis report & recommendation |

---

## Demo scenarios

Sample claims (happy path + anomaly) appear in **Sinistres**. Click any row to open the dossier.

Use quick login as **Assuré** / **Gestionnaire**.

---

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router
- Jotai + TanStack Query
- Framer Motion + Recharts + Lucide
- Mock data only (n8n / Notion / local AI planned next)

---

## Run locally

```bash
cd autoclaim
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

Any email/password works. Prefer the **quick login** buttons.

---

## Pages

### Auth
- `/login` — role switch Assuré / Assurance + quick access

### Assuré
- `/assure` — my claims
- `/assure/declarer` — claim declaration form
- `/assure/sinistres/:id` — tracking (safe view)
- `/assure/notifications`

### Assurance
- `/assurance` — dashboard KPIs & alerts
- `/assurance/sinistres` — searchable claims table
- `/assurance/sinistres/:id` — full dossier + decision
- `/assurance/sinistres/:id/analyse` — multi-agent WOW page
- `/assurance/sinistres/:id` — claim detail (click a row in the list)
- `/assurance/notifications`
- `/assurance/settings`

---

## Next steps

1. Push this prototype to GitHub
2. Wire **n8n** for automation (status updates, Notion, PDF, notifications)
3. Connect real OCR / Vision / RAG agents (local-first)

---

## Note on Aegis

`aegis` in this monorepo is a related fraud-copilot prototype. **AutoClaim** is the full assure + insurer automation platform described in the pitch.
