# MergeLens — Frontend Feature Documentation

> Context document for generating the NestJS backend. Describes every screen, the data it consumes, the filters it supports, and the exact API shape the frontend expects.

---

## Enums

```
ReviewStatus : pending | running | completed | failed
AgentType    : bug | security | performance | style
Severity     : low | medium | high
ApiProvider  : anthropic | google | voyage
```

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| id | string | |
| name | string | |
| email | string | unique |
| emailVerified | boolean | |
| image | string? | avatar URL |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### Repository
| Field | Type | Notes |
|---|---|---|
| id | string | |
| owner | string | GitHub org/user |
| repo | string | repository name |
| installationId | number | GitHub App installation ID |
| enabledAgents | AgentType[] | subset of all 4 agents |
| severityThreshold | Severity | minimum severity that triggers a comment |
| installedAt | DateTime | |
| userId | string | FK → User |

Unique constraint: `(owner, repo, userId)`.

### Review
| Field | Type | Notes |
|---|---|---|
| id | string | |
| owner | string | |
| repo | string | |
| pullNumber | number | GitHub PR number |
| prTitle | string | |
| prDescription | string | |
| commitId | string | short SHA |
| status | ReviewStatus | |
| durationMs | number | 0 while pending/running |
| completedAt | DateTime? | null while not completed |
| createdAt | DateTime | |
| updatedAt | DateTime | |
| repositoryId | string | FK → Repository |

### Finding
| Field | Type | Notes |
|---|---|---|
| id | string | |
| agent | AgentType | which agent raised it |
| file | string | relative file path |
| line | number | line number in the file |
| severity | Severity | |
| issue | string | description of the problem |
| suggestion | string | recommended fix |
| reviewId | string | FK → Review |

### ReviewSummary
One-to-one with Review (optional — only present on `completed` reviews).

| Field | Type |
|---|---|
| id | string |
| reviewId | string (unique FK) |
| bugSummary | string |
| securitySummary | string |
| performanceSummary | string |
| styleSummary | string |
| overallSummary | string |

### ApiUsageLog
One log row per provider per review.

| Field | Type | Notes |
|---|---|---|
| id | string | |
| provider | ApiProvider | anthropic \| google \| voyage |
| calls | number | number of API calls made |
| inputTokens | number | |
| outputTokens | number | |
| costCents | number | integer cents |
| createdAt | DateTime | |
| reviewId | string | FK → Review |

---

## Pages & Required API Endpoints

### 1. Dashboard — `/dashboard`

**Purpose:** High-level stats overview for the authenticated user.

#### Stat cards (top row)
| Stat | Derivation |
|---|---|
| Total reviews | `COUNT(reviews)` for the user |
| Total findings | `COUNT(findings)` across all user's reviews |
| High severity | `COUNT(findings WHERE severity = 'high')` |
| Avg duration | `AVG(durationMs)` over `completed` reviews |
| Delta label | Count of reviews created in the current calendar month |

#### Charts
- **Reviews over time** — area chart; daily count of reviews for the last 30 days. Each data point: `{ date: "YYYY-MM-DD", count: number }`.
- **Findings by agent** — bar chart; total findings grouped by agent. Shape: `{ agent: AgentType, count: number }[]`.

#### Recent reviews table (last 5 reviews, newest first)
Columns: Repository (`owner/repo`), PR number, PR title (links to review detail), Status badge, Findings summary (`{high}H · {medium}M · {low}L`), Duration (ms → `x.xs`), Date.

#### Agent finding counts (bottom row)
Four cards — one per agent — each showing the total finding count for that agent across all user reviews.

**Required endpoint:**
```
GET /stats
Response:
{
  totalReviews: number,
  totalFindings: number,
  findingsByAgent: { bug: number, security: number, performance: number, style: number },
  findingsBySeverity: { low: number, medium: number, high: number },
  reviewsOverTime: { date: string, count: number }[],   // last 30 days
  avgDurationMs: number,
  thisMonthReviews: number
}
```

---

### 2. Reviews List — `/reviews`

**Purpose:** Paginated/filterable table of all reviews for the user.

#### Filters (URL query params)
| Param | Values | Behaviour |
|---|---|---|
| `q` | free text | case-insensitive substring match on `prTitle` |
| `repo` | `owner/repo` string or `all` | exact match |
| `status` | `completed \| running \| pending \| failed \| all` | exact match |

#### Table columns
Repository, PR number, PR title (link to detail), Status, Findings (`{H}H · {M}M · {L}L`), Duration, Date.

**Required endpoints:**
```
GET /reviews?q=&repo=&status=&page=&limit=
Response: {
  data: Review[],         // each item includes a computed findingCounts: { high, medium, low }
  total: number
}
```

---

### 3. Review Detail — `/reviews/:id`

**Purpose:** Full detail for a single review including summary and per-agent findings.

#### Header area
- Back link to `/reviews`
- PR title as page heading
- Sub-heading: `owner/repo · PR #N · commit <shortSHA>`
- Status badge
- Metadata row: Started datetime, Completed datetime, Duration, findings count (`{H}H · {M}M · {L}L`)

#### Summary card (only rendered if a `ReviewSummary` exists)
- `overallSummary` text
- Grid with per-agent summaries: `bugSummary`, `securitySummary`, `performanceSummary`, `styleSummary` — each prefixed with its `AgentBadge`.

#### Findings tabs
Tabs: **All** | **Bug** | **Security** | **Performance** | **Style**  
Each tab shows a `FindingsTable` filtered to that agent (count shown in tab label).

#### FindingsTable columns
Agent badge, File path, Line number, Severity badge, Issue description, Suggestion.

**Required endpoints:**
```
GET /reviews/:id
Response: {
  ...Review,
  findings: Finding[],
  summary: ReviewSummary | null
}
```

---

### 4. Findings — `/findings`

**Purpose:** Global, cross-review findings table with sidebar stats.

#### Filters (URL query params)
| Param | Values |
|---|---|
| `agent` | `bug \| security \| performance \| style \| all` |
| `severity` | `high \| medium \| low \| all` |
| `repo` | `owner/repo` string or `all` |
| `file` | free text — substring match on `finding.file` |

#### Main panel
`FindingsTable` (same columns as review detail) with an additional **Review link** column (links to `/reviews/:reviewId`).

#### Sidebar — "Hotspot files"
Top-5 files by finding count. Each row shows:
- Filename (basename only in the label, full path as secondary text)
- Finding count
- Horizontal bar proportional to max count

#### Sidebar — "By severity"
Count of filtered findings at each severity level (high / medium / low).

**Required endpoints:**
```
GET /findings?agent=&severity=&repo=&file=&page=&limit=
Response: {
  data: (Finding & { review: { owner, repo, id } })[],
  total: number
}

GET /findings/hotspots?limit=5
Response: { file: string, count: number }[]
```

---

### 5. Repositories — `/repositories`

**Purpose:** Card grid showing every repository that has the GitHub App installed. Allows per-repo configuration.

#### RepoCard
Each card displays:
- `owner/repo` (monospace), external link to GitHub
- Installed date
- **Enabled agents** — toggle switches for each of the 4 agents
- **Min severity** — dropdown: `low | medium | high`
- Installation ID badge

Toggling an agent or changing the threshold should persist to the backend.

**Required endpoints:**
```
GET /repositories
Response: Repository[]

PATCH /repositories/:id
Body: { enabledAgents?: AgentType[], severityThreshold?: Severity }
Response: Repository
```

---

### 6. Settings — `/settings`

**Purpose:** Usage tracking and account management.

#### Usage this month card
- Progress bar: `thisMonthReviews / MONTHLY_LIMIT` (limit = 50)
- Remaining reviews count
- **API usage table** — per-provider breakdown for the current month:

| Column | Field |
|---|---|
| Provider | `provider` (anthropic / google / voyage) |
| Calls | `SUM(calls)` |
| Tokens | `SUM(inputTokens + outputTokens)` |
| Est. cost | `SUM(costCents)` → formatted as `$x.xx` |

#### Account card
- User avatar, name, GitHub login, email
- Connected account: GitHub
- Repository count
- Total review count
- Sign out button

**Required endpoints:**
```
GET /settings/usage          // current-month aggregated API usage per provider
Response: {
  thisMonthReviews: number,
  monthlyLimit: number,
  apiUsage: {
    provider: ApiProvider,
    calls: number,
    inputTokens: number,
    outputTokens: number,
    costCents: number
  }[]
}

GET /auth/me                 // current user info
Response: User & { repositoryCount: number, totalReviews: number }
```

---

## Navigation (App Sidebar)

The sidebar is present on all authenticated routes (`/(app)/`). Links:
- Dashboard → `/dashboard`
- Reviews → `/reviews`
- Findings → `/findings`
- Repositories → `/repositories`
- Settings → `/settings`

The sidebar also shows the authenticated user's name and avatar (sourced from `/auth/me`).

---

## Authentication

- Auth provider: **BetterAuth** with GitHub OAuth.
- All `/app/*` routes require an authenticated session.
- Unauthenticated users are redirected to `/login`.
- The login page shows a single "Sign in with GitHub" button.

---

## Computed / Derived Values the Backend Should Return

| Value | Used on | Computation |
|---|---|---|
| `findingCounts: { high, medium, low }` | Reviews list, Dashboard recent-reviews table | COUNT findings grouped by severity for that review |
| `hotspots` | Findings sidebar | Top-N files by finding count across filtered results |
| `reviewsOverTime` | Dashboard chart | Daily review count for last 30 days |
| `findingsByAgent` | Dashboard chart + agent stat cards | Total findings grouped by AgentType |
| `thisMonthReviews` | Dashboard delta label, Settings usage | Reviews created since start of current calendar month |
| `avgDurationMs` | Dashboard stat card | AVG(durationMs) over completed reviews only |
