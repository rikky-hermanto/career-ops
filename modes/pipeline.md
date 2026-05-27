# Mode: pipeline — URL Inbox (Second Brain)

Process job URLs stored in `data/pipeline.md`. The user adds URLs at any time and then executes `/career-ops pipeline` to process them all.

## Workflow

1. **Read** `data/pipeline.md` → collect ALL `- [ ]` items from the entire file (every scan block, legacy "Pending" section, bare lists). **Do not process top-to-bottom.**

   **Tier detection:** for each `- [ ]` line, scan upward to find the nearest `### TIER` heading. That heading determines the line's tier. Lines with no `### TIER` heading above them (legacy flat entries) are untiered.

   **Sort the full queue before processing** — tier priority order:
   1. TIER S (5.0) — `### TIER S`
   2. TIER A+ (4.5) — `### TIER A+`
   3. TIER A (4.0) — `### TIER A`
   4. TIER B (3.0–3.5) — `### TIER B`
   5. TIER C (2.0–2.5) — `### TIER C`
   6. Untiered / legacy flat entries

   Within the same tier, preserve file order (scan.mjs already wrote them sorted by fit score → WLB score at write time). The result is a single ordered work queue — highest-rated items always evaluated first, regardless of which scan block they came from.
2. **For each pending URL**:
   a. Calculate the next sequential `REPORT_NUM` (read `reports/`, take the highest number + 1)
   b. **Extract JD** using Playwright (browser_navigate + browser_snapshot) → WebFetch → WebSearch
   c. If the URL is not accessible → mark as `- [!]` with a note and continue
   d. **Execute full auto-pipeline**: Evaluation A-F → Report .md → PDF (if score >= 3.0) → Tracker
   e. **Mark as processed in-place** — replace `- [ ]` with `- [x]` and append result data:
      `- [x] #NNN | {url} | {company} | {role} | {score}/5 | PDF ✅/❌`
      Keep the entry in its tier section (do not move to a separate Processed block).
3. **If there are 3+ pending URLs**, launch agents in parallel (Agent tool with `run_in_background`) to maximize speed.
4. **At the end**, show summary table:

```
| # | Company | Role | Score | PDF | Recommended action |
```

## Format of pipeline.md

New scans write tiered sections (pipeline mode reads `- [ ]` from all of them):

```markdown
## Scan 2026-05-26 — 12 new offers

### TIER S — Apply Immediately (5.0/5)
- [ ] Grafana Labs — Staff Backend Engineer | Remote (CA/US) | fit:5.0 wlb:4.4 | https://... | Async-first + observability stack
- [x] #155 | https://... | Grafana Labs | Staff Backend Engineer | 4.8/5 | PDF ✅

### TIER A+ — Strong (4.5/5)
- [ ] GitLab — Senior Backend Engineer (AI) | APAC | fit:4.5 wlb:4.2 | https://... | Auth expertise + async-first
- [!] https://... — Error: page not accessible

### TIER B — Consider (3.0–3.5/5)
- [ ] Vercel — Solutions Architect | AU | fit:3.5 wlb:3.6 | https://... | APAC + strong company, SA archetype

### SKIP — Not Recommended
- GitLab — Engineering Manager | Remote | Management role

## Pending
- [ ] https://jobs.example.com/posting/123
- [ ] https://boards.greenhouse.io/company/jobs/456 | Company Inc | Senior PM
```

Legacy flat entries (pre-tiered format) in the Pending section are also processed, after all tiered items.

## Intelligent JD detection from URL

1. **Playwright (preferred):** `browser_navigate` + `browser_snapshot`. Works with all SPAs.
2. **WebFetch (fallback):** For static pages or when Playwright is unavailable.
3. **WebSearch (last resort):** Search in secondary portals that index the JD.

**Special cases:**
- **LinkedIn**: May require login → mark `[!]` and ask the user to paste the text
- **PDF**: If the URL points to a PDF, read it directly with the Read tool
- **`local:` prefix**: Read the local file. Example: `local:jds/linkedin-pm-ai.md` → read `jds/linkedin-pm-ai.md`

## Automatic numbering

1. List all files in `reports/`
2. Extract the number from the prefix (e.g., `142-medispend...` → 142)
3. New number = maximum found + 1

## Source synchronization

Before processing any URL, verify sync:
```bash
node cv-sync-check.mjs
```
If there is a desynchronization, warn the user before continuing.
