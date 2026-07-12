# Schedular

Plan, schedule, and publish social posts across LinkedIn, Instagram, Facebook and X from one place.

## Structure

Two independently deployed services:

- **`frontend/`** — React + Vite + Tailwind. Deployed to Vercel.
- **`backend/`** — Express + MongoDB (Mongoose). Deployed to Render.

They talk to each other over HTTP only — there's no shared build step, so each can be run and deployed on its own.

## Running locally

**Backend**
```
cd backend
cp .env.example .env   # fill in the values
npm install
npm run dev
```

**Frontend**
```
cd frontend
cp .env.example .env   # fill in the values
npm install
npm run dev
```

The frontend expects the backend at `VITE_API_URL` (defaults to `http://localhost:5000`).

## Deploying

Each service reads its config from environment variables — see `backend/.env.example` and `frontend/.env.example` for the full list. The two things most likely to break a production deploy if missed:

- **`BACKEND_URL_PROD`** (backend) — must be the backend's own public URL, and must exactly match the "Authorized redirect URL" configured in the LinkedIn app, since it's used to build the OAuth `redirect_uri`.
- **`VITE_API_URL`** (frontend) — set this in your hosting provider's *Production* environment variables (not a `_PROD`-suffixed variant) to the deployed backend URL. Vite bakes env vars in at build time, so changing this requires a redeploy to take effect.
