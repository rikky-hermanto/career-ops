<!--
DRAFT — compiled from the ATS + hiring-bar review (2026-08-15) plus your answers.
Not yet promoted to cv.md. Two items intentionally left untouched pending your call:
  1. About section (finding #12) — rewrite proposed in the review, never confirmed. Left as-is.
  2. OrchardCore/Travlr bullet (finding #10, Q5) — house rule in modes/_custom.md already
     says it may stay in cv.md's Travlr history and only must not surface in cover
     letters/highlights, so left verbatim here.
Everything else reflects your Q1–Q7 + #11 + #13 answers. Strip this comment before
promoting to cv.md.
-->

# Rikky Hermanto Hasibuan

Bali, Indonesia (Open to Global Relocation) · rikky.hermanto@gmail.com · +628123488851 · [linkedin.com/in/rhermanto](https://linkedin.com/in/rhermanto) · [github.com/rikky-hermanto](https://github.com/rikky-hermanto)

## About

Senior backend engineer, 10+ years in C#/.NET, and for the last year, building agentic LLM systems. Experienced in managing software projects, analyzing complex requirements, and designing adaptable software. Mostly .NET, but I go where the use case takes me — I've worked on client projects using GoLang, AWS Serverless Lambda and GCP, whatever the problem needed. My focus now is applied AI engineering. My foundation stays .NET backend and distributed systems — I'm not leaving it, I'm extending it into RAG pipelines, evaluation harnesses, LLM observability, and now agent orchestration.

Several times trusted as a team leader, yet I never stopped writing code — I'm hands-on every day, and I'm still genuinely open to a straight Software Engineer role when the stack is interesting. The title matters far less to me than what I get to build. Extensive experience with distributed teams across APAC (especially Australia). Open to global relocation or remote role, with APAC-aligned time zones.

## Key Skills

**Languages & Frameworks:** C#/.NET (10+ years, primary), ASP.NET Core, Python (FastAPI)

**AI-Assisted Development:** Cursor, Claude Code, Claude Cowork, Hermes Agent, GitHub Copilot as daily tooling; critical review and validation of AI-generated code for correctness, security, and maintainability before merge

**AI/LLM & RAG Engineering:** Multi-provider LLM abstraction (Anthropic Claude API, Gemini API) with structured extraction (tool use / JSON mode), 
grounded/cited prompt design, and deterministic pre-processing to cut token cost; 
RAG pipelines (OpenAI/Gemini embeddings, pgvector, chunking, cross-encoder re-ranking, metadata filtering, query routing); 
LLM evaluation (custom harnesses with golden-set fixtures, retrieval metrics — MRR, precision/recall —, RAGAS faithfulness via an independent LLM judge, adversarial test cases)

**Architecture & Integration:** Clean Architecture, Distributed Systems/Monoliths, Microservices (familiar), Serverless, Domain-Driven Design (familiar), CQRS, Event Sourcing (PoC); RESTful API, GraphQL, Event-Driven Systems (RabbitMQ, MassTransit, Azure Event Grid), WebSockets w/ SignalR, MediatR domain events, Hangfire/Quartz background jobs; FastAPI SSE streaming, Supabase Realtime

**Cloud & Infrastructure:** Azure (Functions, EventGrid, App Services, App Insights), 
AWS (EC2, RDS, DynamoDB, API Gateway, VPC, Load Balancer), Supabase (Storage, Auth, Webhooks), 
Git, Docker, CI/CD (Azure DevOps, GitHub Actions, Bitbucket Pipelines), Octopus

**Data & Storage:** PostgreSQL (incl. pgvector), MsSQL (SQL Server), MySQL, Marten, EF Core, Neo4j

**Observability & Testing:** Langfuse (cost, tokens, latency per call), OpenTelemetry with Grafana LGTM stack, Azure Application Insights, Datadog APM; TDD/BDD, xUnit, Moq/NSubstitute, pytest, Alba integration testing, Cypress e2e, eval-driven development for LLM

**Security & Identity:** Auth0, OpenID Connect / OAuth 2.0 (IdentityServer4), Supabase Auth, secure API development

**Frontend:** React + TypeScript + Tailwind, Vue.js, Angular

**Methodology:** Agile (Scrum/Kanban), iterative MVP delivery, continuous feedback

## Professional Experience

### Independent — Applied AI Engineering Focus
**Self-directed · Bali, Indonesia · Feb 2026 – Present**

- Building production LLM systems end-to-end on a personal finance platform: multi-provider extraction, RAG, eval harnesses, OpenTelemetry observability.
- Daily agentic development workflow — Claude Code, Claude Cowork, Hermes Agent, GitHub Copilot — reviewing and validating AI-generated code for correctness, security, and maintainability before merge.

### Technical Leader — Quartex Software (INX-K2fly)
**Resource Governance Software Services · Australian-based · Sep 2023 – Feb 2026**

- Joined as Senior Software Engineer; promoted to Tech Lead within a month due to performance and leadership capabilities.
- Led technical strategy and product development, aligning the team's efforts with quarterly planning objectives.
- Evaluated architectural trade-offs to determine scalable, maintainable, and cost-effective solutions. Reduced development costs from 9K/month to 6K/month, moving steadily toward the target of 2K/month.
- Proactively influenced product direction and technical roadmap, based on client needs evaluations led by the Product Owner, to shape a customer-focused roadmap and deliver impactful features, ensuring the product is usable, used, and useful.
- Participated in regular brainstorming sessions to explore architectural trade-offs and propose scalable backend solutions.
- Led product release, and co-implemented DevOps CI/CD enhancements to improve resource and time efficiency.
- Led optimization of Decipher's critical system modules — including IoT data pipelines processing millions of records — cutting load times by 85–98%.

### Technical Leader — Travlr
**Travel E-Commerce Platform · Australian-based · Jun 2021 – Sep 2022**

- Led Travlr Platform Team through the full development cycle using Agile methodologies, managing a team of 5–7 members.
- Defined tasks in alignment with company quarterly OKRs, ensured code quality through rigorous code reviews, and led scrum ceremonies.
- Developed a new CMS platform using OrchardCore, integrating features like multitenancy, 3rd-party integrations, and live custom CSS, which boosted the team's BAU productivity by 30–40%.
- Fostered a culture of collaborative brainstorming, customer-centric feature prioritization, and team mentorship.

### Technical Leader & Senior Backend Software Engineer — Devstack & Geekseat
**Software Development Services · Australian-based · Jul 2014 – Jan 2021**

- Led teams of 3–5 developers each through the entire software development life cycle, in each project.
- Provided formal solutions design, specification review, architecture, and standards to meet each specific client's needs.
- Built the Geekseat Core Framework, a shared foundation that cut boilerplate across new client projects.
- Provided guidance and mentorship to junior developers, enabling faster onboarding and upskilling.

### Backend Software Engineer — Praweda Informatika
**Software Development Services · Indonesian-based · Oct 2011 – Apr 2014**

- Maintained and enhanced the KSEI C-BEST Terminal (Central Depository and Book Entry Settlement System).

### Backend Software Engineer — Jatis Mobile
**Software Development Services · Indonesian-based · Sep 2009 – Apr 2011**

Developed middleware for enterprise and telco clients — Samsung, Djarum, Bukopin, KAI (Kereta Api), Esia — using Brew, PHP, Java, and the Facebook API.

## Selected Projects

### Personal Finance App — Gamified Financial Pyramid Platform · Personal Project · Oct 2024 – Present

A self-built personal finance platform that turns the five-tier Financial Pyramid (Foundations - Defense - Growth - Freedom - Legacy) into a scoring compass — showing where you stand and what to do next, instead of another budgeting spreadsheet. An event-driven scoring engine reads across transactions, assets, and investments, recalculating via MediatR domain events on every data mutation; six modules feed it: Journey (scoring, quests, achievements), Cashflow (hybrid CSV/LLM statement ingestion across 5 Indonesian banks), Assets, Investment, Trading Desk (risk gates + position sizing), and a RAG-backed financial chat. The AI layer runs against my own real financial data (4,400+ transactions), so wrong answers are immediately visible — every AI feature ships behind an offline eval suite (extraction F1, retrieval recall, RAGAS faithfulness, numeric accuracy) rather than vibes.

**Tech-stack:** .NET 10 (C# 13), ASP.NET Core Web API, Python FastAPI, PostgreSQL 17 + pgvector (Supabase: Auth, Storage, Realtime, Webhooks), Anthropic Claude + Gemini, RAG (hybrid BM25 + vector search, cross-encoder re-ranking, SSE streaming), OpenAI embeddings, LLM evaluation (RAGAS, golden-set harness), Clean Architecture, CQRS/MediatR, React 18 + TypeScript, Tailwind CSS, OpenTelemetry → Grafana LGTM (Prometheus, Loki, Tempo), Langfuse, Docker, Git, GitHub Actions, xUnit + Moq, pytest, Playwright, smolagents + LiteLLM (agent orchestration).

### Global Person Profile (GPP) – INX Cloud Identity Platform · Quartex Software K2Fly · Aug 2025 – Feb 2026

A cloud-native, multi-tenant identity platform unifying workforce profile across Quartex products. Enables SSO, MFA, fine-grained access control, and real-time compliance visibility through a centralized profile service.

**Tech-stack:** Auth0 (IAM, MFA, SSO), ASP.NET Core REST API (C#), AWS (VPC, API Gateway, EC2, RDS, Load Balancer), event-driven architecture with RabbitMQ, PostgreSQL (Marten + Entity Framework), Docker, Git, GitHub Actions CI/CD, Octopus Deploy, Pulumi (IaC), Datadog, Cypress, VueJS, Blazor (admin UI), LaunchDarkly (feature flags), SendGrid (notifications).

### Decipher Mining Software · Quartex Software K2Fly · Sep 2023 – Feb 2026

Multi-tenant tailings management software supporting mine rehabilitation and closure, safety decision-making, and Tailings Storage Facility governance risk mitigation. Focused on system reliability by implementing background recovery jobs, monitoring pipelines, and performance profiling.

**Tech-stack:** ASP.NET Core REST API (C# 11, .NET 7), Azure (App Service, Functions, EventGrid + Webhook, Storage — millions of IoT records, Application Insights), MS SQL, Auth0, Hangfire background jobs, Angular + Kendo UI, Google Earth Engine, Power BI, Git.

### Travlr Platform · Travlr · Jun 2021 – Sep 2022

A multi-tenant SaaS web application that offers white-labeling, building a travel e-commerce platform. Along with partners, co-created travel products and promoted offers related to partners' domain businesses. Has various partners like Nickelodeon's NickTravel, BBC's Discover Beyond, MTV's Travel, BaliBible, 10Travlr, many more.

**Tech-stack:** .NET Core (C#), distributed monolith architecture, RabbitMQ, GraphQL, REST API, Vue.js SPA, MySQL, Redis, Elasticsearch, AWS, Git, GitHub Actions CI/CD, Grafana + Elastic APM, OrchardCore, VirtoCommerce, Metabase, Google Analytics. Third-party integrations: Viator, Agoda, Expedia, Amadeus (travel inventory); Stripe, Humm, Forter (payments & fraud).

### Geekseat & Devstack Projects · 2014 – 2021

Led or contributed to a variety of backend platforms across many domains. Projects focused on scalable API design, cloud migration, secure authentication, and multi-platform integrations using modern development and architectural practices.

Projects:
- **iRealty Apps** – Real estate marketing tool with AWS Lambda integrations for third-party agent sync
- **Avmin Air Charter** – Aircraft bidding platform using SPA, DDD practice, SignalR push notifications, actor-based processing
- **MspCube** – Managed Service Provider platform built with secure OAuth 2.0-based authentication
- Additional platforms: **Qiik** (logistics and shipping management, Android/iOS), **Redbourne** (hospital case management, AngularJS), **Plexus Legal Gateway** (legal automation, VueJS + Python), **RentersCard** (property platform, ASP.NET MVC + background jobs)

**Tech-stack:** C#, ASP.NET Core, ASP.NET MVC, Python (Flask), Node.js, RESTful Web API, OAuth 2.0 / IdentityServer4, Domain-Driven Design, CQRS, BDD, SignalR, Akka.NET (actor model), background processing (Hangfire, Quartz), AWS Lambda, MS SQL Server, MySQL, Redis, Vue.js, AngularJS, Azure DevOps, Git, GitHub Actions.

### Research and Development · Geekseat · Jul 2014 – Oct 2018

- Developed proof-of-concept implementations for Event Sourcing using Event Store, also Reactive Actor Model using Akka.Net.
- Developed Geekseat Core Framework, a base building block for projects used in Geekseat.

### Bank Mandiri's Custodian Supporting Application · PT Praweda Ciptakarsa Informatika · Oct 2012 – Apr 2014

Developed Bank Mandiri's Custodian Supporting Application.

**Tech-stack:** C#, ASP.NET MVC, RabbitMQ + MassTransit (service bus, SAGA pattern), NHibernate, Oracle, Kendo MVC.

## Education

**Bachelor, Information System** · University of Indonesia · GPA 3.15 / 4.00

**Academic, Information System** · Institut Teknologi Del · GPA 3.31 / 4.00

## Involvement

**Mentorship, Chairman, & Voluntary**

- Mentored students at a local IT vocational high school in Bali, providing real-world insights into the professional software development lifecycle. *(2019)*
- Served as Chairman and Volunteer Teacher for IADEL Mengajar, a non-profit alumni organization dedicated to educating and empowering communities through technology and education. *(2013–2014)*
