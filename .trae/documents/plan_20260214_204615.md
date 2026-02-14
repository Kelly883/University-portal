## Tasks

1. Create railway.json at repo root pointing to next\_app and defining build/start.
2. Verify and tweak next\_app/package.json (ensure scripts and add engines>=20).
3. Remove duplicate next\_app/next.config.ts to avoid confusion (keep next.config.mjs).
4. Install deps and generate Prisma client; run Next.js build locally to validate.
5. Commit and push to GitHub to trigger deploy.

## Notes

* Railway will now detect rootDirectory next\_app and run npm ci -> npm run build -> npm run start.

* Next start uses PORT provided by Railway automatically.

* Neon + Prisma Neon adapter already configured; DATABASE\_URL must be set in Railway variables.

