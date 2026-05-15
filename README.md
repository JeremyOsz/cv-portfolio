# CV portfolio

AI-powered CV/portfolio app. Data is generated from the **extended-mind** repo (work folder + export script). This app is a sub-project that can be deployed independently and separated into its own repo later.

**Concept:** Interactive surface that represents you—queryable chat, experience cards with “View AI context,” honest fit assessment (paste a job description; get “strong fit,” “worth conversation,” or “probably not your person” with evidence). The fit tool is *bidirectional*: it tells employers when the match is weak, which inverts the usual power dynamic. Approach and prompt design (anti-sycophancy, committed verdicts) follow Nate’s “Escape the application pile” article (Jan 2026) and the Lovable/source guides linked there.

## Data source

- **Source:** [work/career/export/](../../work/career/export/) in the extended-mind repo.
- **Export script:** From repo root: `node tools/export-cv-context.js` (or `--confidential` for public deploy).
- **Consumed by app:** `public/cv-context.json` (copied from the export output).

## Refresh content

1. From **extended-mind repo root**: run `node tools/export-cv-context.js --confidential` (for public) or `node tools/export-cv-context.js` (full).
2. Copy the generated file into this app:  
   `cp ../../work/career/export/cv-context.json public/cv-context.json`
3. Rebuild: `npm run build` (or run `npm run dev` to preview).

## Deploy

- **Root directory:** Set your deployment (Vercel, Netlify, etc.) **Root Directory** to `apps/cv-portfolio`.
- **Build:** `npm run build`
- **Output:** `dist`

No monorepo config needed; the app has its own `package.json` and builds in place.

## Separation (move to its own repo)

1. Copy this folder (`apps/cv-portfolio/`) to a new repo.
2. Copy `cv-context.json` from extended-mind’s `work/career/export/` into the new repo’s `public/` (or run the export script from extended-mind and copy the output).
3. Deploy from the new repo. The app does not depend on parent-repo paths at runtime; it only needs `public/cv-context.json` (or the same JSON in the same shape).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173). Ensure `public/cv-context.json` exists (copy from `work/career/export/` if needed).
