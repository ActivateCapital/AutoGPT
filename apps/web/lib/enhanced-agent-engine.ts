import { streamText, generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { prisma } from '@creai/db';

// Model configurations with cost tracking
const MODEL_CONFIGS = {
  'gpt-3.5-turbo': {
    provider: 'openai',
    model: openai('gpt-3.5-turbo'),
    costPer1kTokens: 0.0015, // $0.0005 input + $0.0015 output (average)
    tier: 'free',
    description: 'Fast and cost-effective for simple tasks',
  },
  'gpt-4-turbo': {
    provider: 'openai',
    model: openai('gpt-4-turbo'),
    costPer1kTokens: 0.02, // $0.01 input + $0.03 output (average)
    tier: 'professional',
    description: 'Best for complex reasoning and analysis',
  },
  'gpt-4o': {
    provider: 'openai',
    model: openai('gpt-4o'),
    costPer1kTokens: 0.0075, // $0.0025 input + $0.01 output (average)
    tier: 'professional',
    description: 'Balanced performance and cost',
  },
  'claude-3-5-sonnet-20241022': {
    provider: 'anthropic',
    model: anthropic('claude-3-5-sonnet-20241022'),
    costPer1kTokens: 0.018, // $0.003 input + $0.015 output (average)
    tier: 'professional',
    description: 'Excellent for long-form content and analysis',
  },
  'claude-3-5-haiku-20241022': {
    provider: 'anthropic',
    model: anthropic('claude-3-5-haiku-20241022'),
    costPer1kTokens: 0.005, // $0.0008 input + $0.004 output (average)
    tier: 'professional',
    description: 'Fast and affordable for straightforward tasks',
  },
} as const;

type ModelKey = keyof typeof MODEL_CONFIGS;

interface AgentStep {
  step: number;
  action: string;
  thought: string;
  result: string;
  tokensUsed?: number;
  cost?: number;
}

// Define tools using Zod schemas for type safety
const tools = {
  webSearch: tool({
    description: 'Search the web for current information. Use this when you need up-to-date data, research, or facts.',
    parameters: z.object({
      query: z.string().describe('The search query'),
      numResults: z.number().optional().describe('Number of results to return (default: 5)'),
    }),
    execute: async ({ query, numResults = 5 }) => {
      // Simulate web search - in production, integrate with Serper, Tavily, or Brave Search API
      return {
        query,
        results: [
          {
            title: `Search result 1 for: ${query}`,
            url: 'https://example.com/result1',
            snippet: `Relevant information about ${query}...`,
          },
          {
            title: `Search result 2 for: ${query}`,
            url: 'https://example.com/result2',
            snippet: `Additional details about ${query}...`,
          },
        ].slice(0, numResults),
        timestamp: new Date().toISOString(),
      };
    },
  }),

  scrapeWebsite: tool({
    description: 'Extract and analyze content from a specific URL',
    parameters: z.object({
      url: z.string().url().describe('The URL to scrape'),
      selector: z.string().optional().describe('Optional CSS selector to extract specific content'),
    }),
    execute: async ({ url, selector }) => {
      // Simulate web scraping - in production, integrate with Firecrawl or Browserless
      return {
        url,
        content: `Content extracted from ${url}${selector ? ` using selector ${selector}` : ''}`,
        metadata: {
          title: 'Example Page Title',
          description: 'Example page description',
          scrapedAt: new Date().toISOString(),
        },
      };
    },
  }),

  analyzeData: tool({
    description: 'Analyze structured or unstructured data and provide insights',
    parameters: z.object({
      data: z.string().describe('The data to analyze (can be text, JSON, or CSV format)'),
      analysisType: z.enum(['summary', 'trends', 'comparison', 'classification']).describe('Type of analysis to perform'),
    }),
    execute: async ({ data, analysisType }) => {
      return {
        analysisType,
        dataPreview: data.substring(0, 200),
        insights: `Analysis of type "${analysisType}" completed. Key findings: [Insights would be generated here]`,
        confidence: 0.87,
      };
    },
  }),

  generateContent: tool({
    description: 'Generate high-quality written content for specific purposes',
    parameters: z.object({
      contentType: z.enum(['email', 'blog', 'social', 'report', 'copy']).describe('Type of content to generate'),
      topic: z.string().describe('Topic or subject matter'),
      tone: z.enum(['professional', 'casual', 'persuasive', 'informative']).optional().describe('Tone of voice'),
      length: z.enum(['short', 'medium', 'long']).optional().describe('Desired length'),
    }),
    execute: async ({ contentType, topic, tone = 'professional', length = 'medium' }) => {
      return {
        contentType,
        topic,
        tone,
        length,
        generatedContent: `[Generated ${contentType} content about ${topic} would appear here]`,
        wordCount: 350,
        readingTime: '2 min',
      };
    },
  }),
};

export class EnhancedAgentEngine {
  /**
   * Select the appropriate model based on agent config and user subscription
   */
  private selectModel(agentConfig: any, subscriptionPlan: string): ModelKey {
    // If agent has model preference, use it (if user has access)
    if (agentConfig?.model && MODEL_CONFIGS[agentConfig.model as ModelKey]) {
      const modelConfig = MODEL_CONFIGS[agentConfig.model as ModelKey];

      // Check if user has access to this model tier
      if (this.hasModelAccess(subscriptionPlan, modelConfig.tier)) {
        return agentConfig.model as ModelKey;
      }
    }

    // Default model selection based on subscription
    switch (subscriptionPlan) {
      case 'business':
      case 'enterprise':
        return 'claude-3-5-sonnet-20241022'; // Best quality
      case 'professional':
        return 'gpt-4o'; // Balanced
      default:
        return 'gpt-3.5-turbo'; // Free tier
    }
  }

  private hasModelAccess(subscriptionPlan: string, modelTier: string): boolean {
    const tierHierarchy = { free: 0, professional: 1, business: 2, enterprise: 3 };
    const userTier = tierHierarchy[subscriptionPlan as keyof typeof tierHierarchy] || 0;
    const requiredTier = tierHierarchy[modelTier as keyof typeof tierHierarchy] || 0;
    return userTier >= requiredTier;
  }

  /**
   * Execute agent with streaming support
   */
  async executeAgentStreaming(
    executionId: string,
    goal: string,
    onUpdate?: (chunk: any) => void
  ) {
    const execution = await prisma.execution.findUnique({
      where: { id: executionId },
      include: { agent: true, user: { include: { subscription: true } } },
    });

    if (!execution) throw new Error('Execution not found');

    const startTime = Date.now();
    let totalTokensUsed = 0;
    let totalCost = 0;

    // Update status to running
    await prisma.execution.update({
      where: { id: executionId },
      data: { status: 'running', startedAt: new Date() },
    });

    try {
      const steps: AgentStep[] = [];
      const modelKey = this.selectModel(
        execution.agent.config,
        execution.user.subscription?.plan || 'free'
      );
      const modelConfig = MODEL_CONFIGS[modelKey];

      // Stream the agent execution
      const result = await streamText({
        model: modelConfig.model,
        system: `You are a highly capable AI assistant with access to powerful tools. You excel at both answering questions directly and executing complex tasks.

**Your Approach:**
1. **For simple questions**: Provide clear, direct answers using your knowledge. No need to use tools unless the question requires current information or research.
2. **For complex tasks**: Break them down into logical steps and use available tools when they add value.
3. **Be conversational**: Engage naturally with the user. You can have a conversation, not just execute tasks.
4. **Be thorough**: When using tools, explain what you're doing and why.

**Available Tools:**
- **webSearch**: Use when you need current information, recent data, or facts you don't know
- **scrapeWebsite**: Use to extract specific content from URLs
- **analyzeData**: Use to process and analyze structured data
- **generateContent**: Use to create formatted content (emails, blog posts, etc.)

**Guidelines:**
- Answer questions directly when you can
- Only use tools when they genuinely add value
- For greetings or casual conversation, just respond naturally
- For open-ended topics, provide comprehensive answers
- For research tasks, use tools to gather current information
- Always be helpful, accurate, and engaging

Now, address the user's request below:`,
        prompt: goal,
        tools,
        maxSteps: 10, // Allow multi-step reasoning
        onStepFinish: async ({ stepType, text, toolCalls, toolResults, usage }) => {
          // Track each step
          const step: AgentStep = {
            step: steps.length + 1,
            action: stepType,
            thought: text || '',
            result: toolResults ? JSON.stringify(toolResults) : text || '',
            tokensUsed: usage.totalTokens,
            cost: ((usage.totalTokens / 1000) * modelConfig.costPer1kTokens),
          };

          steps.push(step);
          totalTokensUsed += usage.totalTokens;
          totalCost += step.cost || 0;

          // Send update to client
          if (onUpdate) {
            onUpdate({
              type: 'step',
              step,
              progress: {
                currentStep: steps.length,
                totalTokens: totalTokensUsed,
                estimatedCost: totalCost,
              },
            });
          }

          // Update execution in database with progress
          await prisma.execution.update({
            where: { id: executionId },
            data: {
              steps: steps as any,
              tokensUsed: totalTokensUsed,
              cost: totalCost,
            },
          });
        },
      });

      // Compile final output
      let finalText = '';
      for await (const chunk of result.textStream) {
        finalText += chunk;
        if (onUpdate) {
          onUpdate({ type: 'text', content: chunk });
        }
      }

      const duration = Date.now() - startTime;

      // Update execution with final results
      await prisma.execution.update({
        where: { id: executionId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          duration,
          output: {
            summary: finalText,
            steps,
            model: modelKey,
            totalSteps: steps.length,
            completedAt: new Date().toISOString(),
          },
          steps: steps as any,
          tokensUsed: totalTokensUsed,
          cost: totalCost,
        },
      });

      // Update agent stats
      await prisma.agent.update({
        where: { id: execution.agentId },
        data: {
          totalExecutions: { increment: 1 },
          lastExecutedAt: new Date(),
        },
      });

      // Update subscription usage
      if (execution.user.subscription) {
        await prisma.subscription.update({
          where: { userId: execution.userId },
          data: {
            usedExecutions: { increment: 1 },
          },
        });
      }

      return {
        summary: finalText,
        steps,
        model: modelKey,
        tokensUsed: totalTokensUsed,
        cost: totalCost,
        duration,
      };
    } catch (error: any) {
      await prisma.execution.update({
        where: { id: executionId },
        data: {
          status: 'failed',
          error: error.message,
          completedAt: new Date(),
          duration: Date.now() - startTime,
        },
      });
      throw error;
    }
  }

  /**
   * Execute agent without streaming (for backwards compatibility)
   */
  async executeAgent(executionId: string, goal: string) {
    return this.executeAgentStreaming(executionId, goal);
  }

  /**
   * Get available models for a subscription tier
   */
  static getAvailableModels(subscriptionPlan: string) {
    return Object.entries(MODEL_CONFIGS)
      .filter(([_, config]) => {
        const tierHierarchy = { free: 0, professional: 1, business: 2, enterprise: 3 };
        const userTier = tierHierarchy[subscriptionPlan as keyof typeof tierHierarchy] || 0;
        const requiredTier = tierHierarchy[config.tier as keyof typeof tierHierarchy] || 0;
        return userTier >= requiredTier;
      })
      .map(([key, config]) => ({
        id: key,
        name: key,
        provider: config.provider,
        description: config.description,
        costPer1kTokens: config.costPer1kTokens,
        tier: config.tier,
      }));
  }
}

// Export for backwards compatibility
export { EnhancedAgentEngine as AgentEngine };
