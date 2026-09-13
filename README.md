<div align="center">

<img src="frontend/src/assets/logo.png" alt="Schedular logo" width="96" />

# Schedular

**Plan once. Publish everywhere.**

A full-stack social media scheduler that lets you write a post one time, target multiple platforms, and let a background job publish it for you — on time, every time.

[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white)](backend)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](frontend)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](backend)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux%20Toolkit-764ABC?logo=redux&logoColor=white)](frontend)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](frontend)
[![AI](https://img.shields.io/badge/AI-Groq%20%2B%20Gemini-8B5CF6?logo=openai&logoColor=white)](backend)

[Live Demo](https://schedular-roan.vercel.app) · [Backend Docs](backend/README.md) · [Report an Issue](https://github.com/suryasubharyan/Schedular/issues)

</div>

---

## Overview

Schedular is a mini Buffer/Hootsuite-style tool, built end-to-end — a React frontend, an Express + MongoDB backend, real OAuth-based social publishing, and an AI assistant that drafts your captions and post images for you.

Write a post once, pick which platforms to publish it on (**LinkedIn**, **Instagram**, **Facebook**, **X**), choose a time, and walk away — a cron-driven scheduler wakes up every minute, finds posts whose time has arrived, and publishes them automatically, with retry-on-failure and double-booking protection built in.

> **What's real vs. demo:** LinkedIn publishing is fully live end-to-end (OAuth, image upload, post creation via LinkedIn's own APIs). Instagram, Facebook, and X are wired up through the exact same architecture — UI, scheduling, database — and publish through a demo path today, since the goal was to prove the *pipeline*, not to collect four sets of developer-app credentials. Adding a real integration for any of them is a one-file addition (see [Design Patterns](backend/README.md#-design-patterns--principles)).

---

## ✨ Key Features

| | |
|---|---|
| 🗓️ **Multi-platform scheduling** | One composer, pick any combination of LinkedIn / Instagram / Facebook / X, per-platform previews and character limits |
| 🔗 **Real LinkedIn publishing** | Full OAuth connect flow, image upload via LinkedIn's asset API, and live post creation — not a mock |
| ✨ **AI-assisted content** | Describe your post in a few words — an LLM (Groq) drafts a platform-tuned caption + hashtags, and a vision model (Gemini) can generate a matching image, both from right inside the composer |
| ⏰ **Reliable scheduling engine** | A cron job checks for due posts every minute, atomically locks each one before publishing (no duplicate posts even if the job overlaps itself), and retries up to 3 times on failure |
| 🔐 **Secure auth** | Email/password (bcrypt-hashed) or Google Sign-In, JWT stored in an `httpOnly` cookie — never touchable by JavaScript, immune to XSS token theft |
| 📊 **Dashboard & Analytics** | Drafts, scheduled, and published posts at a glance; per-platform breakdown; paginated post history |
| 📆 **Calendar view** | See everything scheduled across every platform, at a glance, by day |
| 🌓 **Light/dark mode & responsive UI** | Built with Tailwind CSS, works from mobile to desktop |

---

## 🖼️ Demo

<div align="center">
<img src="frontend/src/assets/hero.png" alt="Schedular composer preview" width="720" />
</div>

<sub>Compose once → preview per platform → schedule or publish. The full user flow is covered in the <a href="backend/README.md#-project-demonstration">backend README's demonstration walkthrough</a>.</sub>

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- React 19 + Vite
- React Router v7
- Redux Toolkit (server-synced state) + Context API (simple app state)
- Tailwind CSS + Framer Motion
- Axios

</td>
<td valign="top" width="50%">

**Backend**
- Node.js + Express 5 (ES Modules)
- MongoDB + Mongoose
- JWT (`jose`) in an `httpOnly` cookie
- bcrypt, Google Identity, `node-cron`
- OpenAI SDK → **Groq** (text) · `@google/genai` → **Gemini** (image)

</td>
</tr>
</table>

Full rationale for every choice — and why, e.g., Redux was introduced for only *one* slice of state instead of everywhere — is in [`backend/README.md`](backend/README.md#-tech-stack) and the project's [interview-prep notes](INTERVIEW_NOTES.md).

---

## 🏗️ Architecture

```
┌──────────────┐        HTTPS / JSON         ┌──────────────────┐
│   Frontend   │ ───────────────────────────▶ │      Backend      │
│  React + Vite│ ◀─────────────────────────── │  Express + Mongo  │
│  (Vercel)    │        httpOnly JWT cookie    │     (Render)      │
└──────────────┘                               └─────────┬────────┘
                                                           │
                          ┌────────────────────────────────┼────────────────────────────────┐
                          ▼                                ▼                                ▼
                  ┌──────────────┐               ┌──────────────────┐             ┌──────────────────┐
                  │  MongoDB      │               │  LinkedIn API     │             │  Groq · Gemini    │
                  │  (Mongoose)   │               │  (OAuth + Publish)│             │  (captions/images)│
                  └──────────────┘               └──────────────────┘             └──────────────────┘
```

The two services are **independently deployable** — no shared build step, they only ever talk over HTTP. The backend itself follows a strict layered structure (`routes → controllers → services → models`); see [`backend/README.md`](backend/README.md#-architecture) for the full breakdown, including the Strategy + Factory pattern behind multi-platform publishing.

---

## 📁 Repository Structure

```
schedular/
├── frontend/        React + Vite SPA — pages, components, Redux store, hooks
├── backend/         Express API — routes, controllers, services, models
│                     (see backend/README.md for the full backend deep-dive)
└── README.md        you are here
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A local or Atlas MongoDB instance
- (Optional, for full functionality) LinkedIn app credentials, a Google OAuth client, a free [Groq](https://console.groq.com) API key, and a [Google AI Studio](https://aistudio.google.com) Gemini API key

### 1. Backend
```bash
cd backend
cp .env.example .env   # fill in the values — see comments inline for what each one does
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env   # fill in the values
npm install
npm run dev
```

The frontend expects the backend at `VITE_API_URL` (defaults to `http://localhost:5000`). Once both are running, open the frontend's local URL (Vite prints it — typically `http://localhost:5173`).

> Everything works with just `MONGO_URI_LOCAL` and `JWT_SECRET` set — social login, LinkedIn publishing, and AI generation are all optional and degrade gracefully without their credentials.

---

## ⚙️ Environment Variables

Every variable is documented inline in [`backend/.env.example`](backend/.env.example) and [`frontend/.env.example`](frontend/.env.example). The highlights:

| Variable | Where | Purpose |
|---|---|---|
| `MONGO_URI_LOCAL` / `MONGO_URI_PROD` | backend | Database connection |
| `JWT_SECRET` | backend | Signs the auth cookie |
| `LINKEDIN_CLIENT_ID` / `SECRET` | backend | Real LinkedIn OAuth + publishing |
| `GOOGLE_CLIENT_ID` / `SECRET` | backend + frontend | "Sign in with Google" |
| `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` | backend | Caption/hashtag generation (OpenAI-SDK-compatible — defaults to Groq, swappable to OpenAI/Together/Ollama) |
| `GENAI_API_KEY`, `GENAI_IMAGE_MODEL` | backend | Image generation (Gemini via Google AI Studio) |
| `VITE_API_URL` | frontend | Which backend the SPA talks to |

**Deploying?** Two things most commonly break a fresh deploy:
- **`BACKEND_URL_PROD`** must exactly match the "Authorized redirect URL" configured in the LinkedIn app — it's used to build the OAuth `redirect_uri`.
- **`VITE_API_URL`** must be set in your host's *Production* environment variables — Vite bakes it in at build time, so a change needs a redeploy to take effect.

---

## 📡 API Reference (highlights)

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register`, `/api/auth/login` | Email/password auth |
| `POST` | `/api/auth/google-login` | Google Sign-In |
| `GET/POST/PATCH/DELETE` | `/api/posts` | Create, list, update, schedule, delete posts |
| `GET` | `/api/social/accounts/:platform/authorize` | Start a platform's OAuth connect flow |
| `POST` | `/api/ai/caption` | AI-generate a platform-tuned caption + hashtags |
| `POST` | `/api/ai/image` | AI-generate a post image from a text prompt |

Full endpoint list, request/response shapes, and the auth model live in [`backend/README.md`](backend/README.md#-api-overview).

---

## 🔭 Roadmap

- [ ] Real Instagram / Facebook / X publishing (architecture already supports it — one publisher file each)
- [ ] Redis-backed caching for AI generations and hot queries, once running multiple backend instances
- [ ] Automated test suite (Jest + React Testing Library)
- [ ] Server-side pagination for post lists (currently client-side)

---

## 👤 Author

Built by **[suryasubbharyan](https://github.com/suryasubharyan)**.

