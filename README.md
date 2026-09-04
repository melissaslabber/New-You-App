# New You Fitness — Member App

## What works right away
- Calorie/macro tracking, weight & body fat graph, meal logging, knowledge base
- Barcode number lookup (Open Food Facts — free, no setup needed)
- Calorie & macro calculators on the Goals tab
- The member access code / staff admin gate (works per-device — see below)

## To make AI features work (Coach Insight + Meal Suggestions)

This project now includes `api/ai.js`, a small serverless function that
keeps your Anthropic API key on the server (never in browser code). To
activate it:

1. Get an API key at **console.anthropic.com** (Anthropic's developer
   console — this is a paid, usage-billed API, separate from a normal
   claude.ai subscription).
2. In Vercel: your project → **Settings → Environment Variables** →
   add a new variable named exactly `ANTHROPIC_API_KEY`, paste your key
   as the value, save.
3. Trigger a new deploy (Vercel → Deployments → the "..." menu on the
   latest deployment → Redeploy) so the app picks up the new variable.
4. That's it — Coach Insight and Meal Suggestions will now call your
   own `/api/ai` endpoint, which forwards to Anthropic using your key.

If this variable isn't set yet, those two features simply show a
"couldn't reach the coach" message instead of crashing — everything
else in the app keeps working normally.

## Still to fix before real multi-member use

Member access codes are stored with `localStorage`, which only lives on
one device/browser. That means codes added in the Staff Admin panel on
one phone won't be seen by a member opening the app on their own phone.
Fine for solo testing, not yet ready for real multi-member gating.
To fix: swap the storage shim (`src/storageShim.js`) for a real backend
— Supabase or Firebase are the fastest to set up and both have generous
free tiers.

## Deploying updates

Any commit to your GitHub repo automatically redeploys on Vercel. To
push a change:
1. On GitHub, open the file (e.g. `src/App.jsx`), tap the pencil icon.
2. Edit, scroll down, tap **Commit changes**.
3. Check Vercel's Deployments tab a minute later to confirm it built.

Change the staff PIN in `src/App.jsx` (search for `ADMIN_PIN`) before
sharing this with anyone.
