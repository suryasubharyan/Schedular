# Schedular — Interview Explanation Notes

## 1. One-line pitch (say this first)

"Schedular is a social media post scheduling tool — like a mini Buffer/Hootsuite. Users write a post once, pick which platforms (LinkedIn, Instagram, Facebook, X) to publish it on, choose a date/time, and the backend automatically publishes it at that time using a cron job. Right now LinkedIn publishing is fully real (uses LinkedIn's API), the other 3 platforms are wired up in the UI/DB but publish as a demo/stub since I haven't added their API keys yet."

## 2. Tech stack (say this like a checklist)

**Backend:**
- Node.js + Express (v5) — REST API
- MongoDB + Mongoose — database
- JWT (using the `jose` library) stored in an httpOnly cookie — for login sessions
- bcrypt — password hashing
- Google OAuth (`google-auth-library`) — "Sign in with Google"
- node-cron — background job that runs every minute to check for scheduled posts
- axios — to call LinkedIn's API

**Frontend:**
- React 19 + Vite
- React Router v7 — page navigation
- Tailwind CSS — styling, with light/dark mode
- Context API (not Redux) — for global state like logged-in user, theme, notifications
- Framer Motion — animations
- Axios — calling my own backend APIs

**Deployment:** Backend on Render, Frontend on Vercel. No Docker — just used the platforms' native build detection.

## 3. How to explain the architecture (backend)

Say it like this: "I followed a layered structure, not just controllers doing everything."

- `routes/` — just define the URL and which controller function handles it
- `controllers/` — receive the request, validate basic stuff, call the service
- `services/` — this is where the actual business logic lives (OAuth flow, calling LinkedIn's API, deciding how to publish, scheduler logic). I did this so controllers stay thin/clean.
- `models/` — Mongoose schemas (User, Post, SocialAccount, Availability)
- `middleware/verifyJWT.js` — checks the login token before letting a request through to protected routes

**Why a service layer?** "If I want to add Instagram's real API tomorrow, I just add logic inside `social-publish.service.js` — I don't need to touch the controller or routes at all."

## 4. How to explain the frontend (detailed — this is where interviewers dig in)

Open with the same "layered, not spaghetti" framing as the backend: "The frontend is a React SPA. I split it by concern — `api/` for network calls, `context/` for global state, `components/` for reusable UI, `pages/` for screens — so a page component stays about layout, not fetching logic."

### 4.1 Folder structure (say this like a tour)

```
src/
  api/          → one file per backend resource: auth.api.js, post.api.js, social.api.js,
                  linkedin.api.js, availability.api.js — thin wrappers around one shared axios instance
  context/      → AuthContext, ThemeContext, NotificationContext, SocialDataContext
  hooks/        → useAuth.js (and similar) — thin wrapper around useContext so components
                  import a hook, not the raw context
  components/
    ui/         → generic, dumb, reusable pieces (Button, Card)
    layout/     → AppShell — the sidebar + topbar shell every logged-in page sits inside
    createPost/ → the multi-step post composer wizard, kept isolated because it's the
                  most complex piece of UI in the app
  pages/        → Landing, Auth, Dashboard, Calendar, Platforms, Settings, Analytics
  lib/          → platforms.js — single source of truth for platform metadata (label, icon,
                  ordering) so every screen that lists platforms reads from one place
```

**Why this matters as an answer:** "If I add a 5th platform, I touch `lib/platforms.js` and one service file on the backend — not ten different components."

### 4.2 Routing — React Router v7

- `App.jsx` defines all routes in one place: public (`/`, `/login`) and protected (`/dashboard`, `/calendar`, `/platforms`, `/settings`, `/analytics`).
- Every protected page is wrapped like `<ProtectedRoute><Dashboard /></ProtectedRoute>` instead of duplicating an auth check inside each page component.
- **`ProtectedRoute` logic (good to walk through):**
  1. Reads `user` and `authReady` from `AuthContext`.
  2. While `authReady` is still `false` (i.e., we haven't yet asked the backend "is my cookie valid?"), it shows a spinner instead of redirecting — **this avoids a flash of the login page for a user who's actually already logged in**, which is a subtle bug a lot of people get wrong.
  3. Once the check resolves: no user → `<Navigate to="/login">` (and it remembers the page you were trying to reach in `location.state.from`, so login can redirect back); user present → render the page.

### 4.3 Global state — 4 Context providers, nested by dependency

`App.jsx` nests them as: `NotificationProvider → AuthProvider → ThemeProvider → SocialDataProvider → BrowserRouter`. "The nesting order isn't random — `SocialDataProvider` calls `useAuth()` internally to know *whose* posts/accounts to load, so it has to sit **inside** `AuthProvider` in the tree."

1. **AuthContext** — holds `user` + `authReady`.
   - On first mount, it calls `verifyToken()` against the backend, which reads the httpOnly cookie server-side and returns the logged-in user if the JWT is valid. This is **how a page refresh doesn't log you out** — there's no token in localStorage to read, so the app re-asks the server on every load.
   - Exposes `login`, `register`, `googleLogin`, `updateUser`, `logout` — all just call the `api/auth.api.js` functions and update local `user` state on success.
2. **ThemeContext** — reads saved theme from `localStorage`, falling back to the OS's `prefers-color-scheme` on first visit. Toggling adds/removes a `dark` class on `<html>`, which is what makes every Tailwind `dark:` utility class in the app switch — no re-render logic needed beyond that one class toggle.
3. **NotificationContext** — a toast queue (`notifications` array) with `showSuccess/showError/showWarning/showInfo` helpers; each toast auto-removes itself via `setTimeout` after its duration. `NotificationContainer` just renders whatever's in the array.
4. **SocialDataContext** — owns `accounts` (connected social platforms) and `posts`, plus a `refresh()` that loads both together. It derives `connectedAccounts`/`hasConnectedAccounts` from `accounts` rather than storing them separately, so there's one source of truth. It re-runs `refresh()` automatically whenever `user` changes (login/logout).

**Custom hook pattern:** every context has a matching hook (`useAuth`, `useTheme`, `useNotification`, `useSocialData`) that just wraps `useContext(...)`. "Components never import a Context object directly — they import the hook. Keeps the import list clean and means I could swap the underlying implementation without touching consumers."

### 4.4 API layer — one axios instance, not one-off fetches

- `api/axios.js` creates a single axios instance with `baseURL` from `VITE_API_URL` and **`withCredentials: true`** — that's the setting that makes the browser actually send the httpOnly auth cookie on every request, which is what ties the frontend to the backend's cookie-based auth.
- It has a response interceptor that **retries a failed request once** if it looks like a bare network error. Reason: the backend is hosted on Render's free tier, which spins the server down when idle — the very first request after a lull can fail before the server even wakes up. Rather than showing the user a broken login, I retry once after a short delay. "This is a small thing, but it's a real production consideration I ran into, not something from a tutorial."
- Every domain gets its own thin `api/*.api.js` file (`auth.api.js`, `post.api.js`, `social.api.js`, `linkedin.api.js`, `availability.api.js`) that just exports functions calling this shared instance — mirrors the backend's route grouping, so it's easy to find "which frontend function calls which backend route."

### 4.5 The post composer — the most complex piece of UI

- Lives entirely under `components/createPost/`, kept out of the `pages/` folder because it's reused for both "create" and "edit" flows.
- `CreatePostWizard` is a small state machine with a `phase`: `compose → loading → preview` (loading is a deliberate staged-progress animation — "Reading your content" → "Matching platform style" → "Building previews" — so publishing doesn't feel instant/fake).
- User picks which connected platforms to post to (`selectedPlatforms`), and can flip between per-platform previews (`activePreviewPlatform`) to see how the same content renders differently — e.g. X has a hard 280-character limit enforced client-side.
- `useMediaUpload` is a custom hook that handles picking images/video and converts them to base64 before they're attached to the post payload — ties directly back to the "known limitation" of storing media as base64 in MongoDB (section 9).
- `ScheduleBox` handles picking the date/time; `EditPostDrawer` reuses the same preview UI for editing an already-scheduled post.

### 4.6 Layout & styling

- `AppShell` is the shared chrome (sidebar nav + topbar with theme toggle + profile menu) that every protected page renders inside — pages themselves only render their own content.
- Tailwind CSS utility classes throughout, dark mode via the `dark:` variant + class strategy described above.
- Framer Motion for transitions/animations (e.g. mobile nav slide-in, the composer's loading overlay).

### 4.7 One-liner if asked to summarize the frontend

"It's a single-page React app where routing decides *what* to show, four Context providers decide *what data is available* to show, and a thin per-resource API layer is the only thing that talks to the backend — no component calls `axios` directly."

## 5. Database design — explain the 4 main collections

1. **User** — email, hashed password, name, Google id (if signed up with Google)
2. **SocialAccount** — one row per platform connected per user (LinkedIn, Instagram, etc.) — stores access token, username, profile picture
3. **Post** — the actual post: content, which platform, image/video, status (draft / scheduled / posted / failed), scheduled date & time
4. **Availability** — tracks which time-slots are already booked for a user on a given day, so two posts can't be scheduled at the exact same slot (prevents double-booking)

**Relationship to mention:** "One user can have many social accounts and many posts. Each post belongs to one social account."

## 6. Authentication flow — this is a common interview question

Explain it as a story:
1. User registers with email/password → password is hashed with bcrypt before saving (never store plain text)
2. On login, I check the password, then generate a JWT token (signed, expires in 7 days) and send it back as an **httpOnly cookie** — not localStorage. 
   - **Why httpOnly cookie instead of localStorage?** Because JavaScript can't read httpOnly cookies, so even if there's an XSS attack, the attacker can't steal the token. This is the "correct" security answer if asked.
3. For Google login: frontend gets a Google ID token using Google Identity Services, sends it to my backend, backend verifies it with Google's own library (`google-auth-library`), then creates/logs in the user the same way — issues my own JWT.
4. Every protected API route runs through a `verifyJWT` middleware which reads the cookie, verifies the signature, and attaches the user info to the request.
5. I also added rate limiting (max 5 attempts per 15 min) on login endpoints to prevent brute force attacks.

## 7. The scheduling / cron logic — good technical talking point

"This is the core feature that makes it a 'scheduler' and not just a poster."

- When a user schedules a post, I save it in MongoDB with `status: "scheduled"` and a `scheduledTime`.
- A `node-cron` job runs every single minute on the server and asks: "Are there any posts whose scheduled time has already passed but are still marked scheduled?"
- To avoid the same post being published twice if the job somehow overlaps, I use `findOneAndUpdate` to atomically flip the status from `scheduled` → `processing` in one step (a simple locking mechanism) before actually publishing it.
- If publishing fails (e.g., LinkedIn API error), I retry up to 3 times, then mark it `failed`.
- If it succeeds, status becomes `posted` and I save the published URL.

## 8. LinkedIn integration — real API usage (good to have a concrete example ready)

- OAuth: user clicks "Connect LinkedIn" → redirected to LinkedIn's OAuth screen → LinkedIn redirects back with a code → backend exchanges that code for an access token → token is saved in `SocialAccount`.
- To prevent CSRF during this redirect, I generate a short-lived signed JWT "state" token that carries which platform + which user, and verify it when LinkedIn calls back.
- Publishing: if there's an image, first register + upload the image binary to LinkedIn's asset API, then create the actual post using LinkedIn's UGC Posts API with axios.

## 9. Honest limitations (interviewers respect honesty + shows self-awareness)

- Instagram/Facebook/X don't have real publishing yet — they're demo/stub, but the architecture is built so adding them later is just plugging in their API in one service file.
- Images/videos are stored as base64 directly inside the MongoDB document (not on S3/Cloudinary) — I'd mention this as a known trade-off: fine for a demo/small scale, but not scalable for production since MongoDB documents have a 16MB size limit and it bloats the DB.
- No real email service — notifications are just in-app toast messages, no emails/SMS reminders yet.
- No automated tests yet — if asked "how do you ensure correctness", be honest: currently manual testing, would add Jest/Supertest for backend and React Testing Library for frontend as a next step.

## 10. Good "what would you improve" answers (interviewers often ask this)

- Move image/video storage to Cloudinary or S3 instead of base64-in-DB
- Add real Instagram/Facebook/X API integrations
- Add automated tests
- Add a proper analytics API integration instead of self-computed counts
- Add email/push notifications for scheduled post success/failure
- Use a job queue (like BullMQ + Redis) instead of node-cron for better reliability at scale

## 11. Quick answers to likely questions

**"Why MongoDB and not SQL?"**
→ "The data is document-like — a post has variable fields (images array, videos, per-platform metadata) that fit naturally into a flexible schema. Also it's fast to prototype with Mongoose."

**"Why Express and not Nest.js/other framework?"**
→ "Express is lightweight and I wanted full control over the folder structure — I organized it in layers myself (routes/controllers/services) to keep it clean without a heavier framework's opinions."

**"How do you handle security?"**
→ "Password hashing with bcrypt, JWT in httpOnly + secure cookies, rate limiting on auth routes, CORS allowlist so only my frontend domain can call the API, and OAuth state tokens to prevent CSRF during social login redirects."

**"How does double-booking prevention work?"**
→ "There's an Availability collection — one document per user per day holding an array of already-booked time slots. Before confirming a schedule, I check/reserve that slot, and there's a unique DB index on `{userId, date}` so it can't be duplicated even under race conditions."
