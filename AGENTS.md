# Repository Guidelines

## Project Structure & Module Organization

This repository is a static online resume site. The main page is `index.html`.
Styles live in `assets/css/style.css`, custom behavior lives in
`assets/js/main.js`. The local profile photo is stored in `assets/img/`, while
technology icons are loaded from public CDNs. Root files such as `CNAME`,
`README.md`, and `LICENSE` support GitHub Pages deployment and project
metadata.

## Build, Test, and Development Commands

There is no package manager or build step. Open `index.html` directly for a
quick check, or serve the directory locally to test browser behavior:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Use browser dev tools to check console
errors, responsive breakpoints, form behavior, and asset loading. Before
publishing, verify that GitHub Pages still resolves the custom domain from
`CNAME`.

## Coding Style & Naming Conventions

Use 4-space indentation in HTML, CSS, and JavaScript to match the existing
files. CSS follows a BEM-like class pattern such as `home__container`,
`button--flex`, and `active-link`; keep new selectors consistent with that
style. Prefer semantic HTML sections with matching IDs for navigation anchors.
Keep JavaScript small and DOM-focused in `assets/js/main.js`; use `const` and
`let` for new variables and avoid adding large dependencies unless they are
clearly needed.

## Testing Guidelines

No automated tests are currently configured. Validate changes manually across
desktop and mobile widths, especially navigation, project filtering, Swiper
controls, resume download links, and the contact form. When editing CSS, check
for horizontal overflow and image aspect ratio regressions. When editing
content, confirm all internal links and asset paths are case-correct.

## Commit & Pull Request Guidelines

Recent history uses uppercase type prefixes, for example `FIX: Added scroll
menu to mobile devices` and `FEAT: Added breakpoints to smallest devices`.
Follow that pattern with concise, imperative summaries: `FIX: Resolve mobile
nav overflow`.

Pull requests should describe the user-visible change, list manual checks
performed, and include screenshots for layout or responsive updates. Link any
related issue when available. Keep unrelated formatting churn out of feature
or fix PRs.

## Security & Configuration Tips

External libraries and fonts are loaded from CDNs in `index.html`. Check those
links when upgrading versions. The contact form uses EmailJS identifiers in
`assets/js/main.js`; treat service/template changes as configuration updates
and verify the form in a browser after editing them.
