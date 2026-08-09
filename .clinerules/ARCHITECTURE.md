# ARCHITECTURE.md — Frontend Architecture

## 1. Stack Summary

| Concern | Choice |
|---|---|
| Framework | **Next.js** (App Router, TypeScript) |
| Auth | **Better Auth**, with the **JWT plugin** enabled so the frontend can attach a bearer token to every call to the separate Express/Prisma backend |
| UI primitives | **shadcn/ui** (Radix-based, themed per `DESIGN.md`) |
| Flourish/marketing components | **Magic UI** |
| Orchestrated animation | **GSAP** |
| Micro-interaction animation | **Framer Motion** |
| Icons | **Lucide React** |
| Data fetching / server cache | **TanStack Query** (client-side mutations + cache) layered under Next.js server components for initial reads |
| Forms + validation | **React Hook Form** + **Zod** (shared-shape schemas mirroring backend DTOs) |
| Styling | **Tailwind CSS**, CSS variables from `DESIGN.md` §2.1 |

This frontend is a **separate deployable** from the Express backend described in the project's backend requirements doc. It communicates with that backend exclusively over REST, using the `{ success, message, data }` response envelope already defined there.

---

## 2. High-Level System Diagram

```
┌────────────────────┐        JWT (Bearer)        ┌──────────────────────────┐
│  Next.js Frontend   │ ─────────────────────────▶ │  Express + Prisma API     │
│  (this project)     │ ◀───────────────────────── │  (separate repo/service)  │
│                      │        JSON responses       │                          │
│  - Better Auth (JWT  │                             │  - Auth (bcrypt+JWT)     │
│    issuance/session) │                             │  - Courses/Modules/etc.  │
│  - App Router pages  │                             │  - PostgreSQL via Prisma │
│  - TanStack Query    │                             │                          │
└────────────────────┘                             └──────────────────────────┘
```

Better Auth owns session/credential concerns on the frontend side (signup/login forms, session persistence, CSRF-safe cookie handling); its **JWT plugin** mints a short-lived token attached to outgoing API requests so the Express backend can verify identity independently, without sharing a session store.

---

## 3. Folder Structure

```
web/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 # landing page
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── courses/
│   │       ├── page.tsx             # catalog
│   │       └── [courseId]/page.tsx  # course detail / roadmap preview
│   │
│   ├── (learner)/
│   │   ├── layout.tsx               # auth-guarded shell: header, streak/gems
│   │   ├── dashboard/page.tsx
│   │   └── learn/
│   │       └── [courseId]/
│   │           ├── page.tsx                     # active module + trail
│   │           ├── module/[moduleId]/page.tsx   # video list for module
│   │           ├── video/[videoId]/page.tsx     # player + mark-complete
│   │           ├── quiz/[moduleId]/page.tsx
│   │           └── assignment/page.tsx
│   │
│   ├── (admin)/
│   │   ├── layout.tsx               # role-guarded (ADMIN, and INSTRUCTOR scoped to own courses)
│   │   └── console/
│   │       ├── categories/
│   │       │   ├── page.tsx                     # list + create
│   │       │   └── [categoryId]/page.tsx         # edit
│   │       ├── courses/
│   │       │   ├── page.tsx                     # list + create
│   │       │   └── [courseId]/
│   │       │       ├── page.tsx                  # course settings, publish checklist
│   │       │       ├── modules/
│   │       │       │   ├── page.tsx              # ordered module list + create/reorder
│   │       │       │   └── [moduleId]/
│   │       │       │       ├── page.tsx          # module settings
│   │       │       │       ├── classes/page.tsx  # module classes (video lessons): add/edit/reorder
│   │       │       │       └── quiz/page.tsx      # quiz builder: questions + options + correct-answer flag
│   │       │       └── assignment/page.tsx        # final assignment prompt editor
│   │       ├── users/
│   │       │   └── page.tsx                     # user list, role management
│   │       └── submissions/
│   │           ├── page.tsx                     # all-courses assignment review queue, filterable
│   │           └── [submissionId]/page.tsx        # submission detail: content, timestamp, learner progress history, approve/reject
│   │
│   ├── api/
│   │   └── auth/[...all]/route.ts   # Better Auth route handler
│   │
│   ├── layout.tsx                   # root layout, ThemeProvider
│   └── globals.css                  # design tokens (CSS variables)
│
├── components/
│   ├── ui/                          # shadcn primitives (generated)
│   ├── magic/                       # magic ui components (sparingly used)
│   ├── trail/                       # WaypointTrail, TrailNode, TrailConnector
│   ├── learning/                    # VideoCard, MarkCompleteButton, DeadlineTimer
│   ├── gamification/                # StreakBadge, GemCounter, RewardBurst
│   └── layout/                      # Header, Sidebar, ThemeToggle
│
├── lib/
│   ├── auth/
│   │   ├── auth-client.ts           # Better Auth client instance
│   │   └── server-session.ts        # server-side session/JWT helpers
│   ├── api/
│   │   ├── client.ts                # fetch wrapper — attaches JWT, parses envelope
│   │   ├── courses.ts                # typed endpoint functions
│   │   ├── modules.ts
│   │   ├── progress.ts
│   │   └── admin.ts
│   ├── query/
│   │   └── query-client.ts          # TanStack Query provider config
│   ├── validation/                  # Zod schemas mirroring backend DTOs
│   └── utils/
│       ├── time.ts                  # deadline/countdown math
│       └── cn.ts
│
├── hooks/
│   ├── use-countdown.ts
│   ├── use-module-progress.ts
│   └── use-role-guard.ts
│
├── types/
│   └── api.ts                       # shared response/DTO types
│
├── styles/
│   └── tokens.css                   # light/dark CSS variable definitions
│
├── middleware.ts                    # route protection (session check, role check)
├── next.config.ts
├── tailwind.config.ts
├── .env.local
└── package.json
```

---

## 4. Authentication Flow

1. **Sign up / Login** — form (shadcn + React Hook Form + Zod) submits to Better Auth's client SDK.
2. Better Auth issues a session (cookie) **and**, via the JWT plugin, exposes a short-lived signed JWT (`getToken()`/session callback) representing that session.
3. `lib/api/client.ts` is the single fetch wrapper: it reads the current JWT (client-side via the Better Auth client, server-side via `server-session.ts` in Server Components/Route Handlers) and attaches `Authorization: Bearer <token>` to every request to the Express API.
4. The Express backend independently verifies the JWT (shared secret or JWKS, aligned with the backend's `JWT_SECRET`/verification setup) and treats the frontend purely as an API consumer — no shared session store between the two services.
5. `middleware.ts` protects route groups: `(learner)` requires any authenticated session; `(admin)` additionally requires `role IN (INSTRUCTOR, ADMIN)`, checked via the session's role claim. Within `(admin)`, `ADMIN` has unrestricted access to every course/category/user/submission; `INSTRUCTOR` is scoped client-side (and enforced server-side by the backend) to courses they authored — the console UI is identical, the data returned differs by role.
6. `users/` and the full cross-course `submissions/` queue are **ADMIN-only** routes — `use-role-guard.ts` redirects an `INSTRUCTOR` session away from these to their own course list.
7. Token refresh is handled by Better Auth's built-in session refresh; the API client wrapper retries once on a `401` after a silent refresh, then redirects to `/login` on repeated failure.

---

## 5. Data Fetching Strategy

- **Initial page loads** (catalog, course detail, dashboard shell) use **Server Components** calling the API client directly on the server for fast first paint and to avoid a loading flash on data the user needs immediately.
- **Interactive/mutating flows** (mark video complete, submit quiz, submit assignment, admin CRUD) use **TanStack Query** on the client for optimistic-safe mutations, cache invalidation, and retry handling.
- **Progress/unlock state is never trusted client-side.** The "next video/module unlocked" UI state is always derived from the latest API response (`ModuleUnlock` / `VideoProgress` payloads), not from local component state — this mirrors the backend's server-enforced sequencing described in `PRD.md` §6.3 / FR-8.
- **Countdown timers** are computed client-side from a server-provided `deadlineAt` ISO timestamp (`use-countdown.ts`), re-synced on each successful API response to avoid client-clock drift becoming visible.

---

## 6. State Management

| State type | Tool |
|---|---|
| Server data (courses, progress, streak, gems) | TanStack Query cache, keyed by resource (`['course', id]`, `['progress', courseId]`) |
| Auth/session | Better Auth client hook (`useSession`) |
| Theme | `next-themes`, persisted to `localStorage` + `data-theme` attribute |
| Ephemeral UI state (modals, active tab, form state) | Local component state / React Hook Form |
| No global client store (Redux/Zustand) is introduced — the app's state is overwhelmingly server-derived, so a query cache plus local state is sufficient and avoids duplicated sources of truth. |

---

## 7. Error & Empty States

- All API errors surface through the shared response envelope (`success: false, message`). `lib/api/client.ts` normalizes these into a typed `ApiError`, surfaced via shadcn `Toast` / inline form errors.
- Deadline-missed and quiz-failed states are treated as **expected states**, not errors — rendered with dedicated UI (per `DESIGN.md` ember/danger tokens), never as a generic error toast.
- Empty states (no enrollments, no submissions to review) use the trail metaphor's "empty path" illustration variant, with a clear single CTA.

---

## 8. Environment Variables

```
NEXT_PUBLIC_API_BASE_URL=       # Express backend base URL
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=
DATABASE_URL=                   # only if Better Auth's own tables live in the same Postgres instance
JWT_ISSUER=
```

---

## 9. Testing & Quality

- **Type safety:** shared Zod schemas in `lib/validation` mirror backend DTOs; API client functions are fully typed against `types/api.ts`, so a backend contract change surfaces as a compile error, not a runtime bug.
- **Component tests:** critical interaction components (`MarkCompleteButton`, `DeadlineTimer`, `WaypointTrail`) covered with unit tests for state transitions (locked → unlocked → completed).
- **Accessibility:** automated checks (axe) in CI for keyboard nav and contrast on both themes, per `DESIGN.md` §4.

---

## 10. Deployment

- Frontend deployed independently (e.g. Vercel) from the Express backend, communicating only via `NEXT_PUBLIC_API_BASE_URL` and CORS-permitted origins configured on the backend.
- Environment-specific `BETTER_AUTH_URL` / `NEXT_PUBLIC_API_BASE_URL` per environment (local / staging / production), no hardcoded URLs in source.