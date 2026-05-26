export type ReviewStatus = "pending" | "running" | "completed" | "failed";
export type AgentType = "bug" | "security" | "performance" | "style";
export type Severity = "low" | "medium" | "high";

export interface Review {
  id: string;
  owner: string;
  repo: string;
  pullNumber: number;
  prTitle: string;
  prDescription: string;
  commitId: string;
  status: ReviewStatus;
  durationMs: number;
  createdAt: string;
  completedAt: string;
}

export interface Finding {
  id: string;
  reviewId: string;
  agent: AgentType;
  file: string;
  line: number;
  severity: Severity;
  issue: string;
  suggestion: string;
}

export interface ReviewSummary {
  id: string;
  reviewId: string;
  bugSummary: string;
  securitySummary: string;
  performanceSummary: string;
  styleSummary: string;
  overallSummary: string;
}

export interface Repository {
  id: string;
  owner: string;
  repo: string;
  installationId: number;
  enabledAgents: AgentType[];
  severityThreshold: Severity;
  installedAt: string;
}

export const MOCK_USER = {
  id: "user_01",
  name: "Vishal Sharma",
  email: "vikashhrs@gmail.com",
  avatarUrl: "https://avatars.githubusercontent.com/u/12345678",
  githubLogin: "vishalkrsharma",
};

export const MOCK_REPOSITORIES: Repository[] = [
  {
    id: "repo_01",
    owner: "vishalkrsharma",
    repo: "merge-lens",
    installationId: 10001,
    enabledAgents: ["bug", "security", "performance", "style"],
    severityThreshold: "low",
    installedAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "repo_02",
    owner: "vishalkrsharma",
    repo: "api-gateway",
    installationId: 10002,
    enabledAgents: ["bug", "security"],
    severityThreshold: "medium",
    installedAt: "2026-04-15T14:30:00Z",
  },
  {
    id: "repo_03",
    owner: "vishalkrsharma",
    repo: "data-pipeline",
    installationId: 10003,
    enabledAgents: ["bug", "performance", "style"],
    severityThreshold: "low",
    installedAt: "2026-05-01T09:00:00Z",
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev_01",
    owner: "vishalkrsharma",
    repo: "merge-lens",
    pullNumber: 42,
    prTitle: "feat: add multi-agent orchestration pipeline",
    prDescription: "Introduces a parallel agent runner for bug, security, performance, and style analysis.",
    commitId: "a1b2c3d",
    status: "completed",
    durationMs: 14200,
    createdAt: "2026-05-25T09:15:00Z",
    completedAt: "2026-05-25T09:15:14Z",
  },
  {
    id: "rev_02",
    owner: "vishalkrsharma",
    repo: "merge-lens",
    pullNumber: 41,
    prTitle: "fix: resolve race condition in BullMQ processor",
    prDescription: "Fixes a race condition where two jobs could process the same PR simultaneously.",
    commitId: "b2c3d4e",
    status: "completed",
    durationMs: 9800,
    createdAt: "2026-05-24T14:30:00Z",
    completedAt: "2026-05-24T14:30:10Z",
  },
  {
    id: "rev_03",
    owner: "vishalkrsharma",
    repo: "api-gateway",
    pullNumber: 18,
    prTitle: "feat: JWT validation middleware",
    prDescription: "Adds middleware for validating JWT tokens on protected routes.",
    commitId: "c3d4e5f",
    status: "completed",
    durationMs: 11500,
    createdAt: "2026-05-24T10:00:00Z",
    completedAt: "2026-05-24T10:00:12Z",
  },
  {
    id: "rev_04",
    owner: "vishalkrsharma",
    repo: "data-pipeline",
    pullNumber: 7,
    prTitle: "perf: batch database writes to reduce round trips",
    prDescription: "Groups individual inserts into batch operations for 10x throughput improvement.",
    commitId: "d4e5f6a",
    status: "completed",
    durationMs: 16000,
    createdAt: "2026-05-23T16:45:00Z",
    completedAt: "2026-05-23T16:45:16Z",
  },
  {
    id: "rev_05",
    owner: "vishalkrsharma",
    repo: "merge-lens",
    pullNumber: 40,
    prTitle: "refactor: extract base agent class",
    prDescription: "Moves shared Google GenAI client setup into a base class.",
    commitId: "e5f6a7b",
    status: "completed",
    durationMs: 8400,
    createdAt: "2026-05-23T11:20:00Z",
    completedAt: "2026-05-23T11:20:08Z",
  },
  {
    id: "rev_06",
    owner: "vishalkrsharma",
    repo: "api-gateway",
    pullNumber: 17,
    prTitle: "fix: SQL injection in user search endpoint",
    prDescription: "Replaces string interpolation with parameterized queries.",
    commitId: "f6a7b8c",
    status: "completed",
    durationMs: 10200,
    createdAt: "2026-05-22T08:00:00Z",
    completedAt: "2026-05-22T08:00:10Z",
  },
  {
    id: "rev_07",
    owner: "vishalkrsharma",
    repo: "data-pipeline",
    pullNumber: 6,
    prTitle: "feat: add Voyage AI embeddings for RAG",
    prDescription: "Integrates Voyage AI for generating embeddings for document retrieval.",
    commitId: "a7b8c9d",
    status: "completed",
    durationMs: 13700,
    createdAt: "2026-05-21T15:00:00Z",
    completedAt: "2026-05-21T15:00:14Z",
  },
  {
    id: "rev_08",
    owner: "vishalkrsharma",
    repo: "merge-lens",
    pullNumber: 39,
    prTitle: "chore: add Prometheus metrics for agent duration",
    prDescription: "Tracks per-agent execution time using a histogram metric.",
    commitId: "b8c9d0e",
    status: "completed",
    durationMs: 7600,
    createdAt: "2026-05-20T13:00:00Z",
    completedAt: "2026-05-20T13:00:08Z",
  },
  {
    id: "rev_09",
    owner: "vishalkrsharma",
    repo: "api-gateway",
    pullNumber: 16,
    prTitle: "feat: rate limiting with Redis sliding window",
    prDescription: "Implements per-IP rate limiting using Redis sorted sets.",
    commitId: "c9d0e1f",
    status: "completed",
    durationMs: 12300,
    createdAt: "2026-05-19T10:30:00Z",
    completedAt: "2026-05-19T10:30:12Z",
  },
  {
    id: "rev_10",
    owner: "vishalkrsharma",
    repo: "data-pipeline",
    pullNumber: 5,
    prTitle: "fix: memory leak in stream processor",
    prDescription: "Properly closes ReadableStream after processing to release memory.",
    commitId: "d0e1f2a",
    status: "completed",
    durationMs: 9100,
    createdAt: "2026-05-18T09:00:00Z",
    completedAt: "2026-05-18T09:00:09Z",
  },
  {
    id: "rev_11",
    owner: "vishalkrsharma",
    repo: "merge-lens",
    pullNumber: 38,
    prTitle: "feat: RAG document indexing on startup",
    prDescription: "Automatically indexes ./docs/*.md files when the server starts.",
    commitId: "e1f2a3b",
    status: "completed",
    durationMs: 15100,
    createdAt: "2026-05-17T14:00:00Z",
    completedAt: "2026-05-17T14:00:15Z",
  },
  {
    id: "rev_12",
    owner: "vishalkrsharma",
    repo: "api-gateway",
    pullNumber: 15,
    prTitle: "refactor: split monolithic auth service",
    prDescription: "Splits the 800-line AuthService into three focused services.",
    commitId: "f2a3b4c",
    status: "completed",
    durationMs: 18200,
    createdAt: "2026-05-16T11:00:00Z",
    completedAt: "2026-05-16T11:00:18Z",
  },
  {
    id: "rev_13",
    owner: "vishalkrsharma",
    repo: "data-pipeline",
    pullNumber: 4,
    prTitle: "perf: parallel file processing with worker threads",
    prDescription: "Uses Node.js worker threads to process large CSV files in parallel.",
    commitId: "a3b4c5d",
    status: "completed",
    durationMs: 11800,
    createdAt: "2026-05-15T16:00:00Z",
    completedAt: "2026-05-15T16:00:12Z",
  },
  {
    id: "rev_14",
    owner: "vishalkrsharma",
    repo: "merge-lens",
    pullNumber: 37,
    prTitle: "fix: HMAC signature verification bypass",
    prDescription: "Fixes a timing attack vulnerability in the webhook HMAC check.",
    commitId: "b4c5d6e",
    status: "completed",
    durationMs: 8700,
    createdAt: "2026-05-14T09:30:00Z",
    completedAt: "2026-05-14T09:30:09Z",
  },
  {
    id: "rev_15",
    owner: "vishalkrsharma",
    repo: "api-gateway",
    pullNumber: 14,
    prTitle: "feat: GraphQL subscriptions for real-time events",
    prDescription: "Adds WebSocket-based subscriptions to the GraphQL schema.",
    commitId: "c5d6e7f",
    status: "failed",
    durationMs: 4200,
    createdAt: "2026-05-13T13:00:00Z",
    completedAt: "2026-05-13T13:00:04Z",
  },
  {
    id: "rev_16",
    owner: "vishalkrsharma",
    repo: "data-pipeline",
    pullNumber: 3,
    prTitle: "chore: upgrade TypeScript to 5.4",
    prDescription: "Upgrades TypeScript and resolves new strict mode warnings.",
    commitId: "d6e7f8a",
    status: "completed",
    durationMs: 6900,
    createdAt: "2026-05-12T10:00:00Z",
    completedAt: "2026-05-12T10:00:07Z",
  },
  {
    id: "rev_17",
    owner: "vishalkrsharma",
    repo: "merge-lens",
    pullNumber: 36,
    prTitle: "feat: structured logging with nestjs-pino",
    prDescription: "Replaces console.log with structured JSON logging using pino.",
    commitId: "e7f8a9b",
    status: "completed",
    durationMs: 10500,
    createdAt: "2026-05-11T15:30:00Z",
    completedAt: "2026-05-11T15:30:10Z",
  },
  {
    id: "rev_18",
    owner: "vishalkrsharma",
    repo: "api-gateway",
    pullNumber: 13,
    prTitle: "fix: CORS misconfiguration allowing all origins",
    prDescription: "Restricts CORS to a whitelist of allowed origins.",
    commitId: "f8a9b0c",
    status: "completed",
    durationMs: 7300,
    createdAt: "2026-05-10T08:00:00Z",
    completedAt: "2026-05-10T08:00:07Z",
  },
  {
    id: "rev_19",
    owner: "vishalkrsharma",
    repo: "data-pipeline",
    pullNumber: 2,
    prTitle: "feat: Kafka consumer for event streaming",
    prDescription: "Adds a Kafka consumer to ingest real-time data events.",
    commitId: "a9b0c1d",
    status: "running",
    durationMs: 0,
    createdAt: "2026-05-26T08:00:00Z",
    completedAt: "",
  },
  {
    id: "rev_20",
    owner: "vishalkrsharma",
    repo: "merge-lens",
    pullNumber: 43,
    prTitle: "feat: add web dashboard frontend",
    prDescription: "Companion web app showing review history, findings, and stats.",
    commitId: "b0c1d2e",
    status: "pending",
    durationMs: 0,
    createdAt: "2026-05-26T09:00:00Z",
    completedAt: "",
  },
];

export const MOCK_FINDINGS: Finding[] = [
  // rev_01 findings
  { id: "f_001", reviewId: "rev_01", agent: "bug", file: "src/orchestrator/orchestrator.service.ts", line: 45, severity: "high", issue: "Promise.all rejects if any agent throws — other results are silently dropped", suggestion: "Use Promise.allSettled and handle rejected promises individually" },
  { id: "f_002", reviewId: "rev_01", agent: "bug", file: "src/agents/summary.agent.ts", line: 23, severity: "medium", issue: "Agent result passed without null check before destructuring", suggestion: "Add a guard: `if (!result?.findings) return []` before accessing result.findings" },
  { id: "f_003", reviewId: "rev_01", agent: "security", file: "src/orchestrator/orchestrator.service.ts", line: 72, severity: "medium", issue: "Raw diff content injected into prompt without sanitization", suggestion: "Strip null bytes and limit diff size before including in prompt" },
  { id: "f_004", reviewId: "rev_01", agent: "performance", file: "src/orchestrator/orchestrator.service.ts", line: 38, severity: "low", issue: "Deep clone of ReviewContext on every agent call is unnecessary", suggestion: "Pass the context by reference — agents should treat it as read-only" },
  { id: "f_005", reviewId: "rev_01", agent: "style", file: "src/agents/base.agent.ts", line: 12, severity: "low", issue: "Class property `client` should be declared as `readonly`", suggestion: "Add `readonly` modifier: `protected readonly client: GoogleGenerativeAI`" },

  // rev_02 findings
  { id: "f_006", reviewId: "rev_02", agent: "bug", file: "src/review/review.processor.ts", line: 88, severity: "high", issue: "Job lock is acquired but never released on uncaught exception", suggestion: "Wrap processor body in try/finally and call job.discard() in the finally block" },
  { id: "f_007", reviewId: "rev_02", agent: "bug", file: "src/review/review.processor.ts", line: 102, severity: "medium", issue: "Duplicate job detection compares timestamps which can collide under high load", suggestion: "Use a deterministic key based on repo+PR number+commit SHA instead of timestamp" },
  { id: "f_008", reviewId: "rev_02", agent: "performance", file: "src/review/review.processor.ts", line: 65, severity: "medium", issue: "PR diff fetched twice — once in processor and once in orchestrator", suggestion: "Fetch diff once in processor and pass it through ReviewContext" },

  // rev_03 findings
  { id: "f_009", reviewId: "rev_03", agent: "security", file: "src/middleware/jwt.middleware.ts", line: 34, severity: "high", issue: "JWT signature not verified — only decoded with `jwt.decode()` instead of `jwt.verify()`", suggestion: "Replace `jwt.decode(token)` with `jwt.verify(token, process.env.JWT_SECRET)` and handle errors" },
  { id: "f_010", reviewId: "rev_03", agent: "security", file: "src/middleware/jwt.middleware.ts", line: 51, severity: "medium", issue: "Token expiry not checked after decoding", suggestion: "Check `payload.exp > Date.now() / 1000` or rely on `jwt.verify()` which checks expiry automatically" },
  { id: "f_011", reviewId: "rev_03", agent: "bug", file: "src/middleware/jwt.middleware.ts", line: 28, severity: "medium", issue: "Middleware does not handle malformed Authorization header (missing 'Bearer ' prefix)", suggestion: "Split on ' ' and validate array length before accessing index 1" },
  { id: "f_012", reviewId: "rev_03", agent: "style", file: "src/middleware/jwt.middleware.ts", line: 15, severity: "low", issue: "Magic string 'Bearer' repeated 3 times — should be a constant", suggestion: "Extract `const BEARER_PREFIX = 'Bearer '` at module level" },

  // rev_04 findings
  { id: "f_013", reviewId: "rev_04", agent: "performance", file: "src/pipeline/writer.service.ts", line: 67, severity: "high", issue: "Batch size is hardcoded to 100 — causes OOM on large payloads", suggestion: "Make batch size configurable via env var with a sensible default of 500" },
  { id: "f_014", reviewId: "rev_04", agent: "performance", file: "src/pipeline/writer.service.ts", line: 89, severity: "medium", issue: "Transaction wraps the entire batch — a single failure retries all records", suggestion: "Use savepoints within the transaction to retry only failed records" },
  { id: "f_015", reviewId: "rev_04", agent: "bug", file: "src/pipeline/writer.service.ts", line: 112, severity: "medium", issue: "Error swallowed in catch block — failed batches are silently skipped", suggestion: "Re-throw or at minimum emit an error event so the caller knows about the failure" },
  { id: "f_016", reviewId: "rev_04", agent: "style", file: "src/pipeline/writer.service.ts", line: 34, severity: "low", issue: "Function `batchWrite` is 120 lines — should be split into smaller helpers", suggestion: "Extract `prepareBatch`, `executeBatch`, and `handleBatchError` as private methods" },

  // rev_05 findings
  { id: "f_017", reviewId: "rev_05", agent: "style", file: "src/agents/base.agent.ts", line: 8, severity: "low", issue: "Abstract class has no abstract methods — could be a plain class or interface", suggestion: "Add `abstract review(context: ReviewContext): Promise<AgentResponse>` to enforce contract" },
  { id: "f_018", reviewId: "rev_05", agent: "bug", file: "src/agents/bug.agent.ts", line: 31, severity: "low", issue: "Agent returns empty findings array instead of throwing on API timeout", suggestion: "Distinguish between empty results and errors — throw `AgentTimeoutError` on timeout" },

  // rev_06 findings
  { id: "f_019", reviewId: "rev_06", agent: "security", file: "src/users/users.controller.ts", line: 44, severity: "high", issue: "User input directly interpolated into SQL string via template literal", suggestion: "Use parameterized queries: `db.query('SELECT * FROM users WHERE email = $1', [email])`" },
  { id: "f_020", reviewId: "rev_06", agent: "security", file: "src/users/users.controller.ts", line: 58, severity: "high", issue: "Error response includes raw database error message exposing schema details", suggestion: "Return a generic error message to clients; log the full error server-side only" },
  { id: "f_021", reviewId: "rev_06", agent: "bug", file: "src/users/users.controller.ts", line: 71, severity: "medium", issue: "Pagination offset calculated with unchecked user input — negative values cause crashes", suggestion: "Clamp offset to `Math.max(0, parseInt(offset) || 0)` before using in query" },
  { id: "f_022", reviewId: "rev_06", agent: "performance", file: "src/users/users.controller.ts", line: 85, severity: "low", issue: "N+1 query: fetching each user's role in a loop instead of a JOIN", suggestion: "Add a JOIN to the main user query: `SELECT u.*, r.name as role FROM users u LEFT JOIN roles r ON u.role_id = r.id`" },

  // rev_07 findings
  { id: "f_023", reviewId: "rev_07", agent: "performance", file: "src/rag/embeddings.service.ts", line: 29, severity: "medium", issue: "Embeddings generated one-by-one in a loop — Voyage AI supports batching", suggestion: "Batch calls: `voyageClient.embed({ input: texts, model: 'voyage-3' })` for all texts at once" },
  { id: "f_024", reviewId: "rev_07", agent: "performance", file: "src/rag/embeddings.service.ts", line: 52, severity: "low", issue: "No caching for frequently accessed doc embeddings — re-computed on every request", suggestion: "Cache embeddings in a Map keyed by content hash; invalidate only when docs change" },
  { id: "f_025", reviewId: "rev_07", agent: "bug", file: "src/rag/vector.service.ts", line: 17, severity: "medium", issue: "Cosine similarity returns NaN when either vector has zero magnitude", suggestion: "Add a guard: `if (magnitudeA === 0 || magnitudeB === 0) return 0`" },

  // rev_08 findings
  { id: "f_026", reviewId: "rev_08", agent: "style", file: "src/observability/metrics.service.ts", line: 38, severity: "low", issue: "Histogram buckets use defaults — not tuned for actual review duration distribution", suggestion: "Set buckets to `[100, 500, 1000, 3000, 7000, 15000, 30000]` to match observed latencies" },
  { id: "f_027", reviewId: "rev_08", agent: "bug", file: "src/observability/metrics.service.ts", line: 61, severity: "low", issue: "Counter incremented before operation completes — counts failed reviews as successful", suggestion: "Move `reviews_total.inc()` to after `orchestrator.execute()` resolves successfully" },

  // rev_09 findings
  { id: "f_028", reviewId: "rev_09", agent: "security", file: "src/middleware/rate-limit.middleware.ts", line: 55, severity: "high", issue: "Rate limit key uses X-Forwarded-For header without validation — trivial to spoof", suggestion: "Use the socket remote address as the primary key; only trust X-Forwarded-For behind a known proxy" },
  { id: "f_029", reviewId: "rev_09", agent: "performance", file: "src/middleware/rate-limit.middleware.ts", line: 78, severity: "medium", issue: "Two Redis round-trips per request (ZSCORE + ZADD) — should use a Lua script", suggestion: "Use `redis.eval()` with an atomic Lua script to check and increment in a single operation" },
  { id: "f_030", reviewId: "rev_09", agent: "bug", file: "src/middleware/rate-limit.middleware.ts", line: 91, severity: "medium", issue: "Window cleanup (ZREMRANGEBYSCORE) never called — sorted set grows unboundedly", suggestion: "Call ZREMRANGEBYSCORE in the same Lua script to prune expired entries" },

  // rev_10 findings
  { id: "f_031", reviewId: "rev_10", agent: "bug", file: "src/pipeline/stream.processor.ts", line: 34, severity: "high", issue: "ReadableStream not closed in error path — file descriptor leak", suggestion: "Add `stream.destroy()` in the catch block and use a finally handler for cleanup" },
  { id: "f_032", reviewId: "rev_10", agent: "performance", file: "src/pipeline/stream.processor.ts", line: 67, severity: "medium", issue: "Processing 10MB chunks synchronously blocks the event loop", suggestion: "Use `setImmediate` to yield between chunks or process in a Worker thread" },

  // rev_11 findings
  { id: "f_033", reviewId: "rev_11", agent: "performance", file: "src/rag/repository-index.service.ts", line: 23, severity: "medium", issue: "Entire docs directory indexed synchronously at startup — delays server readiness", suggestion: "Run indexing asynchronously and expose a `isReady()` check; defer requests until ready" },
  { id: "f_034", reviewId: "rev_11", agent: "bug", file: "src/rag/repository-index.service.ts", line: 41, severity: "low", issue: "Silently ignores files that fail to parse — index is incomplete without any warning", suggestion: "Log a warning with the file path and error when a document fails to index" },

  // rev_12 findings
  { id: "f_035", reviewId: "rev_12", agent: "style", file: "src/auth/token.service.ts", line: 15, severity: "low", issue: "Service has 12 public methods — violates single responsibility principle", suggestion: "Split into TokenIssuer (create/sign), TokenValidator (verify/decode), and TokenStore (revoke/lookup)" },
  { id: "f_036", reviewId: "rev_12", agent: "security", file: "src/auth/session.service.ts", line: 88, severity: "high", issue: "Session tokens stored in localStorage — vulnerable to XSS", suggestion: "Store session tokens in HttpOnly cookies; use SameSite=Strict to prevent CSRF" },
  { id: "f_037", reviewId: "rev_12", agent: "bug", file: "src/auth/session.service.ts", line: 102, severity: "medium", issue: "Session expiry not refreshed on activity — users logged out mid-session", suggestion: "Implement sliding expiry: reset TTL on each authenticated request" },

  // rev_13 findings
  { id: "f_038", reviewId: "rev_13", agent: "performance", file: "src/pipeline/file.processor.ts", line: 28, severity: "high", issue: "Worker thread pool size is 1 — no actual parallelism", suggestion: "Set pool size to `os.cpus().length - 1` to utilize all available cores" },
  { id: "f_039", reviewId: "rev_13", agent: "bug", file: "src/pipeline/file.processor.ts", line: 55, severity: "medium", issue: "Worker thread errors not propagated to main thread — failures silently disappear", suggestion: "Listen for 'error' events on each worker and reject the parent promise accordingly" },

  // rev_14 findings
  { id: "f_040", reviewId: "rev_14", agent: "security", file: "src/webhooks/webhooks.controller.ts", line: 29, severity: "high", issue: "Timing-safe comparison not used for HMAC signature — vulnerable to timing attack", suggestion: "Use `crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))` instead of `===`" },
  { id: "f_041", reviewId: "rev_14", agent: "security", file: "src/webhooks/webhooks.controller.ts", line: 42, severity: "medium", issue: "Webhook payload not size-limited — could cause OOM with a large crafted payload", suggestion: "Add a body size limit: `app.use(express.json({ limit: '1mb' }))`" },

  // rev_16 findings
  { id: "f_042", reviewId: "rev_16", agent: "style", file: "src/pipeline/transform.service.ts", line: 22, severity: "low", issue: "TypeScript strict mode disabled in tsconfig — missing null checks", suggestion: "Enable `strict: true` in tsconfig.json and fix resulting type errors" },
  { id: "f_043", reviewId: "rev_16", agent: "bug", file: "src/pipeline/transform.service.ts", line: 45, severity: "low", issue: "Optional chaining not used — runtime error when deeply nested property is undefined", suggestion: "Replace `obj.a.b.c` with `obj?.a?.b?.c` throughout the file" },

  // rev_17 findings
  { id: "f_044", reviewId: "rev_17", agent: "style", file: "src/observability/logger.service.ts", line: 18, severity: "low", issue: "Log level not configurable at runtime — hardcoded to 'info'", suggestion: "Read log level from `process.env.LOG_LEVEL` with a fallback of 'info'" },
  { id: "f_045", reviewId: "rev_17", agent: "performance", file: "src/observability/logger.service.ts", line: 35, severity: "low", issue: "Large objects serialized in every log call regardless of enabled log level", suggestion: "Wrap expensive serializations in a check: `if (this.logger.isLevelEnabled('debug'))`" },

  // rev_18 findings
  { id: "f_046", reviewId: "rev_18", agent: "security", file: "src/middleware/cors.middleware.ts", line: 14, severity: "high", issue: "CORS wildcard fallback used when origin is not in whitelist instead of rejecting", suggestion: "Return a 403 when the origin is not whitelisted; never fall back to '*'" },
  { id: "f_047", reviewId: "rev_18", agent: "security", file: "src/middleware/cors.middleware.ts", line: 28, severity: "medium", issue: "Credentials flag enabled alongside wildcard origin in some code paths", suggestion: "Ensure `credentials: true` is only set alongside an explicit, non-wildcard origin" },
];

export const MOCK_SUMMARIES: ReviewSummary[] = [
  {
    id: "sum_01", reviewId: "rev_01",
    bugSummary: "Critical issue found: Promise.all drops results if any agent fails. One medium severity null-check omission.",
    securitySummary: "Unsanitized diff content injected into AI prompts — medium severity but low exploitation risk in current context.",
    performanceSummary: "Unnecessary deep cloning of ReviewContext on every agent invocation adds ~2ms per review.",
    styleSummary: "Minor readability improvement: missing `readonly` on base class property.",
    overallSummary: "The multi-agent orchestration is well-structured but has a critical reliability issue: Promise.all will silently drop results from all agents if any single agent throws. Switch to Promise.allSettled. Also sanitize diff content before injecting into prompts.",
  },
  {
    id: "sum_02", reviewId: "rev_02",
    bugSummary: "Critical: job lock is never released on uncaught exceptions, leading to stuck jobs after failures. Duplicate detection logic is also flawed under high concurrency.",
    securitySummary: "No security issues found.",
    performanceSummary: "PR diff is fetched twice unnecessarily — once in the processor and once in the orchestrator.",
    styleSummary: "No style issues found.",
    overallSummary: "The race condition fix is incomplete — while the duplicate detection was updated, the job lock is never released on exceptions. This will cause jobs to get stuck after any unhandled error. Prioritize the try/finally fix before merging.",
  },
  {
    id: "sum_03", reviewId: "rev_03",
    bugSummary: "Middleware does not handle malformed Authorization headers gracefully.",
    securitySummary: "Critical: jwt.decode() used instead of jwt.verify() — tokens are not cryptographically validated at all. This is a severe authentication bypass vulnerability.",
    performanceSummary: "No performance issues found.",
    styleSummary: "Magic string 'Bearer' repeated — minor cleanup.",
    overallSummary: "Do not merge this PR. The JWT middleware uses jwt.decode() which only parses the token without verifying the signature. Any crafted token will be accepted as valid. Replace with jwt.verify() immediately.",
  },
  {
    id: "sum_04", reviewId: "rev_04",
    bugSummary: "Errors in batch writes are silently swallowed — failed records disappear without any notification.",
    securitySummary: "No security issues found.",
    performanceSummary: "Hardcoded batch size of 100 will cause OOM with large payloads. Transaction wrapping the entire batch means a single failure retries all records.",
    styleSummary: "The batchWrite function at 120 lines should be decomposed.",
    overallSummary: "Good performance improvement overall, but two issues need addressing: the hardcoded batch size should be environment-configurable, and errors must propagate rather than being swallowed. The current implementation makes data loss silent.",
  },
  {
    id: "sum_05", reviewId: "rev_05",
    bugSummary: "Agent returns empty findings instead of propagating timeout errors — callers can't distinguish between 'no findings' and 'agent failed'.",
    securitySummary: "No security issues found.",
    performanceSummary: "No performance issues found.",
    styleSummary: "Abstract class should declare an abstract method to enforce the agent contract.",
    overallSummary: "Clean refactor. The base class abstraction is sensible but doesn't enforce the agent contract via abstract methods. Low risk changes overall.",
  },
  {
    id: "sum_06", reviewId: "rev_06",
    bugSummary: "Pagination offset not validated — negative values cause database errors.",
    securitySummary: "Critical: SQL injection via direct string interpolation. Raw database error messages exposed to clients.",
    performanceSummary: "N+1 query pattern in role fetching.",
    styleSummary: "No style issues found.",
    overallSummary: "Block this PR. Two critical security issues: SQL injection via template literals and database schema exposed in error responses. These must be fixed before merging.",
  },
  {
    id: "sum_07", reviewId: "rev_07",
    bugSummary: "Cosine similarity returns NaN for zero-magnitude vectors — will crash similarity search.",
    securitySummary: "No security issues found.",
    performanceSummary: "Voyage AI API called once per document instead of in batches. No caching for repeated embeddings.",
    styleSummary: "No style issues found.",
    overallSummary: "The Voyage AI integration works but misses easy performance wins: the SDK supports batch embedding but is being called in a loop. Add batching and a content-hash cache to reduce API costs significantly.",
  },
  {
    id: "sum_08", reviewId: "rev_08",
    bugSummary: "Review counter incremented before operation completes — failed reviews counted as successful.",
    securitySummary: "No security issues found.",
    performanceSummary: "No performance issues found.",
    styleSummary: "Histogram buckets should be tuned to actual observed latency distribution.",
    overallSummary: "Good observability additions. Minor fix needed: move the counter increment to after successful completion to avoid counting failures as successes.",
  },
  {
    id: "sum_09", reviewId: "rev_09",
    bugSummary: "Sliding window entries never pruned — Redis memory grows unboundedly.",
    securitySummary: "Critical: rate limit key based on X-Forwarded-For is trivially spoofable.",
    performanceSummary: "Two Redis round-trips per request — should be a single atomic Lua script operation.",
    styleSummary: "No style issues found.",
    overallSummary: "The rate limiting logic has a critical security flaw (IP spoofing via X-Forwarded-For) and a correctness issue (unbounded memory growth). Both must be fixed. The Lua script optimization is a nice-to-have.",
  },
  {
    id: "sum_10", reviewId: "rev_10",
    bugSummary: "Critical: ReadableStream not closed in error path — file descriptor leak that will exhaust OS limits under load.",
    securitySummary: "No security issues found.",
    performanceSummary: "Synchronous processing of 10MB chunks blocks the event loop.",
    styleSummary: "No style issues found.",
    overallSummary: "The memory leak is fixed but the stream processor still leaks file descriptors in the error path. Add stream.destroy() in a finally block to guarantee cleanup regardless of success or failure.",
  },
];

export function getFindingsByReview(reviewId: string): Finding[] {
  return MOCK_FINDINGS.filter((f) => f.reviewId === reviewId);
}

export function getSummaryByReview(reviewId: string): ReviewSummary | undefined {
  return MOCK_SUMMARIES.find((s) => s.reviewId === reviewId);
}

export function getReviewStats() {
  const completed = MOCK_REVIEWS.filter((r) => r.status === "completed");
  const totalReviews = MOCK_REVIEWS.length;
  const totalFindings = MOCK_FINDINGS.length;

  const findingsByAgent = MOCK_FINDINGS.reduce(
    (acc, f) => { acc[f.agent] = (acc[f.agent] || 0) + 1; return acc; },
    {} as Record<AgentType, number>,
  );

  const findingsBySeverity = MOCK_FINDINGS.reduce(
    (acc, f) => { acc[f.severity] = (acc[f.severity] || 0) + 1; return acc; },
    {} as Record<Severity, number>,
  );

  const avgDurationMs = completed.length
    ? Math.round(completed.reduce((sum, r) => sum + r.durationMs, 0) / completed.length)
    : 0;

  // Build last-30-days timeline
  const now = new Date("2026-05-26");
  const reviewsOverTime = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const count = MOCK_REVIEWS.filter((r) => r.createdAt.startsWith(dateStr)).length;
    return { date: dateStr, count };
  });

  const thisMonthStart = "2026-05-01";
  const thisMonthReviews = MOCK_REVIEWS.filter((r) => r.createdAt >= thisMonthStart).length;

  return {
    totalReviews,
    totalFindings,
    findingsByAgent: { ...{ bug: 0, security: 0, performance: 0, style: 0 }, ...findingsByAgent },
    findingsBySeverity: { ...{ low: 0, medium: 0, high: 0 }, ...findingsBySeverity },
    reviewsOverTime,
    avgDurationMs,
    thisMonthReviews,
  };
}

export function getHotspotFiles(limit = 5) {
  const counts = MOCK_FINDINGS.reduce(
    (acc, f) => { acc[f.file] = (acc[f.file] || 0) + 1; return acc; },
    {} as Record<string, number>,
  );
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([file, count]) => ({ file, count }));
}
