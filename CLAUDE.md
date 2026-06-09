@AGENTS.md

# MergeLens Frontend

Next.js 16 frontend for an AI-powered PR review dashboard. Connects to a NestJS backend (`BACKEND_URL`) that runs better-auth and the review pipeline.

| Environment | Frontend | Backend |
| ----------- | -------- | ------- |
| Production  | `https://merge-lens.vercel.app` | `https://merge-lens-backend.onrender.com` |
| Local       | `http://localhost:3000` | `http://localhost:8080` |

## Commands

```bash
npm run dev      # start dev server (port 3000)
npm run build    # production build
npm run lint     # biome check
npm run format   # biome format --write
```

## Stack

- **Next.js 16** (App Router) — read `node_modules/next/dist/docs/` before writing routing or data-fetching code
- **React 19** with the React Compiler (`babel-plugin-react-compiler`) — avoid manual `useMemo`/`useCallback`
- **TypeScript** — strict mode, path alias `@/*` → `src/*`
- **Tailwind CSS v4** — utility-first, dark mode only (`className="dark"` on `<html>`)
- **shadcn/ui** — component library; add components via `npx shadcn@latest add <name>`
- **Base UI** (`@base-ui/react`) — used inside shadcn components via the `render` prop pattern
- **react-hook-form + zod** — all forms must use these; wire up with shadcn `<Form>` components
- **better-auth** — auth client in `src/lib/auth-client.ts`; server session helper in `src/lib/auth.ts`
- **Biome** — linter + formatter (replaces ESLint/Prettier); 2-space indent, organise imports on save
- **Recharts** — charts only

## Project structure

```
src/
  app/
    (app)/          # authenticated route group
      layout.tsx    # redirects to / if no session
      dashboard/
      findings/
      repositories/
      reviews/
      settings/
    api/auth/[...all]/   # auth proxy — forwards to backend, keeps cookies on frontend domain
    auth/
      signin/       # public sign-in page
      signup/       # public sign-up page
    page.tsx        # landing page
    layout.tsx      # root layout (fonts, TooltipProvider)
  components/
    app-sidebar.tsx
    ui/             # shadcn-generated primitives (do not hand-edit)
  data/mock.ts      # mock data for UI development
  lib/
    auth.ts         # server: getSession() — fetches /api/auth/get-session directly from backend
    auth-client.ts  # client: authClient (baseURL = NEXT_PUBLIC_BASE_URL), signIn, signOut, signUp, useSession
    auth-schema.ts  # zod: authSchema (base), signInSchema, signUpSchema + inferred types
    server-client.ts # axios instance for backend API calls (server-side)
    utils.ts        # cn()
```

## Backend API

All data endpoints are on the backend under `/api/`. The backend modules and what they expose:

- **`/api/reviews`** — paginated list (filterable by repo/status/search); single review includes `findings` and `summary`
- **`/api/findings`** — paginated list (filterable by agent/severity/repo/file); `getHotspots` returns top N files by finding count
- **`/api/repositories`** — CRUD; `addRepository`, `deleteRepository`, `syncRepositories`
- **`/api/stats`** — dashboard aggregates: `totalReviews`, `totalFindings`, `findingsByAgent`, `findingsBySeverity`, `reviewsOverTime` (30-day), `avgDurationMs`, `thisMonthReviews`
- **`/api/settings`** — monthly usage: reviews this month vs. limit (50), per-provider API cost/token totals
- **`/api/auth/[...]`** — better-auth routes (proxied through frontend at `/api/auth/[...all]`)

Swagger JSON: `https://merge-lens-backend.onrender.com/api/swagger-json/json`
Scalar UI: `https://merge-lens-backend.onrender.com/api/docs`

## Key conventions

### Next.js 16 specifics

- `params` and `searchParams` in page/layout props are **Promises** — always `await` them: `const { id } = await params`
- Dynamic route segments: `app/(app)/reviews/[id]/page.tsx`
- Server Components by default; add `'use client'` only when needed (event handlers, hooks, auth-client)

### Base UI render prop

shadcn components use Base UI's `render` prop instead of `asChild`:

```tsx
// correct
<SidebarMenuButton render={<Link href="/foo" />}>Label</SidebarMenuButton>
// wrong — asChild is not supported
<SidebarMenuButton asChild><Link href="/foo">Label</Link></SidebarMenuButton>
```

### Forms

Every form must use react-hook-form + zod + shadcn Form components:

```tsx
const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
// wrap with <Form>, use <FormField>, <FormItem>, <FormLabel>, <FormControl>, <FormMessage>
```

### Auth

- Client components: import from `@/lib/auth-client`
- Server components / layouts: use `getSession()` from `@/lib/auth.ts`
- Unauthenticated redirect target: `/auth/signin`
- Auth schemas live in `@/lib/auth-schema` — import `signInSchema`/`signUpSchema` and their inferred types from there
- After GitHub OAuth the user lands on `/connect-github`; `session.user.hasGithubApp` controls whether to redirect to `/dashboard`

#### Auth proxy architecture

The frontend and backend are on different domains. All auth traffic is routed through the Next.js proxy at `src/app/api/auth/[...all]/route.ts` so session cookies are set on `vercel.app`, not `onrender.com` (which `getSession()` would never see).

```
signIn.social()
  → POST vercel.app/api/auth/sign-in/social       (same-origin, no CORS)
  → proxy → onrender.com/api/auth/sign-in/social
  → backend returns 302 + JSON { url, redirect }
  → proxy converts POST redirects to 200 JSON     (prevents browser fetch
    following 302 to GitHub, which is CORS-blocked)
  → better-auth client reads url → window.location.href → GitHub OAuth

GitHub callback:
  → GET vercel.app/api/auth/callback/github        (browser navigation)
  → proxy → onrender.com/api/auth/callback/github
  → backend processes OAuth, Set-Cookie (no explicit Domain)
  → browser assigns cookie to vercel.app ✓
  → 302 to /connect-github → getSession() succeeds ✓
```

**Required env vars (Vercel):**

| Variable | Value |
| -------- | ----- |
| `NEXT_PUBLIC_BASE_URL` | `https://merge-lens.vercel.app` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://merge-lens-backend.onrender.com` |
| `BACKEND_URL` | `https://merge-lens-backend.onrender.com` |

**Required backend config (Render):**

| Variable | Value |
| -------- | ----- |
| `BETTER_AUTH_URL` | `https://merge-lens.vercel.app` — **must be frontend URL** so backend generates OAuth callbacks on the proxy domain |
| `FRONTEND_URLS` | must include `https://merge-lens.vercel.app` (CORS + trustedOrigins) |

**GitHub OAuth App:** authorized callback URL must be `https://merge-lens.vercel.app/api/auth/callback/github`.

**Do not** point `authClient.baseURL` at the backend directly — cookies will land on `onrender.com` and `getSession()` will always return null.

#### GitHub App installation flow

After OAuth, better-auth's `databaseHooks.account.create.after` on the backend checks for a `PendingInstallation` row. If the user already installed the GitHub App before signing up, `user.hasGithubApp` is set to `true` and repos are synced immediately. If not, `hasGithubApp` stays `false` and the user is held at `/connect-github` until they install the app.

### Styling

- Dark-only app — do not add light-mode variants
- Font variables: `--font-sans` (Inter), `--font-mono` (JetBrains Mono)
- `cn()` from `@/lib/utils` for conditional classes
