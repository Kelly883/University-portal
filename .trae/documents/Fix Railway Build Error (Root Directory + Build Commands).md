# Diagnose and Fix Railway Build Error

## 1) Root Directory Configuration
- Reason: Railway is scanning the repo root and cannot find a build target; our Next.js app lives in `next_app/`.
- Action: In Railway → Service → Settings → Build
  - Root Directory: `next_app`
  - Install Command: `npm ci`
  - Build Command: `npm run build`
  - Start Command: `npm run start`
  - (Optional) Set Node version to 20+ in the service settings

## 2) Ensure Package Scripts Exist
- Verify scripts in `next_app/package.json`:
  - `build`: `next build`
  - `start`: `next start` (Next.js respects `$PORT` automatically on Railway)
  - `postinstall`: `prisma generate`

## 3) Environment Variables (Railway + Neon)
- Add to Railway → Variables (Environment):
  - `DATABASE_URL` = your Neon pooled connection string (with `sslmode=require`)
  - `AUTH_SECRET` = a secure random string (e.g., `openssl rand -base64 32`)
  - `NEXTAUTH_URL` = your Railway app URL
  - Any other secrets: `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `PAYSTACK_SECRET_KEY`, `FLUTTERWAVE_SECRET_KEY`

## 4) (Alternative) Move Next.js to Repo Root
- If you prefer zero configuration on Railway:
  - Move all contents of `next_app/` to the repository root and keep `legacy_django/` as-is.
  - Push changes; Railway will detect `package.json` at root and build automatically.

## 5) Optional: Add railway.json for Explicit Config
- Create a `railway.json` in the repo root:
```
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "rootDirectory": "next_app",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/"
  }
}
```
- This makes the build portable and explicit.

## 6) Verify Prisma + Neon
- Confirm `DATABASE_URL` uses Neon pooled connection and SSL.
- First deployment may require schema sync:
  - Option A: Manually run once from local: `npx prisma db push`
  - Option B: Add a one-time Railway Job/CLI run with the same command

## References in Repo
- App scripts: [package.json](file:///c:/Users/PC/Downloads/titan%20university/next_app/package.json)
- Prisma schema: [schema.prisma](file:///c:/Users/PC/Downloads/titan%20university/next_app/prisma/schema.prisma)
- Prisma client init (Neon adapter): [prisma.ts](file:///c:/Users/PC/Downloads/titan%20university/next_app/lib/prisma.ts)
- Auth core: [auth.ts](file:///c:/Users/PC/Downloads/titan%20university/next_app/auth.ts), [auth.config.ts](file:///c:/Users/PC/Downloads/titan%20university/next_app/auth.config.ts)
- Middleware (route protection): [middleware.ts](file:///c:/Users/PC/Downloads/titan%20university/next_app/middleware.ts)

Confirm this plan and I’ll apply either the Railway root-directory config via files (railway.json) or restructure the repo to the simplest deploy shape you prefer.