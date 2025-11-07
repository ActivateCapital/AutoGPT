# 🚀 CreAI Platform

**Build AI Agents That Actually Work For You**

The first no-code platform to create autonomous AI agents that automate your business workflows.

## 🎯 Quick Start

### Project Structure
```
creai-platform/
├── apps/
│   ├── web/              # Next.js landing page & dashboard
│   ├── api/              # Backend API
│   └── agent-engine/     # Modified AutoGPT
├── packages/
│   ├── ui/               # Shared UI components
│   ├── db/               # Database schemas & client
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configs
├── integrations/         # n8n and other integrations
└── docs/                 # Documentation
```

## 🚀 Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
cd packages/db
npx prisma migrate dev

# Start development
npm run dev
```

## 📚 Documentation

See `/docs` for complete documentation including:
- Business plan and market research
- Technical architecture
- API documentation
- Deployment guide

## 🎯 Current Status

**Phase**: Foundation & MVP Development
**Target Launch**: 90 days from start
**Goal**: 100 paying customers in first month

## 🔗 Links

- **Website**: https://creai.dev.com (coming soon)
- **Docs**: See `/docs` folder
- **Support**: [Create an issue](issues)

---

Built with ❤️ using AutoGPT + n8n + Next.js
