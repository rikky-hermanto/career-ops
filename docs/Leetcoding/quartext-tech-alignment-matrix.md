# Tech Alignment Matrix

*By Drewan O'Brien · Updated Jan 09*

## Purpose

Purpose of this matrix is to align on our target state technologies across the portfolio. The matrix will show where we are already aligned, where we have plans to be aligned, or where we have accepted the misalignment we will record the rationale.

**Legend** (source used color-coding; text equivalents shown below since color isn't preserved in this conversion):

| Color | Meaning |
|---|---|
| 🟩 Green | Aligned |
| 🟧 Orange | Planning alignment |
| 🟥 Red | No plan for alignment, not accepted |
| 🟦 Blue | Not aligned but accepted |
| 🟪 Purple | Not applicable |

> **Note on this conversion:** the source PDF was a raw browser "print", not a proper Confluence "Export as PDF" (the file itself warns about this on its cover page). Its text layer interleaves cell values with inline page-link badges and wraps across page breaks, so a handful of cells required cross-referencing against the rendered table images and the rationale prose later in the doc. Cells I could not resolve with full confidence are flagged with `[?]`. Recommend spot-checking those against the live Confluence page.

## Matrix

| Category | Technology | Core | Identity | Preserve | Q-Safety | Sitepass | SAM | RD | Decipher | Infoscope |
|---|---|---|---|---|---|---|---|---|---|---|
| Core | C# .NET Core | .NET Framework Accepted | Yes | Yes | Yes | Java Accepted | .NET Framework Accepted | Yes | Yes | .NET Framework Accepted |
| Core | TypeScript | Javascript Accepted | Yes | Yes | Yes | Yes | Accepted – JavaScript | Yes | Yes | — |
| Core | Vue.js | WebForms/Razor/React Accepted | Yes | Yes | Yes | Angular Accepted | WebForms & Angular – Accepted | React – Accepted | Angular Accepted | Custom SPA – Accepted |
| Core | Ionic | React Native Accepted | N/A | Yes | Yes | React Native Accepted | Yes | N/A | PWA Accepted | N/A |
| CI/CD | GitHub (Source Control) | Azure DevOps – move to GitHub | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| CI/CD | GitHub Actions (Builds) | DevOps pipelines – move to GitHub | Yes | Yes | Yes | Yes | Accepted – builds would be easy to move from ADE but not something we want to do now due to opportunity cost | Azure DevOps Accepted | — | — |
| CI/CD | Octopus (Releases) | Yes | Yes | Yes | Yes | N/A | Yes | ADE Accepted | Azure DevOps Accepted | Artifacts package configured for each customer |
| CI/CD | Ionic AppFlow (Mobile Releases) | Yes | N/A | Yes | Yes | Expo Accepted | Yes | N/A | N/A | — |
| CI/CD | LaunchDarkly (Feature Flags) | Accepted – custom feature flag | Yes | Yes | Yes | Implement LD to enable feature flagging | Custom feature-flag implementation accepted | N/A – no requirements right now but would use in the future | Custom Accepted | Custom feature flag, managed in appsettings and code |
| Security | Snyk (SCA & SAST) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | — |
| Security | GitGuardian (Secrets Detection) | Setup once migrated to GitHub | Yes | Yes | Yes | Setup monitoring in GitGuardian | Enable for SAM repos | Enable for RD | Enable for Decipher | — |
| Security | StackHawk (DAST) | Implement nightly/weekly scans | Yes | Yes | Yes | Setup pipeline scans in StackHawk | Yes | Plan to integrate | Plan | — |
| Security | Vanta (Compliance) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | N/A | — |
| Security | Doppler (Secrets Management) | Octopus Accepted | Yes | Yes | Yes | N/A | N/A | N/A – uses Azure Key Vault for now, will move to Doppler for AWS | N/A | — |
| i18n | Crowdin (Translations) | Investigate if Crowdin can translate existing .resx files | Yes | Yes | Yes | Implement static translations with Crowdin | Implement static translations with Crowdin | Plan | Yes | — |
| i18n | Luxon (DateTime Library) | Moment.js accepted | Yes | Yes | Yes | Consider | DateFns Accepted | Plan – Moment.js right now, considering move to Luxon | Plan – Moment.js no longer supported, move to Luxon | — |
| i18n | NodaTime (DateTime Library) | DateTime accepted `[?]` | Yes | Yes | Yes | Consider | DateTime | N/A | DateTimeOffset | JodaTime Accepted `[?]` |
| Testing | xUnit (Unit Testing) | NUnit Accepted | Yes | Yes | Yes | N/A | NUnit Accepted | Yes | Yes | — |
| Testing | Alba (Integration Testing) | N/A | Yes | Yes | Yes | N/A | N/A | Accepted – using a Microsoft library for integration testing | Plan | Custom using xUnit + HttpClient; considering Alba |
| Testing | Cypress (e2e Testing) | Yes | Yes | Yes | Yes | Implement Cypress tests | Katalon accepted | Consider Cypress or Playwright | Katalon accepted | — |
| Testing | K6 (Performance Testing) | Yes | Setup K6 testing in pipeline | Setup K6 testing in pipeline | Setup K6 testing in pipeline | Setup K6 testing in pipeline | Setup K6 testing in pipeline | Setup K6 testing in pipeline | — | — |
| Testing | BrowserStack (Browser & Mobile Testing) | Yes | Yes | Yes | Yes | Yes | N/A | N/A | — | — |
| Messaging | MassTransit (Messaging Abstraction) | NServiceBus Accepted | Yes | Yes | Yes | N/A | N/A | — | Azure Event Grid Accepted | — |
| Messaging | CloudAMQP (RabbitMQ) | MSMQ Accepted | Yes | Yes | Yes | N/A | N/A | N/A | — | — |
| Infra | CDK (IaC) | Accepted | Yes | Yes | Yes | Terraform Accepted | — | Plan | Plan | — |
| Infra | Fargate (Containers) | N/A | Yes | Yes | Yes | EC2 ASG Accepted | — | Plan | Plan | — |
| Infra | Aurora (PaaS Database) | N/A | Yes | Yes | Yes | Yes | — | Plan | Plan | — |
| Infra | ElastiCache (PaaS Redis) | N/A | Yes | Yes | Yes | Yes | — | Plan | Plan | — |
| Infra | Bedrock (PaaS LLM) | N/A | N/A | N/A | Yes | N/A | — | Plan | Plan | — |
| Monitoring | Vantage (FinOps) | Yes | Yes | Yes | Yes | Yes | Yes | Issues with CSP subs not being accessible | N/A | — |
| Monitoring | Datadog (RUM, APM, Logs, SIEM) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Plan to move to DD | — |
| Monitoring | Jellyfish (Repo) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | — |
| Monitoring | Jellyfish (DORA) | Plan | Planning | Plan | Plan | Plan | Plan | Plan | Plan | Plan |
| Monitoring | Auth0 (Identity) | Yes | Yes | Yes | Yes | Migrate to Auth0; plan for cleanup and IaC `[?]` | — | Yes | Partial | Yes |
| SaaS | Transloadit (File Processing) | No virus scanning | N/A | Yes | Yes | GuardDuty Accepted | — | N/A (should align eventually) | Consider | — |
| SaaS | Canny (Release Notes/User Feedback) | N/A | Yes | Yes | Yes | ? | — | Plan | Consider | — |
| SaaS | Courier (Notifications) | N/A | Yes | Yes | Yes | Custom Accepted | — | N/A – customer creates custom email templates; no plans for SMS or push notifications | N/A | — |
| SaaS | Twilio (SMS) | Telstra Accepted | N/A | N/A | N/A | N/A | — | N/A | N/A | — |
| SaaS | SendGrid (Email Service) | Yes | Yes | Yes | Yes | SNS Accepted | — | Yes | Yes | — |
| SaaS | AG Grid | N/A | N/A | Yes | N/A | N/A | N/A | N/A | — | — |
| Data & Analytics | Elevio (Knowledge Base) | N/A | Yes | Yes | Yes | Yes | — | Consider | N/A | — |
| Data & Analytics | Google Maps | Yes | N/A | Yes | N/A | Yes | — | N/A | Google EE Accepted | — |
| Data & Analytics | Deepgram (Audio Transcription) | N/A | N/A | N/A | Yes | N/A | — | N/A | N/A | — |
| Data & Analytics | Meilisearch (AI Search) | N/A | N/A | N/A | Yes | N/A | — | Consider | N/A | — |
| Data & Analytics | Pendo (Product Analytics) | Need a plan to instrument key transactions in core | Yes | Integrate with Pendo | Integrate with Pendo | Integrate with Pendo | — | Yes | N/A | — |
| Data & Analytics | Metabase (Embedded Analytics) | N/A | N/A | N/A | Yes | N/A | — | N/A | N/A | — |
| Data & Analytics | Fivetran (Data Movement) | Yes | N/A | Implement data pipeline | Implement data pipeline | Implement data pipeline | — | Implement data pipeline (challenges expected: temporal tables, model configurability, team's schema understanding) | Implement data pipeline | — |
| Data & Analytics | DBT Cloud (Transformations) | Yes | N/A | Implement data pipeline | Implement data pipeline | Implement data pipeline | — | Implement data pipeline | Implement data pipeline | — |
| Data & Analytics | Snowflake (Data Warehouse) | Yes | N/A | Implement data pipeline | *(source PDF is cut off mid-row here)* | | | | | |

> Note: the document's table-of-contents also lists an **MTA** column/heading alongside RD, Decipher, and Infoscope, but no MTA data ever appears in the captured table (images and text alike stop at Infoscope) — likely a column that's off-screen in this export or not yet populated.

## Rationale detail (from the narrative section below the table)

**Core / .NET Framework Accepted** — Total cost to migrate Core from .NET Framework to .NET Core would be equivalent to a rewrite. For versions 4.5.2 and later, .NET Framework is treated as a component of the Windows operating system, so its support lifecycle is tied to the Windows OS version it's installed on. As long as the Windows OS version is supported, .NET Framework 4.8.1 (and earlier 4.8) will continue to be supported.

**Core / Javascript Accepted**, **Core / WebForms/Razor/React Accepted**, **Core / React Native Accepted** — TODO (not yet written).

**Sitepass / Java Accepted** — Sitepass was an acquisition. Rewriting to .NET doesn't make commercial sense.

**Sitepass / Angular Accepted**, **/ React Native Accepted**, **/ Expo Accepted**, **/ Terraform Accepted**, **/ EC2 ASG Accepted**, **/ SNS Accepted**, **/ GuardDuty Accepted** — TODO (not yet written).

**SAM / .NET Framework Accepted** — Total cost to migrate SAM from .NET Framework to .NET Core would be equivalent to a rewrite, as the entire SAM WebForms front end would need to be rewritten. Same OS-lifecycle reasoning as Core applies.

**RD / Decipher / Infoscope / MTA** — headings present in the doc's table of contents with no rationale text written under them yet.
