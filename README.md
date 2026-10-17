# 🛡️ ScopeGuard — The AI SOW & Scope-Creep Protector

> **The 30-Second Defensive Contract Engine for Freelancers & Independent Contractors**  
> *Convert chaotic client chats, informal Slack messages, and unbilled revisions into binding Statements of Work with explicit Out-of-Scope boundaries in seconds.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Gemma AI](https://img.shields.io/badge/Google_Gemma-2_27B_--_Open_Weights-4285F4?style=flat&logo=google)](https://ai.google.dev/gemma)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Problem Statement

Freelancers and independent consultants lose an average of **$500 to $2,500+ per project** to unbilled scope creep. Because initial conversations happen across informal channels — WhatsApp voice notes, Slack DMs, or messy email threads — client expectations drift without formal boundaries. Drafting traditional legal contracts takes hours or costs hundreds in attorney fees, so freelancers often start working with no protective baseline at all.

### 💡 The Core Innovation: Defensive Scope Ring-Fencing
**ScopeGuard** inverts the contract creation process into a 30-second workflow. By combining **Google Gemma 2 (27B & 9B open-weight models)** with a defensive prompt synthesis pipeline, ScopeGuard parses unstructured client requests and automatically generates:
1. **Phased Milestone Estimates** with calculated hourly allocations and deliverable checklists.
2. **The Scope Boundary Matrix:** Categorizes agreed deliverables into **IN-SCOPE** vs. **EXPLICITLY OUT-OF-SCOPE** (e.g., custom ERP sync, multi-currency conversion, unapproved revision rounds).
3. **Defensive Change-Order Clauses:** Automatically injects a standard $X/hr billing clause for any requirement beyond the bounded terms.
4. **Digital Client Approval Portal:** A dedicated, shareable client view (`/share/[id]`) for one-click digital acceptance, timestamped and stored in MongoDB Atlas.
5. **Pure Vector PDF Export:** High-fidelity, print-ready contract generation with zero browser canvas parsing dependencies.

---

## ✨ Key Features

- **⚡ 30-Second SOW Generator:** Input your hourly rate, currency, and paste unstructured client notes (or use 1-click test scenarios) to synthesize a formal SOW.
- **🧠 Google Gemma Open-Weights Inference:** Structured schema generation via OpenRouter with multi-model fallback (`google/gemma-2-27b-it`, `google/gemma-2-9b-it:free`, `google/gemma-3-12b-it:free`).
- **🛡️ Scope Boundary Matrix:** Clear color-coded contractual ring-fencing separating billable work from excluded feature creep.
- **💳 Phased Payment Schedule:** Automatically calculates deposit, midpoint, and final milestone allocations aligned with project phases.
- **🤝 Public Client Acceptance Portal (`/share/[id]`):** Frictionless client-facing sign-off interface with one-click approval, celebration confetti, and tamper-resistant status tracking.
- **📑 Pure Vector jsPDF Engine:** Lightweight vector PDF export that outputs crisp ASCII documents without layout breakage or CSS color-parsing crashes.
- **🗄️ Private SOW Vault (`/history`):** Name-gated quotation history organized by Freelancer and Client names, complete with cumulative value and signed conversion rate analytics in MongoDB Atlas.
- **🎨 Modern SaaS Design System:** Inspired by high-end product design with frosted glass headers (`#5D5FEF`), subtle grid ambient backdrops, clean card elevations, and full mobile responsiveness.

---

## 🏗️ Architectural Flow

```text
[ 1. SOW Generator Form (<30s) ]
Freelancer inputs Name, Client Name, Hourly Rate ($75), Currency (USD), and raw chat notes
                     │
                     ▼ User clicks "Generate Defensive SOW"
POST /api/proposals/generate
  ├── Google Gemma 2 (via OpenRouter): Parses requirements & ring-fences Out-of-Scope boundaries
  └── MongoDB Atlas: Persists structured SOW proposal document with unique ID
                     │
                     ▼
[ 2. Dedicated SOW Viewer (/sow/[id]) ]
Displays 3-Stat Summary Bar (Hours, Value, Rate) + 4 Interactive Tabs:
  ├── Milestones: Phased deliverables and cost breakdown
  ├── Scope Boundaries: IN-SCOPE vs. EXPLICITLY OUT-OF-SCOPE
  ├── Change Order Policy: Defensive legal protection terms
  └── Payment Schedule: Milestone percentage & trigger milestones
                     │
                     ├── [ Download PDF ]: Generates vector jsPDF document
                     ├── [ Copy Markdown ]: Copies clean markdown SOW to clipboard
                     └── [ Share Link ]: Generates client-facing URL
                     │
                     ▼ Freelancer sends link to Client
[ 3. Public Client Portal (/share/[id]) ]
Read-only legal Statement of Work view with contractor attribution
                     │
                     ▼ Client clicks "Accept Statement of Work"
PATCH /api/proposals/[id]
  ├── MongoDB Atlas: Updates status to "accepted" with acceptedAt timestamp
  └── Browser: Triggers celebration confetti & displays verified signed seal
                     │
                     ▼
[ 4. SOW History Vault (/history) ]
Name-gated private archive showcasing total contract pipeline value,
ring-fenced hours, and signed conversion metrics stored in MongoDB.
```

---

## 🛠️ Tech Stack & Dependencies

- **Frontend & Framework:** [Next.js 16](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom SaaS theme tokens
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (`tabs`, `badge`, `input`, `textarea`, `label`)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) with global cached connection pool
- **AI Inference Engine:** [OpenRouter API](https://openrouter.ai/) (Primary: `google/gemma-2-27b-it`, Fallback: `google/gemma-2-9b-it:free`, `google/gemma-3-12b-it:free`)
- **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF) pure vector engine (no `html2canvas` dependency)
- **Icons & Effects:** `lucide-react`, `canvas-confetti`

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Ankit-Kum-ar/scopeguard.git
cd scopeguard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` or `.env` file in the root directory:

```env
# MongoDB Atlas Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/scopeguard?retryWrites=true&w=majority"

# OpenRouter API Key (Gemma 2 / Gemma 3 inference)
OPENROUTER_API_KEY="your_openrouter_api_key"

# Backboard API Key (Optional secondary provider)
BACKBOARD_API_KEY="your_backboard_api_key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
scopeguard/
├── app/
│   ├── api/
│   │   ├── health/route.ts            # Database & AI gateway connectivity test
│   │   └── proposals/
│   │       ├── route.ts               # Name-gated quotation history & search
│   │       ├── [id]/route.ts          # Proposal retrieval & digital acceptance
│   │       └── generate/route.ts      # Gemma SOW synthesis & MongoDB persistence
│   ├── history/
│   │   └── page.tsx                   # Private SOW Vault & Client Quotation Cards
│   ├── share/[id]/
│   │   └── page.tsx                   # Public Client-Facing Review & Sign-Off Portal
│   ├── sow/[id]/
│   │   └── page.tsx                   # Dedicated SOW Viewer & Multi-tab Contract Review
│   ├── globals.css                    # SaaS theme tokens, elevation styles & print rules
│   ├── layout.tsx                     # Root layout with Inter font & metadata
│   └── page.tsx                       # Main Generator Workspace with 1-click test presets
├── components/
│   ├── generator/
│   │   ├── EmptyStateCard.tsx         # Generator idle state
│   │   ├── ProposalForm.tsx           # Contracting parties, rate, & loose notes input
│   │   └── ProposalPreview.tsx        # Real-time SOW preview & action surface
│   ├── history/
│   │   └── RecentProposalsDrawer.tsx  # Quick proposal summary interface
│   ├── layout/
│   │   └── Navbar.tsx                 # Frosted glass header with dynamic history badge
│   └── ui/                            # shadcn/ui components (badge, tabs, label, input)
├── lib/
│   ├── ai-engine.ts                   # Resilient Gemma AI prompt synthesis pipeline
│   ├── mongodb.ts                     # Cached global MongoClient connection pool
│   ├── pdf-export.ts                  # Pure vector jsPDF export engine
│   └── store.ts                       # In-memory proposal fallback store
└── types/                             # TypeScript definitions
```

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
