# Rikky Hermanto Hasibuan

📍 Bali (Open Global Relocation) · ✉️ rikky.hermanto@gmail.com · 📞 +628123488851 · [linkedin.com/in/rhermanto](https://linkedin.com/in/rhermanto)

---

## Summary

Backend Engineer (10+ years, distributed systems, event-driven architecture), now building AI/LLM systems. Designed and operates an end-to-end LLM pipeline on a personal-finance platform — structured extraction, RAG, grounded generation, and full observability — where every feature ships with an eval or a traced production run behind it. A firm believer that strong engineering fundamentals (clean architecture, testing discipline, root-cause debugging) are what separate production AI systems from throwaway prototypes. Trusted as a team/tech leader; adopts *Elastic Leadership*, adapting style to the team's maturity with the goal of an autonomous, self-organized team. Extensive experience with distributed teams across APAC (especially Australia). Open to global relocation or remote (APAC-aligned time zones) roles.

---

## Key Skills

- **AI/LLM Engineering:** Anthropic Claude API and Gemini API behind a multi-provider abstraction; structured extraction (tool use / JSON mode); prompt design for grounded, cited answers; deterministic pre-processing to cut token cost
- **RAG & Retrieval:** OpenAI/Gemini embeddings, pgvector, chunking, cross-encoder re-ranking, metadata filtering, query routing (LLM for language, SQL for numbers)
- **LLM Evaluation:** custom eval harnesses with golden-set fixtures, retrieval metrics (MRR, precision/recall), RAGAS faithfulness with an independent LLM judge, adversarial test cases
- **AI Observability:** Langfuse (cost, tokens, latency per call), OpenTelemetry with Grafana LGTM stack
- **Streaming & Realtime:** FastAPI SSE streaming, React chat UI, Supabase Realtime
- **Main programming languages:** C# .NET (10+ years, primary), Python FastAPI (live AI service, daily use), exploring Go
- **Architectural Approach and Practices:** Clean Architecture, Distributed Systems/Monoliths, Microservices (familiar), Serverless, Domain-Driven Design (familiar), CQRS, Event Sourcing (PoC)
- **Inter-process Communication:** RESTful API, GraphQL, Event-Driven Systems (RabbitMQ, MassTransit, Azure Event Grid), WebSockets w/ SignalR, Hangfire/Quartz background jobs, MediatR domain events
- **Cloud-Native Systems:** Azure (Functions, EventGrid, App Services, App Insights), AWS (EC2, RDS, DynamoDB, API Gateway, VPC, Load Balancer), Supabase (PostgreSQL + pgvector, Storage, Realtime, Auth, Webhooks)
- **Database Systems:** PostgreSQL (incl. pgvector), MsSQL, MySQL, Marten, EF Core, Neo4j
- **Testing:** TDD/BDD, xUnit, Moq/NSubstitute, pytest, Alba integration testing, Cypress e2e, eval-driven development for LLM features
- **Versioning, Configuration, Deployment:** Git, CI/CD (Azure DevOps, GitHub Actions, Bitbucket Pipelines), Octopus, Docker
- **Security:** Auth0, OpenID Connect / OAuth 2.0 (IdentityServer4), Supabase Auth, secure API development
- **Monitoring:** Langfuse, Azure Application Insights, Datadog APM, OpenTelemetry (traces/metrics/logs) with Grafana
- **Web-Presentation:** React + TypeScript + Tailwind, Vue JS, Angular
- **Development Methodologies:** Agile (Scrum/Kanban), iterative MVP delivery, continuous feedback

---

## Selected AI Engineering Work

### Personal Finance Platform — End-to-End LLM Pipeline · Personal Project · Oct 2024 – Present

A self-built personal finance platform that parses Indonesian bank statements with LLMs and gamifies the Financial Pyramid into a scoring compass toward financial freedom. The AI layer runs against my own real financial data (4,400+ transactions), so wrong answers are immediately visible — every feature below was evaluated or debugged against that live data.

**Numbers come from the database, not the model.** Caught the RAG chat fabricating spending totals during live testing. Redesigned the query path with intent routing: aggregate questions ("how much did I spend on food in April?") resolve to parametrized SQL, so the number always comes from Postgres and the LLM only handles the language around it. Verified against source spreadsheets to the rupiah.

**LLM extraction with a real eval harness.** Multi-provider structured extraction (Anthropic, Gemini) parses five banks' PDF and screenshot statements into transactions. Built a 20-fixture eval harness from real statements (including refund, FX, and multi-currency edge cases) scoring row-level F1 and field-level accuracy; Gemini 2.5 Flash scored 100% row F1 on the 15 fixtures run so far (remaining 5 pending an API quota reset). The live eval also caught a serialization bug that mocked unit tests had passed over.

**RAG measured, not assumed.** Embedded all transactions into pgvector and built a retrieval eval before trusting the results — which paid off twice: it exposed an index misconfiguration that was silently degrading retrieval (MRR@5 at 0.476; fixed to 1.000), and it showed that adding a cross-encoder re-ranker actually made results *worse* on the Indonesian-language corpus (an English-only re-ranker overriding a correct multilingual ranking) — measured, root-caused, rolled back. The final `/ask` endpoint answers with citations, drops any citation the LLM invents, and scores 0.90 mean RAGAS faithfulness — judged by an independent model, not the one that wrote the answer.

**Streaming and observability.** SSE token streaming to a React chat UI; Supabase Realtime replaced polling for upload status. Langfuse traces every LLM and embedding call — cost, tokens, latency, errors — on top of the existing OpenTelemetry + Grafana setup across the .NET and Python services.

**Technologies:** Python FastAPI, Anthropic Claude API, Gemini API, OpenAI embeddings, pgvector, RAGAS, Langfuse, Pydantic v2, C# ASP.NET Core (.NET 10), MediatR (CQRS + Domain Events), Supabase (PostgreSQL 17, Storage, Realtime), OpenTelemetry, Grafana LGTM, React 18 + TypeScript + Tailwind, Docker, GitHub Actions.

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
