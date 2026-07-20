# Rikky Hermanto Hasibuan

📍 Bali (Terbuka untuk Relokasi Global) · ✉️ rikky.hermanto@gmail.com · 📞 +628123488851 · [linkedin.com/in/rhermanto](https://linkedin.com/in/rhermanto)

---

## Ringkasan

Backend Engineer (10+ tahun, distributed systems, event-driven architecture), kini membangun sistem AI/LLM. Merancang dan mengoperasikan pipeline LLM end-to-end pada platform keuangan pribadi — structured extraction, RAG, grounded generation, dan observability penuh — di mana setiap fitur dirilis dengan dukungan eval atau traced production run di baliknya.

Meyakini bahwa fondasi engineering yang kuat (clean architecture, disiplin testing, root-cause debugging) adalah kunci agar sistem — termasuk sistem AI — cukup andal untuk dipercaya. Dipercaya sebagai team/tech leader; menerapkan Elastic Leadership, menyesuaikan gaya kepemimpinan dengan tingkat kematangan tim demi terbentuknya tim yang mandiri dan self-organized. Berpengalaman luas bekerja dengan tim terdistribusi di kawasan APAC (terutama Australia). Terbuka untuk relokasi global maupun peran remote (zona waktu APAC).

> *(SESUAIKAN DENGAN PERAN YANG DITUJU — tonjolkan sisi AI/LLM Integration untuk peran AI; tonjolkan Elastic Leadership + promosi di Quartex untuk peran Tech Lead/EM; tonjolkan kedalaman distributed-systems/observability untuk peran Platform/Cloud-Native. Lihat `config/profile.yml` → `target_roles.archetypes` dan `modes/_profile.md` → "Your Adaptive Framing" untuk pemetaan lengkapnya.)*

---

## Keahlian Utama

- **Bahasa pemrograman utama:** C# .NET (10+ tahun, utama), Python FastAPI (layanan AI live, digunakan setiap hari)
- **AI/LLM Engineering:** Anthropic Claude API dan Gemini API di balik abstraksi multi-provider; structured extraction (tool use / JSON mode); prompt design untuk jawaban yang grounded dan bersitasi; pre-processing deterministik untuk memangkas biaya token
- **RAG & Retrieval:** OpenAI/Gemini embeddings, pgvector, chunking, cross-encoder re-ranking, metadata filtering, query routing (LLM untuk bahasa, SQL untuk angka)
- **LLM Evaluation:** eval harness kustom dengan golden-set fixtures, metrik retrieval (MRR, precision/recall), RAGAS faithfulness dengan LLM judge independen, adversarial test cases
- **AI Observability:** Langfuse (biaya, token, latensi per panggilan), OpenTelemetry dengan Grafana LGTM stack
- **Streaming & Realtime:** FastAPI SSE streaming, React chat UI, Supabase Realtime
- **Pendekatan & Praktik Arsitektur:** Clean Architecture, Distributed Systems/Monoliths, Microservices (familiar), Serverless, Domain-Driven Design (familiar), CQRS, Event Sourcing (PoC)
- **Komunikasi Antar-Proses:** RESTful API, GraphQL, Event-Driven Systems (RabbitMQ, MassTransit, Azure Event Grid), WebSockets dengan SignalR, background job Hangfire/Quartz, MediatR domain events
- **Cloud-Native Systems:** Azure (Functions, EventGrid, App Services, App Insights), AWS (EC2, RDS, DynamoDB, API Gateway, VPC, Load Balancer), Supabase (PostgreSQL + pgvector, Storage, Realtime, Auth, Webhooks)
- **Sistem Basis Data:** PostgreSQL (termasuk pgvector), MsSQL, MySQL, Marten, EF Core, Neo4j
- **Testing:** TDD/BDD, xUnit, Moq/NSubstitute, pytest, integration testing dengan Alba, Cypress e2e, eval-driven development untuk LLM
- **Versioning, Konfigurasi, Deployment:** Git, CI/CD (Azure DevOps, GitHub Actions, Bitbucket Pipelines), Octopus, Docker
- **Keamanan:** Auth0, OpenID Connect / OAuth 2.0 (IdentityServer4), Supabase Auth, pengembangan API yang aman
- **Monitoring:** Langfuse, Azure Application Insights, Datadog APM, OpenTelemetry (traces/metrics/logs) dengan Grafana
- **Web-Presentation:** React + TypeScript + Tailwind, Vue JS, Angular
- **Metodologi Pengembangan:** Agile (Scrum/Kanban), pengiriman MVP secara iteratif, umpan balik berkelanjutan

> *(Urutkan ulang/pangkas sesuai JD — ini adalah superset lengkapnya. Letakkan AI/LLM Engineering, RAG & Retrieval, dan LLM Evaluation di urutan awal untuk peran AI/LLM; letakkan Pendekatan Arsitektur, Komunikasi Antar-Proses, dan Cloud-Native di awal untuk peran Platform/Backend atau Tech Lead.)*

---

## Pengalaman Profesional

### Technical Leader

*Quartex Software (INX-K2fly) · Layanan Perangkat Lunak Resource Governance · Perusahaan berbasis di Australia · Sep 2023 – Feb 2026*

- Bergabung sebagai Senior Software Engineer; dipromosikan menjadi Tech Lead dalam waktu satu bulan berkat performa dan kapabilitas kepemimpinan.
- Memimpin strategi teknis dan pengembangan produk, menyelaraskan upaya tim dengan sasaran perencanaan kuartalan.
- Mengevaluasi trade-off arsitektur untuk menentukan solusi yang scalable, maintainable, dan hemat biaya. Menurunkan biaya pengembangan dari **9K/bulan** menjadi **6K/bulan**, dan terus bergerak menuju target **2K/bulan**.
- Secara proaktif memengaruhi arah produk dan roadmap teknis, berdasarkan evaluasi kebutuhan klien yang dipimpin Product Owner, untuk membentuk roadmap yang berfokus pada pelanggan dan menghadirkan fitur berdampak — memastikan produk usable, digunakan, dan bermanfaat.
- Berpartisipasi rutin dalam sesi brainstorming untuk mengeksplorasi trade-off arsitektur dan mengusulkan solusi backend yang scalable.
- Memimpin rilis produk, serta ikut mengimplementasikan peningkatan DevOps CI/CD untuk efisiensi sumber daya dan waktu.
- Memimpin optimasi modul-modul sistem kritis, meningkatkan performa load sebesar 85–98% pada modul-modul tersebut.

### Technical Leader

*Travlr · Platform E-Commerce Travel · Perusahaan berbasis di Australia · Jun 2021 - Sep 2022*

- Memimpin Travlr Platform Team melewati siklus pengembangan penuh dengan metodologi Agile, mengelola tim beranggotakan 5–7 orang.
- Mendefinisikan tugas selaras dengan OKR kuartalan perusahaan, memastikan kualitas kode melalui review yang ketat, dan memimpin scrum ceremonies.
- Mengembangkan platform CMS baru menggunakan OrchardCore — dengan fitur multitenancy, integrasi pihak ketiga, dan live custom CSS — yang meningkatkan produktivitas BAU tim sebesar 30–40%.
- Menumbuhkan budaya brainstorming kolaboratif, prioritisasi fitur yang berorientasi pelanggan, dan mentorship dalam tim.
- Berhasil merilis platform travel besar, termasuk BBC Discover Beyond, MTV Travel, dan Nickelodeon Travel.

### Technical Leader & Senior Backend Software Engineer

*Devstack & Geekseat · Layanan Pengembangan Perangkat Lunak · Perusahaan berbasis di Australia · Jul 2014 - Jan 2021*

- Memimpin tim beranggotakan 3–5 developer melewati seluruh siklus pengembangan perangkat lunak pada setiap proyek.
- Menyusun solutions design formal, review spesifikasi, arsitektur, dan standar sesuai kebutuhan spesifik setiap klien.
- Mengembangkan Geekseat Core Framework, fondasi dasar bagi proyek-proyek kami, yang secara signifikan mempercepat proses pengembangan dengan menghilangkan pekerjaan berulang dan boilerplate code di setiap proyek baru.
- Memberikan bimbingan dan mentorship kepada junior developer, mempercepat onboarding dan peningkatan keterampilan.

### Backend Software Engineer

*Praweda Informatika · Layanan Pengembangan Perangkat Lunak · Perusahaan Indonesia · Okt 2011 - Apr 2014*

- Mengembangkan Custodian Supporting Application untuk Bank Mandiri (C#, ASP.NET MVC, NHibernate, MassTransit/RabbitMQ, pola SAGA, Oracle).
- Memelihara dan menyempurnakan KSEI C-BEST Terminal (Central Depository and Book Entry Settlement System).

### Backend Software Engineer

*Jatis Mobile · Layanan Pengembangan Perangkat Lunak · Perusahaan Indonesia · Sep 2009 - Apr 2011*

Mengembangkan middleware untuk berbagai klien, di antaranya SAMSUNG e-Reading untuk Galaxy Tab, Device Portal Soccer Mobile (BOLA), Djarum Indonesia Open 2010, KABILA (KAI - KERETA API), Android Bukopin Catalogue, dan Facebook Mobile untuk Esia Phone menggunakan Brew - PHP - Java - Facebook API.

---

## Proyek Pilihan

> *(Pilih 3–5 proyek yang paling relevan per JD. Personal Finance App adalah bukti AI/LLM terkuat; GPP + Decipher di urutan awal untuk sudut pandang Tech Lead/Platform-Cloud-Native.)*

### Aplikasi Keuangan Pribadi · Proyek Pribadi · Okt 2024 - Sekarang

Platform keuangan pribadi yang dibangun sendiri, mem-parsing rekening koran bank-bank Indonesia menggunakan LLM dan menggamifikasi Piramida Keuangan menjadi kompas skor menuju kebebasan finansial. Lapisan AI-nya berjalan di atas data keuangan riil milik saya sendiri (4.400+ transaksi), sehingga jawaban yang salah langsung terlihat — setiap fitur di bawah ini dievaluasi atau di-debug terhadap data live tersebut.

- **LLM extraction, berbasis eval:** ekstraksi multi-provider (Anthropic, Gemini) mem-parsing rekening koran PDF/screenshot dari lima bank; eval harness yang dibangun dari rekening koran asli menilai setiap perubahan, dan menemukan bug yang lolos dari unit test ber-mock.
- **RAG yang tidak menghalusinasikan angka:** menangkap chat yang mengarang total pengeluaran; mengalihkan pertanyaan agregat ke SQL sehingga angka selalu berasal dari Postgres — LLM hanya menangani bahasa. Jawaban `/ask` grounded dengan sitasi, dinilai faithfulness-nya oleh LLM judge independen.
- **Retrieval diukur, bukan diasumsikan:** eval retrieval mengungkap kesalahan konfigurasi index pgvector yang diam-diam menurunkan kualitas hasil, dan menunjukkan bahwa cross-encoder re-ranker justru memperburuk retrieval berbahasa Indonesia — di-root-cause lalu di-rollback.
- **Observability AI penuh:** Langfuse pada setiap panggilan LLM/embedding (biaya, token, latensi) di atas OpenTelemetry + Grafana; chat UI dengan SSE streaming.
- **Arah pengembangan saat ini:** mengevolusikannya menjadi penasihat keuangan agentic — agen tool-calling dengan reasoning yang dapat ditelusuri, workflow multi-langkah yang stateful (LangGraph), dan MCP server yang mengekspos data keuangan sebagai tools.

**Teknologi:** Python FastAPI, Anthropic Claude API, Gemini API, OpenAI embeddings, pgvector, RAGAS, Langfuse, Pydantic v2, C# ASP.NET Core (.NET 10), MediatR (CQRS + Domain Events), Supabase (PostgreSQL 17, Storage, Realtime), OpenTelemetry, Grafana LGTM, React 18 + TypeScript + Tailwind, Docker, GitHub Actions.

### Global Person Profile (GPP) – INX Cloud Identity Platform · Quartex Software K2Fly · Sep 2023 - Feb 2026

Platform identitas cloud-native multi-tenant yang menyatukan profil tenaga kerja di seluruh produk Quartex. Memungkinkan SSO, MFA, kontrol akses berbutir halus (fine-grained), dan visibilitas kepatuhan secara real-time melalui layanan profil terpusat.

**Teknologi yang Digunakan:** Auth0 (IAM, MFA), arsitektur event-driven dengan RabbitMQ, AWS (VPC, API Gateway, EC2, RDS, Load Balancer), Marten (PostgreSQL) + Entity Framework, ASP.NET Core REST API, Pulumi (IaC), Blazor (admin UI), Docker Containers, GitHub Actions CI/CD, VueJS, Cypress, Octopus Deploy, Datadog, SendGrid/Twilio, Courier, feature flagging dengan LaunchDarkly.

### Decipher Mining Software · Quartex Software K2Fly · Sep 2023 - Feb 2026

Perangkat lunak manajemen tailings untuk mendukung rehabilitasi dan penutupan tambang, memperkuat pengambilan keputusan keselamatan, dan memitigasi risiko tata kelola Tailings Storage Facility. Berfokus pada keandalan sistem melalui implementasi background recovery jobs, monitoring pipelines, dan performance profiling.

**Teknologi yang Digunakan:** Azure Platform (App Service, Azure Storage untuk menyimpan jutaan data IoT, Azure Functions, EventGrid), ASP.NET API (C# 11, .NET 7), Hangfire Background Jobs, MS SQL, Google Earth Engine, Azure App Insights, Power BI, Angular, Kendo UI, RESTful API, Auth0, Git (Bitbucket).

### Travlr Platform · Travlr · Jun 2021 - Sep 2022

Aplikasi web SaaS multi-tenant dengan kemampuan white-labeling untuk membangun platform e-commerce travel. Bersama para mitra, ikut menciptakan produk travel dan penawaran promosi yang relevan dengan bisnis masing-masing mitra. Memiliki beragam mitra seperti NickTravel milik Nickelodeon, Discover Beyond milik BBC, MTV Travel, BaliBible, 10Travlr, dan banyak lagi.

**Teknologi yang Digunakan:** .NET Core, C#, arsitektur Distributed Monoliths, RabbitMQ, OrchardCore, VirtoCommerce, SPA VueJS (sebagian ASP MVC), GraphQL, MySQL, Redis Cache, Elasticsearch, Elastic APM, Metabase, Google Analytics. Git untuk manajemen source code, GitHub Actions (sebelumnya Jenkins) untuk CI/CD. Layanan AWS, Grafana dan Elastic APM untuk memantau sistem produksi dan menelusuri bottleneck performa. Terintegrasi dengan produk pihak ketiga seperti Viator, Agoda, Expedia, Hero, dan Amadeus, serta payment gateway pihak ketiga seperti Stripe, Humm, Forter, TCN, dan banyak lagi.

### Proyek Geekseat & Devstack · 2014 - 2021

Memimpin atau berkontribusi pada beragam platform backend di bidang logistik, kesehatan, otomasi hukum, real estat, dan IT enterprise. Proyek-proyek berfokus pada desain API yang scalable, migrasi cloud, autentikasi yang aman, dan integrasi multi-platform dengan praktik pengembangan dan arsitektur modern.

**Proyek Representatif:**

- **Qiik** – Sistem manajemen logistik dan pengiriman dengan frontend Android/iOS, REST API, dan dashboard pelaporan
- **Redbourne (Redicase)** – Platform manajemen kasus rumah sakit dengan Web API modular dan frontend AngularJS
- **Plexus Legal Gateway** – Sistem otomasi hukum dengan pembuatan dokumen dinamis menggunakan VueJS dan Python
- **iRealty Apps** – Perangkat pemasaran real estat dengan integrasi AWS Lambda untuk sinkronisasi agen pihak ketiga
- **MspCube** – Platform Managed Service Provider dengan autentikasi aman berbasis OAuth 2.0
- **Avmin Air Charter** – Platform lelang pesawat dengan SPA, praktik DDD, push notification SignalR, dan pemrosesan berbasis actor
- **RentersCard** – Platform properti online dengan ASP.NET MVC, penanganan background job, dan integrasi Windows service

**Teknologi yang Digunakan:**

- **Bahasa dan Framework:** C#, ASP.NET Core, ASP.NET MVC (hingga 5.2), .NET 4.x, Python (Flask), Node.js, Vue.js
- **Arsitektur dan Integrasi:** RESTful Web API, OAuth 2.0 (IdentityServer4), Domain-Driven Design (DDD), BDD, SignalR, Actor Model (Akka.NET), Microservices (familiar), Background Processing (Quartz, Hangfire), CQRS
- **Basis Data dan Messaging:** Microsoft SQL Server, MySQL, Redis
- **Frontend dan UI:** AngularJS, Angular Material, Telerik Kendo UI, Vue.js, jQuery, Bootstrap, SPA
- **DevOps dan Tooling:** Git, Bitbucket, SourceTree, Azure DevOps, GitHub Actions, AutoMapper, MailKit, StructureMap

### Riset dan Pengembangan · Geekseat · Juli 2014 - Oktober 2018

- Mengembangkan implementasi proof-of-concept untuk Event Sourcing menggunakan Event Store, serta Reactive Actor Model menggunakan Akka .Net.
- Mengembangkan Geekseat Core Framework, fondasi dasar bagi proyek-proyek di Geekseat.

### Custodian Supporting Application Bank MANDIRI · PT Praweda Ciptakarsa Informatika · Oktober 2012 - April 2014

Mengembangkan Custodian Supporting Application untuk Bank MANDIRI. Tech-stack: C#, ASP.NET MVC, NHibernate, Messages (Service Bus, MassTransit, RabbitMQ), pola SAGA, Kendo MVC, Oracle, ORM (ODAC).

---

## Pendidikan

- **Sarjana, Sistem Informasi** — Universitas Indonesia · IPK 3,15 dari 4,00
- **Akademik, Sistem Informasi** — Institut Teknologi Del · IPK 3,31 dari 4,00

---

## Keterlibatan

**Mentorship, Ketua, & Kerelawanan**

- Aktif memberikan mentorship kepada individu yang tertarik belajar coding dan pengembangan perangkat lunak.
- Membimbing siswa di sebuah SMK IT lokal di Bali, memberikan wawasan dunia nyata tentang siklus pengembangan perangkat lunak profesional. (2019)
- Menjabat sebagai Ketua sekaligus Guru Relawan di IADEL Mengajar, organisasi alumni nirlaba yang berdedikasi mendidik dan memberdayakan masyarakat melalui teknologi dan pendidikan. (2013-2014)
- Anggota aktif komunitas Bali Dog Lovers, berpartisipasi dalam penyelamatan, sterilisasi, dan vaksinasi anjing-anjing yang membutuhkan. (2020 - sekarang)
