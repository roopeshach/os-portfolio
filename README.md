# Portfolio OS

Interactive portfolio desktop experience built with React, TypeScript, Redux Toolkit, and Vite.

## Development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
```

## GitHub Pages CI/CD

This project includes automated deployment to GitHub Pages using:
- [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
- dynamic Vite base path config in [`vite.config.ts`](vite.config.ts)

### One-time repository setup

1. Push code to `main`.
2. In GitHub repo settings, go to **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Ensure Actions are enabled for the repository.

After that, every push to `main` builds and deploys automatically.

## Release + Tag Versioning

This repository uses Conventional Commits and Release Please for semantic versioning:

- `feat:` → minor release bump
- `fix:` → patch release bump
- Other supported types: `chore`, `docs`, `refactor`, `test`, `ci`, `perf`, `style`

Configured files:
- [`.github/workflows/conventional-pr.yml`](.github/workflows/conventional-pr.yml)
- [`.github/workflows/release-please.yml`](.github/workflows/release-please.yml)
- [`release-please-config.json`](release-please-config.json)
- [`.release-please-manifest.json`](.release-please-manifest.json)

Release flow:
1. Open PR to `main` with a Conventional Commit title.
2. Merge PR into `main`.
3. Release Please updates/opens the release PR with changelog and version bump.
4. Merge release PR to create GitHub Release and tag (e.g. `v1.2.3`).

## Main Branch CI + Protection

- CI workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
- Branch protection requires PRs and passing checks before merge (configured via `gh api`).
