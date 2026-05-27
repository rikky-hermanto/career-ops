# AI Engineering Pivot — 30/60/90 Day Learning Path

**Goal:** Backend Engineer → AI Engineering / Backend AI Engineering
**Target companies:** Async-first fully remote (Grafana, Supabase, GitLab, PostHog, WorkOS, 1Password archetype)
**Primary proof point:** Personal Finance Platform (`C:\workspaces\personal-finance`)

---

## Why This Order

The sequencing is deliberate:
1. **Observability first** — you need real numbers before anything else. Numbers unlock every other story.
2. **Eval second** — hiring managers will ask "how do you know your extraction is correct?" You need an answer.
3. **Frameworks third** — LangChain/LangGraph is learnable fast. But learning it before you have a project to apply it to is wasteful.
4. **RAG fourth** — builds on the eval foundation. You need eval to know if your RAG retrieval is any good.
5. **Public proof fifth** — a blog post with your benchmark numbers is worth more than a cert alone.
6. **Certification last** — signal booster, not the foundation. Never cert-first.

---

## Phase 1 — Close Critical Gaps (Days 1–30)

### Week 1: AI Observability + Real Metrics
**Theme:** You can't quote numbers you haven't measured.

**Why it matters:** Every AI Eng interview will ask "how do you monitor your LLM in production?" You have OTel — but no AI-specific layer. Adding Langfuse gives you: per-call cost, latency, prompt versioning, accuracy trending. After this week, you can quote: "extraction costs $0.0X per document, p95 latency is Xms."

**Tasks:**
- Add [Langfuse](https://langfuse.com) SDK to `services/ai-service` (Python) — 1-2 hours
- Wrap existing Anthropic and Gemini calls with Langfuse tracing
- Create a Langfuse dashboard showing: cost/day, calls/day, latency distribution, error rate
- Extract p50/p95 latency and average cost-per-doc from OTel + Langfuse
- Document 3 concrete numbers in `article-digest.md`

**Definition of done:** You can say "my extraction pipeline costs $X per document and runs in Xms p95" with a dashboard screenshot to back it up.

**Resources:**
- Langfuse Python SDK: https://langfuse.com/docs/sdk/python
- Langfuse self-hosted (Docker): works with your existing Docker Compose setup
- OTel + Langfuse integration: https://langfuse.com/docs/opentelemetry

---

### Week 2: LLM Evaluation Framework
**Theme:** Know your accuracy. Own your benchmark.

**Why it matters:** "How do you know your extraction is correct?" is a top-3 AI Eng interview question. Right now the answer is "we check manually." After this week, the answer is "we have an eval harness with 20 fixtures, measured at 92% field-level accuracy, with Gemini 38% cheaper on structured extraction workloads."

**Tasks:**
- Create `services/ai-service/evals/` directory
- Collect 20 real (anonymized) bank statement samples — CSV, PDF, screenshot variants
- Write expected output JSON for each (ground truth)
- Build `eval_extraction.py`: runs both providers on all fixtures, computes accuracy per field
- Capture: field-level accuracy %, cost per doc, latency per doc, error rate
- Run benchmark: Gemini 2.5 Flash vs Claude Sonnet 4.6
- Write findings as a table in `docs/eval-results.md`

**Definition of done:** `python eval_extraction.py` runs cleanly, outputs a benchmark table, numbers are documented.

**Resources:**
- No external framework needed yet — custom eval is actually *better* for interviews (you designed it)
- RAGAS (for future RAG eval): https://docs.ragas.io
- Promptfoo (alternative eval runner): https://www.promptfoo.dev

---

### Week 3: Agentic Frameworks Entry
**Theme:** Learn the vocabulary. Build the first agent.

**Why it matters:** "LangChain", "LangGraph", "agentic" appear in ~60% of AI Eng JDs. You don't need to be an expert — but you need to have built something with it. This week's output: a working LangGraph proof-of-concept wired into personal-finance.

**Tasks:**
- Complete DeepLearning.AI "LangChain for LLM Application Development" (free, ~4 hours): https://learn.deeplearning.ai/langchain
- Complete "Functions, Tools and Agents with LangChain" (free, ~3 hours): https://learn.deeplearning.ai/functions-tools-agents-langchain
- Build a simple LangGraph agent: "Transaction Categorizer Agent"
  - Input: uncategorized transaction description
  - Tools: search existing rules, lookup similar transactions, suggest category
  - Output: suggested category + confidence
  - Wire to personal-finance AI service as an optional endpoint

**Definition of done:** LangGraph agent runs end-to-end on 5 test transactions, is reachable via API endpoint.

**Resources:**
- LangGraph quickstart: https://langchain-ai.github.io/langgraph/tutorials/introduction/
- "Build Your First Agent" (LangGraph): https://langchain-ai.github.io/langgraph/tutorials/get-started/
- DeepLearning.AI course catalog: https://learn.deeplearning.ai (filter "free")

---

### Week 4: Demo + Documentation
**Theme:** Package what you've built. Make it showable.

**Why it matters:** A project that can't be demoed in 2 minutes doesn't exist in a recruiter's mind. This week turns your work into interview assets.

**Tasks:**
- Record a 2-minute Loom video (script below)
- Write a one-pager case study (`docs/case-study.md`)
- Update `cv.md` with new metrics (Langfuse numbers, eval results)
- Update `article-digest.md` with all proof points captured so far
- Run `/career-ops pdf` to regenerate CV with updated metrics

**Loom script (2 min):**
1. (0:00–0:30) Show upload flow: drag a BCA PDF → extraction starts → transactions appear with categories
2. (0:30–1:00) Show Financial Journey page: point to pyramid scores, Living Garden animation
3. (1:00–1:30) Open Grafana/Langfuse: show the trace for that exact extraction call — cost, latency, token count
4. (1:30–2:00) Show eval results table: "92% accuracy, Gemini 38% cheaper for this workload"

**Case study one-pager structure:**
- Problem: Indonesian bank statements in 5+ formats, CSV + PDF + screenshots
- Key decision: `tool_use` over JSON mode (why — schema validated server-side)
- Cost optimization: PyMuPDF pre-processing → 40–60% token reduction
- Reliability: three-tier dedup (why three tiers, what each tier catches)
- Results: {numbers from weeks 1-2}

**Definition of done:** Loom is recorded and linked in GitHub README. Case study is in the repo. CV is updated.

---

## Phase 2 — Agentic + RAG Proof (Days 31–60)

### Week 5–6: Full RAG Pipeline
**Theme:** Ship "Ask your finances." Build a real RAG system.

**Why it matters:** RAG is the #1 applied AI skill in the market right now. pgvector is in your schema — this is a 2-week build, not a 2-month one. After this, you've moved from "LLM extraction tool" to "conversational financial assistant with semantic retrieval."

**Tasks:**
- Choose embedding model: `text-embedding-3-small` (OpenAI, cost ~$0.02/1M tokens) or `nomic-embed-text` (Ollama, free/local)
- Embed transactions on insert: add embedding step to the upload pipeline
- Build retrieval endpoint: pgvector cosine similarity search on the `embeddings` table
- Add reranker: Cohere Rerank API (free tier) or FlashRank (local, free)
- Build chat UI in React: simple message box on the `/chat` route
- FastAPI streaming endpoint: return response via SSE from the RAG chain
- Measure retrieval quality: MRR on 10 handwritten test queries

**Agentic architecture to implement:**
```
User question → Embed question → pgvector search (top-10) → Rerank (top-3) → LLM synthesis → Stream response
```

**Definition of done:** Ask "how much did I spend on food in March?" and get a correct, cited answer streamed to the UI.

**Resources:**
- pgvector + Python: https://github.com/pgvector/pgvector-python
- Cohere Rerank free tier: https://cohere.com/rerank
- FlashRank (local reranker): https://github.com/PrithivirajDamodaran/FlashRank
- LangGraph RAG tutorial: https://langchain-ai.github.io/langgraph/tutorials/rag/langgraph_self_rag/

---

### Week 7: Streaming + Advanced Patterns
**Theme:** Production streaming. A pattern every AI Eng role needs.

**Why it matters:** Every modern AI product streams. Knowing how to implement SSE in FastAPI + consume in React is a concrete technical differentiator. This also replaces your current polling-based upload status — a real improvement.

**Tasks:**
- Implement SSE streaming in FastAPI for the chat endpoint (`StreamingResponse` + `EventSourceResponse`)
- Implement chunked streaming in React (EventSource API or `@microsoft/fetch-event-source`)
- Replace polling-based upload status with Supabase Realtime subscription
- Add token streaming: show LLM response word-by-word as it arrives
- Test streaming under load: verify no buffering, proper error handling for dropped connections

**Definition of done:** Chat streams token-by-token in the UI. Upload status updates in real-time without polling.

**Resources:**
- FastAPI SSE: https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse
- `sse-starlette`: https://github.com/sysid/sse-starlette (cleaner SSE in FastAPI)
- Supabase Realtime Python: https://supabase.com/docs/guides/realtime

---

### Week 8: LangGraph Multi-Agent
**Theme:** Build a real agent. Handle state. Handle failures.

**Why it matters:** "Agentic systems" is the hardest gap to close on paper — it requires having built one. After this week, you have a multi-step agent with tool use, conditional routing, and state management. That's a real AI Eng credential.

**Tasks:**
- Design the "Financial Health Advisor" agent:
  - State: user's pyramid scores, recent transactions, asked question
  - Tools: `get_cashflow_summary`, `get_pyramid_scores`, `get_spending_by_category`, `get_investment_summary`
  - Graph: analyze → identify gaps → generate recommendations → optionally drill down
- Implement with LangGraph, wired to personal-finance data layer
- Add proper error handling: tool failures don't crash the agent, they route to a fallback
- Implement conversation memory: agent remembers context within a session
- Write 5 test scenarios with expected agent behavior

**Definition of done:** Agent correctly responds to "I want to improve my financial health, where should I start?" with a personalized, tool-grounded recommendation.

---

## Phase 3 — Positioning + Active Hunt (Days 61–90)

### Week 9–10: Public Presence + Certification
**Theme:** Make your work findable. Get the credential if the ROI is there.

**Tasks:**
- Write and publish technical blog post:
  - Title: "Building a Production LLM Pipeline for Indonesian Bank Statement Parsing"
  - Platform: dev.to (free, good SEO) or personal blog
  - Content: tool_use vs JSON mode decision, three-tier dedup, PyMuPDF cost optimization, eval results
  - Include: benchmark table (Gemini vs Claude, accuracy vs cost), architecture diagram
  - This is public proof that your personal project has real engineering depth
- **Certification (choose one):**
  - **Databricks Generative AI Engineer Associate** (~$200, ~2 weeks study): covers RAG, LLM evaluation, deployment, guardrails — highest signal for AI Eng roles
  - **Azure AI Engineer Associate (AI-102)** (~$165, ~2 weeks study): covers Azure OpenAI, AI Search (RAG on Azure), Cognitive Services — good if targeting Azure-stack companies; builds on your existing Azure depth
- Update LinkedIn:
  - Headline: "Backend Engineer → AI Engineering | LLM Pipelines · RAG · Agentic Systems | Python · .NET"
  - About section: lead with the AI narrative, link the blog post and GitHub

**Definition of done:** Blog post is live and linked in GitHub. Cert exam passed or scheduled. LinkedIn updated.

---

### Week 11: Interview Prep
**Theme:** Translate your work into interview-ready stories.

**Tasks:**
- Write 5 STAR+R stories from personal-finance (use `/career-ops interview-prep` for structure):
  1. tool_use vs JSON mode decision (architecture trade-off)
  2. Three-tier dedup design (reliability engineering)
  3. PyMuPDF cost optimization (cost-conscious AI engineering)
  4. Multi-provider factory (extensibility trade-off)
  5. RAG pipeline design (retrieval + evaluation)
- Prepare 3 deep-dive explanations (5-min each):
  - "Explain your extraction pipeline"
  - "How do you evaluate LLM accuracy in production?"
  - "Walk me through your RAG architecture"
- Practice: record yourself on Loom delivering each one. Watch it back. Cut the filler.
- Prep answers for common AI Eng screen questions:
  - "What's the difference between RAG and fine-tuning? When do you use each?"
  - "How do you handle hallucinations in production?"
  - "How do you keep LLM costs under control at scale?"

**Definition of done:** 5 stories written. 3 deep-dives rehearsed and timed. Common Q&A answers prepared.

---

### Week 12: Active Applications
**Theme:** Ship applications like you ship code — deliberate, not spam.

**Tasks:**
- Run `/career-ops scan` targeting AI Engineering roles specifically
- Filter for async-first / fully remote companies (Grafana, Supabase, PostHog, GitLab, WorkOS, 1Password, Planetscale, Neon, Turso, Qdrant, Weaviate, LangChain, etc.)
- Evaluate each with `/career-ops offer` — only apply to 4.0+ scores
- Target: 5-10 high-fit applications, not 50 generic ones
- For each application: generate tailored CV with `/career-ops pdf`, write cover letter, run `/career-ops contact` for LinkedIn outreach
- Engage in AI Eng communities: Latent Space Discord, AI Engineer Foundation, LangChain Discord

**Definition of done:** 5+ applications sent to 4.0+ score roles. Follow-up cadence set in `/career-ops followup`.

---

## Certification Guide

### Tier 1 — Do These (Free, High Signal)

| Course | Provider | Time | Why |
|---|---|---|---|
| LangChain for LLM Application Development | DeepLearning.AI | 4h | LangChain foundation — Week 3 |
| Functions, Tools and Agents with LangChain | DeepLearning.AI | 3h | Tool use + agents — Week 3 |
| Building Agentic RAG with LlamaIndex | DeepLearning.AI | 3h | RAG + agents — Week 5 |
| Generative AI with Large Language Models | Coursera/DeepLearning.AI | 16h | LLM fundamentals + deployment — Week 1-2 background |
| LangGraph: Multi-Agent Workflows | DeepLearning.AI | 3h | LangGraph deep dive — Week 8 |

### Tier 2 — Pick One (Paid, High Signal)

| Cert | Cost | Study | Signal | Best for |
|---|---|---|---|---|
| Databricks GenAI Engineer Associate | ~$200 | 2 weeks | ⭐⭐⭐ | AI Eng roles at data-forward companies |
| Azure AI Engineer Associate (AI-102) | ~$165 | 2 weeks | ⭐⭐⭐ | Azure-stack companies; builds on existing Azure depth |
| Google Cloud Professional ML Engineer | ~$200 | 3 weeks | ⭐⭐ | GCP-heavy companies |

### Tier 3 — Skip for This Pivot

| Cert | Why Skip |
|---|---|
| AWS ML Specialty | Traditional ML focus, not GenAI — wrong pivot signal |
| Generic cloud certs (AWS SAA, AZ-900) | Already strong in cloud; zero marginal signal |
| Full ML specializations (fast.ai, Coursera ML Specialization) | 3-6 months; overkill for Backend AI Eng target |

---

## Key Resources

### LLM Observability
- Langfuse (self-hosted): https://langfuse.com/docs/deployment/local
- Arize Phoenix (free, local): https://github.com/Arize-ai/phoenix
- Helicone: https://www.helicone.ai

### Agentic Frameworks
- LangGraph docs: https://langchain-ai.github.io/langgraph/
- LlamaIndex: https://docs.llamaindex.ai
- CrewAI: https://docs.crewai.com
- Pydantic AI: https://ai.pydantic.dev (closest to your existing Pydantic v2 usage)

### RAG
- pgvector Python: https://github.com/pgvector/pgvector-python
- RAGAS (eval): https://docs.ragas.io
- Cohere Rerank: https://cohere.com/rerank

### Learning
- DeepLearning.AI free courses: https://learn.deeplearning.ai
- Latent Space podcast (stay current): https://www.latent.space
- AI Engineer Foundation: https://www.ai.engineer

### Target companies to watch for AI Eng roles
Grafana Labs, Supabase, PostHog, GitLab, WorkOS, 1Password, Neon, Planetscale, Turso, Qdrant, Weaviate, Chroma, LangChain, Langfuse, Arize, Helicone, Braintrust, Weights & Biases, Modal, Fly.io, Render
