# New You Fitness — Member App

Mobile-first member nutrition, goal and progress tracker with a protected coach dashboard.

## Included

- Centrally managed member access codes
- Goals, calorie and macro calculator
- Weight and optional body-fat tracking
- Food diary with manual and barcode entry
- AI Coach Insight and meal suggestions
- Saved meals and grocery list
- Coach dashboard with each member's goals, food diary and progress
- Secure HTTP-only member and staff sessions
- New You logo on member, app and coach screens

## Required Vercel setup

1. Open the Vercel project and select **Storage**.
2. In the Marketplace, create an **Upstash Redis** database and connect it to
   this project. Vercel supplies `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN`.
3. In **Settings → Environment Variables**, add `STAFF_PIN` as a Secret.
4. Add `SESSION_SECRET` as a Secret, using a unique random value of at least 32
   characters.
5. Add `GEMINI_API_KEY` as a Secret for Coach Insight and meal suggestions.
6. Redeploy so the new environment variables are used.

After deployment, select **New You staff access**, sign in with `STAFF_PIN`, and
add members. Selecting a member opens their coach profile.

## Development

Run `npm install`, followed by `npm run dev`. Run `npm run build` before
deploying changes.
Deployment refresh
