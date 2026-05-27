# Rikky Hermanto Hasibuan

Bali (Open to Global Relocation) · rikky.hermanto@gmail.com · +628123488851 · [linkedin.com/in/rhermanto](https://linkedin.com/in/rhermanto)

## Summary

Backend Engineer with 10+ years of experience building scalable distributed systems, cloud-native services, and event-driven backends — currently specializing in LLM integration and AI-powered backend systems. Designed and shipped multi-provider LLM extraction pipelines (Gemini + Anthropic) for financial document parsing, including structured output enforcement, failure mode handling, and observability instrumentation. Trusted as a team/tech leader; adopting *"Elastic Leadership"* that adapts leadership style to the team's maturity phase, with the main goal of bringing teams into an autonomous, self-organized state. Worked extensively with distributed engineering teams across APAC (especially Australia) and thrives in inclusive, collaborative cultures. Open to global relocation or remote (APAC-aligned time zones) roles.

## Key Skills

| Area | Details |
|------|---------|
| **AI & LLM** | Anthropic Claude API (`tool_use` structured extraction), Gemini API (JSON mode), multi-provider orchestration, prompt engineering, temperature/stop\_reason failure handling, PyMuPDF pre-processing |
| **Languages** | Python (FastAPI, Pydantic v2, asyncio), C# .NET / .NET Core (primary), Java (familiar) |
| **Architecture** | Clean Architecture, Event-Driven Systems, CQRS, Distributed Monoliths, Microservices (familiar), Serverless, DDD (familiar) |
| **IPC & Messaging** | RESTful API, GraphQL, RabbitMQ + MassTransit, SignalR WebSockets, MediatR Domain Events, Azure Event Grid, Hangfire/Quartz |
| **Cloud & Infra** | Azure (Functions, EventGrid, App Services, App Insights), AWS (EC2, RDS, DynamoDB, API Gateway, VPC, Load Balancer), Supabase (PostgreSQL 17 + pgvector, Auth, Storage, Realtime, Webhooks) |
| **Databases** | PostgreSQL, MSSQL, MySQL, Supabase PostgREST, Marten, Neo4j, EF Core, NHibernate |
| **DevOps & CI/CD** | Git, GitHub Actions, Azure DevOps, Bitbucket Pipelines, Docker, Kubernetes (familiar), Octopus |
| **Monitoring** | OpenTelemetry (traces/metrics/logs), Grafana LGTM Stack (Alloy, Prometheus, Loki, Tempo), Azure App Insights, Datadog APM |
| **Testing** | xUnit, Moq, NSubstitute, Alba, Cypress, pytest, TDD/BDD |
| **Security** | Auth0, OpenID Connect, OAuth 2.0, IdentityServer4, Supabase Auth, Snyk |
| **Principles** | SOLID, DRY, KISS, YAGNI, Clean Code, Design Patterns |
| **R&D** | Event Sourcing (EventStore), Reactive Actor Model (Akka.NET), Elasticsearch, LaunchDarkly, pgvector (RAG pipeline) |

## Professional Experience

### Technical Leader — Quartex Software (INX-K2fly)
**Resource Governance Software Services · Australian-based · Sep 2023 – Present**

- Joined as Senior Software Engineer; promoted to Tech Lead within a month based on performance and leadership capabilities.
- Led technical strategy and product development, aligning team efforts with quarterly planning objectives.
- Evaluated architectural trade-offs to determine scalable, maintainable, and cost-effective solutions; reduced development costs from $9K/month to $6K/month, targeting $2K/month.
- Proactively influenced product direction and technical roadmap based on client needs, shaping a customer-focused roadmap to deliver features that are usable, used, and useful.
- Led product releases and co-implemented DevOps CI/CD enhancements to improve resource and time efficiency.
- Led optimization of critical system modules, improving load performance by 85–98%.

### Technical Leader — Travlr
**Travel E-Commerce Platform · Australian-based · Jun 2021 – Sep 2022**

- Led the Travlr Platform Team through the full development cycle using Agile methodologies, managing a team of 5–7 members.
- Defined tasks aligned with company quarterly OKRs; ensured code quality through rigorous reviews and led scrum ceremonies.
- Developed a new CMS platform using OrchardCore, integrating multitenancy, 3rd-party integrations, and live custom CSS — boosting team BAU productivity by 30–40%.
- Fostered a culture of collaborative brainstorming, customer-centric feature prioritization, and team mentorship.
- Successfully released major travel platforms including BBC Discover Beyond, MTV Travel, and Nickelodeon Travel.

### Technical Leader & Senior Backend Engineer — Devstack & Geekseat
**Software Development Services · Australian-based · Jul 2014 – Jan 2021**

- Led teams of 3–5 developers through the entire software development lifecycle across multiple client projects.
- Provided formal solutions design, specification reviews, architecture, and standards tailored to each client's needs.
- Developed the Geekseat Core Framework — a foundational building block that eliminated redundant boilerplate code across all new project developments.
- Provided guidance and mentorship to junior developers, enabling faster onboarding and upskilling.

### Backend Software Engineer — Praweda Informatika
**Software Development Services · Indonesian-based · Oct 2011 – Apr 2014**

- Developed Bank Mandiri's Custodian Supporting Application (C#, ASP.NET MVC, NHibernate, MassTransit/RabbitMQ, SAGA pattern, Oracle).
- Maintained and enhanced the KSEI C-BEST Terminal (Central Depository and Book Entry Settlement System).

### Backend Software Engineer — Jatis Mobile
**Software Development Services · Indonesian-based · Sep 2009 – Apr 2011**

Developed middleware for various clients including SAMSUNG e-Reading for Galaxy Tab, Device Portal Soccer Mobile (BOLA), Djarum Indonesia Open 2010, KABILA (KAI – Kereta Api), Android Bukopin Catalogue, and Facebook Mobile for Esia Phone using Brew, PHP, Java, and the Facebook API.

## Selected Projects

### Personal Finance App · Personal Project · Oct 2024 – Present (Active Development)

A self-built personal finance platform built around a core insight: most people aren't financially illiterate — they're *directionally lost*. The platform gamifies the **Financial Pyramid** (Foundations → Defense → Growth → Freedom → Legacy) into a scoring engine that reads across cashflow, assets, and investments to compute per-tier health indicators — recalculated event-driven via MediatR domain event handlers on every data mutation.

**Key architectural decisions:**
- **Structured LLM extraction:** Used Anthropic `tool_use` over JSON mode because tool schemas are validated server-side before the response is returned — eliminating post-processing regex against unvalidated free text. `temperature=0.0` enforced across all extraction calls (extraction is deterministic; creativity causes hallucination). `stop_reason == "max_tokens"` treated as a hard error: partial extraction corrupts the deduplication pipeline and is worse than a failure.
- **Token cost reduction:** PDFs pre-processed via PyMuPDF to extract text before LLM ingestion, reducing token cost 40–60%. Screenshots/images sent directly to LLM vision API as base64 (no text layer to extract).
- **Multi-provider abstraction:** Provider selection abstracted behind a factory pattern (`GeminiProvider` / `AnthropicProvider`) — swap models without changing extraction logic.
- **Three-tier deduplication:** File-hash table (upload-level), composite UNIQUE index on `(date, amount, description, wallet, flow, bank_running_balance)` (row-level), with bank running balance as tie-breaker for legitimate same-day duplicate transactions.
- **Scoring engine:** `JourneyScoringService` reads across cashflow, assets, and investments to compute per-tier health indicators across a five-tier Financial Pyramid (Foundations → Defense → Growth → Freedom → Legacy). Score recalculation is event-driven via MediatR domain event handlers triggered on every data mutation.
- **Observability:** Full OpenTelemetry instrumentation on both .NET and Python services, surfaced via self-hosted Grafana LGTM stack (Alloy, Prometheus, Loki, Tempo).

**Technologies:** Python FastAPI, Anthropic Claude API (`tool_use`), Gemini API (JSON mode), PyMuPDF, Pydantic v2, C# ASP.NET Core Web API (.NET 10), MediatR (CQRS + Domain Events), FluentValidation, Supabase (PostgreSQL 17 + pgvector, Storage, Realtime, Webhooks), OpenTelemetry, Grafana LGTM Stack, Docker, GitHub Actions, React 18 + TypeScript + Tailwind CSS.

### Global Person Profile (GPP) – INX Cloud Identity Platform · Quartex Software K2Fly · Present

A cloud-native, multi-tenant identity platform unifying workforce profiles across Quartex products. Enables SSO, MFA, fine-grained access control, and real-time compliance visibility through a centralized profile service.

**Technologies:** Auth0 (IAM, MFA), RabbitMQ (event-driven), AWS (VPC, API Gateway, EC2, RDS, Load Balancer), Marten (PostgreSQL) + EF Core, ASP.NET Core, Pulumi (IaC), Blazor, Docker, GitHub Actions, Vue.js, Cypress, Octopus Deploy, Datadog, SendGrid/Twilio, Courier, LaunchDarkly.

### Decipher Mining Software · Quartex Software K2Fly · Sep 2023 – Present

Tailings management software supporting mine rehabilitation and closure, enhancing safety decision-making and mitigating risks associated with Tailings Storage Facility governance. Focused on system reliability via background recovery jobs, monitoring pipelines, and performance profiling.

**Technologies:** Azure (App Service, Storage, Functions, EventGrid), ASP.NET Core (C# 11, .NET 7), Hangfire, MSSQL, Google Earth Engine, Azure App Insights, Power BI, Angular, Kendo UI, Auth0, Bitbucket.

### Travlr Platform · Travlr · Jun 2021 – Sep 2022

A multi-tenant SaaS travel e-commerce platform offering white-labeling and co-created travel products with partners including Nickelodeon NickTravel, BBC Discover Beyond, MTV Travel, BaliBible, and 10Travlr.

**Technologies:** .NET Core, C#, Distributed Monolith, RabbitMQ, OrchardCore, VirtoCommerce, Vue.js SPA, GraphQL, MySQL, Redis, Elasticsearch, Elastic APM, Metabase, Google Analytics, AWS, Grafana, GitHub Actions. Integrated with Viator, Agoda, Expedia, Hero, Amadeus, Stripe, Humm, Forter, TCN.

### Geekseat & Devstack Projects · 2014 – 2021

Led or contributed to backend platforms across logistics, healthcare, legal automation, real estate, and enterprise IT — focused on scalable API design, cloud migration, secure authentication, and multi-platform integrations.

Representative projects:
- **Qiik** – Logistics and shipping management with Android/iOS frontend, REST APIs, and reporting dashboard
- **Redbourne (Redicase)** – Hospital case management platform with modular Web API and AngularJS frontend
- **Plexus Legal Gateway** – Legal automation with dynamic document generation using Vue.js and Python
- **iRealty Apps** – Real estate marketing tool with AWS Lambda integrations for third-party agent sync
- **MspCube** – Managed Service Provider platform with OAuth 2.0-based authentication
- **Avmin Air Charter** – Aircraft bidding platform with SignalR push notifications, actor-based processing (Akka.NET), and job schedulers
- **RentersCard** – Online property platform with ASP.NET MVC, background jobs, and Windows service integration

**Technologies:** C#, ASP.NET Core, ASP.NET MVC, .NET 4.x, Python (Flask), Node.js, Vue.js, AngularJS, RESTful API, OAuth 2.0 (IdentityServer4), DDD, SignalR, Akka.NET, Hangfire, Quartz, MSSQL, MySQL, Redis, Azure DevOps, GitHub Actions.

### Bank Mandiri Custodian Supporting Application · PT Praweda Ciptakarsa Informatika · Oct 2012 – Apr 2014

Developed Bank Mandiri's Custodian Supporting Application for settlement and depository operations.

**Technologies:** C#, ASP.NET MVC, NHibernate, MassTransit, RabbitMQ, SAGA pattern, Kendo MVC, Oracle, ODAC.

## Education

**Bachelor, Information System** · University of Indonesia · GPA 3.15 / 4.00

**Academic, Information System** · Institut Teknologi Del · GPA 3.31 / 4.00

## Involvement

- Actively provide mentorship to individuals learning coding and software development.
- Mentored students at a local IT vocational high school in Bali on the professional software development lifecycle. *(2019)*
- Served as Chairman and Volunteer Teacher for **IADEL Mengajar**, a non-profit alumni organization dedicated to educating and empowering communities through technology. *(2013–2014)*
- Active member of the Bali Dog Lovers community — rescue, neutering, and vaccination of dogs in need. *(2020–present)*
