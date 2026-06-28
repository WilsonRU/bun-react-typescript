# Bun React TypeScript Boilerplate

Production-oriented React starter built with Bun, Vite, TypeScript, Tailwind CSS, shadcn-style UI primitives, React Router, React Hook Form, Zod, Ky, Zustand, Sonner, and Biome.

## Requirements

- Bun
- Node-compatible runtime for Vite tooling

## Setup

```bash
bun install
cp .env.example .env
bun run dev
```

## Environment

```bash
VITE_API_URL="http://localhost:4001/api/"
VITE_APP_TITLE="Bun + Vite + React"
VITE_ENABLE_REACT_COMPILER="false"
```

`VITE_API_URL` is required for production builds. Development falls back to `http://localhost:4001/api/` to keep local setup simple.
`VITE_ENABLE_REACT_COMPILER` is opt-in because the compiler can affect build performance and should be enabled deliberately.

## Scripts

```bash
bun run dev
bun run typecheck
bun run check
bun run lint
bun run format
bun run format:check
bun run build
bun run preview
```

## Structure

```text
src/
  components/      Shared layout and UI primitives
  config/          Environment configuration
  lib/             Shared utilities and HTTP client
  modules/auth/    Authentication pages
  modules/errors/  Error and fallback pages
  modules/user/    Authenticated user pages
  utils/           Contexts, hooks, and stores
```

## Auth Flow

- Login responses are validated with Zod before being stored.
- The HTTP client injects the bearer token from the user store.
- API `401` responses clear the local session and redirect the user to sign in.
- Protected routes use the auth context before rendering private pages.

For high-security production applications, prefer server-managed `HttpOnly` cookies over browser-persisted bearer tokens.

## Production Checklist

- Set `VITE_API_URL` in the deployment environment.
- Run `bun run check` and `bun run build` in CI.
- Add automated tests for auth, protected routes, and forms.
- Review token storage strategy with your backend security model.
- Consider migrating `react-query` v3 to `@tanstack/react-query` when adding or updating data fetching.
