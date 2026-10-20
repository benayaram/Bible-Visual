# Render static-site deployment

`render.yaml` prepares **one static site** from the `main` branch of `benayaram/Bible-Visual`. It defines no database, instance, disk, or worker. Automatic deployments are disabled to avoid repeated builds. The build uses Node 24.19.0 and publishes `dist-public`.

The public build is deliberately distinct from the local `dist` build. `npm run build:public` checks `src/data/publication.json` and copies only editions with documented redistribution permission. The current policy approves none, so the public atlas, event references, and source links work while full Bible text and PDFs stay out of the public build. `npm run build` still uses the user-supplied text available in the local workspace.

When the Render connection is available, inspect the target workspace and existing services before creating anything. Confirm its static-site pricing, remaining free quotas, and workspace spend controls. Import the repository's `render.yaml` as a Blueprint or create a Static Site with:

- Repository: `benayaram/Bible-Visual`, branch `main`
- Root directory: repository root
- Build command: `npm ci && npm run build:public`
- Publish directory: `dist-public`
- Node version: `24.19.0`
- Automatic deployments: off

Choose a free static service and decline any paid option. Do not infer that a free tier makes bandwidth, builds, domains, or upgrades free without limits. Once deployed, check the actual URL, page title, atlas, source links, and absence of the withheld text/PDF assets. `render.yaml` by itself neither creates a service nor confirms a live site.

Before enabling an edition in `src/data/publication.json`, record its applicable permission URL, reviewer, and verification date, then rerun the public build and examine its contents. The source translations and supplied PDFs have separate rights; PDF publication requires a separate policy and is currently blocked in the preparation script. Availability of a ZIP download alone does not establish redistribution permission.

The site uses hash navigation, so a Render URL with `#reader?edition=kjv&book=43&chapter=3&verse=16` resolves to the root page without a server rewrite. All text links remain inspectable without requiring a paid backend.
