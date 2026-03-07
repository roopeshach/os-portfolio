import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const githubPagesBase = repositoryName ? `/${repositoryName}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubActions ? githubPagesBase : '/',
  plugins: [react()],
})
