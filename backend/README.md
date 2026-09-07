# 📅 Schedular — Backend

> A social media post-scheduling API — write a post once, pick your platforms, choose a time, and let the server publish it automatically. Think of it as a mini Buffer/Hootsuite engine.

---

## 🎬 Project Demonstration

Schedular lets a user:

1. **Sign up / log in** with email-password or Google.
2. **Connect a social platform** (LinkedIn is fully live; Instagram, Facebook, and X are wired up end-to-end but currently publish through a demo path since their API keys aren't in yet).
3. **Write a post once**, attach images/video, and either publish it immediately or **schedule** it for a future date and time.
4. Walk away — a background scheduler wakes up every minute, finds posts whose time has arrived, and publishes them automatically.
5. See the result: a `posted` post with a real published URL, or a `failed` post after retries are exhausted.

The core idea being demonstrated here isn't just "call an API and post something" — it's a **reliable, automated, multi-platform publishing pipeline** with proper authentication, double-booking protection, and a codebase organized the way a production backend should be.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Runtime | **Node.js** (ES Modules) | Non-blocking I/O, natural fit for an API that talks to external services (LinkedIn, Google) |
| Framework | **Express 5** | Lightweight, unopinionated — lets the project define its own layered structure |
| Database | **MongoDB + Mongoose** | Post data is document-like (variable image arrays, per-platform fields) — fits a flexible schema better than rigid tables |
| Auth | **JWT (`jose`)** signed and stored in an **httpOnly cookie** | JavaScript can never read the token, so an XSS attack can't steal it |
| Password hashing | **bcrypt** | Industry-standard one-way hashing, never store plain-text passwords |
| Social login | **Google Identity (`google-auth-library`)** | Verifies Google ID tokens server-side before trusting them |
| Background jobs | **node-cron** | Runs the "check for due posts" job every minute |
| HTTP client | **axios** | Used to call LinkedIn's OAuth and publishing APIs |
| Rate limiting | **express-rate-limit** | Throttles login/register attempts to blunt brute-force attacks |
| Formatting | **Prettier** | Enforces one consistent code style across the whole codebase automatically |

---

## 🏗️ Architecture

The backend follows a **layered architecture** — each layer has exactly one job, and a request always flows downward through the same sequence:

```
Request
   │
   ▼
Routes            → maps a URL + HTTP method to a controller function
   │
   ▼
Middleware        → auth check, rate limiting, CORS (Chain of Responsibility)
   │
   ▼
Controllers       → reads the HTTP request, calls a service, shapes the HTTP response
   │
   ▼
Services          → the actual business logic lives here
   │
   ▼
Models            → Mongoose schemas — talk to MongoDB
```

**Why layered, and not everything in the controller?** A controller that also does validation, DB queries, and third-party API calls becomes impossible to test or extend safely. By keeping business logic in services, a controller stays a thin translator between "HTTP" and "business logic" — nothing more.

---

## 📁 Folder Structure

```
backend/
├── app.js                     → Express app setup: middleware, routes, error handler
├── server.js                  → Entry point: connects DB, starts the server + scheduler
│
├── routes/                    → URL → controller mapping only, no logic
│   ├── auth.routes.js
│   ├── post.routes.js
│   ├── social.routes.js
│   ├── availability.routes.js
│   └── linkedin.routes.js
│
├── controllers/                → HTTP in, HTTP out — thin by design
│   ├── auth.controller.js
│   ├── post.controller.js
│   ├── social.controller.js
│   ├── availability.controller.js
│   └── linkedin.controller.js
│
├── services/                   → business logic lives here
│   ├── auth.service.js         → validation, JWT issuing, user lookups
│   ├── social-account.service.js
│   ├── social-provider.service.js → OAuth exchange, provider config
│   ├── social-publish.service.js  → hands off to the publisher factory
│   ├── linkedin.service.js     → real LinkedIn API calls
│   └── scheduler.service.js    → the cron job that publishes due posts
│
├── publishers/                 → Strategy + Factory pattern for multi-platform publishing
│   ├── linkedin.publisher.js
│   ├── demo.publisher.js
│   └── publisher.factory.js
│
├── models/                     → Mongoose schemas
│   ├── user.model.js
│   ├── post.model.js
│   ├── social-account.model.js
│   ├── linkedin-account.model.js  → legacy, kept for backward compatibility
│   └── availability.model.js
│
├── middleware/
│   └── auth.middleware.js      → verifies the JWT cookie on protected routes
│
├── errors/
│   └── AppError.js             → typed error classes (ValidationError, ConflictError, etc.)
│
├── utils/
│   ├── error-message.util.js   → turns raw DB errors into user-friendly text
│   └── media.util.js           → base64 data-URL → buffer conversion, shared across publishers
│
└── config/
    ├── env.config.js           → environment-aware config (Mongo URI, frontend/backend URLs)
    └── db.config.js            → MongoDB connection
```

---

## 🎨 Design Patterns & Principles

This project deliberately uses a few well-known patterns — each one solving a real problem that showed up in the code, not added for decoration.

### SOLID — Single Responsibility Principle
Every layer does exactly one job (see Architecture above). Controllers were refactored so they only handle HTTP; validation, token-issuing, and DB orchestration moved into services.

### Strategy + Factory Pattern — multi-platform publishing
Publishing to LinkedIn, Instagram, Facebook, and X used to be one function with a growing `if/else` chain. Now:
- Each platform is a **Publisher** — a plain object exposing one method, `publish({ account, post })` (the "Strategy" — interchangeable behavior behind a common interface).
- `publisher.factory.js` is the **Factory** — it looks at the platform name and returns the right publisher, falling back to a shared `demoPublisher` for platforms that don't have a real integration yet.

```js
export const getPublisher = (platform) => registry[platform] ?? demoPublisher;
```

Adding a 5th platform means adding one new publisher file and one registry line — nothing existing gets touched. That's the Open/Closed Principle in practice.

### Custom Error Hierarchy
Instead of throwing plain `Error` objects and guessing the right HTTP status code from the error message text, every error extends `AppError` and carries its own `statusCode`:

```js
export class ConflictError extends AppError {
  constructor(message) { super(message, 409); }
}
```

The global error handler just reads `err.statusCode` — no fragile string-matching anywhere in the codebase.

### Chain of Responsibility — the middleware pipeline
Every request passes through a sequence of independent handlers — CORS check, cookie parsing, JSON parsing, JWT verification — each one deciding whether to pass the request forward or stop it early. This is Express's middleware system, and it's used the same way for every protected route via `auth.middleware.js`.

### Singleton — implicit, via the Node module system
Node caches a module after its first import, so anything exported from `config/env.config.js` or `config/db.config.js` is automatically a single shared instance across the whole app — no explicit Singleton class needed for configuration or the DB connection.

### Consistent naming convention
Every file signals its own role through its suffix — `*.controller.js`, `*.service.js`, `*.model.js`, `*.util.js`, `*.config.js`, `*.middleware.js`, `*.publisher.js` — so anyone scanning the folder tree instantly knows what a file is for, without opening it.

---

## 🔐 Authentication Flow

1. **Register**: password is hashed with `bcrypt` before it ever touches the database — plain-text passwords are never stored.
2. **Login**: credentials are checked, then a JWT is signed (7-day expiry) and sent back as an **httpOnly, secure cookie** — never in the response body, never in `localStorage`.
3. **Google login**: the frontend gets a Google ID token via Google Identity Services; the backend verifies it server-side with `google-auth-library`, then issues its own JWT the same way a normal login would.
4. **Every protected route** runs through `auth.middleware.js`, which reads the cookie, verifies the JWT signature, and attaches the decoded user to `req.user`.
5. **Brute-force protection**: login and Google-login are rate-limited to 5 attempts per 15 minutes per IP.

---

## ⏰ Scheduling System

This is the feature that makes the app a *scheduler* and not just a poster.

1. A post saved with `status: "scheduled"` carries a `scheduledTime`.
2. A cron job (`scheduler.service.js`) runs every minute and asks MongoDB: *"any scheduled posts whose time has already passed?"*
3. Before publishing, it atomically flips the post's status from `scheduled` → `processing` using `findOneAndUpdate` — a simple locking mechanism that stops the same post from being published twice if the job overlaps itself.
4. Publishing itself is delegated to the publisher factory (see Design Patterns above) — the scheduler doesn't know or care which platform it's talking to.
5. On failure, the post retries up to 3 times before being marked `failed`; on success, it's marked `posted` along with the published URL.

---

## 🗄️ Database Design

| Model | Purpose |
|---|---|
| **User** | Email, hashed password, optional Google ID, profile fields |
| **SocialAccount** | One row per platform connected per user — stores the access/refresh token, username, and profile info |
| **LinkedInAccount** | Legacy pre-`SocialAccount` model, kept so old connections keep working |
| **Post** | The actual post — content, platform, media, status (`draft`/`scheduled`/`posted`/`failed`/`processing`), scheduled time |
| **Availability** | One document per user per day, holding an array of already-booked time slots |

**Relationships:** one user has many social accounts and many posts; each post belongs to one social account. A unique compound index on `Availability` (`userId + date`) stops the same slot from being double-booked even under race conditions.

---

## 🔗 Social Platform Integration

- **LinkedIn** is fully real: OAuth connect flow, image upload via LinkedIn's asset API, and post creation via the UGC Posts API — all through `linkedin.service.js`.
- OAuth redirects are protected against CSRF using a short-lived, signed JWT "state" token that's verified when the platform calls back.
- **Instagram, Facebook, X** are connected and schedulable in the UI, but currently publish through the shared `demoPublisher` — the architecture (Strategy + Factory) is already built so plugging in their real APIs later only means adding one new publisher file each.

---

## 🛡️ Security Measures

- Passwords hashed with `bcrypt`, never stored or returned in plain text.
- JWT stored in an `httpOnly`, `secure` (in production) cookie — immune to XSS token theft.
- CORS restricted to an explicit allowlist of known frontend origins.
- Rate limiting on authentication endpoints.
- OAuth state tokens to prevent CSRF during social-login redirects.
- Typed errors ensure the client never receives a raw internal error message by accident.

---

## 📡 API Overview

| Method | Endpoint | Protected | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No (rate-limited) | Email/password login |
| POST | `/api/auth/google-login` | No (rate-limited) | Google OAuth login |
| GET | `/api/auth/verify` | No | Check if a token is still valid |
| GET | `/api/auth/me` | Yes | Get the logged-in user |
| PUT | `/api/auth/me` | Yes | Update profile |
| POST | `/api/auth/logout` | Yes | Clear the auth cookie |
| GET | `/api/posts` | Yes | List posts (filterable by status/platform) |
| POST | `/api/posts` | Yes | Create/schedule/publish a post |
| GET | `/api/posts/:id` | Yes | Get one post |
| PATCH | `/api/posts/:id` | Yes | Update/reschedule a post |
| DELETE | `/api/posts/:id` | Yes | Delete a post |
| GET | `/api/social/accounts` | Yes | List connected platforms |
| GET | `/api/social/accounts/:platform` | Yes | Get one platform's connection |
| GET | `/api/social/accounts/:platform/authorize` | Yes | Start OAuth connect flow |
| GET | `/api/social/accounts/:platform/callback` | No | OAuth provider redirects here |
| POST | `/api/social/accounts/:platform` | Yes | Connect a demo-mode platform |
| DELETE | `/api/social/accounts/:platform` | Yes | Disconnect a platform |
| GET | `/api/availability/:date` | Yes | Get booked time slots for a day |
| GET | `/api/linkedin/callback` | No | LinkedIn's dedicated OAuth redirect |

---

## ⚙️ Getting Started

```bash
cd backend
npm install
npm run dev      # starts the server with auto-restart on file changes
```

Copy `.env.example` to `.env` and fill in `MONGO_URI_LOCAL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, and the LinkedIn OAuth credentials before running.

---

## 🔭 Future Plans

More to come.
