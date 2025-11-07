export const AGENT_TEMPLATES = [
  {
    id: 'lead-research',
    name: 'Lead Research Agent',
    description: 'Research and qualify potential leads from LinkedIn, company websites, and business databases',
    category: 'lead-generation',
    icon: '🎯',
    defaultGoal: 'Research B2B SaaS companies in the marketing automation space that raised Series A funding in the last 6 months. For each company, find: company name, website, funding amount, decision makers (CEO, CTO, CMO), tech stack, and draft a personalized outreach email.',
    recommendedModel: 'gpt-4o',
    config: {
      actions: ['web_search', 'web_scrape', 'data_analysis', 'email_draft'],
      maxSteps: 10,
      model: 'gpt-4o',
    },
  },
  {
    id: 'content-writer',
    name: 'Content Writer Agent',
    description: 'Research topics and write SEO-optimized blog posts, articles, and social media content',
    category: 'content-creation',
    icon: '✍️',
    defaultGoal: 'Research the topic "AI agents for business automation" and write a 1500-word SEO-optimized blog post. Include: current market trends, top 5 use cases, benefits, challenges, and actionable tips for businesses getting started.',
    recommendedModel: 'claude-3-5-sonnet-20241022',
    config: {
      actions: ['web_search', 'content_generation', 'data_analysis'],
      maxSteps: 8,
      model: 'claude-3-5-sonnet-20241022',
    },
  },
  {
    id: 'competitor-research',
    name: 'Competitor Intelligence Agent',
    description: 'Monitor competitors and analyze their pricing, features, marketing strategies, and customer reviews',
    category: 'research',
    icon: '🔍',
    defaultGoal: 'Research the top 5 competitors in the AI automation space. For each competitor, analyze: pricing tiers, key features, unique selling propositions, customer reviews (pros/cons), marketing channels they use, and recent product updates.',
    recommendedModel: 'gpt-4o',
    config: {
      actions: ['web_search', 'web_scrape', 'data_analysis'],
      maxSteps: 12,
      model: 'gpt-4o',
    },
  },
  {
    id: 'email-responder',
    name: 'Email Response Agent',
    description: 'Draft professional email responses based on context and tone requirements',
    category: 'communication',
    icon: '📧',
    defaultGoal: 'Draft a professional response to a customer inquiry about our pricing. Tone: friendly and helpful. Include: acknowledgment of their question, clear explanation of our pricing tiers, key benefits of each tier, and a soft call-to-action to schedule a demo.',
    recommendedModel: 'claude-3-5-haiku-20241022',
    config: {
      actions: ['content_generation'],
      maxSteps: 3,
      model: 'claude-3-5-haiku-20241022',
    },
  },
  {
    id: 'market-research',
    name: 'Market Research Agent',
    description: 'Analyze market trends, customer pain points, and opportunities in any industry',
    category: 'research',
    icon: '📊',
    defaultGoal: 'Research the no-code automation tools market. Provide: market size and growth rate, top players and their market share, emerging trends, customer pain points, gaps in current solutions, and opportunities for new entrants.',
    recommendedModel: 'claude-3-5-sonnet-20241022',
    config: {
      actions: ['web_search', 'data_analysis'],
      maxSteps: 10,
      model: 'claude-3-5-sonnet-20241022',
    },
  },
  {
    id: 'social-media',
    name: 'Social Media Content Agent',
    description: 'Create engaging social media posts tailored for different platforms (Twitter, LinkedIn, etc.)',
    category: 'content-creation',
    icon: '📱',
    defaultGoal: 'Create a social media content calendar for the next week promoting our AI agent platform. For each day, create: 1 Twitter/X post (280 chars), 1 LinkedIn post (longer form), topic ideas, relevant hashtags, and suggested posting times.',
    recommendedModel: 'gpt-4o',
    config: {
      actions: ['content_generation', 'web_search'],
      maxSteps: 7,
      model: 'gpt-4o',
    },
  },
]

export function getTemplate(id: string) {
  return AGENT_TEMPLATES.find((t) => t.id === id)
}

export function getTemplatesByCategory(category: string) {
  return AGENT_TEMPLATES.filter((t) => t.category === category)
}
