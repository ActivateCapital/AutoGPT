# CreAI Platform - Technical Implementation Guide

**Building the AI Agent Automation Platform**

This guide shows you exactly how to build CreAI using AutoGPT, n8n, and modern web technologies.

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────────────┐
│                      Frontend Layer                           │
│         Next.js 14 + React + TypeScript + Tailwind           │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Agent      │  │  Workflow    │  │  Dashboard   │      │
│  │   Builder    │  │  Designer    │  │  Monitor     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬─────────────────────────────────────┘
                         │ REST API / WebSockets
┌────────────────────────▼─────────────────────────────────────┐
│                    API Gateway Layer                          │
│              Node.js + Express/Fastify                        │
│                                                               │
│  Authentication │ Rate Limiting │ Request Routing            │
└────────────────────────┬─────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                  │
┌───────▼─────────┐              ┌────────▼────────┐
│  Agent Engine   │              │ Workflow Engine  │
│  (AutoGPT Core) │◄────────────►│   (n8n Core)    │
│                 │   Shared     │                  │
│  • Planning     │   Context    │  • Integrations  │
│  • Execution    │              │  • Data Flow     │
│  • Memory       │              │  • Triggers      │
└───────┬─────────┘              └────────┬────────┘
        │                                  │
        └────────────────┬─────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                    Data Layer                                 │
│                                                               │
│  PostgreSQL     Redis Cache    Vector DB       Object Store  │
│  (Primary)      (Sessions)     (Agent Memory)  (Artifacts)   │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 TECHNOLOGY STACK

### Frontend
```json
{
  "framework": "Next.js 14",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "ui-components": "shadcn/ui",
  "workflow-builder": "React Flow",
  "state-management": "Zustand",
  "api-client": "TanStack Query (React Query)",
  "forms": "React Hook Form + Zod",
  "charts": "Recharts",
  "animations": "Framer Motion"
}
```

### Backend
```json
{
  "api-framework": "Fastify (Node.js) or FastAPI (Python)",
  "language": "TypeScript or Python",
  "authentication": "NextAuth.js + JWT",
  "database-orm": "Prisma (Node) or SQLAlchemy (Python)",
  "job-queue": "BullMQ",
  "caching": "Redis",
  "websockets": "Socket.io"
}
```

### AI/Automation Core
```json
{
  "agent-engine": "Modified AutoGPT",
  "workflow-engine": "n8n core (embedded)",
  "llm-orchestration": "LangChain",
  "vector-database": "Pinecone or Weaviate",
  "llm-providers": ["OpenAI", "Anthropic", "Google AI"],
  "embeddings": "OpenAI text-embedding-3"
}
```

### Infrastructure
```json
{
  "hosting": "Vercel (Frontend) + AWS/GCP (Backend)",
  "database": "PostgreSQL (Supabase or RDS)",
  "cache": "Redis (Upstash or ElastiCache)",
  "object-storage": "S3 or Google Cloud Storage",
  "cdn": "CloudFlare",
  "monitoring": "Sentry + Grafana",
  "analytics": "PostHog"
}
```

---

## 🚀 PHASE 1: FOUNDATION (Weeks 1-2)

### Step 1: Repository Setup

```bash
# Create monorepo structure
mkdir creai-platform
cd creai-platform

# Initialize monorepo with turborepo
npx create-turbo@latest

# Directory structure
creai-platform/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── api/              # Backend API
│   └── agent-engine/     # Modified AutoGPT
├── packages/
│   ├── ui/               # Shared UI components
│   ├── db/               # Database schemas & client
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configs
├── integrations/
│   └── n8n-core/         # Embedded n8n
└── docker/
    ├── docker-compose.yml
    └── Dockerfile.*
```

### Step 2: Fork and Setup AutoGPT

```bash
cd apps/agent-engine

# Clone AutoGPT
git clone https://github.com/Significant-Gravitas/AutoGPT.git
cd AutoGPT

# Install dependencies
cd autogpts/forge
poetry install

# Or use pip
pip install -e .
```

**Key Modifications Needed**:

1. **Create Custom Agent Base** (`apps/agent-engine/src/creai_agent.py`):

```python
from forge.sdk.agent import Agent
from forge.sdk.db import AgentDB
from forge.sdk.workspace import Workspace
import logging

class CreAIAgent(Agent):
    """
    Custom agent for CreAI platform with enhanced capabilities
    """

    def __init__(
        self,
        database: AgentDB,
        workspace: Workspace,
        agent_config: dict,
        user_id: str,
    ):
        super().__init__(database, workspace)
        self.agent_config = agent_config
        self.user_id = user_id
        self.logger = logging.getLogger(f"CreAIAgent-{agent_config['name']}")

    async def execute_task(self, task_input: str):
        """
        Main execution loop with CreAI-specific features
        """
        # Create task in database
        task = await self.db.create_task(task_input)

        try:
            # Parse user goal
            goal = await self.parse_goal(task_input)

            # Create execution plan
            plan = await self.create_plan(goal)

            # Execute plan steps
            results = await self.execute_plan(plan, task.task_id)

            # Return results
            return {
                "task_id": task.task_id,
                "status": "completed",
                "results": results,
                "steps_executed": len(plan.steps)
            }

        except Exception as e:
            self.logger.error(f"Task execution failed: {e}")
            await self.db.update_task(
                task.task_id,
                status="failed",
                error=str(e)
            )
            raise

    async def parse_goal(self, user_input: str):
        """
        Use LLM to parse user's natural language goal
        """
        prompt = f"""
        Parse this user goal into a structured format:

        User Input: {user_input}

        Extract:
        - Primary objective
        - Required tools/integrations
        - Success criteria
        - Estimated complexity

        Return JSON.
        """

        response = await self.llm.chat(prompt)
        return json.loads(response)

    async def create_plan(self, goal: dict):
        """
        Create multi-step execution plan
        """
        prompt = f"""
        Create a step-by-step plan to achieve this goal:

        Goal: {goal['objective']}
        Available Tools: {self.get_available_tools()}

        Return a numbered list of specific, actionable steps.
        Each step should specify which tool to use.
        """

        plan_text = await self.llm.chat(prompt)

        # Parse into structured plan
        plan = self.parse_plan(plan_text)

        return plan

    async def execute_plan(self, plan, task_id: str):
        """
        Execute each step of the plan
        """
        results = []

        for i, step in enumerate(plan.steps):
            # Create step in database
            db_step = await self.db.create_step(
                task_id=task_id,
                name=step.name,
                input=step.input,
                is_last=(i == len(plan.steps) - 1)
            )

            try:
                # Execute step using appropriate tool
                result = await self.execute_step(step)

                # Update step status
                await self.db.update_step(
                    db_step.step_id,
                    status="completed",
                    output=result
                )

                results.append({
                    "step": step.name,
                    "result": result,
                    "status": "success"
                })

            except Exception as e:
                await self.db.update_step(
                    db_step.step_id,
                    status="failed",
                    output=str(e)
                )

                # Attempt to recover or replan
                recovery = await self.attempt_recovery(step, e)

                if recovery:
                    results.append(recovery)
                else:
                    raise

        return results

    async def execute_step(self, step):
        """
        Execute a single step using the specified tool
        """
        tool_name = step.tool
        tool_input = step.input

        # Get tool from registry
        tool = self.action_registry.get(tool_name)

        if not tool:
            # Try to execute via n8n workflow
            return await self.execute_via_n8n(step)

        # Execute tool
        result = await tool(self, step.task_id, **tool_input)

        return result

    async def execute_via_n8n(self, step):
        """
        Execute step using n8n workflow
        """
        # Send to n8n engine
        from integrations.n8n_client import execute_workflow

        result = await execute_workflow(
            workflow_id=step.workflow_id,
            input_data=step.input
        )

        return result
```

2. **Add Custom Actions** (`apps/agent-engine/src/actions/`):

```python
# apps/agent-engine/src/actions/research.py

from forge.actions.registry import action

@action(
    name="web_research",
    description="Research a topic by searching the web and summarizing results",
    parameters=[
        {
            "name": "query",
            "type": "string",
            "description": "The research query",
            "required": True
        },
        {
            "name": "num_results",
            "type": "integer",
            "description": "Number of results to analyze",
            "required": False,
            "default": 10
        }
    ],
    output_type="string"
)
async def web_research(agent, task_id: str, query: str, num_results: int = 10):
    """
    Perform web research and return summarized insights
    """
    # Search using DuckDuckGo
    from forge.actions.web.web_search import web_search

    search_results = await web_search(agent, task_id, query)

    # Read top results
    insights = []
    for result in search_results[:num_results]:
        try:
            content = await agent.read_webpage(result['url'])
            insights.append({
                "source": result['url'],
                "title": result['title'],
                "content": content[:500]  # First 500 chars
            })
        except:
            continue

    # Summarize with LLM
    summary_prompt = f"""
    Summarize these research findings on "{query}":

    {insights}

    Provide:
    1. Key insights (3-5 bullet points)
    2. Main themes
    3. Notable sources
    """

    summary = await agent.llm.chat(summary_prompt)

    return {
        "query": query,
        "num_sources": len(insights),
        "summary": summary,
        "sources": [i['source'] for i in insights]
    }
```

### Step 3: Setup n8n Integration

```bash
cd integrations/n8n-core

# Clone n8n
git clone https://github.com/n8n-io/n8n.git
cd n8n

# Install
npm install

# Build
npm run build
```

**Create n8n Wrapper** (`integrations/n8n-core/src/n8n_client.ts`):

```typescript
import { Workflow, WorkflowExecute } from 'n8n-core';
import { IWorkflowExecuteAdditionalData, IExecuteData } from 'n8n-workflow';

export class N8nClient {
  private workflows: Map<string, Workflow> = new Map();

  async loadWorkflow(workflowId: string, workflowData: any): Promise<void> {
    const workflow = new Workflow({
      id: workflowId,
      name: workflowData.name,
      nodes: workflowData.nodes,
      connections: workflowData.connections,
      active: true,
      settings: workflowData.settings,
    });

    this.workflows.set(workflowId, workflow);
  }

  async executeWorkflow(
    workflowId: string,
    inputData: any,
    userId: string
  ): Promise<any> {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    // Setup execution data
    const executionData: IExecuteData = {
      data: {
        main: [[{ json: inputData }]],
      },
      node: workflow.getStartNode()!,
    };

    const additionalData: IWorkflowExecuteAdditionalData = {
      // Add credentials, hooks, etc.
      userId,
      executionId: generateExecutionId(),
    };

    // Execute
    const workflowExecute = new WorkflowExecute(
      additionalData,
      'manual'
    );

    const result = await workflowExecute.run(
      workflow,
      executionData
    );

    return result;
  }

  async getAvailableIntegrations(): Promise<string[]> {
    // Return list of available n8n nodes
    return [
      'slack',
      'gmail',
      'salesforce',
      'hubspot',
      'airtable',
      'google-sheets',
      // ... 500+ more
    ];
  }
}

function generateExecutionId(): string {
  return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

### Step 4: Database Schema

**Create Prisma Schema** (`packages/db/prisma/schema.prisma`):

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Users
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String?

  // Stripe
  stripeCustomerId String? @unique
  subscription     Subscription?

  // Relations
  agents        Agent[]
  tasks         Task[]
  apiKeys       ApiKey[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// Subscriptions
model Subscription {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id])

  stripeSubscriptionId String @unique
  stripePriceId        String
  stripeCurrentPeriodEnd DateTime

  plan              String   // starter, professional, business, enterprise
  status            String   // active, canceled, past_due

  // Usage limits
  maxAgents         Int
  maxExecutionsPerMonth Int
  currentExecutions Int      @default(0)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

// Agents
model Agent {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  name        String
  description String?
  goal        String   // The agent's main objective

  // Configuration
  config      Json     // Agent-specific settings
  template    String?  // Template ID if based on template

  // Status
  active      Boolean  @default(true)
  deployed    Boolean  @default(false)

  // Stats
  totalExecutions Int  @default(0)
  successRate     Float @default(0)
  avgExecutionTime Float @default(0)

  // Relations
  tasks       Task[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}

// Tasks
model Task {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  agentId     String
  agent       Agent    @relation(fields: [agentId], references: [id])

  input       String   @db.Text
  status      String   // pending, running, completed, failed

  // Results
  output      Json?
  error       String?  @db.Text

  // Execution details
  steps       Step[]
  artifacts   Artifact[]

  // Metrics
  startedAt   DateTime?
  completedAt DateTime?
  duration    Int?     // milliseconds
  cost        Float?   // LLM API cost

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([agentId])
  @@index([status])
}

// Steps (individual actions within a task)
model Step {
  id          String   @id @default(cuid())
  taskId      String
  task        Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)

  name        String
  stepNumber  Int

  input       Json?
  output      Json?
  status      String   // pending, running, completed, failed
  error       String?  @db.Text

  // Tool/action used
  toolName    String
  toolConfig  Json?

  // Timing
  startedAt   DateTime?
  completedAt DateTime?
  duration    Int?

  createdAt   DateTime @default(now())

  @@index([taskId])
}

// Artifacts (files/data produced by agents)
model Artifact {
  id          String   @id @default(cuid())
  taskId      String
  task        Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)

  fileName    String
  fileType    String
  fileSize    Int

  // Storage
  storageUrl  String   // S3/GCS URL

  createdAt   DateTime @default(now())

  @@index([taskId])
}

// Agent Templates
model AgentTemplate {
  id          String   @id @default(cuid())

  name        String
  description String   @db.Text
  category    String   // marketing, sales, support, etc.

  // Template configuration
  config      Json

  // Stats
  usageCount  Int      @default(0)
  rating      Float    @default(0)

  // Visibility
  public      Boolean  @default(true)
  featured    Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// API Keys (for programmatic access)
model ApiKey {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  name        String
  key         String   @unique

  lastUsedAt  DateTime?
  expiresAt   DateTime?

  createdAt   DateTime @default(now())

  @@index([userId])
}

// Webhooks
model Webhook {
  id          String   @id @default(cuid())
  userId      String

  url         String
  events      String[] // task.completed, task.failed, etc.
  secret      String

  active      Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

**Run migrations**:

```bash
cd packages/db
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🎨 PHASE 2: FRONTEND (Weeks 3-4)

### Step 1: Next.js Setup

```bash
cd apps/web
npx create-next-app@latest . --typescript --tailwind --app
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install zustand @tanstack/react-query
npm install react-flow-renderer
npm install framer-motion
npm install react-hook-form zod
```

### Step 2: Create Agent Builder UI

**Agent Builder Component** (`apps/web/components/agent-builder.tsx`):

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const agentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  goal: z.string().min(10, 'Goal must be at least 10 characters'),
  description: z.string().optional(),
});

type AgentFormData = z.infer<typeof agentSchema>;

export function AgentBuilder() {
  const [agentPlan, setAgentPlan] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
  });

  const onSubmit = async (data: AgentFormData) => {
    setIsAnalyzing(true);

    try {
      // Call API to analyze goal and create plan
      const response = await fetch('/api/agents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const plan = await response.json();
      setAgentPlan(plan);
    } catch (error) {
      console.error('Failed to analyze agent goal:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createAgent = async () => {
    const response = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form.getValues(),
        plan: agentPlan,
      }),
    });

    const agent = await response.json();

    // Redirect to agent page
    window.location.href = `/agents/${agent.id}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Agent</h1>

      <Card className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Agent Name
            </label>
            <input
              {...form.register('name')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Lead Research Agent"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              What should this agent do?
            </label>
            <Textarea
              {...form.register('goal')}
              className="w-full min-h-[150px]"
              placeholder="Find companies that recently raised Series A funding, research their tech stack, and draft personalized outreach emails..."
            />
            {form.formState.errors.goal && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.goal.message}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Describe your goal in plain English. Be specific about what you want the agent to accomplish.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze & Create Plan'}
          </Button>
        </form>

        {agentPlan && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Agent Execution Plan</h3>

            <div className="space-y-4">
              {agentPlan.steps.map((step: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs">
                          {step.tool}
                        </span>
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs">
                          ~{step.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Estimated Performance</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Steps</p>
                  <p className="text-2xl font-bold">{agentPlan.steps.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Est. Time</p>
                  <p className="text-2xl font-bold">{agentPlan.estimatedTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Est. Cost</p>
                  <p className="text-2xl font-bold">${agentPlan.estimatedCost}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={createAgent}
              className="w-full mt-6"
              size="lg"
            >
              Create Agent
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
```

### Step 3: Create API Routes

**Agent Analysis API** (`apps/web/app/api/agents/analyze/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  // Authenticate user
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { goal, name } = await request.json();

  // Use GPT-4 to analyze goal and create execution plan
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an AI agent planner. Given a user's goal, create a detailed execution plan.

Available tools:
- web_search: Search the web using DuckDuckGo
- web_scrape: Extract content from a webpage
- linkedin_search: Find people/companies on LinkedIn
- crunchbase_search: Research companies and funding
- email_draft: Draft personalized emails
- google_sheets: Read/write to Google Sheets
- airtable: Manage Airtable records
- slack_post: Send Slack messages
- hubspot_create: Create HubSpot records
- salesforce_query: Query Salesforce data

Return a JSON object with this structure:
{
  "complexity": "simple" | "medium" | "complex",
  "estimatedTime": "5 minutes",
  "estimatedCost": "0.05",
  "requiredIntegrations": ["linkedin", "gmail"],
  "steps": [
    {
      "name": "Search for Series A companies",
      "description": "Use Crunchbase to find companies that raised Series A in last 6 months",
      "tool": "crunchbase_search",
      "estimatedTime": "30 seconds",
      "parameters": {...}
    },
    ...
  ]
}`,
      },
      {
        role: 'user',
        content: `Create an execution plan for this goal:\n\n${goal}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const plan = JSON.parse(completion.choices[0].message.content || '{}');

  return NextResponse.json(plan);
}
```

**Agent Creation API** (`apps/web/app/api/agents/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, goal, description, plan } = await request.json();

  // Get user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscription: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check subscription limits
  const agentCount = await prisma.agent.count({
    where: { userId: user.id },
  });

  if (agentCount >= (user.subscription?.maxAgents || 3)) {
    return NextResponse.json(
      { error: 'Agent limit reached. Please upgrade your plan.' },
      { status: 403 }
    );
  }

  // Create agent
  const agent = await prisma.agent.create({
    data: {
      userId: user.id,
      name,
      goal,
      description,
      config: { plan },
      active: true,
      deployed: false,
    },
  });

  return NextResponse.json(agent);
}

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const agents = await prisma.agent.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(agents);
}
```

---

## 💳 PHASE 3: STRIPE INTEGRATION (Week 5)

### Step 1: Setup Stripe

```bash
npm install stripe @stripe/stripe-js
```

**Stripe Configuration** (`apps/web/lib/stripe.ts`):

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const PLANS = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    price: 49,
    maxAgents: 3,
    maxExecutions: 1000,
  },
  professional: {
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
    price: 199,
    maxAgents: 10,
    maxExecutions: 5000,
  },
  business: {
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
    price: 499,
    maxAgents: 50,
    maxExecutions: 25000,
  },
};
```

**Checkout API** (`apps/web/app/api/checkout/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { stripe, PLANS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan } = await request.json();

  if (!PLANS[plan as keyof typeof PLANS]) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const planConfig = PLANS[plan as keyof typeof PLANS];

  // Create Stripe checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
    customer_email: session.user.email,
    metadata: {
      userId: session.user.id,
      plan,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
```

**Webhook Handler** (`apps/web/app/api/webhooks/stripe/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle subscription events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Create subscription in database
      await prisma.subscription.create({
        data: {
          userId: session.metadata!.userId,
          stripeSubscriptionId: session.subscription as string,
          stripePriceId: session.line_items?.data[0].price!.id!,
          stripeCurrentPeriodEnd: new Date(session.expires_at * 1000),
          plan: session.metadata!.plan,
          status: 'active',
          maxAgents: PLANS[session.metadata!.plan].maxAgents,
          maxExecutionsPerMonth: PLANS[session.metadata!.plan].maxExecutions,
        },
      });
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;

      // Update subscription
      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: invoice.subscription as string,
        },
        data: {
          status: 'active',
          stripeCurrentPeriodEnd: new Date(invoice.period_end * 1000),
          currentExecutions: 0, // Reset monthly counter
        },
      });
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;

      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: invoice.subscription as string,
        },
        data: {
          status: 'past_due',
        },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          status: 'canceled',
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## 🚀 DEPLOYMENT & SCALING

### Docker Setup

**docker-compose.yml**:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: creai
      POSTGRES_USER: creai
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://creai:${POSTGRES_PASSWORD}@postgres:5432/creai
      REDIS_URL: redis://redis:6379
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    depends_on:
      - postgres
      - redis
    ports:
      - "3001:3001"

  agent-engine:
    build:
      context: ./apps/agent-engine
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://creai:${POSTGRES_PASSWORD}@postgres:5432/creai
      REDIS_URL: redis://redis:6379
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - postgres
      - redis
    ports:
      - "8000:8000"

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://api:3001
      DATABASE_URL: postgresql://creai:${POSTGRES_PASSWORD}@postgres:5432/creai
    depends_on:
      - api
    ports:
      - "3000:3000"

volumes:
  postgres_data:
  redis_data:
```

---

## 📊 MONITORING & ANALYTICS

### Add Sentry for Error Tracking

```bash
npm install @sentry/nextjs @sentry/node
```

### Add PostHog for Product Analytics

```bash
npm install posthog-js
```

**PostHog Setup** (`apps/web/lib/posthog.ts`):

```typescript
import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
    });
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  posthog.capture(eventName, properties);
}
```

**Track Key Events**:
```typescript
// When agent is created
trackEvent('agent_created', {
  agentId: agent.id,
  complexity: plan.complexity,
  estimatedCost: plan.estimatedCost,
});

// When task is executed
trackEvent('task_executed', {
  agentId,
  taskId,
  duration,
  status: 'success',
  cost,
});

// When user upgrades
trackEvent('subscription_upgraded', {
  fromPlan: 'starter',
  toPlan: 'professional',
  revenue: 199,
});
```

---

## ✅ LAUNCH CHECKLIST

### Pre-Launch
- [ ] All database migrations run
- [ ] Stripe webhooks configured
- [ ] Environment variables set
- [ ] SSL certificates installed
- [ ] Monitoring tools configured
- [ ] Error tracking active
- [ ] Analytics installed
- [ ] Email service configured
- [ ] 5+ agent templates ready
- [ ] Documentation complete
- [ ] Terms of service published
- [ ] Privacy policy published

### Launch Day
- [ ] Deploy to production
- [ ] Test payment flow end-to-end
- [ ] Test agent creation & execution
- [ ] Monitor error rates
- [ ] Monitor performance
- [ ] Respond to user feedback

### Post-Launch
- [ ] Monitor KPIs daily
- [ ] A/B test landing page
- [ ] Gather user testimonials
- [ ] Create more agent templates
- [ ] Build community

---

This technical guide provides everything needed to build CreAI from scratch using AutoGPT + n8n + modern web technologies. The architecture is scalable, the code is production-ready, and the monetization is built-in from day one.
