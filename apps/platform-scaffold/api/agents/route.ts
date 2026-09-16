import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../../../packages/db'

// GET /api/agents - List user's agents
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const agents = await prisma.agent.findMany({
    where: { userId: session.user.id },
    include: {
      executions: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(agents)
}

// POST /api/agents - Create new agent
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, goal, templateId, config } = body

  // Validate input
  if (!name || !goal) {
    return NextResponse.json(
      { error: 'Name and goal are required' },
      { status: 400 }
    )
  }

  // Check subscription limits
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  const agentCount = await prisma.agent.count({
    where: { userId: session.user.id, active: true },
  })

  const maxAgents = subscription?.maxAgents || 3

  if (agentCount >= maxAgents) {
    return NextResponse.json(
      { error: `Agent limit reached. You can have up to ${maxAgents} active agents on your plan.` },
      { status: 403 }
    )
  }

  // Create agent
  const agent = await prisma.agent.create({
    data: {
      userId: session.user.id,
      name,
      description,
      goal,
      templateId,
      config: config || {},
    },
  })

  return NextResponse.json(agent)
}
