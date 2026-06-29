export interface Stat {
  label: string;
  value: string;
}

export interface Person {
  name: string;
  title: string;
  tagline: string;
  intro: string;
  email: string;
  github: string;
  githubLabel: string;
  linkedin: string;
  linkedinLabel: string;
  portfolio: string;
  portfolioLabel: string;
  location: string;
  availability: string;
  education: string;
  certifications: string[];
  stats: Stat[];
}

export const person: Person = {
  name: "Ammar Hassan",
  title: "Senior Software Engineer",
  tagline:
    "Polyglot full-stack engineer building production SaaS, FinTech, healthcare & AI platforms.",
  intro:
    "I design and ship end-to-end products — from multi-tenant SaaS backends and real-time data pipelines to RAG-powered AI features — across Ruby on Rails, Python, and the modern JavaScript ecosystem. I care about clean architecture, sub-100ms APIs, and shipping things people actually use.",
  email: "ammar.hassan@example.dev",
  github: "https://github.com/ammar-hassan",
  githubLabel: "github.com/ammar-hassan",
  linkedin: "https://linkedin.com/in/ammar-hassan",
  linkedinLabel: "linkedin.com/in/ammar-hassan",
  portfolio: "",
  portfolioLabel: "",
  location: "Lahore, Pakistan",
  availability: "Available for senior / staff engineering roles",
  stats: [
    { label: "Years Experience", value: "15+" },
    { label: "SaaS & MVPs Shipped", value: "40+" },
    { label: "Tech Stacks", value: "6" },
  ],
  education:
    "B.S. Information Technology (Computer Science) — University of the Punjab, Lahore (2017)",
  certifications: [
    "AWS Certified Solutions Architect — Associate",
    "Certified Web Developer",
    "English: C2 Proficient",
  ],
};

export interface TechCategory {
  label: string;
  icon: string;
  items: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location?: string;
  points: string[];
}

export interface ProjectItem {
  name: string;
  link?: string;
  role?: string;
  stack: string[];
  points: string[];
  alsoSpans?: string;
}

export interface Stack {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  icon: string;
  accent: string;
  blurb: string;
  tech: TechCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
}

export const stacks: Stack[] = [

  {
    slug: "e22b6eec8e580d6b",
    name: "Ruby on Rails",
    shortName: "Rails",
    tagline: "Rails · PostgreSQL · Hotwire · Sidekiq · AWS",
    icon: "Gem",
    accent: "from-red-500 to-orange-500",
    blurb:
      "My deepest stack: Ruby on Rails (Rails 5/6/7, Ruby 3.x) for production SaaS, FinTech, healthcare and data-intensive platforms — paired with Hotwire (Turbo/Stimulus) or a JS frontend, PostgreSQL, Redis/Sidekiq background jobs, and AWS deployment.",
    tech: [
      {
        label: "Core Backend",
        icon: "Server",
        items: [
          "Ruby on Rails 6/7",
          "Ruby 3.x",
          "ActiveRecord",
          "ActionCable",
          "ActionMailer",
          "Sidekiq",
          "Resque",
          "Devise",
          "Pundit",
        ],
      },
      {
        label: "Frontend",
        icon: "Layers",
        items: [
          "Hotwire (Turbo / Stimulus)",
          "Tailwind CSS",
          "ERB",
          "HAML",
          "React.js",
          "Next.js",
          "Vue.js",
        ],
      },
      {
        label: "APIs & Architecture",
        icon: "Network",
        items: [
          "RESTful APIs",
          "GraphQL",
          "gRPC",
          "Webhooks",
          "OAuth2 / JWT",
          "Microservices",
          "Multi-Tenant SaaS",
        ],
      },
      {
        label: "Databases",
        icon: "Database",
        items: [
          "PostgreSQL (indexing, partitioning)",
          "MySQL",
          "Redis",
          "Elasticsearch",
          "MongoDB",
          "Active Storage",
        ],
      },
      {
        label: "Cloud / DevOps",
        icon: "Cloud",
        items: [
          "AWS (EC2, S3, RDS, Lambda, CloudFront, VPC)",
          "Docker",
          "Kubernetes",
          "GitHub Actions",
          "CircleCI",
          "Heroku",
          "Capistrano",
        ],
      },
      {
        label: "Testing",
        icon: "TestTube",
        items: [
          "RSpec",
          "FactoryBot",
          "Capybara",
          "SimpleCov",
          "VCR",
          "Minitest",
          "TDD / BDD (90%+ coverage)",
        ],
      },
      {
        label: "Integrations",
        icon: "Plug",
        items: [
          "Stripe",
          "Tilled",
          "Twilio",
          "SendGrid",
          "Algolia",
          "Salesforce",
          "Plaid",
          "Auth0",
          "OpenAI API",
          "LangChain",
          "pgvector / RAG",
        ],
      },
    ],
    experience: [
      {
        company: "Nexbridge Technologies",
        role: "Senior Ruby on Rails Engineer",
        period: "Mar 2020 – Present",
        location: "SaaS — Remote, Dallas TX",
        points: [
          "Architected and led the backend of a multi-tenant AI-powered SaaS; integrated Twilio voice, OpenAI Whisper transcription, and a RAG pipeline (pgvector + PostgreSQL) at sub-300ms retrieval for enterprise clients.",
          "Owned end-to-end Rails 7 infrastructure for 10,000+ MAU: Stripe billing, subscription lifecycle, metered usage, and automated dunning.",
          "Cut API response from ~800ms to <120ms via N+1 fixes and PostgreSQL table partitioning across 3 high-traffic services.",
          "Built a real-time analytics dashboard with ActionCable + Redis pub/sub handling 50,000+ WebSocket events/day.",
          "Raised RSpec coverage from 12% to 91% on a 6-year monolith; zero-downtime migration to Rails 7 with no incidents.",
          "Ran CI/CD (GitHub Actions + Docker + AWS) across 8+ product lines; deploys ~45min → <8min. Mentored 5 engineers; PR cycle time −40%.",
        ],
      },
      {
        company: "Stratum Financial Group",
        role: "Ruby on Rails Engineer",
        period: "Jun 2018 – Feb 2020",
        location: "FinTech — New York, NY / Remote",
        points: [
          "Scaled a REST API for 2M+ users on a social trading platform; 99.95% uptime SLA under sustained load.",
          "Ran Sidekiq + Redis background jobs at 500,000+ async tasks/day (trade notifications, portfolio recalcs, email workflows) with zero data loss.",
          "Integrated KYC/AML verification and financial data providers; −35% manual compliance review time.",
          "Refactored ActiveRecord associations and query caching; −28% peak DB CPU.",
          "Achieved 87% RSpec coverage on the core trading module; zero critical production bugs.",
        ],
      },
      {
        company: "Ledgerline Labs",
        role: "Full Stack Rails Developer",
        period: "Aug 2016 – May 2018",
        location: "Blockchain / Web3 — Austin, TX",
        points: [
          "Built a blockchain explorer + token management UI (Rails 5 + React) serving 80,000+ MAU wallets across 14 countries.",
          "Delivered webhook / event notification systems with sub-500ms delivery at peak.",
          "Optimized Elasticsearch transaction search: 2.4s → 340ms (7×).",
          "Implemented role-based access (Pundit) + audit logging for admin / operator / viewer roles.",
          "Containerized local dev with Docker; onboarding 2+ days → <30 min.",
        ],
      },
      {
        company: "Clearpath Digital",
        role: "Rails Developer",
        period: "Jan 2015 – Jul 2016",
        location: "B2B SaaS — Denver, CO",
        points: [
          "Built core features on a Rails 4 multi-tenant SaaS: billing, user roles, analytics dashboards, CRM integrations.",
          "Automated recurring reporting with Sidekiq workers (replaced 20+ hrs/week of manual work).",
          "Lifted test coverage from near-zero to 78%, enabling the first safe major upgrade.",
          "Led Heroku → AWS EC2/RDS migration; −30% monthly hosting cost.",
        ],
      },
      {
        company: "Tkxel",
        role: "Senior Software Engineer / Product Engineer",
        period: "May 2022 – Sep 2025",
        points: [
          "Designed and shipped full-stack apps with React, Vue.js, Nuxt.js and Ruby on Rails; built and maintained RESTful APIs and third-party integrations.",
          "Built a production-grade ETL pipeline with Rails, AWS S3 and Snowflake.",
          "Led architecture decisions, code reviews and mentoring; integrated ML models for predictive analytics.",
        ],
      },
      {
        company: "Stack360",
        role: "Senior Full Stack Developer",
        period: "Sep 2020 – Apr 2022",
        points: [
          "Built full-stack apps with React, Vue.js, JavaScript and Ruby on Rails.",
          "Redesigned the reporting module to Rails best practices: +25% performance and maintainability.",
          "Introduced automated testing frameworks to reduce regressions.",
        ],
      },
      {
        company: "Fiverr (Freelance)",
        role: "Web Developer",
        period: "Apr 2019 – Jul 2020",
        points: [
          "Delivered full-stack apps using Node.js, Django and Rails for international clients.",
          "Built a Facebook Ads management tool with the Marketing API + Graph API.",
        ],
      },
      {
        company: "Strategic Systems International",
        role: "Senior Software Engineer",
        period: "Sep 2021 – Present",
        location: "Hybrid",
        points: [
          "Built and maintained scalable Node.js and Rails-based apps with React/Vue.js frontends; microservices, CI/CD, ETL (AWS S3 + Snowflake) and LLM/AI integration.",
        ],
      },
      {
        company: "TechCreatix",
        role: "Senior Software Engineer",
        period: "Mar 2021 – Sep 2021",
        location: "Lahore",
        points: [
          "Delivered full-stack features in an Agile team; reporting module performance +25%; automated testing + CI/CD; architecture analysis and code reviews.",
        ],
      },
      {
        company: "Kinectro",
        role: "Web Developer",
        period: "Apr 2018 – Mar 2021",
        location: "Pakistan",
        points: [
          "Built and maintained Ruby on Rails apps with REST APIs and third-party integrations; Facebook Marketing/Graph API; Git, Heroku, Redis, EC2.",
        ],
      },
    ],
    projects: [
      {
        name: "The Tie — Financial Data & Analytics Platform",
        link: "https://thetie.io",
        role: "Full-Stack Engineer",
        stack: ["Ruby on Rails", "Vue.js", "ChatGPT", "Auth0", "PostgreSQL", "Docker", "AWS"],
        points: [
          "Real-time financial analytics with AI-driven market insights and ChatGPT integration.",
          "Secure Auth0 authentication; scalable backend with a responsive Vue.js frontend.",
        ],
        alsoSpans: "AI / GenAI",
      },
      {
        name: "TribeAWL — Medical Spa SaaS Platform",
        role: "Full-Stack Engineer",
        stack: ["React.js", "Tailwind", "Ruby on Rails", "PostgreSQL", "WebSockets", "Stripe", "Tilled", "Active Storage"],
        points: [
          "Multi-tenant SaaS: client/staff management, appointment booking, inventory tracking, role-based portals and real-time notifications.",
          "Stripe + Tilled PCI-compliant payments; Twilio SMS and in-app chat via WebSockets.",
        ],
        alsoSpans: "JavaScript (React)",
      },
      {
        name: "Coach Catalyst — Fitness & Coaching SaaS Platform",
        role: "Senior Full-Stack Developer",
        stack: ["Ruby on Rails", "PostgreSQL", "SaaS"],
        points: [
          "Scaled an MVP coaching platform to production-ready SaaS: coaching workflows and dashboards.",
          "Shipped MVP features, improved data visibility/reporting, and refactored continuously as requirements changed.",
        ],
      },
      {
        name: "AI-Powered Call Center SaaS",
        role: "Backend / Full-Stack Engineer",
        stack: ["Rails", "FastAPI", "React", "RAG (pgvector)", "Twilio", "Whisper", "Stripe"],
        points: [
          "End-to-end multi-tenant SaaS on a Rails + FastAPI hybrid with real-time WebSocket UI.",
          "Sub-300ms RAG retrieval (pgvector) at production; Twilio + Whisper transcription and Stripe billing.",
        ],
        alsoSpans: "Python · AI / GenAI",
      },
      {
        name: "Institutional Data Analytics Platform",
        role: "Backend Engineer",
        stack: ["Rails", "ActionCable", "PostgreSQL", "Redis"],
        points: [
          "ActionCable dashboards with high-frequency real-time market-data ingestion.",
          "PostgreSQL query optimization cut peak-load response times by 85%.",
        ],
        alsoSpans: "Cloud / Data",
      },
      {
        name: "Digital Wallet Compliance Backend",
        role: "Backend Engineer",
        stack: ["Ruby on Rails", "PostgreSQL", "PCI-DSS", "ISO 27001"],
        points: [
          "Built compliance and transaction modules to PCI-DSS / ISO 27001 standards.",
          "−60% audit findings over two review cycles.",
        ],
      },
      {
        name: "Blockchain Explorer + Token Management",
        role: "Full-Stack Engineer",
        stack: ["Rails 5", "React", "Elasticsearch", "Pundit"],
        points: [
          "80,000+ MAU wallets across 14 countries; Elasticsearch search 7× faster.",
          "Pundit RBAC and full audit logging.",
        ],
        alsoSpans: "Web3 / Blockchain",
      },
      {
        name: "ETL Data Pipeline (Rails variant)",
        role: "Data / Backend Engineer",
        stack: ["Rails", "AWS S3", "Snowflake", "Streamlit"],
        points: [
          "Fault-tolerant pipeline processing large-volume data feeds into Snowflake.",
        ],
        alsoSpans: "Python · Cloud / DevOps",
      },
      {
        name: "GozuPees — SaaS Automation & Service Marketplace",
        role: "Full-Stack Developer",
        stack: ["Ruby on Rails", "Multi-Tenant", "Payments", "Automation"],
        points: [
          "Multi-tenant SaaS marketplace with automation workflows, service orchestration and role-based systems.",
          "Payment and third-party integrations across the platform.",
        ],
        alsoSpans: "Python · JavaScript",
      },
    ],
  },

  {
    slug: "23eeeb4347bdd26b",
    name: "Python",
    shortName: "Python",
    tagline: "Django · FastAPI · Flask · Snowflake · ML",
    icon: "Braces",
    accent: "from-sky-500 to-amber-400",
    blurb:
      "Python backend work centered on Django (web apps, REST), FastAPI (high-performance real-time APIs and AI services) and Flask — plus the data/BI side: Snowflake ETL, Streamlit dashboards, ML pipelines, and pgvector semantic search. Strongly tied to the AI/GenAI work.",
    tech: [
      {
        label: "Backend",
        icon: "Server",
        items: [
          "Python (Django, FastAPI, Flask)",
          "SQLAlchemy ORM",
          "REST APIs",
          "GraphQL",
          "Microservices",
          "WebSockets",
        ],
      },
      {
        label: "Data / BI",
        icon: "LineChart",
        items: [
          "Snowflake",
          "Streamlit",
          "ETL Pipelines",
          "pgvector",
          "PostGIS",
          "High-Volume Optimization",
          "Predictive Analytics",
        ],
      },
      {
        label: "Databases",
        icon: "Database",
        items: ["PostgreSQL (pgvector, PostGIS)", "MySQL", "MongoDB", "Redis"],
      },
      {
        label: "ML / AI",
        icon: "Brain",
        items: [
          "TensorFlow",
          "Python ML pipelines",
          "LangChain",
          "LlamaIndex",
          "OpenAI GPT-4",
          "RAG pipelines",
        ],
      },
      {
        label: "Cloud",
        icon: "Cloud",
        items: [
          "Azure (cognitive services, blob storage)",
          "AWS (EC2, S3, RDS, Lambda)",
          "GCP",
          "Docker",
          "Kubernetes",
          "CI/CD (GitHub Actions)",
        ],
      },
      {
        label: "Messaging & Testing",
        icon: "Workflow",
        items: ["RabbitMQ", "Redis", "WebSockets", "Pytest / Jest / Playwright / Cypress", "Swagger"],
      },
    ],
    experience: [
      {
        company: "Alula",
        role: "Lead Engineer",
        period: "Apr 2025 – Present",
        location: "alulaathome.com",
        points: [
          "Lead engineer on a senior-care management platform; owns architecture, AI workflow design and integration strategy end-to-end.",
          "Built a \"Chief of Staff\" AI agent orchestrating internal ops across specialized sub-agents (LLM tool-calling + structured task routing).",
          "Built dedicated AI agents for client onboarding and automated outreach.",
          "Architected a multi-agent workflow layer: prompt engineering, agent handoff logic, fallback handling and human-in-the-loop review gates.",
          "Connected agent outputs to CRM updates, notifications and dashboards.",
        ],
      },
      {
        company: "Tkxel",
        role: "Senior Software Engineer",
        period: "May 2022 – Sep 2025",
        points: [
          "Built full-stack apps with Python/Django, Vue.js, Nuxt.js and Ruby on Rails.",
          "Production ETL: Django + AWS S3 + Snowflake; Streamlit analytics dashboards on Snowflake; Azure cognitive services integration.",
          "Shipped RAG AI features with pgvector + LangChain + OpenAI GPT-4.",
        ],
      },
      {
        company: "Stack360",
        role: "Senior Full Stack Developer",
        period: "Sep 2020 – Apr 2022",
        points: [
          "Built full-stack apps with Django, Vue.js, React and Ruby on Rails.",
          "Redesigned the reporting module to Django best practices: +25% performance.",
        ],
      },
      {
        company: "Fiverr (Freelance)",
        role: "Full Stack Web Developer",
        period: "Apr 2019 – Jul 2020",
        points: [
          "Built full-stack apps with Django, Node.js and Ruby on Rails.",
          "Delivered a Facebook Ads tool with the Marketing + Graph API.",
        ],
      },
    ],
    projects: [
      {
        name: "MicroHealth — AI & RAG-Based Knowledge Platform",
        role: "Senior Software Engineer (Full-Stack / Backend)",
        stack: ["Python (FastAPI/Django)", "PostgreSQL (pgvector)", "OpenAI GPT-4", "LangChain", "LlamaIndex", "Azure", "Vue.js", "Streamlit"],
        points: [
          "End-to-end RAG-powered intelligent document search for healthcare data.",
          "Scalable Django/FastAPI ingestion pipelines with pgvector semantic search.",
          "Streamlit dashboards for admin analytics and model-performance monitoring.",
          "Iterated on relevance, latency and quality against real clinical user needs.",
        ],
        alsoSpans: "AI / GenAI",
      },
      {
        name: "GoZupees — AI Call Center Platform",
        role: "Full-Stack Engineer",
        stack: ["Python (FastAPI)", "PostgreSQL (pgvector)", "OpenAI GPT-4", "LangChain", "SQLAlchemy", "Twilio", "WebSockets", "React", "TypeScript", "Docker", "AWS"],
        points: [
          "Real-time AI call center management platform; WebSocket-based AI suggestions at 1–2s latency (OpenAI GPT + pgvector RAG).",
          "Structured agent/ticket management with full CRUD REST APIs (FastAPI + SQLAlchemy).",
          "Twilio WhatsApp, live call transcription and Stripe subscription management.",
          "Docker on AWS with CI/CD via GitHub Actions.",
        ],
        alsoSpans: "AI / GenAI · JavaScript · Cloud",
      },
      {
        name: "Genie AI — Location-Based Social Discovery",
        link: "https://geniegetsme.com",
        role: "Backend Engineer",
        stack: ["Python (FastAPI)", "PostgreSQL (PostGIS)", "LangChain", "OpenAI API", "Redis", "RabbitMQ", "Docker", "Auth0", "SQLAlchemy"],
        points: [
          "Scalable location-based discovery APIs with PostGIS analytics.",
          "Real-time chat via WebSockets; RabbitMQ event messaging.",
          "AI-powered recommendations (LangChain LLM + RAG personalization).",
          "Auth0 auth and Redis caching supporting thousands of concurrent users.",
        ],
        alsoSpans: "AI / GenAI",
      },
      {
        name: "Frosty Metrics — Crypto Analytics Platform",
        link: "https://frostymetrics.com/dashboard",
        role: "Full-Stack Engineer",
        stack: ["Node.js", "Python (Django, ML)", "React", "Next.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "WebSockets", "GraphQL", "LLM"],
        points: [
          "High-performance real-time crypto analytics: token tracking, historical data viz and AI-driven predictive analytics via Python ML pipelines.",
          "Scalable microservices, real-time data pipelines and containerized cloud deploys handling large transaction volumes; secure GraphQL APIs.",
        ],
        alsoSpans: "JavaScript · AI / GenAI · Cloud",
      },
      {
        name: "Multi-Tenant SaaS Marketplace (GoZupees — Django variant)",
        role: "Full-Stack Engineer",
        stack: ["Django", "React", "PostgreSQL", "Stripe", "WebSockets", "AWS"],
        points: [
          "Multi-tenant architecture with automation workflows and role-based access.",
          "Third-party payment integrations.",
        ],
      },
      {
        name: "ETL Data Pipeline (Django variant)",
        role: "Data Engineer",
        stack: ["Django", "AWS S3", "Snowflake", "Streamlit"],
        points: [
          "Fault-tolerant ETL processing large-volume feeds into Snowflake.",
          "Streamlit visualizations for ops teams.",
        ],
        alsoSpans: "Cloud / DevOps",
      },
      {
        name: "Streamlit BI Dashboards",
        role: "Data / BI Engineer",
        stack: ["Python", "Streamlit", "Snowflake"],
        points: [
          "Internal analytics and operational reporting consuming Snowflake data.",
        ],
      },
    ],
  },

  {
    slug: "de9b9ed78d7e2e1d",
    name: "JavaScript / Node.js",
    shortName: "JavaScript",
    tagline: "React · Next.js · Node · TypeScript · NestJS",
    icon: "Code2",
    accent: "from-yellow-400 to-amber-500",
    blurb:
      "End-to-end JavaScript/TypeScript: React/Next.js (and Vue/Nuxt/Svelte) on the frontend, Node.js (Express, NestJS) on the backend, real-time systems, and SaaS platforms — from architecture all the way to production.",
    tech: [
      {
        label: "Frontend",
        icon: "Layers",
        items: [
          "JavaScript (ES6+)",
          "TypeScript",
          "React.js",
          "Next.js",
          "Vue.js",
          "Nuxt.js",
          "Svelte",
          "PWAs",
          "Tailwind CSS",
          "HTML5 / CSS3",
        ],
      },
      {
        label: "Backend",
        icon: "Server",
        items: [
          "Node.js",
          "Express.js",
          "NestJS",
          "REST APIs",
          "GraphQL",
          "WebSockets",
          "Microservices",
        ],
      },
      {
        label: "Databases",
        icon: "Database",
        items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Schema design & query optimization"],
      },
      {
        label: "Cloud / DevOps",
        icon: "Cloud",
        items: ["AWS", "GCP", "Docker", "Kubernetes", "CI/CD pipelines", "Cloud-Native"],
      },
      {
        label: "Testing",
        icon: "TestTube",
        items: ["Jest", "Playwright", "Cypress", "React Testing Library"],
      },
      {
        label: "Practices",
        icon: "GitBranch",
        items: ["Git", "Agile / Scrum", "Code Reviews", "Technical Documentation"],
      },
    ],
    experience: [
      {
        company: "Tkxel",
        role: "Senior Software Engineer",
        period: "May 2022 – Sep 2025",
        points: [
          "Shipped full-stack apps with React, Vue.js and Nuxt.js (plus Rails); REST APIs and third-party services.",
          "Drove architecture decisions and mentoring.",
        ],
      },
      {
        company: "Stack360",
        role: "Senior Full Stack Developer",
        period: "Sep 2020 – Apr 2022",
        points: [
          "Built full-stack apps with React, Vue.js and JavaScript (plus Rails); REST APIs.",
          "Introduced automated testing frameworks.",
        ],
      },
      {
        company: "Fiverr (Freelance)",
        role: "Web Developer",
        period: "Apr 2019 – Jul 2020",
        points: [
          "Built Node.js apps (plus Django, Rails).",
          "Delivered a Facebook Ads tool with the Marketing + Graph API.",
        ],
      },
      {
        company: "Strategic Systems International",
        role: "Senior Software Engineer",
        period: "Sep 2021 – Present",
        location: "Hybrid",
        points: [
          "Built scalable Node.js (plus Rails) apps with React/Vue.js frontends.",
          "Designed microservices with modular, independently deployable services and secure APIs.",
          "Built CI/CD pipelines, ETL (AWS S3 + Snowflake) and LLM/AI integration.",
        ],
      },
      {
        company: "TechCreatix",
        role: "Senior Software Engineer",
        period: "Mar 2021 – Sep 2021",
        location: "Lahore",
        points: [
          "Delivered full-stack JavaScript features in an Agile team with CI/CD and code reviews.",
        ],
      },
      {
        company: "Kinectro",
        role: "Web Developer",
        period: "Apr 2018 – Mar 2021",
        location: "Pakistan",
        points: [
          "Built and maintained web apps with REST APIs and third-party integrations; Git, Heroku, Redis, EC2.",
        ],
      },
    ],
    projects: [
      {
        name: "SoloSuit — Debt Resolution Platform",
        link: "https://solosuit.com",
        role: "Senior Software Engineer",
        stack: ["React", "Node.js", "Playwright", "Plaid", "Bloom API"],
        points: [
          "Led integration of Plaid + Bloom into the platform.",
          "Introduced Playwright testing from scratch for critical debt-law workflows; delivered features and bug fixes for platform stability.",
        ],
      },
      {
        name: "SaaS Dashboard Platform",
        role: "Full-Stack Engineer",
        stack: ["React", "Node.js", "PostgreSQL"],
        points: ["Multi-tenant architecture with real-time data sync."],
        alsoSpans: "Cloud",
      },
      {
        name: "Facebook Ads Automation Tool",
        role: "Full-Stack Developer",
        stack: ["Node.js", "Facebook Marketing API", "Graph API"],
        points: [
          "Managed multiple ad accounts: ad creation, insights, previews and campaign analytics.",
        ],
        alsoSpans: "Ruby on Rails (variant)",
      },
      {
        name: "HealthTech & FinTech MVPs",
        role: "Full-Stack Engineer",
        stack: ["Next.js", "NestJS"],
        points: ["End-to-end delivery from architecture to production."],
      },
      {
        name: "Frosty Metrics — Crypto Analytics Platform",
        link: "https://frostymetrics.com",
        role: "Full-Stack Engineer",
        stack: ["Node.js", "Python", "React", "Next.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "WebSockets", "GraphQL", "LLM"],
        points: [
          "Built the Node.js frontend and services portion of a real-time crypto analytics platform.",
        ],
        alsoSpans: "Python · AI / GenAI · Cloud",
      },
      {
        name: "GoZupees — AI Call Center (Frontend)",
        role: "Frontend Engineer",
        stack: ["React", "TypeScript", "Tailwind"],
        points: [
          "Built the React/TypeScript frontend over a FastAPI backend for a real-time AI call center.",
        ],
        alsoSpans: "Python · AI / GenAI",
      },
    ],
  },

  {
    slug: "4921c0e2d1f6005a",
    name: "AI / GenAI / LLM",
    shortName: "AI / GenAI",
    tagline: "LLMs · RAG · Multi-Agent · pgvector · LangChain",
    icon: "Sparkles",
    accent: "from-fuchsia-500 to-purple-600",
    blurb:
      "A cross-cutting specialization layered on top of Python, Rails and Node backends: LLM integrations, RAG pipelines, multi-agent orchestration, vector/semantic search and AI-driven analytics — shipped into real production products.",
    tech: [
      {
        label: "LLMs / APIs",
        icon: "Brain",
        items: ["OpenAI API (GPT-4)", "OpenAI Whisper", "ChatGPT integration"],
      },
      {
        label: "Frameworks",
        icon: "Workflow",
        items: ["LangChain", "LlamaIndex"],
      },
      {
        label: "Patterns",
        icon: "Network",
        items: [
          "RAG pipelines",
          "Multi-agent orchestration",
          "Agent handoff / tool-calling",
          "Human-in-the-loop gates",
          "Predictive analytics",
          "AI workflow automation",
        ],
      },
      {
        label: "Vector / Search",
        icon: "Database",
        items: ["pgvector semantic search", "Vector search", "PostGIS-driven recommendations"],
      },
      {
        label: "ML",
        icon: "Cpu",
        items: ["TensorFlow", "Python ML pipelines"],
      },
      {
        label: "Serving Infra",
        icon: "Server",
        items: [
          "FastAPI / Django backends",
          "WebSockets (1–2s latency suggestions)",
          "Redis caching",
          "Docker / AWS deploy",
        ],
      },
    ],
    experience: [
      {
        company: "Alula",
        role: "Lead Engineer — Multi-Agent AI",
        period: "Apr 2025 – Present",
        location: "alulaathome.com",
        points: [
          "Designed a multi-agent AI workflow layer for a senior-care platform: a \"Chief of Staff\" orchestrator plus specialized onboarding/outreach agents.",
          "LLM tool-calling, structured task routing, fallback handling and human-in-the-loop review gates.",
          "Wired agent outputs to CRM, notifications and dashboards.",
        ],
      },
      {
        company: "Tkxel / Strategic Systems International",
        role: "AI/ML Engineer (cross-role)",
        period: "2021 – 2025",
        points: [
          "Integrated ML models for predictive analytics and AI-driven decision-making into existing systems.",
          "Integrated LLM/AI solutions into existing platforms collaborating with cross-functional teams.",
        ],
      },
    ],
    projects: [
      {
        name: "Alula — Multi-Agent \"Chief of Staff\" System",
        role: "Lead Engineer",
        stack: ["LLM tool-calling", "Multi-agent orchestration", "CRM integration"],
        points: [
          "Multi-agent AI workflow layer: Chief of Staff orchestrator + specialized onboarding/outreach agents.",
          "LLM tool-calling, structured task routing, fallback handling and human-in-the-loop gates; outputs wired to CRM, notifications and dashboards.",
        ],
        alsoSpans: "Python",
      },
      {
        name: "MicroHealth — RAG Knowledge Platform",
        role: "Backend / AI Engineer",
        stack: ["pgvector", "LangChain", "LlamaIndex", "OpenAI GPT-4"],
        points: [
          "RAG-powered document search; pgvector semantic search.",
          "LangChain + LlamaIndex + OpenAI GPT-4 with relevance/latency/quality tuning.",
        ],
        alsoSpans: "Python",
      },
      {
        name: "GoZupees — AI Call Center",
        role: "AI Engineer",
        stack: ["OpenAI GPT-4", "pgvector RAG", "WebSockets"],
        points: [
          "WebSocket GenAI suggestions at 1–2s latency; OpenAI GPT-4 + pgvector RAG.",
          "Live call transcription.",
        ],
        alsoSpans: "Python · JavaScript",
      },
      {
        name: "Genie AI — AI Recommendations",
        role: "AI Engineer",
        stack: ["LangChain", "RAG", "PostGIS"],
        points: [
          "LangChain LLM integration + RAG-based personalization over PostGIS data.",
        ],
        alsoSpans: "Python",
      },
      {
        name: "The Tie — ChatGPT-Powered Financial Analysis",
        role: "AI Engineer",
        stack: ["ChatGPT", "Ruby on Rails", "Vue.js"],
        points: ["Real-time market insights with ChatGPT integration."],
        alsoSpans: "Ruby on Rails",
      },
      {
        name: "Frosty Metrics — AI-Driven Predictive Analytics",
        role: "AI / ML Engineer",
        stack: ["Python ML pipelines", "LLM"],
        points: ["Python ML pipelines + LLM integration for crypto predictive analytics."],
        alsoSpans: "Python · JavaScript",
      },
      {
        name: "AI-Powered Call Center SaaS",
        role: "AI / Backend Engineer",
        stack: ["OpenAI Whisper", "RAG (pgvector)", "Rails + FastAPI"],
        points: [
          "OpenAI Whisper live transcription + RAG pipeline (pgvector) at sub-300ms retrieval.",
          "Rails + FastAPI hybrid.",
        ],
        alsoSpans: "Ruby on Rails · Cloud",
      },
    ],
  },

  {
    slug: "a1234b3161b4fbfd",
    name: "Cloud / DevOps / Data",
    shortName: "Cloud / DevOps",
    tagline: "AWS · GCP · Azure · Docker · K8s · Snowflake",
    icon: "Cloud",
    accent: "from-cyan-500 to-blue-500",
    blurb:
      "The infrastructure and platform layer shared by every stack: cloud (AWS + GCP + Azure), containerization/orchestration, CI/CD, microservices, messaging, and large-scale ETL/data pipelines. AWS Certified Solutions Architect.",
    tech: [
      {
        label: "Cloud",
        icon: "Cloud",
        items: [
          "AWS (EC2, S3, RDS, Lambda, VPC, CloudFront, CloudFormation)",
          "GCP (Cloud-Native, Serverless)",
          "Microsoft Azure (cognitive services, blob storage)",
        ],
      },
      {
        label: "Containers",
        icon: "Container",
        items: ["Docker", "Kubernetes", "Containerization", "IaC"],
      },
      {
        label: "CI/CD",
        icon: "GitBranch",
        items: ["GitHub Actions", "CircleCI", "Capistrano", "Vercel", "Netlify", "Heroku"],
      },
      {
        label: "Architecture",
        icon: "Network",
        items: [
          "Microservices",
          "API Gateway patterns",
          "Event-Driven Design",
          "Serverless",
          "Cloud-Native deployments",
          "API security",
        ],
      },
      {
        label: "Messaging",
        icon: "Workflow",
        items: ["RabbitMQ", "WebSockets", "Redis pub/sub"],
      },
      {
        label: "Data Engineering",
        icon: "LineChart",
        items: [
          "ETL pipelines (AWS S3 + Snowflake)",
          "High-volume optimization",
          "Real-time data pipelines",
          "Streamlit / BI",
        ],
      },
      {
        label: "Databases",
        icon: "Database",
        items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "PostGIS", "pgvector", "Snowflake"],
      },
    ],
    experience: [
      {
        company: "Nexbridge Technologies",
        role: "Senior Engineer — Cloud & DevOps",
        period: "Mar 2020 – Present",
        location: "Remote, Dallas TX",
        points: [
          "Ran CI/CD (GitHub Actions + Docker + AWS) across 8+ product lines; deploy time ~45min → <8min.",
          "PostgreSQL partitioning + N+1 fixes cut response times 800ms → <120ms.",
        ],
      },
      {
        company: "Strategic Systems International",
        role: "Senior Software Engineer — Microservices",
        period: "Sep 2021 – Present",
        location: "Hybrid",
        points: [
          "Designed modular, independently deployable microservices with secure APIs.",
          "Built CI/CD pipelines streamlining release workflows; production ETL (AWS S3 + Snowflake).",
        ],
      },
      {
        company: "Clearpath Digital",
        role: "Cloud Migration Engineer",
        period: "Jan 2015 – Jul 2016",
        location: "Denver, CO",
        points: [
          "Led Heroku → AWS EC2/RDS migration; −30% monthly hosting cost.",
        ],
      },
    ],
    projects: [
      {
        name: "ETL Data Pipeline (AWS S3 + Snowflake)",
        role: "Data Engineer",
        stack: ["Rails / Django", "AWS S3", "Snowflake", "Streamlit"],
        points: [
          "Production-grade, fault-tolerant, large-volume ingestion/transformation built at Tkxel / SSI.",
          "Streamlit visualizations for ops teams.",
        ],
        alsoSpans: "Rails · Python",
      },
      {
        name: "CI/CD Pipelines",
        role: "DevOps Engineer",
        stack: ["GitHub Actions", "Docker", "AWS"],
        points: [
          "GitHub Actions + Docker + AWS across 8+ product lines; deploy ~45min → <8min.",
          "CI/CD pipelines streamlining release workflows.",
        ],
      },
      {
        name: "Microservices Architecture",
        role: "Architect / Engineer",
        stack: ["Microservices", "RabbitMQ", "Containers"],
        points: [
          "Modular, independently deployable services with secure APIs.",
          "Scalable microservices + containerized cloud deploys (Frosty Metrics); RabbitMQ event-driven messaging (Genie).",
        ],
      },
      {
        name: "Real-Time / WebSocket Infrastructure",
        role: "Backend Engineer",
        stack: ["ActionCable", "Redis pub/sub", "WebSockets"],
        points: [
          "ActionCable + Redis pub/sub at 50,000+ events/day.",
          "WebSocket AI suggestions (GoZupees); real-time chat (Genie, TribeAWL).",
        ],
      },
      {
        name: "Cloud Migrations & Optimization",
        role: "Cloud Engineer",
        stack: ["AWS EC2/RDS", "PostgreSQL"],
        points: [
          "Heroku → AWS EC2/RDS migration, −30% cost.",
          "PostgreSQL partitioning + N+1 fixes, 800ms → <120ms.",
        ],
      },
    ],
  },

  {
    slug: "d55930f03965659d",
    name: "Web3 / Blockchain",
    shortName: "Web3",
    tagline: "DApps · Smart Contracts · On-chain Systems",
    icon: "Blocks",
    accent: "from-emerald-500 to-teal-500",
    blurb:
      "A focused niche: blockchain explorers and token management, on-chain event systems, wallet infrastructure, DApps and smart contracts — production Web3 work delivered on top of a Rails + React core.",
    tech: [
      {
        label: "Web3",
        icon: "Blocks",
        items: ["Web3", "DApps", "Blockchain", "Smart Contracts"],
      },
      {
        label: "On-Chain Systems",
        icon: "Coins",
        items: [
          "Blockchain explorer / token management",
          "On-chain event systems",
          "Wallet infrastructure",
        ],
      },
      {
        label: "Backend & Search",
        icon: "Server",
        items: ["Rails 5", "React", "Elasticsearch", "Webhooks / event notifications"],
      },
      {
        label: "Security",
        icon: "ShieldCheck",
        items: ["Pundit RBAC", "Audit logging", "Role-based access (admin / operator / viewer)"],
      },
    ],
    experience: [
      {
        company: "Ledgerline Labs",
        role: "Full Stack Rails / Web3 Developer",
        period: "Aug 2016 – May 2018",
        location: "Blockchain / Web3 — Austin, TX",
        points: [
          "Built a Rails 5 + React blockchain explorer + token management UI; 80,000+ MAU wallets across 14 countries.",
          "On-chain webhook / event notification systems with sub-500ms delivery at peak.",
          "Elasticsearch transaction search 7× faster (2.4s → 340ms).",
          "Pundit RBAC + audit logging across admin / operator / viewer roles.",
        ],
      },
    ],
    projects: [
      {
        name: "Blockchain Explorer + Token Management",
        role: "Full-Stack Engineer",
        stack: ["Rails 5", "React", "Elasticsearch", "Pundit", "Web3"],
        points: [
          "80,000+ MAU wallets across 14 countries; on-chain webhook/event notifications (sub-500ms).",
          "Elasticsearch tx search 7× faster; Pundit RBAC + audit logging.",
        ],
        alsoSpans: "Ruby on Rails",
      },
      {
        name: "Web3 / DApps / Smart Contracts",
        role: "Supplementary specialization",
        stack: ["Web3", "DApps", "Smart Contracts"],
        points: [
          "Web3, DApps and Smart Contracts maintained as supplementary skills across roles.",
        ],
      },
    ],
  },
];
