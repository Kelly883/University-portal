# Objectives
- Resolve Railpack error by declaring the build root and commands
- Keep Next.js app under `next_app/` and deploy cleanly on Railway/Vercel
- Verify Prisma + Neon configuration and perform a local build test

## Steps
1) Add railway.json (root)
- rootDirectory: `next_app`
- buildCommand: `npm ci && npm run build`
- startCommand: `npm run start`

2) Package.json verification
- Ensure `next_app/package.json` has scripts: build, start, postinstall
- Optionally add Node engines field

3) Prisma + Neon
- Confirm schema + Neon adapter (already done)
- Run `npm ci && npx prisma generate` locally
- If DATABASE_URL is present locally, run `npx prisma db push`; otherwise skip with notice

4) Build test
- Run `npm run build` in `next_app/` to ensure the project compiles

5) Commit & Push
- Commit railway.json and any minimal adjustments
- Push to `origin main` to trigger deploy

6) Platform Settings
- Railway/Vercel: Set env vars (DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL, OPENAI_API_KEY, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, PAYSTACK_SECRET_KEY, FLUTTERWAVE_SECRET_KEY)
- For Vercel, set Root Directory to `next_app` if not using railway.json