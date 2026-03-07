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
