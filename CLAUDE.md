@AGENTS.md

# MergeLens Frontend

Next.js 16 frontend for an AI-powered PR review dashboard. Connects to a separate backend at `BACKEND_URL` (default `http://localhost:8080`) that runs better-auth and the review pipeline.

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
    api/auth/[...all]/   # better-auth catch-all handler
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
    auth.ts         # server: getSession() via fetch to backend
    auth-client.ts  # client: authClient, signIn, signOut, signUp, useSession
    auth-schema.ts  # zod: authSchema (base), signInSchema, signUpSchema + inferred types
    utils.ts        # cn()
```

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

### Styling

- Dark-only app — do not add light-mode variants
- Font variables: `--font-sans` (Inter), `--font-mono` (JetBrains Mono)
- `cn()` from `@/lib/utils` for conditional classes
