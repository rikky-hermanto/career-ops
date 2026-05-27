# Career-Ops Workflow Guide

> This is the operational manual — the README covers what career-ops is, this covers how to actually use it day to day.

---

## Table of Contents

1. [Commands Quick Reference](#commands-quick-reference)
2. [The Application Status Lifecycle](#the-application-status-lifecycle)
3. [Scoring System — What the Numbers Mean](#scoring-system--what-the-numbers-mean)
4. [Evaluation Blocks — What A–G Covers](#evaluation-blocks--what-ag-covers)
5. [The Pipeline Inbox (pipeline.md)](#the-pipeline-inbox-pipelinemd)
6. [File Map — What Lives Where](#file-map--what-lives-where)
7. [Workflow Patterns](#workflow-patterns)
8. [Daily Usage Patterns](#daily-usage-patterns)
9. [Maintenance Commands](#maintenance-commands)

---

## Commands Quick Reference

| Command | What it does |
|---|---|
| `/career-ops` | Show command menu |
| `/career-ops offer` | Evaluate a single job offer (A–G scoring blocks) |
| `/career-ops offers` | Compare & rank multiple offers side by side |
| `/career-ops pipeline` | Process pending URLs from [`data/pipeline.md`](../data/pipeline.md) inbox |
| `/career-ops scan` | Scan portals for new jobs (zero LLM cost — hits APIs directly) |
| `/career-ops batch` | Batch-process many offers in parallel workers |
| `/career-ops apply` | Live application assistant — fills forms, drafts answers, stops before Submit |
| `/career-ops pdf` | Generate an ATS-optimized tailored CV as PDF |
| `/career-ops tracker` | Show application status overview from [`data/applications.md`](../data/applications.md) |
| `/career-ops contact` | LinkedIn outreach — find contacts + draft messages |
| `/career-ops deep` | Deep company research |
| `/career-ops training` | Evaluate a course or certification against your goals |
| `/career-ops project` | Evaluate a portfolio project idea |
| `/career-ops patterns` | Analyze rejection patterns and improve targeting |
| `/career-ops followup` | Follow-up cadence tracker — when to nudge, who to contact |

Or just **paste a job URL** — the system auto-detects it and runs the full pipeline.

---

## The Application Status Lifecycle

Every entry in [`data/applications.md`](../data/applications.md) has one of these canonical statuses:

| Status | Meaning |
|--------|---------|
| `Evaluated` | Report is done, score is in. **Waiting on your decision** — you haven't applied yet. |
| `Applied` | Application has been sent. |
| `Responded` | Company responded (any direction — recruiter screen, rejection, next steps). |
| `Interview` | Actively in an interview process. |
| `Offer` | Offer received. |
| `Rejected` | Company passed on you. |
| `Discarded` | You chose to drop it, or the posting closed. |
| `SKIP` | Set during evaluation — doesn't fit, don't apply. Never progresses forward. |

**The flow:**

```
Evaluated ──────────────► Applied ──► Responded ──► Interview ──► Offer
     │                                                        │
     │                                                        └──► Rejected
     │
     └──► Discarded   (you decide not to pursue)

SKIP  (set at eval time — shortcut past Evaluated, never enters the active funnel)
```

**Key point:** `Evaluated` is a holding state. The AI has done its job; now you decide. To move it forward, say `"apply to [company]"` or `"discard [company]"` — the AI will update the status accordingly.

**Status rules (enforced by the pipeline):**
- No markdown bold (`**`) in the status field
- No dates in the status field — dates go in the date column
- No extra text — notes go in the notes column
- Status must be exactly one of the 8 canonical values above

To check and normalize statuses: [`normalize-statuses.mjs`](../normalize-statuses.mjs)

---

## Scoring System — What the Numbers Mean

Every evaluated offer gets a **global score from 1.0 to 5.0**, computed across 5 dimensions:

| Dimension | What it measures |
|-----------|-----------------|
| **CV Match** | How well your skills, experience, and proof points map to the JD requirements |
| **North Star Alignment** | How well the role fits your target archetypes (from [`modes/_profile.md`](../modes/_profile.md)) |
| **Comp** | Salary vs. market (5 = top quartile, 1 = well below market) |
| **Cultural Signals** | Company culture, remote policy, WLB, stability, growth |
| **Red Flags** | Negative adjustments for blockers, deal-breakers, or concerning signals |

**What the score means in practice:**

| Score | Meaning | Recommended action |
|-------|---------|-------------------|
| **4.5–5.0** | Strong match | Apply immediately. Draft application answers auto-generated. |
| **4.0–4.4** | Good match | Worth applying. Invest the time. |
| **3.5–3.9** | Decent but not ideal | Apply only if you have a specific reason to. |
| **3.0–3.4** | Weak fit | Probably pass. Not worth the time unless something unusual applies. |
| **Below 3.0** | Poor fit | Recommend against. Only proceed if you want the practice. |

**Scoring adjustments that happen automatically:**

- **WLB score** (from [`data/wlb-scores.yml`](../data/wlb-scores.yml)): ≥4.0 adds +0.15 to cultural signals; 3.0–3.4 subtracts −0.10; below 2.5 subtracts −0.40
- **Async-first culture bonus**: Known async-first developer tooling companies (Grafana, Supabase, GitLab archetype) get +0.2
- **Location penalty**: Hybrid outside Indonesia scores 2.5–3.0 on the remote dimension; US relocation scores 1.0 (deal-breaker)

**Note:** Block G (Posting Legitimacy) does **not** affect the 1–5 score. It's a separate qualitative signal: `High Confidence`, `Proceed with Caution`, or `Suspicious`.

---

## Evaluation Blocks — What A–G Covers

When you evaluate a role, you get 7 blocks in the report:

### Block A — Role Summary
One-page snapshot: archetype, domain, seniority, remote policy, team size, TL;DR. Sets context before the detailed analysis.

### Block B — Match with CV
Every JD requirement mapped to exact lines in your CV. Shows gaps with mitigations — whether each gap is a hard blocker, adjacent experience exists, or a portfolio project covers it.

### Block C — Level and Strategy
- What level the JD signals vs. your natural level for that archetype
- "Sell senior without lying" plan — specific phrases, which achievements to highlight
- "If they downlevel me" plan — when to accept, what to negotiate

### Block D — Comp and Demand
Real salary data from Glassdoor, Levels.fyi, and Blind for the role and location. Company's compensation reputation. WLB score lookup and adjustment. Demand trend for the role type.

### Block E — Customization Plan
Top 5 changes to your CV + top 5 changes to LinkedIn to maximize match for this specific role. Written as a table: what to change, how to change it, and why.

### Block F — Interview Plan
6–10 STAR+R stories mapped to JD requirements. Each story has a Reflection column — what was learned, what would be done differently. Stories also get added to [`interview-prep/story-bank.md`](../interview-prep/story-bank.md) so they accumulate across evaluations.

Also includes:
- Recommended case study to present
- Red-flag questions (e.g. "why did you leave?") with recommended framing

### Block G — Posting Legitimacy
Signals that tell you whether this is a real, active opening or a ghost job:
- Posting age (under 30 days = good; 60+ days = concerning)
- Apply button state
- Description specificity (named tools vs. boilerplate)
- Company layoff / hiring freeze news
- Reposting pattern from scan history

---

## The Pipeline Inbox (pipeline.md)

[`data/pipeline.md`](../data/pipeline.md) is your inbox — URLs waiting to be evaluated.

**Format of each item:**
```
- [ ] {url} | {company} — {role} | {location} | {optional pre-score}
```

**After evaluation, it becomes:**
```
- [x] {url} | {company} — {role} | {score} — {one-line verdict} → [NNN](reports/NNN-slug-date.md)
```

**Structure of the file:**
- **TIER A+** (fit ≥ 4.5) — highest priority, evaluate first
- **TIER A** (fit 4.0–4.4) — good, worth evaluating
- **TIER B** (fit 3.0–3.5) — consider if time allows
- **TIER C** (fit 2.0–2.5) — low priority
- **SKIP** — not recommended, reason noted
- **Pending** — miscellaneous items without a tier yet
- **Processed** — evaluated items grouped by session date

The pre-scan scores (e.g. `fit:4.4 wlb:3.2`) come from the zero-LLM scanner — keyword matching only. **The full A–G evaluation often scores differently** because it factors in WLB, location policy, culture, and gaps. Expect the final score to be 0.3–0.7 lower than the pre-scan for roles with location or culture concerns.

### What `/career-ops pipeline` actually does

When you run `/career-ops pipeline`, it works through each unchecked item in [`pipeline.md`](../data/pipeline.md) one by one and runs the full evaluation pipeline on each:

1. **Fetches the job posting** — navigates to the URL with Playwright to verify it's still active
2. **Evaluates the offer** — scores it A–G across role fit, comp, tech stack, company quality, location, and legitimacy
3. **Generates a report** — saves it to [`reports/`](../reports/) in the standard format
4. **Creates a tailored CV PDF** — generates an ATS-optimized version targeting that specific role
5. **Updates the tracker** — adds the entry to [`data/applications.md`](../data/applications.md) with score and status

If you have a large inbox (say, 200+ URLs from a big scan), running pipeline on all of them sequentially would take a while. The typical approaches:

- **Run it selectively** — pick the most promising companies (`"evaluate just the Airwallex and Anthropic ones"`)
- **Run `/career-ops batch`** — spawns parallel workers to process many URLs simultaneously, much faster than one-by-one
- **Run pipeline on a subset** — `"evaluate the top 10 by company quality"`

Or skip the inbox entirely — just paste a job URL or description directly into the chat and career-ops auto-detects it and runs the full pipeline.

---

## File Map — What Lives Where

### Your data (never auto-updated — safe to edit)

| File | What it is |
|------|-----------|
| [`cv.md`](../cv.md) | Your canonical CV in markdown. Source of truth for all evaluations and PDFs. |
| [`config/profile.yml`](../config/profile.yml) | Your identity, comp targets, location policy, archetypes, deal-breakers. |
| [`modes/_profile.md`](../modes/_profile.md) | Your narrative, framing per archetype, negotiation scripts, culture preferences, WLB policy. |
| [`article-digest.md`](../article-digest.md) | Compact proof points from your portfolio. Takes precedence over cv.md for metrics. |
| [`portals.yml`](../portals.yml) | Companies and queries for the scanner. |
| [`data/applications.md`](../data/applications.md) | Application tracker — the single source of truth for all evaluated offers. |
| [`data/pipeline.md`](../data/pipeline.md) | Pending URL inbox, tiered by fit score. |
| [`data/wlb-scores.yml`](../data/wlb-scores.yml) | WLB score database. Auto-extended when new companies are evaluated. |
| [`data/follow-ups.md`](../data/follow-ups.md) | Follow-up history tracker. |
| [`data/scan-history.tsv`](../data/scan-history.tsv) | Dedup history for the scanner — prevents re-adding known offers. |
| [`interview-prep/story-bank.md`](../interview-prep/story-bank.md) | Accumulating STAR+R stories from all evaluations. |
| `interview-prep/{company}-{role}.md` | Company-specific interview intel reports. |
| [`reports/`](../reports/) | All evaluation reports (format: `NNN-company-YYYY-MM-DD.md`). |
| [`output/`](../output/) | Generated PDFs. |

### System files (auto-updatable — don't put your data here)

| File | What it is |
|------|-----------|
| [`modes/_shared.md`](../modes/_shared.md) | Shared scoring logic, archetype detection, tool config. Updated by `node update-system.mjs`. |
| [`modes/offer.md`](../modes/offer.md) | A–G evaluation instructions. |
| [`modes/pdf.md`](../modes/pdf.md) | PDF generation pipeline. |
| [`modes/scan.md`](../modes/scan.md) | Portal scanner instructions. |
| [`modes/auto-pipeline.md`](../modes/auto-pipeline.md) | Auto-pipeline (paste URL → full pipeline). |
| [`batch/batch-prompt.md`](../batch/batch-prompt.md) | Self-contained prompt for headless batch workers. |
| [`templates/cv-template.html`](../templates/cv-template.html) | ATS CV HTML template (Space Grotesk + DM Sans). |
| [`templates/states.yml`](../templates/states.yml) | Canonical application statuses (source of truth). |
| [`templates/portals.example.yml`](../templates/portals.example.yml) | Starter portals config — copy to `portals.yml`. |

---

## Workflow Patterns

### Workflow A — Bulk Discovery (most common starting point)

```
scan → pipeline → offer/apply → pdf → followup
```

| Step | Command | What happens |
|---|---|---|
| 1 | `/career-ops scan` | Hits Greenhouse/Ashby/Lever APIs, finds new jobs, deduplicates, adds URLs to [`data/pipeline.md`](../data/pipeline.md) |
| 2 | Review [`pipeline.md`](../data/pipeline.md) | Skim the tiered list — anything obviously wrong (wrong location, wrong archetype) → mark SKIP manually |
| 3 | `/career-ops pipeline` | Processes pending URLs — evaluates each, writes reports, generates PDFs, updates tracker |
| 4 | `/career-ops tracker` | See all evaluated offers sorted by score |
| 5 | `/career-ops offer` | Deep-dive a specific offer for more detail (if pipeline was rushed) |
| 6 | `/career-ops apply` | Fill application for roles you want to pursue |
| 7 | `/career-ops followup` | After applying, schedule follow-ups |

---

### Workflow B — Single URL (quick eval)

Just paste a job URL into the chat. The system auto-detects it and runs the full pipeline:
1. Fetches the JD (Playwright → WebFetch → WebSearch)
2. Evaluates A–G
3. Saves report to [`reports/`](../reports/)
4. Generates tailored PDF
5. Adds to tracker with status `Evaluated`

No command needed — just paste.

---

### Workflow C — Batch Processing (10+ offers at once)

```
scan → batch → patterns → followup
```

| Step | Command | What happens |
|---|---|---|
| 1 | `/career-ops scan` | Populates pipeline inbox |
| 2 | `/career-ops batch` | Spawns parallel `claude -p` workers — much faster than pipeline for 10+ offers |
| 3 | [`node merge-tracker.mjs`](../merge-tracker.mjs) | Merges all the TSV tracker additions from batch workers into [`applications.md`](../data/applications.md) |
| 4 | `/career-ops patterns` | After the batch, find what's hurting your scores to improve targeting |

---

### Workflow D — Company-first (you know where you want to apply)

```
deep → contact → apply → pdf
```

| Step | Command | What happens |
|---|---|---|
| 1 | `/career-ops deep` | Research the company — culture, stack, red flags, talking points, interview style |
| 2 | `/career-ops contact` | Find the right person on LinkedIn + draft outreach before applying |
| 3 | `/career-ops apply` | Fill application with company-specific framing from the deep research |
| 4 | `/career-ops pdf` | Generate CV tailored to that company |

---

## Daily Usage Patterns

### New scan day (every 3–7 days)
```
1. /career-ops scan          → find new offers
2. Skim pipeline.md          → mark obvious SKIPs
3. /career-ops pipeline      → evaluate the rest (or batch if 10+)
4. /career-ops tracker       → review scores, decide what to apply to
```

### Active application day
```
1. /career-ops tracker       → see what's Evaluated and decide
2. /career-ops apply [URL]   → fill the form, draft answers
3. Review everything         → YOU submit, not the AI
4. Update status to Applied  → "mark [company] as applied"
```

### Follow-up day (weekly)
```
1. /career-ops followup      → who needs a nudge this week
2. /career-ops contact       → draft the follow-up message
3. Check Responded entries   → update statuses in tracker
```

### Prep day (before interview)
```
1. /career-ops offer [URL]   → re-read Block F (interview plan)
2. Review story-bank.md      → pick your 3 master stories for this role
3. /career-ops deep [company] → refresh company research
```

---

## Maintenance Commands

Run these when things get messy:

| Command | When to use |
|---|---|
| [`node merge-tracker.mjs`](../merge-tracker.mjs) | After batch processing — merges TSV additions into [`applications.md`](../data/applications.md) |
| [`node verify-pipeline.mjs`](../verify-pipeline.mjs) | Health check — finds missing reports, broken links, format issues |
| [`node normalize-statuses.mjs`](../normalize-statuses.mjs) | Fixes non-canonical statuses (e.g. `**Applied**` → `Applied`) |
| [`node dedup-tracker.mjs`](../dedup-tracker.mjs) | Removes duplicate entries in [`applications.md`](../data/applications.md) |
| [`node cv-sync-check.mjs`](../cv-sync-check.mjs) | Checks that [`cv.md`](../cv.md) and [`config/profile.yml`](../config/profile.yml) are consistent |
| [`node check-liveness.mjs`](../check-liveness.mjs) | Checks if job postings in the tracker are still active |
| [`node analyze-patterns.mjs`](../analyze-patterns.mjs) | JSON output of score patterns, rejection patterns, archetype distribution |
| [`node followup-cadence.mjs`](../followup-cadence.mjs) | JSON output of follow-up schedule for active applications |
| [`node update-system.mjs check`](../update-system.mjs) | Check for career-ops system updates |
| [`node update-system.mjs apply`](../update-system.mjs) | Apply a pending system update |
| [`node update-system.mjs rollback`](../update-system.mjs) | Roll back the last system update |

---

## Report Numbering

Reports are sequentially numbered 3-digit zero-padded: `001`, `002`, ..., `065`.

The number is assigned at evaluation time as `max existing number + 1`. Numbers in `batch/tracker-additions/merged/` count toward the max, even if not yet merged into [`applications.md`](../data/applications.md).

**Never manually renumber a report.** If there's a numbering conflict, the merge script handles it.

Format: [`reports/`](../reports/)`{NNN}-{company-slug}-{YYYY-MM-DD}.md`

---

## The WLB Score Database

[`data/wlb-scores.yml`](../data/wlb-scores.yml) caches Work/Life Balance scores so they don't need to be re-searched every evaluation.

- Scale: 1.0–5.0
- Primary source: Glassdoor WLB sub-rating
- Bonuses: +0.3 remote-by-design, +0.2 GPTW certified, +0.1 Forbes/Built In
- Penalties: −0.2 fintech/crypto, −0.1 hypergrowth startup (<500 employees)

When a company isn't in the database, the evaluator runs a quick WebSearch for the Glassdoor WLB sub-rating and **automatically adds it to the file** so future evaluations are instant.

**WLB → scoring impact:**

| WLB Score | Effect on Block D | Label |
|-----------|------------------|-------|
| ≥ 4.0 | +0.15 | Positive signal |
| 3.5–3.9 | 0 | Neutral, mentioned |
| 3.0–3.4 | −0.10 | "Below average for this sector" |
| 2.5–2.9 | −0.25 | "Known WLB concerns — confirm before applying" |
| < 2.5 | −0.40 | Red flag — investigate first |

---

> **Tip:** Most users start with Workflow A (`scan` → `pipeline`), then drop into Workflow D for the top 2–3 results worth pursuing seriously. The story bank ([`interview-prep/story-bank.md`](../interview-prep/story-bank.md)) gets more valuable over time — after 20+ evaluations you'll have 10–15 deep STAR+R stories that cover almost any interview question.
