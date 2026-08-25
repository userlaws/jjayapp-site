# jjayapp-site

Marketing/info site for **JJAY Campus Companion** — [jjayapp.com](https://jjayapp.com). Static
[Astro](https://astro.build) site, deployed on Vercel. No client JS, no analytics, no frameworks.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/ locally
```

## Adding a changelog entry

Releases live in `src/content/changelog/`, one markdown file per release. Copy an existing file,
rename it (`YYYY-MM-DD-short-slug.md` — the filename becomes the entry's URL anchor on
`/changelog`), and edit the frontmatter:

| Field         | Required | Meaning                                                              |
| ------------- | -------- | -------------------------------------------------------------------- |
| `version`     | yes      | App version string, e.g. `"1.0.6"`                                   |
| `date`        | yes      | `YYYY-MM-DD`, or `YYYY-MM` if the exact day is unknown               |
| `type`        | yes      | `"binary"` (App Store build) or `"ota"` (EAS over-the-air update)    |
| `updateGroup` | no       | EAS update group id (OTA releases only)                              |
| `commit`      | no       | Short git sha the release was built from                             |
| `title`       | yes      | Headline shown on the changelog page                                 |

The body is the release notes. Write them in user-facing language — commit shas, update group
ids, and internal names belong in frontmatter only, never in the body. Entries are sorted
newest-first by `date`.

## Screenshots

Real captures from the app live in `public/screenshots/` (portrait PNG, currently 644×1400,
captured from the iOS Simulator and downscaled with `sips -Z 1400`):

- `professors.png` — shown inside the hero phone frame
- `today.png`, `classes.png`, `campus.png` — the "Straight from the app" row

To refresh them, replace the files and rebuild — the home page checks for them at build time
and falls back to neutral skeleton placeholders for any that are missing. No code change needed.

## ⚠️ `assetlinks.json` placeholder

`public/.well-known/assetlinks.json` contains a placeholder certificate fingerprint
(`REPLACE_WITH_RELEASE_SHA256`). **It must be replaced with the real release-signing SHA-256
fingerprint before any Android release ships.** Until then Android App Links will not verify —
which is fine, because there is no Android app yet.

The iOS counterpart, `public/.well-known/apple-app-site-association`, is real and live (team
`59W2RJLQCM`, bundle `com.jjay.campus`, paths `/auth/*`). `vercel.json` forces its
`Content-Type: application/json` since the file has no extension.

## DNS (read before touching anything)

The domain's DNS **stays at Squarespace**. Point it at Vercel by editing individual records only:

| Record | Host  | Value                  |
| ------ | ----- | ---------------------- |
| `A`    | `@`   | `76.76.21.21`          |
| `CNAME`| `www` | `cname.vercel-dns.com` |

**Never change the nameservers, and never delete any `MX` or `TXT` record.** The apex `MX` and
the `send` subdomain records are Resend mail delivery/receiving — removing them breaks the app's
email (verification codes, password resets).
