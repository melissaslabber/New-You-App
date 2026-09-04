# New You Fitness — Member App

## What works right away
- Calorie/macro tracking, weight & body fat graph, meal logging, knowledge base
- Barcode lookup (Open Food Facts — free, no setup needed)
- The member access code / staff admin gate (works per-device — see below)

## Two things to fix BEFORE giving this to real members

### 1. AI features ("Coach insight" and "Meal suggestions") need a backend
The app currently calls Anthropic's API directly from the browser with no key.
That only works inside Claude's own preview. Once deployed on your own
domain it needs:
- An Anthropic API key (get one at console.anthropic.com)
- A small serverless function (e.g. a single `api/ai.js` file on Vercel) that
  holds the key server-side and the app calls instead of calling Anthropic
  directly — **never put an API key in the browser code**, anyone could
  steal and misuse it.
This is a small, well-defined job for a developer (a couple of hours).

### 2. Member access codes need a real database
Right now the access list is stored with `localStorage`, which only lives on
one device/browser. That means:
- Codes you add in the Staff Admin panel on your phone won't be seen by a
  member opening the app on their phone.
- This is fine for testing solo on one device, but NOT ready for real
  multi-member gating yet.
To fix: swap the storage shim (`src/storageShim.js`) for a real backend —
Supabase or Firebase are the fastest to set up and both have generous free
tiers. A developer can do this alongside item 1 above.

## Deploying to get a real link (no local coding needed)

1. Create a free GitHub account at github.com (if you don't have one).
2. Create a new repository, and upload every file in this folder using
   GitHub's "Add file → Upload files" button in the browser (drag the whole
   folder in).
3. Go to vercel.com, sign up free (you can sign in with GitHub).
4. Click "Add New → Project", pick the repository you just created.
5. Vercel auto-detects this as a Vite project — just click Deploy.
6. In a minute or two you'll get a live link like
   `new-you-fitness-app.vercel.app`.
7. In Vercel: Project → Settings → Domains → add `app.newyoufitness.co.za`.
   Vercel gives you a value to add as a CNAME record.
8. In GoDaddy: Domain → DNS Management → Add Record → Type: CNAME,
   Name: `app`, Value: (what Vercel gave you). Save.
9. Wait up to an hour for it to go live at that address.

Change the staff PIN in `src/App.jsx` (search for `ADMIN_PIN`) before
sharing this with anyone.
