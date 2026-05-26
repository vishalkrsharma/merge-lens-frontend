# MergeLens — Project Context for Web App Generation

## What is MergeLens?

MergeLens is an AI-powered GitHub Pull Request reviewer. When a developer opens or updates a PR on GitHub, MergeLens automatically triggers a multi-agent AI analysis pipeline that produces:

1. **Inline code comments** on specific lines in the PR (bugs, security issues, performance problems, style violations)
2. **A structured summary comment** on the PR with categorized findings and severity breakdowns

The backend is a production-style NestJS (TypeScript) application deployed as a GitHub App.

---

## Current Backend Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 (TypeScript) |
| Queue | BullMQ + Redis |
| AI (agents) | Google Generative AI (`gemini-3.5-flash`) |
| AI (review) | Anthropic Claude (`claude-opus-4-7`) |
| Embeddings | Voyage AI (`voyage-3`) |
| Vector store | In-memory cosine similarity (no external DB) |
| Metrics | Prometheus (`prom-client`) |
| Logging | `nestjs-pino` (structured JSON) |
| GitHub integration | `@octokit/rest` (GitHub App auth) |

### Module Structure

```
src/
├── webhooks/         # POST /webhooks/github — receives GitHub PR events
├── review/           # BullMQ processor — orchestrates the full review pipeline
├── orchestrator/     # Runs all 4 agents in parallel (Promise.all), then summary
├── agents/
│   ├── base.agent.ts          # Shared Google GenAI client
│   ├── bug.agent.ts           # Finds logic/null/type bugs
│   ├── security.agent.ts      # Finds auth/injection/secrets bugs
│   ├── performance.agent.ts   # Finds N+1, blocking I/O, memory leaks
│   ├── style.agent.ts         # Finds code style/naming/structure issues
│   └── summary.agent.ts       # Synthesizes all agent results into a summary
├── ai-review/        # (legacy) Single-agent review path with prompt caching
├── comments/         # Posts findings as inline GitHub PR review comments
├── github/           # Octokit wrapper — fetches PR data, posts comments
├── rag/
│   ├── embeddings.service.ts  # Voyage AI embeddings
│   ├── vector.service.ts      # In-memory cosine similarity search
│   ├── repository-index.service.ts  # Indexes ./docs/*.md on startup
│   └── retrieval.service.ts   # Returns top-k doc chunks relevant to the diff
├── observability/
│   ├── logger.service.ts      # Structured logging helpers
│   ├── metrics.service.ts     # Prometheus metrics (review duration, findings count)
│   ├── tracing.service.ts     # Simple span tracking
│   └── metrics.controller.ts  # GET /api/metrics (Prometheus scrape endpoint)
├── health/           # GET /health (NestJS Terminus)
└── queue/            # BullMQ queue name constants + job data types
```

### Data Flow

```
GitHub PR opened/updated
        │
        ▼
POST /webhooks/github
  [verifies HMAC signature]
        │
        ▼
BullMQ "review" queue
        │
        ▼
ReviewProcessor (worker)
  ├── fetch PR details (title, description)
  ├── fetch changed files + diffs
  ├── RAG retrieval (top docs relevant to the diff)
  └── OrchestratorService.execute(context)
       ├── BugAgent.review()       ─┐
       ├── SecurityAgent.review()   ├── run in parallel
       ├── PerformanceAgent.review()┤
       ├── StyleAgent.review()     ─┘
       └── SummaryAgent.summarize()  ← sequential, uses all 4 results
        │
        ▼
CommentsService.postOrchestratorResults()
  ├── POST summary as GitHub issue comment
  └── POST each finding as inline PR review comment
```

### Core Data Structures

```typescript
interface ReviewContext {
  title: string;        // PR title
  description: string;  // PR body
  files: string[];      // changed file names
  diff: string;         // unified diff of all changed files
  docs: string[];       // RAG-retrieved doc chunks
}

interface AgentFinding {
  file: string;         // relative file path
  line: number;         // line number in the diff
  severity: 'low' | 'medium' | 'high';
  issue: string;        // description of the problem
  suggestion: string;   // how to fix it
}

interface AgentResponse {
  findings: AgentFinding[];
  summary: string;      // human-readable agent summary
}

interface OrchestratorResult {
  bug: AgentResponse;
  security: AgentResponse;
  performance: AgentResponse;
  style: AgentResponse;
  overallSummary: string;  // final synthesized summary
}
```

### Observability Metrics (Prometheus)

| Metric | Type | Description |
|---|---|---|
| `review_duration_ms` | Histogram | End-to-end PR review duration |
| `agent_duration_ms{agent}` | Histogram | Per-agent execution duration |
| `reviews_total` | Counter | Total PR reviews processed |
| `findings_total{severity, agent}` | Counter | Total findings by severity and agent |

### API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/webhooks/github` | GitHub App webhook receiver |
| GET | `/health` | Health check (NestJS Terminus) |
| GET | `/api/metrics` | Prometheus metrics scrape |

### Environment Variables

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API (SummaryAgent, AiReviewService) |
| `GOOGLE_API_KEY` | Google GenAI (BugAgent, SecurityAgent, PerformanceAgent, StyleAgent) |
| `VOYAGE_API_KEY` | Voyage AI embeddings (RAG) |
| `GITHUB_APP_ID` | GitHub App ID |
| `GITHUB_PRIVATE_KEY` | GitHub App private key (PEM) |
| `GITHUB_WEBHOOK_SECRET` | HMAC secret for webhook signature verification |
| `REDIS_URL` | BullMQ queue backend |

---

## What the Web App Needs to Do

The goal is to build a companion web app for MergeLens users. Users install the MergeLens GitHub App on their repos, and the web app gives them:

### Core Features

1. **Authentication**
   - Login with GitHub OAuth (so users can connect their GitHub account)
   - User profile showing connected repos/orgs

2. **Dashboard**
   - Overview of recent PR reviews (repo, PR number, title, date, finding counts)
   - Stats: total reviews run, total findings by severity, average review duration
   - Charts: reviews over time, findings by category (bug/security/performance/style)

3. **Review History**
   - List of all PR reviews for the user's repos
   - Filterable by repo, date range, severity, agent type
   - Click into a review to see full breakdown: all findings per agent, overall summary

4. **Usage Tracking**
   - How many reviews have been run this month
   - API token usage / cost tracking (Anthropic + Google + Voyage calls)
   - Rate limits / quotas if applicable

5. **Repository Settings**
   - Which repos have MergeLens installed
   - Per-repo configuration: which agents to enable, severity thresholds
   - RAG document management (upload/view custom docs used for context)

6. **Findings Explorer**
   - Browse all findings across repos
   - Filter by: agent type, severity, file pattern, date
   - See which files get the most findings (hotspot view)

### Nice-to-Have Features

- **Notifications**: Email or Slack alerts when a high-severity finding is detected
- **Trends**: Finding rate over time — is code quality improving?
- **Team View**: If the user belongs to a GitHub org, show org-wide stats
- **PR Re-review**: Trigger a re-review of any past PR from the dashboard

---

## Integration Points Between Backend and Web App

The web app will need to either:

**Option A — Read from a shared database** (recommended): The NestJS backend writes review results to a database (PostgreSQL recommended), and the web app reads from the same database.

**Option B — New REST/GraphQL API**: Add API endpoints to the NestJS backend that the web app calls.

Currently the backend has **no database** — all state is transient (queue jobs, in-memory vector store). The web app integration will require adding persistence to the backend.

### Suggested data to persist per review:

```
Review
  id            UUID
  owner         string       // GitHub org/user
  repo          string
  pullNumber    number
  prTitle       string
  prDescription string
  commitId      string
  status        enum(pending, running, completed, failed)
  durationMs    number
  createdAt     DateTime
  completedAt   DateTime

Finding
  id            UUID
  reviewId      UUID (FK → Review)
  agent         enum(bug, security, performance, style)
  file          string
  line          number
  severity      enum(low, medium, high)
  issue         string
  suggestion    string

ReviewSummary
  id            UUID
  reviewId      UUID (FK → Review)
  bugSummary          string
  securitySummary     string
  performanceSummary  string
  styleSummary        string
  overallSummary      string
```

---

## Suggested Web App Tech Stack

These are suggestions — adapt based on your preferences:

| Layer | Suggestion | Reason |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR for dashboard, API routes for BFF, good GitHub OAuth support |
| Language | TypeScript | Consistent with backend |
| Styling | Tailwind CSS + shadcn/ui | Fast to build dashboard UIs |
| Charts | Recharts or Tremor | Easy integration with Tailwind |
| Auth | NextAuth.js (GitHub provider) | Built-in GitHub OAuth flow |
| Database | PostgreSQL + Prisma | Shared with backend, type-safe ORM |
| State | TanStack Query | Data fetching + caching for dashboard |
| Hosting | Vercel (frontend) + existing backend | Natural fit for Next.js |

---

## Visual Design Guidance

- **Brand**: Dark-themed developer tool (like Linear, Vercel, GitHub itself). Think dark backgrounds, subtle borders, monospace fonts for code.
- **Color coding for severity**: Red for high, yellow/amber for medium, green for low — consistent with the backend's comment formatting.
- **Agent icons** (already used in PR comments):
  - Bug: 🐛
  - Security: 🔒
  - Performance: ⚡
  - Style: ✨
- **Tone**: Professional/technical, minimal, no marketing fluff.

---

## GitHub App Details

The MergeLens GitHub App:
- Listens to `pull_request` events (actions: `opened`, `synchronize`, `reopened`)
- Requires repo permissions: read code, write pull request comments
- Posts two types of comments on PRs:
  1. A top-level issue comment with the full summary (markdown formatted)
  2. Individual inline review comments per finding (file + line specific)

The web app login should use GitHub OAuth (separate from the GitHub App installation flow, but ideally linked so users can see which of their repos have the App installed).
