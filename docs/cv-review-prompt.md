# Master CV Review — Prompt for a fresh session

Paste everything below the line into a new chat opened in `c:\workspaces\career-ops`.

---

# Master CV Review — ATS + Big-Tech Hiring Bar

## Context

Repo: `c:\workspaces\career-ops` (career-ops job-search system). Read `AGENTS.md` first — it defines the Data Contract and the Source-of-Truth Boundary you must obey.

Subject: my master CV at `cv.md`. Active targeting preset is `dotnet` (see `presets/_active` and `config/profile.yml`): Senior C#/.NET SaaS developer, remote from Indonesia, targeting AU/NZ/SEA employers. Reference archetype JD: `jds/citation-group-senior-saas-developer.md`.

## Task

Run a complete, adversarial review of `cv.md` against two independent bars:

1. **ATS machine-parseability**
2. **The human hiring bar at large software companies (2026 standard)**

**Do NOT edit any file.** Produce a findings report and wait for my approval.

## Read before reviewing

- `cv.md` — the subject
- `AGENTS.md` — rules, especially the Source-of-Truth Boundary
- `config/profile.yml` — targeting, archetypes, `minimum_bar`, deal-breakers
- `modes/_profile.md`, `modes/_custom.md` — my house rules
- `jds/citation-group-senior-saas-developer.md` — the archetype JD
- `docs/cv-stack-review.md` — **IN-FLIGHT WORK**: a pending project-stack reorder I have reviewed but not applied. Don't re-litigate it; flag any conflict with your findings.
- `templates/cv-template.html` — what `cv.md` renders through, so it determines the actual artifact an ATS receives

## Hard rules

- **Never invent, upgrade, or extrapolate a claim.** Every statement must trace to `cv.md`, `article-digest.md`, `config/profile.yml`, or `modes/_profile.md`.
- If a bullet would be stronger with a metric I haven't given you, **ask me for it** — do not estimate, infer, or write a placeholder.
- Never claim I authored a tool, library, or framework unless `cv.md` explicitly attributes it to me.
- Flag anything **currently on the CV** you suspect is unsupported or overstated.
- Prioritize findings specific to *this* CV over generic CV advice. If a standard best practice is already satisfied, say so in one line and move on.

## Review dimensions

### A. ATS parse layer

- Section headers: standard recognized names vs creative ones
- Tables, multi-column layouts, text boxes, and header/footer content that ATS parsers drop or scramble. Note two specifics: my **Key Skills is a 16-row table**, and the current PDF export leaves **"N/A" and "1 of 3" artifacts** at the top/bottom of each page. Assess both.
- Contact block placement — must be body text, not a page header
- Date formats: consistency, parseability, gaps
- Icons/graphics carrying information not duplicated in text
- Keyword coverage vs the archetype JD: what would a keyword filter miss?
- Format recommendation for what I actually submit

### B. Content & impact layer

- **Length**: currently 3 pages. Justify it or cut it.
- **Bullet quality**: responsibilities or outcomes? Apply an impact-first standard (action → what → measurable result).
- **Verb tense consistency** — at least one bullet uses "Evaluating" among past-tense peers; find the rest.
- **Quantification**: which bullets have numbers, which need them, which cite numbers without context (e.g. "9K/month to 6K/month" — of what? whose budget?).
- **Summary/About**: length, specificity, survives a 6-second scan?
- **Experience vs Selected Projects redundancy** — several project entries restate their parent job entry.
- **Space allocation**: is the most recent and most relevant work getting proportional room?
- **Seniority signal**: does this read as a 10+ year senior IC/lead?

### C. Targeting layer

- Fit against the `dotnet` preset archetype and `minimum_bar` in `config/profile.yml`
- How the AI-engineering pivot is positioned — asset or dilution for .NET SaaS roles?
- The **Feb 2026 – present employment gap is INTENTIONAL**. Do not invent a filler role. Advise only on whether and how to address it.

## Output format

A findings report, **ranked most-severe first**. Per finding:

- **Severity**: blocker / high / medium / polish
- **Layer**: ATS / content / targeting
- **Location**: `cv.md` line reference
- **What's wrong and why it matters**
- **Concrete proposed fix** — exact replacement text where applicable
- If it needs a fact only I have: **state the question instead of a fix**

Close with:

1. Mechanical fixes you can apply with no input from me
2. Judgment calls needing my decision
3. What is already strong and should not be touched

Then **stop and wait for my approval** before editing anything.
