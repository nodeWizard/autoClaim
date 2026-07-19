# AutoClaim — Automatisation intelligente des sinistres

**AutoClaim** is an AI-powered **automobile** insurance claims automation platform.

Built for the **AUTOMATE OR DIE 2026** hackathon.

> **This repository is the frontend prototype only** (React UI).  
> It is **not linked to n8n yet**. The demo runs with realistic mock data and a simulated multi-agent analysis in the UI.
>
> The **AI / backend work was built separately**: **n8n** (agent orchestration), **Notion** (database + RAG knowledge base), and **Ollama** (**2 local models**). Frontend and AI pipeline are separate tracks for the hackathon; wiring them together is the next step.

Tagline: *De la déclaration à la décision en 7 minutes, au lieu de 7 jours.*

Scope: **automobile claims only** (collision, glass, theft, etc.).

---

## Architecture

| Layer | Role | Status |
|--------|------|--------|
| **Frontend (this repo)** | UI prototype — Assuré + Assurance spaces, claim flow, analysis screen, reports | **This prototype** |
| **n8n** | Backend automation — orchestrates the 6 AI agents, webhooks, status updates, notifications, PDF | Built **separately** (not wired here yet) |
| **Notion** | Database + **RAG** knowledge base (contrats, règles, historiques) | Built **separately** (not wired here yet) |
| **Ollama** | Local LLM runtime — **2 local models** used by the agents | Built **separately** (not wired here yet) |

Target stack once integrated: UI → n8n → Notion + Ollama.

---

## What is AutoClaim?

AutoClaim automates the automobile claims lifecycle with two complementary spaces:

### Espace Assuré
- Declare a claim in a few clicks
- Upload photos & documents (validated required fields + formats)
- Track status in real time
- See the final decision (no fraud internals)

### Espace Assurance
- Dashboard KPIs, charts, risk alerts
- Review incoming claims
- Launch intelligent multi-agent analysis (backed by n8n + Ollama)
- See fraud risks, incoherences, and AI reasoning
- Download / print the generated PDF report
- Decide: accept / refuse / request documents / escalate fraud

---

## The 5-step journey

1. **Declaration** — insured submits claim + documents (&lt; 3 min)
2. **Intelligent analysis** — 6 specialized AI agents (orchestrated in **n8n**, powered by **Ollama**)
3. **Automation** — report, status updates, notifications via **n8n**; persistence / RAG via **Notion**
4. **Manager decision** — risk score, evidence, recommendations
5. **Insured tracking** — real-time status, no sensitive fraud data

---

## AI Agents

The agent chain is designed to run on the **n8n** backend (built separately; simulated in this UI for the demo):

| Agent | Role |
|--------|------|
| **OCR** | Extract data from constat, invoices, contract |
| **Vision** | Analyze damage photos & coherence |
| **Contrat** | Check coverage, deductibles, exclusions (Notion RAG) |
| **Fraude** | Detect inconsistencies & suspicious patterns |
| **Risque** | Confidence score & risk level |
| **Rapport** | Generate analysis report & recommendation (PDF) |

Local inference: **Ollama** with **2 local models**.

---

## Demo scenarios

Sample claims (happy path + anomaly) appear in **Sinistres**. Click any row to open the dossier.

Use quick login as **Assuré** / **Gestionnaire**.

---

## Stack

### Frontend (this prototype)
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router
- Jotai + TanStack Query
- Framer Motion + Recharts + Lucide

### Backend / AI (built separately — not connected to this UI yet)
- **n8n** — agent orchestration & automation
- **Notion** — database + RAG knowledge base
- **Ollama** — 2 local models

---

## Run locally (frontend prototype)

```bash
cd autoclaim
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

Any email/password works. Prefer the **quick login** buttons.

No n8n / Notion / Ollama setup is required to run this prototype.

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
- `/assurance` — dashboard KPIs, charts & alerts
- `/assurance/sinistres` — searchable claims table
- `/assurance/sinistres/:id` — full dossier + decision
- `/assurance/sinistres/:id/analyse` — multi-agent analysis page
- `/assurance/analytique` — analytics
- `/assurance/rapports` — AI reports (view / print / PDF)
- `/assurance/notifications`
- `/assurance/settings`
