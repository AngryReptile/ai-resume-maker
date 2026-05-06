<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.1-FF6B00?style=for-the-badge&logo=meta&logoColor=white" alt="Groq AI" />
</p>

<h1 align="center">ResumeAI — Architecting Careers</h1>

<p align="center">
  <strong>An AI-powered resume builder with 21 premium templates, live WYSIWYG editing, an integrated AI writing assistant, and a resume coaching engine — all wrapped in a cinematic, high-fidelity dark UI.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-database-schema">Database</a> •
  <a href="#-project-structure">Project Structure</a>
</p>

---

## ✨ Features

### 🎨 21 Premium Resume Templates
- **11 Light-Mode Blueprints**: Modern Clean, Executive Professional, Tech Minimalist, Creative Accent, Split Column, Academic CV, Bold Header, Elegant Serif, Startup Dynamic, Classic Centered, and Internship & Placement.
- **10 Midnight Variants**: Dark-themed counterparts for each base template (except Classic Centered), providing a unique design edge.
- **Live Thumbnail Previews**: The template gallery renders actual React components scaled down to A4 thumbnails — no static images.

### 🤖 AI-Powered Writing Assistant (Groq + LLaMA 3.1)
- **Generate Professional Summaries**: AI drafts a tailored executive summary based on your job title.
- **Enhance Experience Bullet Points**: Refines rough notes into powerful, action-oriented CAR-format bullets.
- **Generate Skills Stack**: Produces 10-12 ATS-optimized skills relevant to your target role.
- **Contextual Awareness**: AI prompts are dynamically constructed with position, company, and job title context.

### 🛡️ AI Resume Coach
- **10-Point Score Analysis**: Get an expert verdict on your resume's overall strength.
- **Strengths & Critical Issues**: Detailed breakdown of what works and what needs fixing.
- **CAR-Model Power Rewrites**: Weak bullet points are rewritten with quantified outcomes.
- **ATS Keyword Gap Analysis**: Surfaces missing keywords that recruiters and ATS systems look for.
- **Priority Recommendation**: One concrete, actionable next step to improve your resume.

### ✏️ Live WYSIWYG Builder
- **Inline Editing**: Click any text on the live preview to edit it directly — changes reflect in real-time.
- **Drag-and-Drop Section Reordering**: Reorder resume sections via an intuitive rearrange modal with Framer Motion `Reorder` API.
- **Section Toggle Controls**: Enable/disable any section (Summary, Experience, Education, Skills, Projects, Languages, Interests).
- **Custom Sections**: Add unlimited custom sections with user-defined titles and content.
- **Sidebar/Main Assignment**: Configure which sections render in the sidebar vs. main column for supported templates.
- **Editable Section Labels**: Rename any default section heading (e.g., "Work History" → "Professional Experience").

### 📄 Multi-Format Export
- **PDF Export**: Browser-native `window.print()` with a precision A4 paging engine that handles page breaks, orphan control, and WYSIWYG print fidelity.
- **DOCX Export**: Generates a fully structured Word document using the `docx` library, respecting section order and visibility.

### 🔐 Authentication & Authorization
- **Google OAuth via Supabase**: One-click sign-in with automatic profile creation via database trigger.
- **Role-Based Access**: `user` and `admin` roles enforced at both UI and RLS policy levels.
- **Profile Sync with Retry**: Robust profile fetching with 3-attempt retry logic and graceful fallback.

### 📊 Admin Dashboard (Command Center)
- **Platform Statistics**: Total users, total resumes, and active users with animated stat cards.
- **User Management Table**: View all registered users with resume counts and role badges.
- **Recent Activity Feed**: Latest 10 resume events with user attribution.
- **Tabbed Interface**: Stats / Users / Activity tabs with `AnimatePresence` transitions.

### 🎭 Cinematic UI Design System
- **Liquid Glass Aesthetic**: Custom `.liquid-glass` component with `backdrop-blur-2xl`, specular highlight overlays, and noise texture.
- **Animated Background**: Warping gradient orbs, mesh gradients, and fractal noise SVG textures.
- **Micro-Animations**: Hover effects, floating HUD elements, animated status dots, glassmorphism shimmer.
- **Typography**: Dual-font system with `Inter` (body) and `Outfit` (display headings).
- **Dark-First Design**: `#0a0a0f` base with indigo/violet accent palette and `selection:bg-indigo-500/30`.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.1 (App Router) |
| **Language** | TypeScript 5.x |
| **UI Library** | React 19.2 |
| **Styling** | Tailwind CSS 4.x |
| **Animations** | Framer Motion 12.x |
| **State Management** | Zustand 5.x |
| **Forms** | React Hook Form + Zod 4.x |
| **Authentication** | Supabase Auth (Google OAuth) |
| **Database** | Supabase PostgreSQL |
| **AI / LLM** | Groq SDK → LLaMA 3.1 8B Instant |
| **DOCX Export** | `docx` + `file-saver` |
| **PDF Export** | Native `window.print()` with custom A4 paging engine |
| **Icons** | Lucide React |
| **Fonts** | Google Fonts (Inter, Outfit) |
| **Deployment** | Vercel |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Landing   │  │  Template    │  │      Resume Builder      │  │
│  │  Page      │  │  Gallery     │  │  ┌────────┐ ┌─────────┐ │  │
│  │           │  │  (21 Live    │  │  │Form    │ │Preview  │ │  │
│  │           │  │   Previews)  │  │  │Section │ │Section  │ │  │
│  └───────────┘  └──────────────┘  │  │(AI+    │ │(WYSIWYG │ │  │
│                                    │  │Coach)  │ │+Export) │ │  │
│  ┌───────────┐  ┌──────────────┐  │  └────────┘ └─────────┘ │  │
│  │  Login     │  │  Dashboard   │  └──────────────────────────┘  │
│  │  (OAuth)   │  │  (CRUD)      │                                │
│  └───────────┘  └──────────────┘  ┌──────────────────────────┐  │
│                                    │  Admin Command Center     │  │
│                                    │  (Stats / Users / Feed)   │  │
│                                    └──────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                    STATE LAYER (Zustand)                         │
│     useResumeStore: resume data, template, sections, coach      │
│     useAuth Hook: session, profile, role, loading               │
├─────────────────────────────────────────────────────────────────┤
│                    API ROUTES (Next.js)                          │
│     POST /api/ai/enhance  →  Groq LLaMA 3.1 (summary/exp/skill)│
│     POST /api/ai/coach    →  Groq LLaMA 3.1 (resume analysis)  │
│     GET  /auth/callback   →  Supabase OAuth callback            │
├─────────────────────────────────────────────────────────────────┤
│                    DATA LAYER (Supabase)                         │
│     ┌──────────┐    ┌──────────┐    ┌─────────────────────┐     │
│     │ profiles │    │ resumes  │    │ auth.users (managed)│     │
│     │ (RLS)    │◄──►│ (RLS)    │◄──►│ (trigger → profile)│     │
│     └──────────┘    └──────────┘    └─────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- A [Supabase](https://supabase.com) project (free tier works)
- A [Groq](https://console.groq.com) API key (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/ai-resume-maker.git
cd ai-resume-maker
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
GROQ_API_KEY="your-groq-api-key"
```

### 3. Set Up Supabase Database

Run the provided schema in your Supabase SQL Editor:

```bash
# Copy and execute the contents of:
supabase_schema.sql
```

This creates:
- `profiles` table with RLS policies
- `resumes` table with RLS policies
- `handle_new_user()` trigger function for automatic profile creation
- Row-Level Security policies for user/admin access control

### 4. Configure Supabase Auth

1. In Supabase Dashboard → **Authentication** → **Providers** → Enable **Google**.
2. Add your Google OAuth Client ID and Secret.
3. Set the redirect URL to: `http://localhost:3000/auth/callback`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🗄 Database Schema

### `profiles`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK, FK → auth.users) | User's unique identifier |
| `email` | `text` (unique) | User's email address |
| `full_name` | `text` | Display name |
| `avatar_url` | `text` | Profile picture URL |
| `role` | `text` | `'user'` or `'admin'` |
| `created_at` | `timestamptz` | Account creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

### `resumes`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Resume's unique identifier |
| `user_id` | `uuid` (FK → auth.users) | Owner's user ID |
| `title` | `text` | Resume title |
| `content` | `jsonb` | Full resume data (personal info, experience, education, skills, projects, section config) |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

### Row-Level Security (RLS)

- **Profiles**: Public read, owner-only update, admin can update all.
- **Resumes**: Owner has full CRUD, admins have read access to all.
- **Trigger**: `on_auth_user_created` automatically inserts a profile row when a new user signs up via OAuth.

---

## 📁 Project Structure

```
ai-resume-maker/
├── public/                          # Static assets
├── scripts/
│   ├── generateTemplates.js         # Template generation script
│   └── injectRegistry.js            # Template registry injection
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (fonts, navbar, footer, background)
│   │   ├── page.tsx                 # Landing page (hero, features, template preview)
│   │   ├── globals.css              # Tailwind v4 config, liquid glass, print styles
│   │   ├── login/page.tsx           # Google OAuth login page
│   │   ├── dashboard/page.tsx       # User dashboard (resume CRUD)
│   │   ├── templates/page.tsx       # Template gallery (21 live previews)
│   │   ├── builder/page.tsx         # Resume builder workspace
│   │   ├── admin/page.tsx           # Admin command center
│   │   ├── auth/callback/           # Supabase OAuth callback handler
│   │   └── api/ai/
│   │       ├── enhance/route.ts     # AI text enhancement endpoint
│   │       └── coach/route.ts       # AI resume coaching endpoint
│   ├── components/
│   │   ├── Navbar.tsx               # Global navigation bar
│   │   ├── Footer.tsx               # Global footer
│   │   ├── AnimatedBackgroundFixed.tsx # Warping gradient background
│   │   └── builder/
│   │       ├── FormSection.tsx      # Left panel (Architecture + AI + Coach tabs)
│   │       ├── PreviewSection.tsx   # Right panel (live preview + export controls)
│   │       ├── EditableText.tsx     # Inline editable text component
│   │       ├── EntryToolbar.tsx     # Per-entry action toolbar
│   │       ├── RearrangeModal.tsx   # Drag-and-drop section rearrange modal
│   │       └── templates/           # 21 resume template components
│   │           ├── ModernClean.tsx
│   │           ├── ModernCleanMidnight.tsx
│   │           ├── ExecutiveProfessional.tsx
│   │           ├── ... (11 light + 10 midnight variants)
│   │           └── ClassicCentered.tsx
│   ├── hooks/
│   │   └── useAuth.ts              # Auth hook (session, profile, role, retry logic)
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client initialization
│   │   ├── exportUtils.ts          # DOCX export logic (section-order aware)
│   │   ├── countryCodes.ts         # Country code data
│   │   └── jobTitles.ts            # Job title suggestions
│   └── store/
│       └── useResumeStore.ts       # Zustand store (resume state, sections, coach)
├── supabase_schema.sql              # Database schema + RLS + triggers
├── next.config.ts                   # Next.js config (image remotePatterns)
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔑 Key Technical Decisions

| Decision | Rationale |
|---|---|
| **Zustand over Redux** | Minimal boilerplate for a single-store pattern; direct access via `useResumeStore.getState()` for non-React contexts. |
| **Groq + LLaMA 3.1 8B** | Ultra-low latency AI inference (< 500ms) for real-time resume enhancement without streaming complexity. |
| **Native `window.print()` over html2pdf** | Pixel-perfect A4 rendering with CSS `@page` rules, avoiding canvas rasterization artifacts and SVG text issues. |
| **CSS Mask-based paging** | `repeating-linear-gradient` mask creates visual page gaps without physically splitting DOM nodes, enabling seamless multi-page content flow. |
| **Dynamic template imports** | `next/dynamic` for the builder preview reduces initial bundle size; static imports only in the template gallery for immediate thumbnails. |
| **Server-side auth on API routes** | `createServerClient` from `@supabase/ssr` ensures API routes validate sessions independently, preventing unauthorized AI calls. |
| **JSONB resume storage** | A single `content` column stores the entire resume data structure, enabling flexible schema evolution without migrations. |

---


