# Rikky Hermanto Hasibuan

📍 Bali (Open Global Relocation) · ✉️ rikky.hermanto@gmail.com · 📞 +628123488851 · [linkedin.com/in/rhermanto](https://linkedin.com/in/rhermanto)

---

## Summary

Backend Engineer (10+ years, distributed systems, event-driven architecture), currently building AI/LLM systems. Designed, shipped, and operates an end-to-end LLM pipeline — multi-provider structured extraction, RAG with measured retrieval quality, grounded generation with hallucination guards, streaming UX, and full AI observability — on a personal-finance platform processing thousands of real transactions. Backed by a measured number, an eval harness, or a traced production run. A firm believer in strong engineering fundamentals — clean architecture, testing discipline, root-cause debugging, and design principles — and applies that same rigor to AI-assisted development. Trusted as a team/tech leader; adopts *Elastic Leadership*, adapting style to the team's maturity with the goal of an autonomous, self-organized team. Extensive experience with distributed teams across APAC (especially Australia). Open to global relocation or remote (APAC-aligned time zones) roles.

---

## Key Skills

- **AI/LLM Engineering:** Anthropic Claude API (`tool_use` structured extraction, temperature=0.0 with `stop_reason` hard-error handling), Gemini API (JSON mode), multi-provider factory pattern (LLM + embedding layers behind protocol abstractions), PyMuPDF deterministic pre-processing (40–60% token cost reduction), prompt design for grounded generation with citation guards
- **RAG & Retrieval:** OpenAI/Gemini embeddings (provider-agnostic, L2 normalization, asymmetric task types), pgvector (IVFFlat tuning), chunking strategies (fixed-size + sentence-window), cross-encoder re-ranking (FlashRank), hybrid retrieval design, metadata filtering, query routing with deterministic SQL aggregation for numeric questions
- **LLM Evaluation:** custom eval harnesses (golden-set fixtures, row-level precision/recall/F1, field-level accuracy), retrieval metrics (MRR@5, Hit@5, P@5, set-based relevance design), RAGAS faithfulness with cross-provider LLM-as-judge, adversarial/canary test cases
- **AI Observability:** Langfuse (tracing, cost-per-call, token usage, p50/p95 latency dashboards, error rates), OpenTelemetry with Grafana LGTM stack, cost estimation and provider quota/cost management
- **Streaming & Realtime:** FastAPI SSE (`StreamingResponse`), React EventSource consumption, Supabase Realtime subscriptions
- **Main programming languages:** C# .NET (10+ years, primary), Python FastAPI (AI service)
- **Architectural Approach and Practices:** Clean Architecture, Distributed Systems/Monoliths, Microservices (familiar), Serverless, Domain-Driven Design (familiar), CQRS, Event Sourcing (PoC)
- **Inter-process Communication:** RESTful API, GraphQL, Event-Driven Systems (RabbitMQ, MassTransit, Azure Event Grid), WebSockets w/ SignalR, Hangfire/Quartz background jobs, MediatR domain events
- **Cloud-Native Systems:** Azure (Functions, EventGrid, App Services, App Insights, Webhook), AWS (EC2, RDS, DynamoDB, API Gateway, VPC, Load Balancer), Supabase (PostgreSQL + pgvector, Storage, Realtime, Auth, Webhooks)
- **Database Systems:** PostgreSQL (incl. pgvector), MsSQL, MySQL, Marten, EF Core, Neo4j
- **Testing:** TDD/BDD, xUnit, Moq/NSubstitute, pytest, Alba integration testing, Cypress e2e, eval-driven development for LLM features
- **Versioning, Configuration, Deployment:** Git, CI/CD (Azure DevOps, GitHub Actions, Bitbucket Pipelines), Octopus, Docker
- **Security:** Auth0, OpenID Connect / OAuth 2.0 (IdentityServer4), Supabase Auth, secure API development
- **Monitoring:** Langfuse, Azure Application Insights, Datadog APM, OpenTelemetry (traces/metrics/logs) with Grafana
- **Web-Presentation:** React + TypeScript + Tailwind, Vue JS, Angular
- **Development Methodologies:** Agile (Scrum/Kanban), iterative MVP delivery, continuous feedback

---

## Selected AI Engineering Work

### Personal Finance Platform — LLM Pipeline · Personal Project · Oct 2024 – Present

A self-built personal finance platform that parses Indonesian bank statements with LLMs and gamifies the Financial Pyramid into a scoring compass toward financial freedom. The AI layer is built and operated end-to-end as a system — measured, evaluated, and traced, not a demo.

**LLM extraction pipeline**
- Multi-provider structured extraction (Anthropic `tool_use`, Gemini JSON mode) behind a provider factory; PyMuPDF pre-processing cut token cost 40–60%; three-tier deduplication pipeline.
- Built a 20-fixture extraction eval harness (real bank statements incl. adversarial refund/FX/multi-currency cases) with row-level F1 on a natural key plus field-level accuracy; Gemini 2.5 Flash reached 100% row F1 — and the live eval caught a Python enum serialization bug mocked unit tests never would.

**RAG with measured retrieval quality**
- Embeddings on 4,400+ real transactions via a provider-agnostic embedding layer (OpenAI `text-embedding-3-small` ⇄ Gemini, protocol + factory pattern, cross-model guard in retrieval SQL to prevent stale-vector poisoning).
- pgvector cosine retrieval with a set-based relevance eval (MRR@5 / Hit@5 / P@5); diagnosed and fixed an IVFFlat `probes` misconfiguration that had suppressed MRR@5 from 1.000 to 0.476.
- Two-stage funnel with FlashRank cross-encoder re-ranking — measured a *negative* re-rank delta on the Indonesian-language corpus and root-caused it (English-only cross-encoder overriding a correct multilingual bi-encoder ranking).
- Grounded `POST /ask` endpoint: top-K synthesis with citations, a hallucination guard that drops citation IDs not present in retrieved context, and metadata filtering (account/date/category). Mean RAGAS faithfulness 0.90 on live answers, scored with a cross-provider judge to avoid self-preference bias; adversarial "no-data" canary correctly refused.

**Answer accuracy by design**
- Caught the RAG chat fabricating aggregate totals in live testing; redesigned the query path with intent routing so aggregate questions resolve to parametrized SQL `SUM` — the number comes from Postgres, never the model. Live-verified against source spreadsheets to the rupiah.

**Streaming, realtime, observability**
- SSE streaming for generation (FastAPI `StreamingResponse` → React EventSource chat UI); replaced polling upload status with Supabase Realtime.
- Langfuse tracing on every LLM and embedding call — cost/day, token usage, p50/p95 latency, error rate — layered on existing OpenTelemetry + Grafana LGTM across the .NET and Python services.

**Technologies:** Python FastAPI, Anthropic Claude API, Gemini API, OpenAI embeddings, pgvector, FlashRank, RAGAS, Langfuse, Pydantic v2, C# ASP.NET Core (.NET 10), MediatR (CQRS + Domain Events), Supabase (PostgreSQL 17, Storage, Realtime), OpenTelemetry, Grafana LGTM, React 18 + TypeScript + Tailwind, Docker, GitHub Actions.

---

## Professional Experience

### Technical Leader — Quartex Software (INX-K2fly)

*Resource Governance Software Services · Australian based company · Sep 2023 – Present*

- Joined as Senior Software Engineer; promoted to Tech Lead within a month due to performance and leadership capabilities.
- Led technical strategy and product development, aligning the team's efforts with quarterly planning objectives.
- Evaluated architectural trade-offs to determine scalable, maintainable, and cost-effective solutions. Reduced development costs from 9K/month to 6K/month, moving steadily toward the target of 2K/month.
- Proactively influenced product direction and technical roadmap, based on client needs evaluations led by the Product Owner, to shape a customer-focused roadmap and deliver impactful features.
- Led product releases, and co-implemented DevOps CI/CD enhancements to improve resource and time efficiency.
- Led optimization of critical system modules, improving performance by 85–98% of the load performance of those modules.

### Technical Leader — Travlr

*Travel E-Commerce Platform · Australian based company · Jun 2021 – Sep 2022*

- Led Travlr Platform Team through the full development cycle using Agile methodologies, managing a team of 5–7 members.
- Defined tasks in alignment with company quarterly OKRs, ensured code quality through rigorous reviews, and led scrum ceremonies.
- Developed a new CMS platform using OrchardCore (multitenancy, 3rd-party integrations, live custom CSS), boosting the team's BAU productivity by 30–40%.
- Fostered a culture of collaborative brainstorming, customer-centric feature prioritization, and team mentorship.
- Successfully released major travel platforms, including BBC Discover Beyond, MTV Travel, Nickelodeon Travel.

### Technical Leader & Senior Backend Software Engineer — Devstack & Geekseat

*Software Development Services · Australian based company · Jul 2014 – Jan 2021*

- Led teams of 3–5 developers each through the entire software development life cycle, in each project.
- Provided formal solutions design, specification review, architecture, and standards to meet each specific client's needs.
- Developed the Geekseat Core Framework, a foundational building block that significantly accelerated development by eliminating redundant work and boilerplate on each new project.
- Provided guidance and mentorship to junior developers, enabling faster onboarding and upskilling.

### Backend Software Engineer — Praweda Informatika

*Software Development Services · Indonesian based company · Oct 2011 – Apr 2014*

- Developed Bank Mandiri's Custodian Supporting Application (C#, ASP.NET MVC, NHibernate, MassTransit/RabbitMQ, SAGA pattern, Oracle).
- Maintained and enhanced the KSEI C-BEST Terminal (Central Depository and Book Entry Settlement System).

### Backend Software Engineer — Jatis Mobile

*Software Development Services · Indonesian based company · Sep 2009 – Apr 2011*

- Developed middleware for various clients, including SAMSUNG e-Reading for Galaxy Tab, Device Portal Soccer Mobile (BOLA), Djarum Indonesia Open 2010, KABILA (KAI – KERETA API), Android Bukopin Catalogue, Facebook Mobile for Esia Phone using Brew – PHP – Java – Facebook API.

---

## Other Selected Projects

### Global Person Profile (GPP) – INX Cloud Identity Platform · Quartex Software K2Fly · Present

A cloud-native, multi-tenant identity platform unifying workforce profile across Quartex products. Enables SSO, MFA, fine-grained access control, and real-time compliance visibility through a centralized profile service.

**Technologies:** Auth0 (IAM, MFA), RabbitMQ event-driven architecture, AWS (VPC, API Gateway, EC2, RDS, Load Balancer), Marten (PostgreSQL) + EF, ASP.NET Core REST API, Pulumi (IaC), Blazor, Docker, GitHub Actions CI/CD, VueJS, Cypress, Octopus Deploy, Datadog, SendGrid/Twilio, Courier, LaunchDarkly.

### Decipher Mining Software · Quartex Software K2Fly · Sep 2023 – Present

Tailings management software supporting mine rehabilitation and closure, safety decision-making, and TSF governance risk mitigation. Focused on system reliability via background recovery jobs, monitoring pipelines, and performance profiling.

**Technologies:** Azure (App Service, Storage for millions of IoT datapoints, Functions, EventGrid), ASP.NET API (C# 11, .NET 7), Hangfire, MS SQL, Google Earth Engine, Azure App Insights, Power BI, Angular, Kendo UI, Auth0.

### Travlr Platform · Travlr · Jun 2021 – Sep 2022

Multi-tenant white-label travel e-commerce SaaS (NickTravel, BBC Discover Beyond, MTV Travel, BaliBible, 10Travlr, and more).

**Technologies:** .NET Core, Distributed Monoliths, RabbitMQ, OrchardCore, VirtoCommerce, VueJS SPA, GraphQL, MySQL, Redis, Elasticsearch, Elastic APM, Grafana, AWS, GitHub Actions. Integrations: Viator, Agoda, Expedia, Amadeus; payments via Stripe, Humm, Forter, TCN.

### Geekseat & Devstack Projects · 2014 – 2021

Led or contributed to backend platforms across logistics, healthcare, legal automation, real estate, and enterprise IT — scalable API design, cloud migration, secure authentication, multi-platform integrations. Representative: Qiik (logistics), Redbourne Redicase (hospital case management), Plexus Legal Gateway (legal automation, VueJS + Python), iRealty (AWS Lambda integrations), MspCube (OAuth 2.0), Avmin Air Charter (SPA, DDD, SignalR, actor-based processing), RentersCard.

**Technologies:** C#, ASP.NET Core/MVC, Python (Flask), Node.js, Vue.js, OAuth 2.0 (IdentityServer4), DDD, BDD, SignalR, Akka.NET, Quartz/Hangfire, CQRS, MS SQL, MySQL, Redis, AngularJS, Kendo UI.

### Research and Development · Geekseat · Jul 2014 – Oct 2018

- Proof-of-concept implementations for Event Sourcing (Event Store) and Reactive Actor Model (Akka .NET).
- Developed the Geekseat Core Framework, the base building block for Geekseat projects.

---

## Education

- **Bachelor, Information System** — University of Indonesia · GPA 3.15 of 4.00
- **Academic, Information System** — Institut Teknologi Del · GPA 3.31 of 4.00

---

## Involvement

**Mentorship, Chairman, & Voluntary**

- Actively provide mentorship to individuals interested in learning coding and software development.
- Mentored students at a local IT vocational high school in Bali, providing real-world insights into the professional software development lifecycle. (2019)
- Served as Chairman and Volunteer Teacher for IADEL Mengajar, a non-profit alumni organization dedicated to educating and empowering communities through technology and education. (2013–2014)
- Active member of the Bali Dog Lovers community, participating in the rescue, neutering, and vaccination of dogs in need. (2020 – present)
