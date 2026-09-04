# CV Stack Review — 7 Project Entries

**Status:** DRAFT — reviewed, not yet applied to `cv.md`. Resume by answering Section D, then edit.

**Context:** Active preset is `dotnet` (Senior .NET/SaaS, remote-from-Indonesia, Citation Group archetype — see `config/profile.yml`). Goal: reorder each project's tech-stack line most-essential-first and cut redundancy (e.g. "Git, Bitbucket" → just the fundamental one), without removing any real capability claim.

---

## A. The ranking signal (and its limits)

Keyword frequency across `reports/` (25 files) + `jds/` (1 file), n=26 docs:

| Band | Terms (doc hits) |
|---|---|
| **Tier 1 — gates the search** | .NET 17 · Python 16 · C# 16 · Azure 15 · AWS 14 · RabbitMQ 12 · REST 12 · multi-tenant 11 |
| **Tier 2 — commonly listed** | event-driven 10 · React 9 · Kubernetes 9 · Auth0 9 · CI/CD 8 · MediatR 7 · Docker 7 · ASP.NET 7 · PostgreSQL 7 |
| **Tier 3 — appears, not decisive** | microservices 6 · Datadog 6 · IaC 6 · TypeScript 5 · MassTransit 5 · GitHub Actions 5 · EF Core 5 · Octopus 4 · GraphQL 4 · Cypress/Playwright 4 |
| **Tier 4 — near-absent** | MSSQL 3 · OAuth 3 · Vue 3 · CQRS 3 · Hangfire 2 · xUnit 2 · Angular 2 · Kendo 1 · DDD 1 · TDD 1 · **Blazor 0 · LaunchDarkly 0 · SendGrid/Twilio/Courier 0 · Oracle 0 · SignalR 0 · Clean Architecture 0** |

**Three caveats weighed before ordering:**

1. **The corpus is contaminated.** Reports contain my own analysis echoing your CV back at itself, not just employer text. `OpenTelemetry 13`, `Grafana 13`, `Supabase 10`, `eval 26` are almost certainly *your* terms reflected back, not employer demand — discounted rather than treated as Tier 1.
2. **The corpus skews AI.** `LLM 16 / RAG 15` reflects roles evaluated under the earlier `ai-engineer` preset. Active preset is `dotnet`. Ordering below treats AI as a high-value differentiator but doesn't let it outrank C#/.NET.
3. **n=26 is small.** Tier 1 vs Tier 2 is reasonably solid; Tier 3 vs Tier 4 is noisier.

Reproduce with:
```bash
for k in "term1" "term2|alt"; do n=$(grep -rilE "$k" reports/ jds/ 2>/dev/null | wc -l); printf "%3d  %s\n" "$n" "$k"; done | sort -rn
```

## B. Redundancy rules applied

| Rule | Example |
|---|---|
| Same-category, keep the fundamental | `Git, GitHub Actions` → `GitHub Actions` (Git assumed at 10+ yrs) |
| Sub-feature under parent | `Docker Compose` → `Docker`; `shadcn/ui` → already covered by `Tailwind CSS` |
| Component library under its framework | `Angular Material`, `Kendo UI` → fold into `Angular` |
| Literal duplicate | Travlr lists **Elastic APM twice**; Geekseat lists **Vue.js twice** |
| Version noise | `Gemini 2.5 Flash` → `Gemini`; `ASP.NET MVC (up to 5.2)` → `ASP.NET MVC` |
| Named sub-implementation of a stated concept | `FlashRank`, `RRF` → already covered by "re-ranking", "hybrid search" |

## C. Proposed lines

### 1. Personal Finance App — 35 items → 20

```
**Tech-stack:** .NET 10 (C# 13), ASP.NET Core Web API, Python FastAPI, PostgreSQL 17 + pgvector (Supabase: Auth, Storage, Realtime, Webhooks), Anthropic Claude + Gemini, RAG (hybrid BM25 + vector search, cross-encoder re-ranking, SSE streaming), OpenAI embeddings, LLM evaluation (RAGAS, golden-set harness), Clean Architecture, CQRS/MediatR, React 18 + TypeScript, Tailwind CSS, OpenTelemetry → Grafana LGTM (Prometheus, Loki, Tempo), Langfuse, Docker, GitHub Actions, xUnit + Moq, pytest, Playwright, smolagents + LiteLLM (agent orchestration).
```
**Cut:** Vite · shadcn/ui · TanStack Query · Recharts · Vitest · FluentValidation · Docker Compose→Docker · Alloy · FlashRank · RRF · "2.5 Flash"

### 2. GPP — 16 → 15, PostgreSQL surfaced

```
**Stack:** ASP.NET Core REST API (C#), AWS (VPC, API Gateway, EC2, RDS, Load Balancer), Auth0 (IAM, MFA, SSO), event-driven architecture with RabbitMQ, PostgreSQL (Marten + Entity Framework), Docker, GitHub Actions CI/CD, Octopus Deploy, Pulumi (IaC), Datadog, Cypress, VueJS, Blazor (admin UI), LaunchDarkly (feature flags), SendGrid (notifications).
```
**Cut:** Twilio (matrix: N/A for Identity) · Courier (third notification vendor — same category as SendGrid) · "Docker Containers"→Docker
**Key change:** `Marten (PostgreSQL) + Entity Framework` restructured so **PostgreSQL** is the head term an ATS matches, not buried in a parenthetical.

### 3. Decipher — Azure was named twice

```
**Tech-stack:** ASP.NET Core REST API (C# 11, .NET 7), Azure (App Service, Functions, EventGrid, Storage — millions of IoT records, Application Insights), MS SQL, Auth0, Hangfire background jobs, Angular + Kendo UI, Google Earth Engine, Power BI.
```
**Cut:** Git · trailing "RESTful API" (folded into the ASP.NET head) · `Azure Platform (…)` and `Azure App Insights` merged into one Azure block

### 4. Travlr — literal duplicate present

```
**Tech-stack:** .NET Core (C#), distributed monolith architecture, RabbitMQ, GraphQL, REST API, Vue.js SPA, MySQL, Redis, Elasticsearch, AWS, GitHub Actions CI/CD, Grafana + Elastic APM, OrchardCore, VirtoCommerce, Metabase, Google Analytics. Third-party integrations: Viator, Agoda, Expedia, Amadeus (travel inventory); Stripe, Humm, Forter (payments & fraud).
```
**Cut:** **Elastic APM (appeared twice)** · Git · Hero · TCN · "and many more" · "Redis Cache"→Redis
**Kept deliberately:** the travel-brand integrations — near-zero ATS value, but `Travel tech` is in `preferred_industries` (profile.yml) and Viator/Agoda/Amadeus are domain credibility with a human reader.

### 5. Geekseat & Devstack — Vue.js listed twice

Flattened to match the other six (currently the only categorized one):
```
**Tech-stack:** C#, ASP.NET Core, ASP.NET MVC, Python (Flask), Node.js, RESTful Web API, OAuth 2.0 / IdentityServer4, Domain-Driven Design, CQRS, BDD, SignalR, Akka.NET (actor model), background processing (Hangfire, Quartz), AWS Lambda, MS SQL Server, MySQL, Redis, Vue.js, AngularJS, Azure DevOps, GitHub Actions.
```
**Cut:** **Vue.js (twice)** · Angular Material + Telerik Kendo UI (fold into AngularJS) · jQuery · Bootstrap · standalone "SPA" · AutoMapper · MailKit · StructureMap · "Microservices (familiar)" · "(up to 5.2)" · ".NET 4.x" · Git
**Promoted:** `AWS Lambda` — already claimed in the iRealty bullet above it but missing from the stack line; Lambda/serverless is a real keyword.

### 6. Bank Mandiri — one technical inaccuracy

```
**Tech-stack:** C#, ASP.NET MVC, RabbitMQ + MassTransit (service bus, SAGA pattern), NHibernate, Oracle, Kendo MVC.
```
**Cut:** `ORM (ODAC)` — ODAC is Oracle's data-access driver, **not an ORM**; NHibernate is the actual ORM and Oracle is already listed. This is a correctness fix, not just trimming.

### 7. Research and Development · Geekseat
No stack line currently — bullets only. Leave as-is, or add: `**Tech-stack:** EventStore (Event Sourcing), Akka.NET (Reactive Actor Model), C#.`

## D. Open decisions — answer these to resume

1. **Drop `Git` from every project line?** The user's own "Git, Bitbucket → just Git" example points this way — at 10+ years it's assumed, and GitHub Actions / Azure DevOps already prove source control. Removes it from Decipher, Travlr, Geekseat.
   - *Side note:* the same redundancy sits in the **Key Skills** table — `Git, CI/CD (Azure DevOps, GitHub Actions, Bitbucket Pipelines)`. Sweep Key Skills too, or projects only (as originally scoped)?

2. **Two cross-section duplications** spotted outside the stack lines — left alone pending direction:
   - **Bank Mandiri** project entry ≈ verbatim repeat of the Praweda Informatika experience bullet (same tech, same sentence).
   - **Geekseat Core Framework** described in both the Devstack experience bullet and the R&D project entry.

3. **Blazor / Pulumi / LaunchDarkly on GPP** score 0 hits in the JD corpus and deviate from the Quartex tech-alignment-matrix target state (`docs/quartext-tech-alignment-matrix.md`) — but they're real work. Current proposal **keeps and demotes** them rather than cutting. Cut instead?

**Net effect if approved as-is:** ~118 → ~92 stack items across 6 project lines, no capability claim removed.
