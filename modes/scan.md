# Mode: scan — Portal Scanner (Offer Discovery)

Scans configured job portals, filters by title relevance, and adds new offers to the pipeline for later evaluation.

> **Note (v1.6+):** The default scanner (`scan.mjs` / `npm run scan`) is **zero-token** and uses structured sources: company-specific local parsers and public Greenhouse, Ashby, and Lever APIs. The Playwright/WebSearch levels described below are the **agent** flow (run by Claude/Codex), not what `scan.mjs` does. If a company has no local parser or Greenhouse/Ashby/Lever API, `scan.mjs` will skip it; for those cases, the agent must manually complete Level 1 (Playwright) or Level 3 (WebSearch).
>
> **Rule (v1.8+):** If a company's local parser completes successfully at Level 0, the agent **must not** re-run that company through Playwright (Level 1) or API (Level 2). At Level 3, general queries remain active but results from companies already covered by a parser are discarded. See [Rule: successful local parser](#rule-successful-local-parser--no-redundant-scraping).

## Recommended execution

Run as a subagent to avoid consuming main context:

```
Agent(
    subagent_type="general-purpose",
    prompt="[content of this file + specific invocation data]",
    run_in_background=True
)
```

## Configuration

Read `portals.yml` which contains:
- `search_queries`: List of WebSearch queries with `site:` filters per portal (broad discovery)
- `tracked_companies`: Specific companies with `careers_url` for direct navigation
- `tracked_companies[].parser`: Optional local parser for SSR or stable HTML pages
- `title_filter`: Positive/negative/seniority_boost keywords for title filtering

## Discovery strategy (4 levels)

### Level 0 — Local parser (CHEAPEST)

**For each company in `tracked_companies` with `parser:` configured:** run the local parser defined in `portals.yml`. This level is ideal when the careers page uses SSR or stable HTML and a local JavaScript, Python, or other runtime script already exists to extract jobs without agent help.

Recommended contract:

```yaml
- name: Example Company
  careers_url: https://example.com/careers
  scan_method: local_parser
  parser:
    command: node
    script: scripts/parsers/example-company-jobs.js
    format: jobs-json-v1
  enabled: true
```

Typically the parser is company-specific and already knows the URL, selectors, and pagination. `args` is optional: use it to help whoever built the script — for example to reuse it across companies, pass `{careers_url}` or `{company}`, enable a debug flag, save a JSON snapshot, or control parser-specific behavior.

The parser must print JSON to stdout:

Array format:

```json
[
  { "title": "Senior AI Engineer", "url": "https://example.com/jobs/123", "location": "Remote" }
]
```

Object with `jobs`:

```json
{
  "jobs": [
    { "title": "Senior AI Engineer", "url": "https://example.com/jobs/123", "location": "Remote" }
  ]
}
```

Object with `results`:

```json
{
  "results": [
    { "title": "Senior AI Engineer", "url": "https://example.com/jobs/123", "location": "Remote" }
  ]
}
```

`company` is optional; if not provided, `scan.mjs` uses the name from `tracked_companies`.

The scanner does not need to keep the full JSON after reading stdout. If a parser also generates an artifact for auditing or debugging, save it to `data/parser-output/{company}/` and keep it out of git (JSON files in `.gitignore`; `.gitkeep` files stay in git to preserve the directory structure).

### Rule: successful local parser — no redundant scraping

The goal of `scan_method: local_parser` is to **reduce tokens**: prevent the LLM from re-scraping the same company with Playwright or redundant APIs.

During the agent scan, maintain in memory the set **`local_parser_ok`**: company names (`tracked_companies[].name`) where Level 0 completed successfully:

- `parser.command` + `parser.script` exist and the script ran without a fatal error
- stdout was valid JSON (`[]`, `{ jobs: [] }`, or `{ results: [] }`)
- No timeout or process crash

| Level | If company is in `local_parser_ok` |
|-------|-------------------------------------|
| **1 — Playwright** | **Skip** — no `browser_navigate` to its `careers_url` (most expensive in tokens) |
| **2 — API** | **Skip** — no WebFetch of its `api:` endpoint (already covered by parser; `scan.mjs` also skips API after successful parser) |
| **3 — WebSearch** | Run **general** queries (`site:`, role titles); **discard** each hit whose normalized company matches `local_parser_ok` |

**Exceptions:**

- Parser **failed** → company does **not** enter `local_parser_ok`; Levels 1 and 2 apply normally (same as the `scan.mjs` fallback when a parser fails and an ATS API exists).
- Level 3: do not disable cross-portal queries (`site:jobs.ashbyhq.com`, `site:boards.greenhouse.io`, etc.) — they are used to discover **new** companies. Only filter results for companies already in `tracked_companies` with a successful parser.
- Do not create dedicated `search_queries` for a company with an active local parser (e.g. `site:jobs.ashbyhq.com/cohere "AI Engineer"`); use the parser or, if it fails, Playwright/API.

**Recommended Level 0:** run `node scan.mjs` (or `npm run scan`) at the start of the agent workflow. This covers local parsers + APIs in one zero-token pass and returns which companies used `local-parser` successfully.

### Level 1 — Direct Playwright (PRIMARY)

**For each company in `tracked_companies` not in `local_parser_ok`:** Navigate to its `careers_url` with Playwright (`browser_navigate` + `browser_snapshot`), read ALL visible job listings, and extract title + URL for each. This is the most reliable method because:
- Sees the page in real time (no cached Google results)
- Works with SPAs (Ashby, Lever, Workday)
- Detects new offers instantly
- Does not depend on Google's indexing

**Each company MUST have `careers_url` in portals.yml.** If missing, find it once, save it, and use it in future scans.

### Level 2 — ATS APIs / Feeds (COMPLEMENTARY)

For companies with a public API or structured feed **not in `local_parser_ok`**, use the JSON/XML response as a fast complement to Level 1. Faster than Playwright and reduces visual scraping errors.

**Current support (variables in `{}`):**
- **Greenhouse**: `https://boards-api.greenhouse.io/v1/boards/{company}/jobs`
- **Ashby**: `https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams`
- **BambooHR**: list `https://{company}.bamboohr.com/careers/list`; detail `https://{company}.bamboohr.com/careers/{id}/detail`
- **Lever**: `https://api.lever.co/v0/postings/{company}?mode=json`
- **Teamtailor**: `https://{company}.teamtailor.com/jobs.rss`
- **Workday**: `https://{company}.{shard}.myworkdayjobs.com/wday/cxs/{company}/{site}/jobs`

**Parsing conventions by provider:**
- `greenhouse`: `jobs[]` → `title`, `absolute_url`
- `ashby`: GraphQL `ApiJobBoardWithTeams` with `organizationHostedJobsPageName={company}` → `jobBoard.jobPostings[]` (`title`, `id`; construct public URL if not in payload)
- `bamboohr`: list `result[]` → `jobOpeningName`, `id`; construct detail URL `https://{company}.bamboohr.com/careers/{id}/detail`; to read the full JD, GET the detail and use `result.jobOpening` (`jobOpeningName`, `description`, `datePosted`, `minimumExperience`, `compensation`, `jobOpeningShareUrl`)
- `lever`: root array `[]` → `text`, `hostedUrl` (fallback: `applyUrl`)
- `teamtailor`: RSS items → `title`, `link`
- `workday`: `jobPostings[]`/`jobPostings` (depending on tenant) → `title`, `externalPath` or URL built from host

### Level 3 — WebSearch queries (BROAD DISCOVERY)

The `search_queries` with `site:` filters cover portals broadly (all Ashby, all Greenhouse, etc.). Useful for discovering NEW companies not yet in `tracked_companies`, but results may be stale. After filtering hits from companies in `local_parser_ok`, remaining results are deduplicated against Levels 0–2.

**Execution priority:**
1. Level 0: Local parser → companies with `parser:` configured and existing script; build `local_parser_ok`
2. Level 1: Playwright → `tracked_companies` with `careers_url`, **except** `local_parser_ok`
3. Level 2: API → `tracked_companies` with `api:`, **except** `local_parser_ok`
4. Level 3: WebSearch → all `search_queries` with `enabled: true`; discard hits from companies in `local_parser_ok`

Levels are additive — they run in order, results are merged and deduplicated. Companies in `local_parser_ok` **do not** go through Levels 1 or 2; at Level 3 they only contribute to cross-portal discovery (other companies on the same portal).

## Workflow

1. **Read configuration**: `portals.yml`
2. **Read history**: `data/scan-history.tsv` → already-seen URLs
3. **Read dedup sources**: `data/applications.md` + `data/pipeline.md`

3.5. **Level 0 — Local parser** (`scan.mjs`, zero-token):
   Initialize `local_parser_ok = []`.
   Prefer running `node scan.mjs` once to cover all parsers + APIs in a single zero-token pass; if done manually, follow the logic below.
   For each company in `tracked_companies` with `enabled: true`, `parser.command` and existing script:
   a. Run `parser.command` with `parser.script` + `parser.args` using local execution without shell
   b. Expand `{careers_url}` and `{company}` placeholders in arguments
   c. Read JSON from stdout (`[]`, `{ jobs: [] }`, or `{ results: [] }`)
   d. Normalize each job to `{title, url, company, location}`
   e. Resolve relative URLs against `careers_url`
   f. If parser fails, log error, attempt ATS API fallback if it exists, and continue with other companies (**do not** add to `local_parser_ok`)
   g. If parser completes successfully (steps c–e without fatal error), add `entry.name` to `local_parser_ok` and accumulate jobs in candidates

4. **Level 1 — Playwright scan** (parallel in batches of 3–5):
   For each company in `tracked_companies` with `enabled: true`, defined `careers_url`, and **name not listed in `local_parser_ok`**:
   a. `browser_navigate` to `careers_url`
   b. `browser_snapshot` to read all job listings
   c. If the page has filters/departments, navigate relevant sections
   d. For each job listing extract: `{title, url, company}`
   e. If the page paginates results, navigate additional pages
   f. Accumulate in candidate list
   g. If `careers_url` returns 404 or redirect, try `scan_query` as fallback and flag for URL update

5. **Level 2 — ATS APIs / feeds** (parallel):
   For each company in `tracked_companies` with defined `api:`, `enabled: true`, and **name not listed in `local_parser_ok`**:
   a. WebFetch the API/feed URL
   b. If `api_provider` is defined, use its parser; if not, infer from domain (`boards-api.greenhouse.io`, `jobs.ashbyhq.com`, `api.lever.co`, `*.bamboohr.com`, `*.teamtailor.com`, `*.myworkdayjobs.com`)
   c. For **Ashby**, send POST with:
      - `operationName: ApiJobBoardWithTeams`
      - `variables.organizationHostedJobsPageName: {company}`
      - GraphQL query for `jobBoardWithTeams` + `jobPostings { id title locationName employmentType compensationTierSummary }`
   d. For **BambooHR**, the list only has basic metadata. For each relevant item, read `id`, GET `https://{company}.bamboohr.com/careers/{id}/detail`, and extract the full JD from `result.jobOpening`. Use `jobOpeningShareUrl` as public URL if present; otherwise use the detail URL.
   e. For **Workday**, send POST JSON with at least `{"appliedFacets":{},"limit":20,"offset":0,"searchText":""}` and paginate by `offset` until results are exhausted
   f. For each job extract and normalize: `{title, url, company}`
   g. Accumulate in candidate list (dedup with Level 1)

6. **Level 3 — WebSearch queries** (parallel where possible):
   For each query in `search_queries` with `enabled: true` (general portal/role queries — not dedicated queries for companies with an active local parser):
   a. Run WebSearch with the defined `query`
   b. From each result extract: `{title, url, company}`
      - **title**: from the result title (before " @ " or " | ")
      - **url**: result URL
      - **company**: after " @ " in the title, or extract from domain/path
   c. **Skip** the result if `company` (normalized) matches any name in `local_parser_ok`
   d. Accumulate the rest in candidate list (dedup with Levels 0+1+2)

6. **Filter by title** using `title_filter` from `portals.yml`:
   - At least 1 keyword from `positive` must appear in the title (case-insensitive)
   - 0 keywords from `negative` may appear
   - `seniority_boost` keywords give priority but are not required

6b. **Filter by location (optional)** using `location_filter` from `portals.yml`:
   - If the `location_filter` block is absent, all locations pass (default behavior)
   - Empty location on a job → passes (do not penalize missing data)
   - Any keyword from `block` present → reject (takes precedence over allow)
   - Empty `allow` → passes (already cleared block)
   - Non-empty `allow` → at least one keyword must match
   - All matches are case-insensitive substring
   - Location is persisted as the 7th column in `scan-history.tsv` for later auditing

7. **Deduplicate** against 3 sources:
   - `scan-history.tsv` → exact URL already seen
   - `applications.md` → company + normalized role already evaluated
   - `pipeline.md` → exact URL already in pending or processed

7.5. **Verify liveness of WebSearch results (Level 3)** — BEFORE adding to pipeline:

   WebSearch results may be stale (Google caches results for weeks or months). To avoid evaluating expired offers, verify with Playwright every new URL from Level 3. Levels 1 and 2 are inherently real-time and do not require this check.

   For each new URL from Level 3 (sequential — NEVER Playwright in parallel):
   a. `browser_navigate` to the URL
   b. `browser_snapshot` to read content
   c. Classify:
      - **Active**: job title visible + role description + Apply/Submit control visible within main content. Do not count generic header/navbar/footer text.
      - **Expired** (any of these signals):
        - Final URL contains `?error=true` (Greenhouse redirects this way when the offer is closed)
        - Page contains: "job no longer available" / "no longer open" / "position has been filled" / "this job has expired" / "page not found"
        - Only navbar and footer visible, no JD content (content < ~300 chars)
   d. If expired: record in `scan-history.tsv` with status `skipped_expired` and discard
   e. If active: continue to step 8

   **Do not interrupt the entire scan if one URL fails.** If `browser_navigate` errors (timeout, 403, etc.), mark as `skipped_expired` and continue with the next.

8. **Score and rank new offers**:

   For each new verified offer, compute a preliminary fit score (0.0–5.0) using **title + company + location only** (no JD read). Read `config/profile.yml`, `modes/_profile.md`, and **`data/wlb-scores.yml`** for the user's target roles, preferred locations, async-first companies, and WLB scores.

   **Fit score dimensions:**
   - **Role fit (40%)**: Title matches profile target roles (e.g. Senior/Staff/Principal/Lead + Backend/AI/Platform/Distributed Systems/Observability/Auth/Identity).
     **Primary stack boost (+0.3, cap 5.0):** if the title explicitly mentions any of: `.NET`, `C#`, `dotnet`, `ASP.NET`, `OOP`, `C# .NET` — this is Rikky's primary language and signals a direct stack match that meaningfully raises fit. Apply the boost on top of the base role fit score before computing the weighted total. Note it in the `{one-line why}` with "primary stack match".
   - **Culture/WLB (30%)**: Combines async-first/remote culture signal with WLB score from `data/wlb-scores.yml`:
     - Look up company in `data/wlb-scores.yml` (normalize name: lowercase + hyphens)
     - WLB ≥ 4.0 = full weight for this dimension; 3.5–3.9 = slight reduction; 3.0–3.4 = moderate reduction; < 3.0 = significant reduction
     - If company not in file: estimate from async-first/remote signals (remote-by-design = ~4.0, office-only = ~3.0)
   - **Location/timezone (20%)**: APAC-eligible, open global remote, or preferred relocation target = high; US-only/EST-required = low; EU relocation with support = medium
   - **Stack (10%)**: Title mentions known stack keywords (`.NET`, `C#`, `dotnet`, Auth, Observability, PostgreSQL, Platform, Distributed, AI, LLM, OpenTelemetry, etc.). `.NET`/`C#`/`dotnet` in the title scores this dimension at maximum since it is the primary language.

   **WLB score lookup:**
   - Key format: lowercase company name with hyphens (e.g. "Grafana Labs" → `grafana-labs`, "Trade Republic" → `trade-republic`)
   - If not found, use `3.5` as default and mark as `(est)` in output
   - Always display the WLB score alongside the fit score in the output

   Score tiers (based on fit score):
   - **TIER S (5.0)**: Perfect across all dimensions
   - **TIER A+ (4.5)**: Strong fit, one dimension slightly off
   - **TIER A (4.0)**: Good fit, one dimension notably off
   - **TIER B (3.0–3.5)**: Moderate — one significant misalignment
   - **TIER C (2.0–2.5)**: Low priority — notable issues
   - **SKIP (<2.0 or obvious dealbreaker)**: Management roles, wrong level, consulting firm, hard timezone block, language not in stack

9. **Write to `pipeline.md`** — insert a new dated scan block **above** the existing Pending section:

   ```markdown
   ## Scan {YYYY-MM-DD} — {N} new offers

   ### TIER S — Apply Immediately (5.0/5)
   - [ ] {company} — {title} | {location} | fit:{score} wlb:{wlb} | {url} | {one-line why}

   ### TIER A+ — Strong (4.5/5)
   - [ ] {company} — {title} | {location} | fit:{score} wlb:{wlb} | {url} | {one-line why}

   ### TIER A — Good (4.0/5)
   - [ ] {company} — {title} | {location} | fit:{score} wlb:{wlb} | {url} | {one-line why}

   ### TIER B — Consider (3.0–3.5/5)
   - [ ] {company} — {title} | {location} | fit:{score} wlb:{wlb} | {url} | {one-line why}

   ### TIER C — Low Priority (2.0–2.5/5)
   - [ ] {company} — {title} | {location} | fit:{score} wlb:{wlb} | {url} | {one-line why}

   ### SKIP — Not Recommended
   - {company} — {title} | {location} | {reason}
   ```

   - `{wlb}` = WLB score from `data/wlb-scores.yml` (e.g. `4.4` or `3.5est` if estimated)
   - Omit any tier section that has zero entries.
   - SKIP entries have no checkbox — they are informational only and never processed by pipeline mode.
   - `{one-line why}` = one short phrase: primary fit reason + any notable caveat (e.g. "Async-first + auth stack" or "Staff level, EU relocation").
   - Within each tier, sort by descending fit score, then descending WLB score as tiebreaker, then alphabetically by company.
   - Record each offer in `scan-history.tsv`: `{url}\t{date}\t{query_name}\t{title}\t{company}\tadded`

10. **Offers filtered by title**: record in `scan-history.tsv` with status `skipped_title`
11. **Duplicate offers**: record with status `skipped_dup`
12. **Expired offers (Level 3)**: record with status `skipped_expired`

## Title and company extraction from WebSearch results

WebSearch results come in format: `"Job Title @ Company"` or `"Job Title | Company"` or `"Job Title — Company"`.

Extraction patterns by portal:
- **Ashby**: `"Senior AI PM (Remote) @ EverAI"` → title: `Senior AI PM`, company: `EverAI`
- **Greenhouse**: `"AI Engineer at Anthropic"` → title: `AI Engineer`, company: `Anthropic`
- **Lever**: `"Product Manager - AI @ Temporal"` → title: `Product Manager - AI`, company: `Temporal`

Generic regex: `(.+?)(?:\s*[@|—–-]\s*|\s+at\s+)(.+?)$`

## Private URLs

If a non-publicly accessible URL is found:
1. Save the JD to `jds/{company}-{role-slug}.md`
2. Add to pipeline.md as: `- [ ] local:jds/{company}-{role-slug}.md | {company} | {title}`

## Scan History

`data/scan-history.tsv` tracks ALL seen URLs:

```
url	first_seen	portal	title	company	status
https://...	2026-02-10	Ashby — AI PM	PM AI	Acme	added
https://...	2026-02-10	Greenhouse — SA	Junior Dev	BigCo	skipped_title
https://...	2026-02-10	Ashby — AI PM	SA AI	OldCo	skipped_dup
https://...	2026-02-10	WebSearch — AI PM	PM AI	ClosedCo	skipped_expired
```

## Output summary

```
Portal Scan — {YYYY-MM-DD}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Queries run: N
Offers found: N total
Filtered by title: N relevant
Duplicates: N (already evaluated or in pipeline)
Expired discarded: N (dead links, Level 3)
New added to pipeline.md: N

  + {company} | {title} | {query_name}
  ...

→ Run /career-ops pipeline to evaluate the new offers.
```

## careers_url management

Each company in `tracked_companies` must have `careers_url` — the direct URL to its job listings page. This avoids looking it up every time.

**RULE: Always use the company's corporate URL; fall back to the ATS endpoint only if no corporate careers page exists.**

`careers_url` should point to the company's own job page whenever available. Many companies use Workday, Greenhouse, or Lever under the hood but expose job IDs only through their corporate domain. Using the direct ATS URL when a corporate page exists can cause false 410 errors because job IDs don't match.

| ✅ Correct (corporate) | ❌ Incorrect as first choice (direct ATS) |
|---|---|
| `https://careers.mastercard.com` | `https://mastercard.wd1.myworkdayjobs.com` |
| `https://openai.com/careers` | `https://job-boards.greenhouse.io/openai` |
| `https://stripe.com/jobs` | `https://jobs.lever.co/stripe` |

Fallback: if you only have the direct ATS URL, navigate to the company's website first and find its corporate careers page. Use the direct ATS URL only if the company has no corporate careers page.

**Known patterns by platform:**
- **Ashby:** `https://jobs.ashbyhq.com/{slug}`
- **Greenhouse:** `https://job-boards.greenhouse.io/{slug}` or `https://job-boards.eu.greenhouse.io/{slug}`
- **Lever:** `https://jobs.lever.co/{slug}`
- **BambooHR:** list `https://{company}.bamboohr.com/careers/list`; detail `https://{company}.bamboohr.com/careers/{id}/detail`
- **Teamtailor:** `https://{company}.teamtailor.com/jobs`
- **Workday:** `https://{company}.{shard}.myworkdayjobs.com/{site}`
- **Custom:** The company's own URL (e.g. `https://openai.com/careers`)

**API/feed patterns by platform:**
- **Ashby API:** `https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams`
- **BambooHR API:** list `https://{company}.bamboohr.com/careers/list`; detail `https://{company}.bamboohr.com/careers/{id}/detail` (`result.jobOpening`)
- **Lever API:** `https://api.lever.co/v0/postings/{company}?mode=json`
- **Teamtailor RSS:** `https://{company}.teamtailor.com/jobs.rss`
- **Workday API:** `https://{company}.{shard}.myworkdayjobs.com/wday/cxs/{company}/{site}/jobs`

**If `careers_url` is missing** for a company:
1. Try the pattern for its known platform
2. If that fails, run a quick WebSearch: `"{company}" careers jobs`
3. Navigate with Playwright to confirm it works
4. **Save the found URL in portals.yml** for future scans

**If `careers_url` returns 404 or redirect:**
1. Note in the output summary
2. Try scan_query as fallback
3. Flag for manual update

## portals.yml maintenance

- **ALWAYS save `careers_url`** when adding a new company
- Add new queries as new portals or interesting roles are discovered
- Disable queries with `enabled: false` if they generate too much noise
- Adjust filter keywords as target roles evolve
- Add companies to `tracked_companies` when you want to track them closely
- Periodically verify `careers_url` — companies change ATS platforms
