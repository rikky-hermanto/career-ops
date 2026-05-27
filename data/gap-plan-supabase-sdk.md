# Gap Closure Plan — Supabase SDK Engineer (C#)

**Role:** SDK Engineer (C#) — Supabase  
**JD URL:** https://jobs.ashbyhq.com/supabase/6a0e111d-6246-43b8-80c3-037303ff9fb2  
**Current score:** 3.9/5 — borderline. Target after gap closure: 4.5+  
**Plan created:** 2026-04-07  
**Target apply date:** 2026-05-05 (4 weeks)

---

## Assumptions

- Full-time job at Quartex: evenings + weekends available only
- ~10–15 hrs/week realistically available for side work
- Gaps are sequenced by dependency: GitHub profile must exist before publishing anything
- Unity is optional — do it only if the other gaps are closed and time permits

---

## Gap 1 — Public GitHub Profile

**Why it matters:** For an SDK role, GitHub *is* the portfolio. A missing or empty GitHub
profile is a silent disqualifier. Every other gap below depends on this being done first.

**Definition of done:**
- [ ] GitHub profile exists and is public
- [x] Profile photo, bio, and location filled in
- [] Personal Finance App repo pinned (even if private → make public)
- [x] Profile README.md written (1 short paragraph, link to LinkedIn)
- [] GitHub URL added to `config/profile.yml` and CV

**Tasks:**
1. Create/clean up GitHub account — use `rhermanto` or similar to match LinkedIn handle
2. Make Personal Finance App repo public (check for secrets first — rotate any env vars)
3. Write `README.md` for Personal Finance App: what it does, stack, how to run
4. Write profile-level `README.md` (GitHub special repo: `github.com/username/username`)
5. Add GitHub URL to `config/profile.yml` under `candidate.github`
6. Re-generate Supabase CV PDF once GitHub URL is ready

**Timeline:** Weekend 1, Day 1 — 2–3 hours  
**Effort:** Low  
**Blocker for:** Everything below

---

## Gap 2 — Open-Source the Geekseat Core Framework

**Why it matters:** This is the single highest-leverage move. The Framework is the closest
thing you have to a public SDK. Published on NuGet with a README, it turns the "no public SDK"
soft blocker into a direct proof point.

**Definition of done:**
- [ ] A public GitHub repo exists with the Framework code (or a representative subset)
- [ ] `README.md` explains the problem it solves, how to install, and a usage quickstart
- [ ] Published to NuGet.org under your account (even v0.1.0 is fine)
- [ ] GitHub Actions workflow publishes to NuGet on tag push
- [ ] XML doc comments on all public API surface (at minimum the top 10 most-used types)

**Tasks:**
1. Extract the shareable core from Geekseat projects — remove any client-specific or proprietary code
2. Create a new GitHub repo: `geekseat-framework` or `dotnet-foundation` (pick something clean)
3. Strip to a minimal but real subset: base controllers, result types, common middleware, validation helpers — whatever is genuinely reusable
4. Write `README.md`:
   - "The problem: every new project started by copy-pasting the same 2000 lines of boilerplate"
   - "The solution: a shared .NET library that every project installs as a NuGet package"
   - Quickstart: `dotnet add package GeekseatFramework`, then 3 lines of usage
5. Add XML doc comments (`/// <summary>`) to all public classes and methods
6. Create `CHANGELOG.md` — start at v0.1.0 with an initial release entry
7. Set up GitHub Actions: on `v*` tag → `dotnet pack` → `dotnet nuget push`
8. Publish v0.1.0 to NuGet.org
9. Tweet/post about it on LinkedIn: "Open-sourced the internal .NET framework I've been using for 10 years..."

**Timeline:** Weekend 1 (Day 2) + Weekend 2 (Day 1) — ~8–10 hours total  
**Effort:** Medium  
**Dependency:** Gap 1 must be done first (need GitHub account)

---

## Gap 3 — OSS Contributions (1–2 Merged PRs)

**Why it matters:** Publishing your own package shows you can build; contributing to
someone else's shows you know how open-source collaboration works — reviews, CI, maintainer
expectations. Supabase will care about this since the SDK role involves managing external
contributors.

**Definition of done:**
- [ ] At least 1 merged PR on a public .NET OSS repo that isn't yours
- [ ] Ideally 1 contribution to `supabase-csharp` specifically (even a doc fix)

**Tasks:**
1. Browse `supabase-csharp` on GitHub — look for:
   - Issues labeled `good first issue` or `help wanted`
   - Missing XML doc comments on public API
   - Outdated README sections or broken quickstart steps
   - A small bug or missing feature you can reproduce
2. File a PR — could be as small as:
   - Adding `/// <summary>` doc comments to 5 public methods
   - Fixing a typo in the README
   - Adding a missing usage example
3. If `supabase-csharp` has nothing obvious, look at: `Marten`, `MassTransit`, `FluentValidation`, `Refit`
4. Leave a comment on any open issues you understand — even "I can reproduce this on .NET 8" counts as community engagement

**Timeline:** Weekday evenings in Week 2 — 2–4 hours  
**Effort:** Low  
**Dependency:** None (can do in parallel with Gap 2)

---

## Gap 4 — SDK Documentation Writing

**Why it matters:** The JD explicitly calls out documentation as a core responsibility.
Supabase's bar for docs is high — the Framework README alone won't prove this. Writing
a proper quickstart guide demonstrates you understand what "good SDK docs" look like.

**Definition of done:**
- [ ] Geekseat Framework has a `docs/` folder with at minimum:
  - `quickstart.md` — install → configure → first API call in under 10 steps
  - `api-reference.md` — generated from XML docs or hand-written for the top 5 types
  - `CHANGELOG.md` — v0.1.0 entry with what's included
- [ ] README links to these docs

**Tasks:**
1. After the Framework is published (Gap 2), write `docs/quickstart.md`:
   - Assume zero prior knowledge of the Framework
   - Steps: install NuGet → configure in Program.cs → make first call → handle errors
   - Include a copy-pasteable working code example
2. Write `docs/api-reference.md` — list the 5 most important public types, their methods, and a 1-line description each
3. Add a "Documentation" section to the README linking to both

**Timeline:** Weekend 2, Day 2 — 3–4 hours  
**Effort:** Low-Medium  
**Dependency:** Gap 2 must be done first

---

## Gap 5 — Unity Awareness (Optional)

**Why it matters:** Unity is listed in the JD as a secondary target platform for the C# SDK.
You don't need to be a game developer. You need to understand *why* Unity C# is different from
ASP.NET Core C# — specifically: IL2CPP compilation, no `async`/`await` by default in some
Unity contexts, and .NET Standard 2.1 compatibility constraints.

**Definition of done:**
- [ ] Can explain in an interview: "Here's why Unity SDK design differs from ASP.NET SDK design"
- [ ] Optionally: a tiny Unity project on GitHub (even a cube that changes color on a button press)

**Tasks:**
1. Read: Unity's documentation on .NET compatibility and IL2CPP
2. Read: the existing `supabase-csharp` Unity integration notes (if any exist in the repo)
3. Spend 2–3 hours in Unity Editor — install, create a new project, write a C# MonoBehaviour script
4. Understand the key constraints:
   - `async`/`await` alternatives in Unity (Coroutines, UniTask)
   - Types that don't exist in .NET Standard 2.1 vs .NET 8
   - How NuGet packages are consumed in Unity (Unity Package Manager vs manual DLL)
5. Optional: push a tiny Unity project to GitHub

**Timeline:** Weekend 3 — 4–6 hours  
**Effort:** Medium (learning curve is real but shallow for this goal)  
**Dependency:** None — can be done any time, but do Gaps 1–4 first

---

## Timeline Overview

```
Week 1 (Apr 7–13)
├── Day 1 (weekend): Gap 1 — GitHub profile + pin Personal Finance App       [2–3 hrs]
└── Day 2 (weekend): Gap 2 start — extract Framework, create repo             [4–5 hrs]

Week 2 (Apr 14–20)
├── Evenings:         Gap 3 — find + submit OSS PR to supabase-csharp         [2–4 hrs]
└── Weekend:          Gap 2 finish — NuGet publish + GitHub Actions pipeline   [4–5 hrs]

Week 3 (Apr 21–27)
├── Day 1 (weekend): Gap 4 — write quickstart + api-reference docs            [3–4 hrs]
├── Evenings:         Gap 3 follow-up — respond to PR review if needed        [1 hr]
└── Day 2 (weekend): Gap 5 (optional) — Unity basics + read IL2CPP docs       [4–6 hrs]

Week 4 (Apr 28 – May 4)
├── Regenerate CV PDF (now with GitHub URL + NuGet link added)
├── Update LinkedIn: pin Framework repo in Featured, update Skills
└── Apply to Supabase — target date: 2026-05-05
```

---

## Minimum Viable Apply (if time is short)

If you can only do one thing before applying: **open-source the Geekseat Framework** (Gap 2).

That single move:
- Proves you can design a library for other developers
- Gives you a GitHub presence
- Turns the "no public SDK" blocker into a direct proof point
- Gives you something concrete to reference in the cover letter

Apply with just that, and address the other gaps honestly in the cover letter:
> "I'm currently contributing to supabase-csharp to understand the ecosystem better before owning it."

---

## Checklist Before Applying

- [ ] GitHub profile is public and linked from CV + LinkedIn
- [ ] Geekseat Framework is on GitHub with a README
- [ ] Framework is published on NuGet (any version)
- [ ] At least 1 OSS PR filed (merged is ideal, pending is acceptable)
- [ ] CV PDF regenerated with GitHub URL in header
- [ ] LinkedIn updated: pin Framework, update Skills, add GitHub to contact
- [ ] Cover letter written — lead with the Framework story
