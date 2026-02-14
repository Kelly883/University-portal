## Problem

* Railway (Railpack 0.17.2) cannot find a build target because the Next.js app lives in `next_app/`, not the repo root. It looks for a root-level build script or `start.sh` and fails.

## Solution (Preferred)

1. Add `railway.json` at repository root to explicitly point Railway to `next_app/` and define build/start commands:

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

1. Verify `next_app/package.json` scripts (present already):

* build: `next build`

* start: `next start`

* postinstall: `prisma generate`

* (Optional) add engines `{ "node": ">=20" }`

1. Environment variables (Railway → Variables):

* `DATABASE_URL` (Neon pooled, `sslmode=require`)

* `AUTH_SECRET` (random 32 bytes)

* `NEXTAUTH_URL` (your Railway URL)

* `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `PAYSTACK_SECRET_KEY`, `FLUTTERWAVE_SECRET_KEY`

1. Prisma + Neon

* If possible locally: `cd next_app && npx prisma db push`

* Otherwise rely on an initial job/CLI run on Railway

1. Commit & push to trigger deploy

* Add `railway.json`, commit, push to `main`.

## Alternative

* Move all contents of `next_app/` to the repo root to avoid platform config. This is optional; the `railway.json` approach keeps the current structure.

## On Approval

* <br />

