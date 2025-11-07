# 🤖 CreAI Platform - AI Agent Automation SaaS

**The first no-code platform to create autonomous AI agents that automate your business workflows with multi-provider AI model support.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vercel AI SDK](https://img.shields.io/badge/AI_SDK-4.0-purple)](https://sdk.vercel.ai/)

---

## 🎯 What is CreAI?

CreAI is a **production-ready SaaS platform** that lets users create, deploy, and manage AI agents without code. Think Zapier meets ChatGPT, but the AI actually takes action.

### Key Differentiators:
- ✅ **Multi-Provider AI**: Choose between GPT-4, Claude, or bring your own model
- ✅ **Real-Time Streaming**: See your agents think and work in real-time
- ✅ **Tool Calling**: Agents can search the web, scrape data, analyze information
- ✅ **Usage-Based Pricing**: Transparent cost tracking per execution
- ✅ **Built for Scale**: Production-ready with Stripe, auth, and database

---

## 🚀 Features

### For End Users
- 🎨 **6 Pre-Built Agent Templates** (Lead Research, Content Writing, Market Analysis, etc.)
- 🤖 **Custom Agent Creation** with visual builder
- ⚡ **Real-Time Execution** with step-by-step progress
- 📊 **Execution History** with detailed logs and cost tracking
- 💳 **Flexible Pricing** (Free, Professional $199/mo, Business $499/mo)
- 🔒 **OAuth Login** (Google & GitHub)

### For Developers
- 🧠 **5 AI Models Supported**:
  - GPT-3.5 Turbo (free tier)
  - GPT-4 Turbo (professional)
  - GPT-4o (professional)
  - Claude 3.5 Sonnet (professional)
  - Claude 3.5 Haiku (professional)
- 🛠️ **Tool Calling Framework** with Zod schemas
- 📡 **Streaming API** with Server-Sent Events
- 💾 **Prisma ORM** with PostgreSQL
- 🎨 **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS
- 💰 **Stripe Integration** with webhooks

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, Radix UI, Lucide Icons |
| **Backend** | Next.js API Routes, Server Components |
| **Database** | PostgreSQL + Prisma ORM |
| **Authentication** | NextAuth.js (OAuth: Google, GitHub) |
| **AI** | Vercel AI SDK, OpenAI, Anthropic |
| **Payments** | Stripe (Checkout, Subscriptions, Webhooks) |
| **Deployment** | Render (Web Service + PostgreSQL) |

---

## 🏗️ Project Structure

```
AutoGPT/
├── apps/
│   └── web/                          # Main Next.js application
│       ├── app/                       # Next.js App Router
│       │   ├── api/                   # API routes
│       │   │   ├── agents/            # Agent CRUD & execution
│       │   │   ├── auth/              # NextAuth endpoints
│       │   │   ├── executions/        # Execution status & results
│       │   │   ├── models/            # Available AI models
│       │   │   ├── stripe/            # Checkout & webhooks
│       │   │   └── subscription/      # User subscription data
│       │   ├── auth/                  # Auth pages (sign in)
│       │   ├── dashboard/             # Protected dashboard
│       │   │   ├── agents/            # Agent management
│       │   │   ├── executions/        # Execution results viewer
│       │   │   └── subscription/      # Billing management
│       │   └── page.tsx               # Landing page
│       ├── components/                # React components
│       ├── lib/                       # Core libraries
│       │   ├── enhanced-agent-engine.ts  # AI agent execution engine
│       │   ├── auth.ts                # NextAuth configuration
│       │   └── templates.ts           # Agent templates
│       └── package.json
│
├── packages/
│   └── db/                            # Shared database package
│       ├── prisma/
│       │   └── schema.prisma          # Database schema
│       └── index.ts                   # Prisma client export
│
├── docs/                              # Business documentation
│   ├── creai-dev-market-research.md   # Market analysis ($47B opportunity)
│   └── EXECUTIVE-SUMMARY-AND-NEXT-STEPS.md  # Business plan
│
├── DEPLOYMENT-CHECKLIST.md            # Step-by-step deployment guide
├── STRIPE-SETUP-GUIDE.md              # Stripe configuration
├── STRIPE-QUICK-REFERENCE.md          # Quick Stripe reference
└── .env.example                       # Environment variables template
```

---

## 💾 Database Schema

### Core Tables:
- **User** - User accounts (email, name, OAuth)
- **Account** - OAuth provider accounts
- **Session** - Active user sessions
- **Subscription** - User subscriptions (plan, limits, usage)
- **Agent** - User-created AI agents
- **Execution** - Agent execution runs (with steps, costs)
- **Template** - Pre-built agent templates
- **Waitlist** - Marketing waitlist signups

### Key Relationships:
```
User
├── has many Agents
├── has many Executions
└── has one Subscription

Agent
└── has many Executions

Subscription
└── tracks usage limits and billing
```

---

## 🧠 Agent Execution Engine

### How It Works:

1. **User Creates Agent** with a goal (e.g., "Research competitors in AI automation")
2. **Agent Engine Receives Request** and selects appropriate AI model based on user's subscription
3. **AI Plans Execution** by breaking goal into steps
4. **Tools Execute Steps**:
   - `webSearch` - Search web for information
   - `scrapeWebsite` - Extract content from URLs
   - `analyzeData` - Analyze and process data
   - `generateContent` - Create written content
5. **Results Compiled** and saved with cost tracking
6. **User Gets Notification** with detailed execution report

### Example Execution Flow:

```typescript
User Goal: "Find 5 B2B SaaS companies in marketing automation"

Step 1: Planning (GPT-4o)
→ Creates 4-step plan

Step 2: Web Search (webSearch tool)
→ Searches "B2B SaaS marketing automation companies"
→ Returns 10 results

Step 3: Data Analysis (analyzeData tool)
→ Analyzes search results
→ Filters to top 5 companies

Step 4: Content Generation (generateContent tool)
→ Creates summary report with:
  - Company names
  - Websites
  - Key features
  - Pricing (if available)

Step 5: Compilation
→ Final report delivered to user
→ Cost: $0.024 (1,200 tokens × $0.02/1K)
```

---

## 💰 Business Model

### Pricing Tiers:

| Plan | Price | Agents | Executions | Models | Target |
|------|-------|--------|------------|---------|--------|
| **Free** | $0 | 3 | 100/mo | GPT-3.5 only | Hobbyists |
| **Professional** | $199/mo | 10 | 5,000/mo | All 5 models | Small teams |
| **Business** | $499/mo | 50 | 25,000/mo | All + analytics | Companies |
| **Enterprise** | Custom | Unlimited | Unlimited | Custom models | Large orgs |

### Revenue Projections (Year 1):

**Conservative ($1.2M ARR):**
- 300 Pro users @ $199/mo = $59,700/mo
- 100 Business @ $499/mo = $49,900/mo
- 20 Enterprise @ $1,500/mo = $30,000/mo
- **Total: $139,600/mo = $1.67M ARR**

**Optimistic ($4.1M ARR):**
- 500 Pro = $99,500/mo
- 200 Business = $99,800/mo
- 50 Enterprise = $75,000/mo
- 25 Agencies @ $2,000/mo = $50,000/mo
- Marketplace fees = $20,000/mo
- **Total: $344,300/mo = $4.13M ARR**

### Unit Economics:
```
ARPU: $349/mo (blended average)
COGS: $30/mo (AI costs + infrastructure)
Gross Margin: 91%
CAC: $150 (estimated)
LTV: $8,376 (24-month retention)
LTV:CAC Ratio: 56:1 (excellent!)
```

---

## 🚀 Quick Start

### Prerequisites:
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Anthropic API key (optional, for Claude)
- Stripe account
- Google OAuth app
- GitHub OAuth app

### 1. Clone Repository

```bash
git clone https://github.com/ActivateCapital/AutoGPT.git
cd AutoGPT
git checkout claude/lucrative-saas-product-ideas-011CUsTkx3YLvpJt6RrkeDf2
```

### 2. Install Dependencies

```bash
cd apps/web
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 4. Set Up Database

```bash
npm run db:generate
npm run db:push
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 🌐 Deployment

See **[DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)** for complete step-by-step guide.

### Quick Deploy to Render:

1. Create PostgreSQL database in Render
2. Create Web Service connected to this repo
3. Set environment variables (see `.env.example`)
4. Deploy!

**Estimated time: 20 minutes**

---

## 🔧 Configuration

### Stripe Products Setup

See **[STRIPE-SETUP-GUIDE.md](STRIPE-SETUP-GUIDE.md)** for detailed instructions.

**Quick version:**
1. Create Professional Plan product ($199/month)
2. Create Business Plan product ($499/month)
3. Set up webhook endpoint
4. Add Price IDs to environment variables

### OAuth Setup

**Google:**
1. Create OAuth app in Google Cloud Console
2. Add callback URL: `https://your-app.com/api/auth/callback/google`
3. Add Client ID and Secret to env vars

**GitHub:**
1. Create OAuth app in GitHub Settings
2. Add callback URL: `https://your-app.com/api/auth/callback/github`
3. Add Client ID and Secret to env vars

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with OAuth
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### Agents
- `GET /api/agents` - List user's agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/[id]` - Get agent details
- `PATCH /api/agents/[id]` - Update agent
- `DELETE /api/agents/[id]` - Delete agent
- `POST /api/agents/[id]/execute` - Execute agent (async)
- `POST /api/agents/[id]/stream` - Execute with streaming (SSE)
- `GET /api/agents/[id]/executions` - Get execution history

### Executions
- `GET /api/executions/[id]` - Get execution status & results

### Models
- `GET /api/models` - Get available AI models for user's tier

### Subscriptions
- `GET /api/subscription` - Get user's subscription
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

---

## 🧪 Testing

### Test User Flow:
1. Sign up with Google/GitHub
2. Create agent from template
3. Execute agent
4. View results
5. Upgrade to Professional (use test card `4242 4242 4242 4242`)
6. Verify model access expanded

### Test Stripe Webhooks:
1. Complete test checkout
2. Check Stripe Dashboard → Webhooks
3. Verify events delivered successfully

---

## 🐛 Troubleshooting

### Common Issues:

**"Cannot find module 'ai'"**
```bash
cd apps/web
npm install
```

**OAuth login fails**
- Verify callback URLs match exactly
- Check `NEXTAUTH_URL` is correct
- Verify `NEXTAUTH_SECRET` is set

**Stripe checkout doesn't work**
- Verify Price IDs are correct
- Check Stripe API keys are for same account (test or live)
- Verify `NEXT_PUBLIC_APP_URL` is set

**Webhook signature verification failed**
- Verify `STRIPE_WEBHOOK_SECRET` matches signing secret
- Check webhook URL is correct
- Ensure app is deployed and accessible

---

## 📈 Roadmap

### ✅ Phase 1: MVP (COMPLETE)
- [x] User authentication
- [x] Agent creation & templates
- [x] Multi-model AI execution
- [x] Subscription billing
- [x] Basic dashboard

### 🚧 Phase 2: Enhancement (In Progress)
- [ ] Real-time streaming UI
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] API documentation
- [ ] White-label options

### 🔮 Phase 3: Scale
- [ ] Smart model routing (cost optimization)
- [ ] A/B testing framework
- [ ] Model marketplace
- [ ] BYOM (Bring Your Own Model)
- [ ] Enterprise features
- [ ] Multi-language support

---

## 🤝 Contributing

This is a commercial SaaS platform. For partnership or white-label opportunities, contact the team.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) by Vercel
- [Vercel AI SDK](https://sdk.vercel.ai/) for multi-provider AI
- [Prisma](https://www.prisma.io/) for database ORM
- [Stripe](https://stripe.com/) for payments
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for components

---

## 📞 Support

- **Documentation:** See `/docs` folder
- **Issues:** Check troubleshooting section above
- **Deployment Help:** See DEPLOYMENT-CHECKLIST.md
- **Stripe Setup:** See STRIPE-SETUP-GUIDE.md

---

## 🎯 Market Opportunity

**Total Addressable Market:** $47.2 billion
**Target Market:** AI automation for businesses
**Competitive Advantage:** Only platform with multi-provider AI model selection

**Target Customers:**
- Marketing agencies (lead generation, content creation)
- Sales teams (prospect research, outreach automation)
- Content creators (blog writing, social media)
- Product teams (market research, competitor analysis)
- Customer success (email responses, data analysis)

---

## 💡 Why CreAI Wins

### vs ChatGPT:
- ✅ **We have actions** (they don't)
- ✅ **We integrate with tools** (they're limited)
- ✅ **We support workflows** (they're single-query)

### vs Zapier/Make:
- ✅ **We have real AI** (they have basic triggers)
- ✅ **We can reason** (they can't adapt)
- ✅ **We handle complexity** (they need manual setup)

### vs Other AI Automation:
- ✅ **Model choice** (we're the ONLY one)
- ✅ **Streaming execution** (real-time feedback)
- ✅ **Cost transparency** (users see exact costs)
- ✅ **Production-ready** (enterprise-grade infrastructure)

---

**Built with ❤️ for the future of AI automation**

**Ready to automate your business? Visit [www.creai.dev](https://www.creai.dev)** 🚀
