# Career-Ops Workflow Guide

## Available Commands

| Command | What it does |
|---|---|
| `/career-ops` | Show command menu |
| `/career-ops offer` | Evaluate a single job offer (A–G scoring blocks) |
| `/career-ops offers` | Compare & rank multiple offers side by side |
| `/career-ops pipeline` | Process pending URLs from `data/pipeline.md` inbox |
| `/career-ops scan` | Scan portals for new jobs (zero LLM cost — hits APIs directly) |
| `/career-ops batch` | Batch-process many offers in parallel workers |
| `/career-ops apply` | Live application assistant — fills forms, drafts answers, stops before Submit |
| `/career-ops pdf` | Generate an ATS-optimized tailored CV as PDF |
| `/career-ops tracker` | Show application status overview from `data/applications.md` |
| `/career-ops contact` | LinkedIn outreach — find contacts + draft messages |
| `/career-ops deep` | Deep company research |
| `/career-ops training` | Evaluate a course or certification against your goals |
| `/career-ops project` | Evaluate a portfolio project idea |
| `/career-ops patterns` | Analyze rejection patterns and improve targeting |
| `/career-ops followup` | Follow-up cadence tracker — when to nudge, who to contact |

---

## Workflow A — Bulk Discovery (most common)

```
scan → pipeline → offer/apply → pdf → followup
```

| Step | Command | What happens |
|---|---|---|
| 1 | `/career-ops scan` | Hits Greenhouse/Ashby/Lever APIs, finds new jobs, adds URLs to `data/pipeline.md` |
| 2 | `/career-ops pipeline` | Processes all pending URLs — evaluates each, writes reports, updates tracker |
| 3 | `/career-ops offer` | Deep-dive a specific high-score offer if you want more detail |
| 4 | `/career-ops apply` | Fill out application form for roles you decide to pursue |
| 5 | `/career-ops pdf` | Generate tailored CV for each application |
| 6 | `/career-ops followup` | After applying, tracks when to follow up and with whom |

---

## Workflow B — Single URL (quick eval)

```
paste URL → (auto-pipeline) → apply → pdf
```

Just paste a job URL directly. Auto-runs evaluate + report + tracker entry in one shot. No command needed.

---

## Workflow C — Batch Processing (many URLs at once)

```
scan → batch → patterns → followup
```

| Step | Command | What happens |
|---|---|---|
| 1 | `/career-ops scan` | Populates pipeline inbox |
| 2 | `/career-ops batch` | Spawns parallel workers, evaluates everything at once — faster than pipeline for 10+ offers |
| 3 | `/career-ops patterns` | After several rejections, finds what's hurting your score so you can fix targeting |
| 4 | `/career-ops followup` | Manages cadence across all active applications |

---

## Workflow D — Company-first (you know where you want to apply)

```
deep → contact → apply → pdf
```

| Step | Command | What happens |
|---|---|---|
| 1 | `/career-ops deep` | Research the company — culture, stack, red flags, talking points |
| 2 | `/career-ops contact` | Find the right person on LinkedIn + draft outreach before applying |
| 3 | `/career-ops apply` | Fill application with company-specific framing |
| 4 | `/career-ops pdf` | Generate CV tailored to that company |

---

## Maintenance (run anytime)

```
tracker → patterns → followup
```

| Command | When to use |
|---|---|
| `/career-ops tracker` | Weekly check of where everything stands |
| `/career-ops patterns` | If getting low scores or radio silence — find out why |
| `/career-ops followup` | Who needs a nudge this week |

---

> **Tip:** Most users start with Workflow A (`scan` → `pipeline`), then drop into Workflow D for the top 2–3 results worth pursuing seriously.
