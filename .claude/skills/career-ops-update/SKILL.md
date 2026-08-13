---
name: career-ops-update
description: >-
  Safe career-ops system update that protects the local targeting presets. Use
  when the user asks to update career-ops, check for a new version, or upgrade
  the system — this replaces a bare `update-system.mjs apply` because it also
  analyses the incoming changes for impact on presets/, preset.mjs and the
  house rules in modes/_custom.md, and reconciles them afterwards.
user_invocable: true
user-invocable: true
license: MIT
---

# career-ops-update — update without losing the presets

The stock `/career-ops update` flow ([modes/update.md](../../../modes/update.md)) updates
the system layer correctly, but it knows nothing about this installation's local
additions. This skill wraps it.

## What is local and why it needs protecting

| Path | Tracked by git? | In the upstream manifest? | Risk on update |
|---|---|---|---|
| `presets/` (4 preset dirs + `_active`) | no — gitignored | no | safe from deletion; **can fall behind the config schema** |
| `preset.mjs`, `preset-doctor.mjs` | no — untracked | no | safe today; **name collision** if upstream ever ships its own |
| `config/profile.yml`, `portals.yml`, `modes/_profile.md` | no — gitignored | preserved by the updater | safe |
| `cv.md`, `data/`, `reports/`, `interview-prep/` | user layer | preserved | safe |
| `modes/_custom.md` | no — gitignored | preserved | safe, but its rules can be **contradicted** by new upstream behaviour |
| the `presets/` + `preset.mjs` rows in `AGENTS.md` | tracked | **yes — system layer** | **overwritten every update** |

Two mechanics worth knowing, both verified in [update-system.mjs](../../../update-system.mjs):
stale-file pruning is scoped to `tests/` and `test-fixtures/` only
([update-system.mjs:1205](../../../update-system.mjs#L1205)), and the backup step uses
`git stash create`, which builds an object without touching the working tree
([update-system.mjs:1045](../../../update-system.mjs#L1045)). Neither deletes untracked
files. So the presets survive an update — what they do *not* do on their own is
stay current with it.

## Phase 0 — Preflight

```bash
node preset.mjs list --json
node preset-doctor.mjs --summary
```

- Record the active preset name. **It must be restored at the end.**
- If `list` reports `unsaved edits` on the active preset, run `node preset.mjs save`
  first and say so — an unsaved targeting edit is the one thing this flow can lose.
- If `preset-doctor` exits non-zero, fix that **before** updating. Updating on top
  of already-drifted presets makes the after-diagnosis ambiguous.

## Phase 1 — Check

```bash
node update-system.mjs check
```

Branch as [modes/update.md](../../../modes/update.md) Step 1 does, with one
difference: `offline` → report and stop. `dismissed` → clear `.update-dismissed`,
re-check. `update-available` → continue.

`up-to-date` does **not** mean nothing changed. The check compares `VERSION`,
and `main` routinely moves ahead of the last released version — verified on
2026-08-13, when `check` reported v1.26.0 on both sides while `HEAD..FETCH_HEAD`
carried 31 new lines in `templates/portals.example.yml`. So on `up-to-date`,
report it, then offer to run Phase 2 read-only against `main`. Never run Phase 3
on `up-to-date`: there is no release to apply.

## Phase 2 — Analyse before applying (the point of this skill)

```bash
git fetch https://github.com/santifer/career-ops.git main
```

If the fetch fails, stop. Do not analyse a stale `FETCH_HEAD`, and do not apply.

Then answer all five questions below. Each has a command; run it and report what
it actually returned, never an assumption.

### Q1 — Does upstream now ship its own preset/profile-switching feature?

```bash
git ls-tree -r --name-only FETCH_HEAD | grep -iE 'preset|profile-switch|profiles?/'
git diff HEAD..FETCH_HEAD -- AGENTS.md DATA_CONTRACT.md | grep -iE 'preset|switch|profile'
```

Baseline recorded 2026-08-13 against `main` at v1.26.0 — treat any result beyond
these two as new:

- the filename grep matches exactly one path, `web/src/app/api/profile/route.ts`,
  a dashboard API route with no relation to targeting
- the content grep matches the phrase "regional preset" in
  [modes/discover.md:108](../../../modes/discover.md#L108), which refers to portal
  query sets, not to a profile-switching system

**If upstream ships a real preset system: STOP and report.** Never auto-migrate.
Present the overlap, what each side does that the other does not, and let the
user decide whether to adopt upstream's, keep this one, or run both. Swapping the
targeting system mid-update is how a configuration gets lost.

### Q2 — Name collision with the local scripts?

```bash
git ls-tree -r --name-only FETCH_HEAD -- preset.mjs preset-doctor.mjs presets/
```

Any output at all is a collision: `git checkout FETCH_HEAD -- <path>` would
overwrite the local file. **Stop before applying.** Rename the local script
(e.g. `targeting-preset.mjs`), update the references in `modes/_custom.md`,
`AGENTS.md` and this skill, then resume.

### Q3 — New or renamed keys in the config schema?

```bash
git diff HEAD..FETCH_HEAD -- config/profile.example.yml templates/portals.example.yml
```

Every added key is a key all four presets lack. Note them — Phase 4 backfills
them. A *renamed* key is worse than an added one: the old name lives on in four
preset snapshots and will keep being restored on every switch. Flag renames
explicitly.

### Q4 — Did the scan filter semantics change?

```bash
git diff HEAD..FETCH_HEAD -- scan.mjs | grep -E '^[-+].*(compileKeyword|buildTitleFilter|title_filter|AND_SEPARATOR|positive|negative)'
```

The `dotnet` / `ai-engineer` / `backend-ai-integration` negative lists are built
on plain substring matching (e.g. `AI Platform` is listed separately from
`AI Engineer` precisely because substrings do not compose). If matching gains
word boundaries, AND-groups, or regex, those lists need revisiting — over-blocking
is silent, and a preset that quietly matches nothing looks identical to a slow
job market.

### Q5 — Does new upstream behaviour contradict the house rules?

```bash
git diff HEAD..FETCH_HEAD -- AGENTS.md modes/_shared.md CLAUDE.md
```

Read `modes/_custom.md` alongside it. The rules most exposed are the preset rule,
the scan-results format, and the source-of-truth boundary. Report contradictions;
do not resolve them silently — `_custom.md` wins by design, but the user should
know when it has started fighting the system defaults.

### Report and gate

Present: version delta, the changelog summary, the five answers, and a one-line
verdict per answer (`no impact` / `needs backfill` / `blocking`). Then **ask for
approval before applying.** Do not apply on a blocking finding.

## Phase 3 — Apply

```bash
node update-system.mjs apply
```

Report the backup branch name it prints — that is the rollback handle
(`node update-system.mjs rollback`).

## Phase 4 — Reconcile

1. **Restore the AGENTS.md rows.** The update overwrites `AGENTS.md`. Re-add the
   two rows under `### Main Files`, after the `portals.yml` row:

   | `presets/` | Targeting presets (user layer) — one directory per preset holding a full snapshot of `config/profile.yml`, `portals.yml` and `modes/_profile.md`. `presets/_active` names the active one. `cv.md` and all history files are deliberately NOT part of a preset |
   | `preset.mjs` | Preset switcher: `list` · `current` · `use <name>` (auto-saves the outgoing preset) · `save [name]` · `new <name> --from <src>` · `diff <a> <b>` · `sync-identity` · `--self-test`. Copies byte-for-byte, never re-serializes YAML |
   | `preset-doctor.mjs` | Preset schema-drift check: missing/unknown keys vs the upstream example files, plus identity drift across presets (JSON or `--summary`) |

   This row loss is expected, not a bug: `AGENTS.md` is system layer. The
   operative rule lives in `modes/_custom.md`, which survives — the rows are
   convenience only, so if the file has been restructured upstream, place them
   where they now fit rather than forcing the old position.

2. **Backfill new keys into every preset.** For each key found in Q3, add it to
   all four `presets/*/profile.yml` (or `portals.yml`), using the upstream
   example's default unless the user says otherwise. Edit the preset files
   directly, then apply the active one:

   ```bash
   node preset.mjs use <active-preset-from-phase-0>
   ```

   Backfill **all** presets, not just the active one. A preset skipped here is a
   trap that springs the next time the user switches to it.

3. **Re-sync identity** if the update changed anything in a non-targeting block:

   ```bash
   node preset.mjs sync-identity
   ```

## Phase 5 — Verify

```bash
node preset.mjs --self-test
node preset-doctor.mjs --self-test
node preset-doctor.mjs --summary
node preset.mjs list
node doctor.mjs --json
node verify-pipeline.mjs
```

Everything must pass, `preset-doctor` must exit 0, and `preset.mjs list` must show
the same active preset as Phase 0. `verify-pipeline` failures that predate the
update (missing report files for old tracker rows) are pre-existing — say so
explicitly rather than attributing them to the update.

Then confirm to the user in one short block: version before → after, what was
reconciled, what was left for them to decide, and the rollback command.

## Refusals

- Never apply on a Q1 or Q2 blocking finding without explicit approval.
- Never hand-edit `config/profile.yml`, `portals.yml` or `modes/_profile.md` to
  fix drift — edit the preset and switch. Hand-edits are lost on the next switch.
- Never create a per-preset `cv.md`. Presets carry targeting; `cv.md` carries facts.
