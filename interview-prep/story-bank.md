# Story Bank — Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

## How it works

1. Every time `/career-ops offer` generates Block F (Interview Plan), new STAR+R stories get appended here
2. Before your next interview, review this file — your stories are already organized by theme
3. The "Big Three" questions can be answered with stories from this bank:
   - "Tell me about yourself" → combine 2-3 stories into a narrative
   - "Tell me about your most impactful project" → pick your highest-impact story
   - "Tell me about a conflict you resolved" → find a story with a Reflection

## Stories

<!-- Stories will be added here as you evaluate offers -->
<!-- Format:
### [Theme] Story Title
**Source:** Report #NNN — Company — Role
**S (Situation):** ...
**T (Task):** ...
**A (Action):** ...
**R (Result):** ...
**Reflection:** What I learned / what I'd do differently
**Best for questions about:** [list of question types this story answers]
-->

### [LLM Production] Anthropic tool_use Structured Extraction Pipeline
**Source:** Report #054 — Anthropic — Applied AI Engineer (London)
**S (Situation):** PDF bank statements arrive in arbitrary formats with no standard schema; needed reliable extraction without silent data corruption.
**T (Task):** Build a production LLM extraction pipeline that never silently corrupts the deduplication pipeline.
**A (Action):** Chose Anthropic tool_use over JSON mode for server-side schema validation; enforced temperature=0.0 across all extraction calls; treated stop_reason=max_tokens as a hard error (partial extraction corrupts dedup); pre-processed PDFs via PyMuPDF to reduce token cost 40–60%.
**R (Result):** Zero silent corruption in 6+ months of production use; three-tier deduplication operates reliably on clean data.
**Reflection:** The model doesn't lie — it just completes tokens. Treat the API as a finite-state machine with defined error modes, not a magic box.
**Best for questions about:** LLM integration, production AI systems, failure mode handling, cost optimization, evaluation design

### [Client Advisory] Technical Advisory Across Multiple Client Engagements
**Source:** Report #054 — Anthropic — Applied AI Engineer (London)
**S (Situation):** At Devstack/Geekseat (7 years), multiple clients with varying technical maturity needed backend systems architected and delivered.
**T (Task):** Understand client constraints, make architectural calls appropriate to context, and deliver reliably without a fixed template.
**A (Action):** Ran solution design and specification reviews per client; applied multi-pattern thinking (DDD, serverless, monolith) based on actual context rather than preference; produced formal architecture documentation and standards.
**R (Result):** Delivered platforms across healthcare, logistics, legal automation, real estate — no client churn over 7 years.
**Reflection:** Advisory is about building trust, not just delivering code. The best architectural advice sounds like "here's what you don't need."
**Best for questions about:** Customer-facing work, technical advisory, architecture trade-offs, stakeholder communication

### [Multi-Provider Abstraction] LLM Provider Factory Pattern
**Source:** Report #054 — Anthropic — Applied AI Engineer (London)
**S (Situation):** Two LLM providers (Anthropic, Gemini) had different API contracts, reliability profiles, and cost structures.
**T (Task):** Enable model swapping and cost/quality experimentation without changing extraction logic.
**A (Action):** Built a factory pattern (GeminiProvider / AnthropicProvider) behind a shared interface; compared structured output reliability between JSON mode and tool_use; observed that tool_use schema enforcement reduced post-processing needs.
**R (Result):** Ability to run cost/quality experiments without touching core extraction logic; isolated provider-specific failure handling.
**Reflection:** Evaluation is a first-class architectural concern. Build the abstraction that makes it measurable from day one.
**Best for questions about:** Multi-provider LLM, abstraction patterns, evaluation, cost optimization, experimentation

### [SDK / Library] Geekseat Core Framework
**Source:** Report #001 — Supabase — SDK Engineer (C#)
**S (Situation):** Multiple projects at Geekseat/Devstack were repeatedly re-implementing the same boilerplate infrastructure code from scratch, slowing delivery.
**T (Task):** Design and ship a shared foundational C# framework that all company projects would build on.
**A (Action):** Designed and built the Geekseat Core Framework — an opinionated shared library covering common patterns, eliminating redundant boilerplate, and establishing standards across all projects.
**R (Result):** All Geekseat/Devstack projects adopted it; onboarding time and redundant development effort reduced significantly.
**Reflection:** I'd open-source it from day 1 — internal frameworks die when the team changes. OSS gives it longevity and community feedback that improves the API.
**Best for questions about:** SDK experience, library design, developer experience, scaling standards across a team

### [API Design] GPP Identity Platform API
**Source:** Report #001 — Supabase — SDK Engineer (C#)
**S (Situation):** Multiple Quartex products needed a unified identity system but each was building their own auth layer with incompatible contracts.
**T (Task):** Design a single identity API that felt native to .NET consumers and could be adopted across all products without breaking changes.
**A (Action):** Built the Global Person Profile platform using Auth0, ASP.NET Core, RabbitMQ for events, and clean API contracts with strict versioning.
**R (Result):** Adopted by all Quartex products; zero breaking changes post-launch.
**Reflection:** Good API design means the consumer never needs to read the source code. The public contract is the product.
**Best for questions about:** API design, platform thinking, cross-team collaboration, DX

### [Performance] 85–98% Load Performance Improvement
**Source:** Report #001 — Supabase — SDK Engineer (C#)
**S (Situation):** Critical system modules at Quartex were timing out under normal production load, causing reliability issues.
**T (Task):** Debug, profile, and fix without introducing regressions in a complex production system.
**A (Action):** Used Azure Application Insights to profile hot paths, identified bottlenecks, rewrote critical sections with async patterns and query optimization.
**R (Result):** 85–98% load performance improvement across the affected modules.
**Reflection:** Profiling data should drive SDK design decisions — async patterns and lazy loading matter at the API level too, not just inside the implementation.
**Best for questions about:** Performance engineering, production debugging, .NET optimization

### [Async/Remote] 10+ Years Remote with Australian Teams
**Source:** Report #001 — Supabase — SDK Engineer (C#)
**S (Situation):** Joined and led teams at Geekseat, Devstack, Travlr, and Quartex — all Australian companies — while based in Bali, Indonesia, without ever meeting most teammates in person.
**T (Task):** Deliver consistently on time with async-only coordination across significant timezone differences.
**A (Action):** Developed async-first practices: written specs, detailed PR descriptions, structured async standups, clear escalation paths, and strong documentation habits.
**R (Result):** Zero missed deadlines across 10+ years and multiple companies; promoted to Tech Lead at Quartex within one month.
**Reflection:** Async is a discipline, not just a preference. The written word becomes your primary trust signal — clarity in writing = credibility.
**Best for questions about:** Remote work, async communication, distributed teams, reliability

### [Greenfield / Ambiguity] Travlr White-Label Platform
**Source:** Report #001 — Supabase — SDK Engineer (C#)
**S (Situation):** No existing platform, multiple brand partners (BBC, MTV, Nickelodeon) needed separate white-label travel e-commerce sites on one codebase.
**T (Task):** Lead a team of 5–7 to design and launch a multi-tenant SaaS platform from zero.
**A (Action):** Defined architecture (distributed monolith with multitenancy), led Agile ceremonies, made key technology choices (.NET Core, OrchardCore CMS, Vue.js, RabbitMQ, AWS), and drove delivery.
**R (Result):** All 3 brand partners launched on time; platform grew to serve 10Travlr, BaliBible, and more.
**Reflection:** Greenfield with multitenancy constraints (each tenant needs isolation AND shared core) is the same mental model as SDK design — you're building for consumers you can't fully predict.
**Best for questions about:** Greenfield projects, ambiguity, technical leadership, system design

### [LLM Production] The stop_reason Incident
**Source:** Report #046 — Grafana Labs — Staff AI Engineer - Grafana Ops, AI/ML
**S (Situation):** Building the LLM extraction pipeline for the Personal Finance App, early testing showed occasional silent data corruption — duplicate transactions appearing with wrong amounts when PDF parsing produced truncated output.
**T (Task):** Trace the root cause and make the failure mode impossible, not just unlikely.
**A (Action):** Discovered that `stop_reason == "max_tokens"` was returning a partial JSON object that passed schema validation but produced corrupted deduplication keys. Added hard-error treatment for `max_tokens` (full retry + alert), enforced `temperature=0.0` across all extraction calls, and wrote regression tests that simulate token-truncated LLM responses.
**R (Result):** Zero silent corruption incidents since; the extraction pipeline is fully auditable with every call logged to OpenTelemetry traces.
**Reflection:** Partial data is worse than no data — it's the silent failure that corrupts downstream systems without triggering alerts. The fix isn't retrying more — it's defining failure explicitly and refusing to proceed with ambiguous output.
**Best for questions about:** LLM production hardening, failure modes, observability, data integrity, incident handling

### [Observability] The Grafana Trace Hunt
**Source:** Report #046 — Grafana Labs — Staff AI Engineer - Grafana Ops, AI/ML
**S (Situation):** Unexplained latency spikes appeared in the Personal Finance App — intermittent 3–5 second delays during scoring recalculation with no obvious pattern in application logs.
**T (Task):** Identify and resolve the root cause using the observability stack I'd instrumented from day one.
**A (Action):** Used Tempo's trace correlation to follow a slow request across the .NET API and Python FastAPI services. The trace showed a gap in the database span — cross-referenced with Loki logs filtered by trace ID, which revealed an N+1 query pattern in the scoring engine triggered only when wallet counts exceeded a threshold.
**R (Result):** Fixed in one pull request; latency returned to baseline. The debugging process — start to fix — took under 2 hours, versus what would have been days of log grepping without distributed tracing.
**Reflection:** Instrumenting from day one (not "we'll add it when we have a problem") is the only way to debug systems you didn't write or that have changed since you did. The observability investment pays back the first time you have a production incident.
**Best for questions about:** Observability, debugging distributed systems, OpenTelemetry, Grafana, incident triage, production ownership

### [Multi-Provider AI] The Provider Factory
**Source:** Report #046 — Grafana Labs — Staff AI Engineer - Grafana Ops, AI/ML
**S (Situation):** The Personal Finance App's LLM extraction was built on Anthropic Claude. A brief API outage early in development caused total extraction failure — no fallback, no recovery.
**T (Task):** Design a multi-provider architecture so provider failure is handled at the infrastructure level, not the feature level.
**A (Action):** Abstracted provider selection behind a factory pattern (`GeminiProvider` / `AnthropicProvider`) with identical input/output schemas. The factory reads provider config at startup; swapping providers requires a single config change, no code changes. Also added PyMuPDF pre-processing before LLM ingestion — extracting text from PDFs before sending them to the LLM reduced token consumption by 40–60%.
**R (Result):** Provider switch tested in < 5 minutes. Cost per extraction reduced by 40–60%. No production outage attributable to a single provider dependency since.
**Reflection:** Treat LLM providers like databases — your application logic should be completely unaware of which one is running. The abstraction cost is low; the resilience gain is high. This is the same principle behind connection strings and repository patterns.
**Best for questions about:** LLM architecture, vendor independence, cost optimisation, production resilience, system design

### [Platform Engineering] Three-Tier Deduplication — Storage Design at the Data Layer
**Source:** Report #058 — Grafana Labs — Senior Backend Engineer - Search & Storage
**S (Situation):** Financial transaction data arrives from multiple banks with no standard schema; real duplicate transactions exist (same day, same amount, same merchant) alongside erroneous duplicates.
**T (Task):** Design a deduplication pipeline that handles both genuine and erroneous duplicates with zero silent corruption.
**A (Action):** Implemented three-tier deduplication: (1) file-hash table at upload level to detect re-uploaded files; (2) composite UNIQUE index on (date, amount, description, wallet, flow, bank_running_balance) at row level; (3) bank running balance as tie-breaker for legitimate same-day duplicate transactions. Every dedup decision is logged to OpenTelemetry traces.
**R (Result):** Zero false duplicates in production; genuine duplicates correctly separated; the dedup pipeline is fully auditable — every decision traceable via trace ID.
**Reflection:** The dedup problem is a microcosm of distributed storage design: you need correctness, observability, and explicit failure modes. Implicit dedup (e.g., "just use a hash") fails at the edges. Explicit design with a tie-breaker covers the real-world cases that hash-only dedup silently misclassifies.
**Best for questions about:** Storage design, data integrity, distributed systems, deduplication, observability, system design trade-offs

### [Engineering Management] OKR Alignment at Quartex — Engineering Strategy Meeting Business Reality
**Source:** Report #062 — Grafana Labs — Engineering Manager - Platform - Usage
**S (Situation):** Engineering and product teams at Quartex had no shared planning mechanism; feature requests arrived without business context, causing misaligned dev cycles.
**T (Task):** Create alignment between engineering, product, and leadership so the team builds what the company actually needs — not what's technically interesting.
**A (Action):** Introduced quarterly OKR reviews that tied the engineering roadmap to company objectives; framed technical debt as business risk (cost reduction, reliability) rather than engineering preference; reduced infrastructure costs from $9K→$6K/month as a direct result of aligned prioritization.
**R (Result):** Measurable cost reduction; team understood the "why" behind every sprint; reduced wasted cycles on features that didn't serve customers.
**Reflection:** Engineering strategy that can't be explained to a CFO is a strategy that will get overruled at budget time. The EM job is translation — between what's technically correct and what's commercially necessary. Both matter; neither wins alone.
**Best for questions about:** Engineering management, stakeholder alignment, OKRs, roadmap strategy, technical debt prioritization, business-engineering partnership

### [Reliability / Distributed] MassTransit SAGA — Fault-Tolerant Settlement at Bank Mandiri Scale
**Source:** Report #063 — Trade Republic — Observability Tech Lead
**S (Situation):** Bank Mandiri's custodian settlement system handled multi-step financial operations across multiple services (custody, book entry, KSEI interface). Partial failures left orphaned state with no automated recovery — ops team had to manually reconcile every incident.
**T (Task):** Design a fault-tolerant distributed workflow where every step is either completed or compensated — zero manual intervention for recoverable failures.
**A (Action):** Implemented a MassTransit SAGA state machine with explicit compensation actions; each step in the workflow was idempotent; failure at any step triggered the compensation chain automatically via MassTransit's built-in routing; state was persisted to survive process restarts.
**R (Result):** Zero unrecovered partial failures in production across the custodian settlement pipeline. The ops team stopped receiving manual reconciliation incidents for the failure scenarios the SAGA covered.
**Reflection:** Distributed transactions require explicit failure design — not just error handling. The SAGA pattern forces you to ask "what does undo look like?" for every step. Teams that skip this end up with compensations written as one-off scripts during incidents, which introduces more bugs than the original failure.
**Best for questions about:** Reliability engineering, distributed systems, fault tolerance, event-driven architecture, SAGA/compensation patterns, financial systems

### [Autonomy / Leadership] Promoted to Tech Lead in 1 Month — Stepping Up Without Being Asked
**Source:** Report #063 — Intercom — Principal Engineer, Fin AI Agent
**S (Situation):** Joined Quartex as a Senior Software Engineer. Within days, I noticed the team was shipping without clear technical ownership — architectural decisions were being deferred, code reviews were inconsistent, and no one was connecting delivery to the broader product roadmap.
**T (Task):** Operate at the highest impact level possible — regardless of what my job title said.
**A (Action):** Took initiative on architectural decisions without waiting to be asked; started running structured code reviews; aligned sprint output with quarterly objectives; acted as the de facto technical point of contact for the product team. Didn't ask for permission to step into a leadership role — showed it was already happening.
**R (Result):** Promoted from Senior SE to Tech Lead within one month of joining — based entirely on observed output and leadership behavior, not tenure.
**Reflection:** Autonomy is a muscle, not a privilege. You demonstrate it before anyone grants it. The first promotion I've ever gotten that wasn't tied to time-in-role was also the fastest one — because it was based on behavior, not duration.
**Best for questions about:** Extreme autonomy, principal/staff-level judgment, stepping up, leadership without authority, self-direction, promotion velocity
