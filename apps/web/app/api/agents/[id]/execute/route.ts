import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import { prisma } from '../../../../../../../packages/db'
import { EnhancedAgentEngine } from '../../../../../lib/enhanced-agent-engine'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: agentId } = params
  const body = await request.json()
  const { input } = body

  // Get agent
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
  })

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  if (agent.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Check subscription limits
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  const currentMonth = new Date().getMonth()
  const executionsThisMonth = subscription?.currentExecutions || 0
  const maxExecutions = subscription?.maxExecutionsPerMonth || 100

  if (executionsThisMonth >= maxExecutions) {
    return NextResponse.json(
      {
        error: `Execution limit reached. You have used ${executionsThisMonth}/${maxExecutions} executions this month. Upgrade your plan for more.`,
      },
      { status: 403 }
    )
  }

  // Create execution record
  const execution = await prisma.execution.create({
    data: {
      userId: session.user.id,
      agentId,
      input,
      status: 'pending',
    },
  })

  // Execute agent asynchronously with enhanced engine
  const engine = new EnhancedAgentEngine()

  // Start execution in background
  engine
    .executeAgent(execution.id, agent.goal + (input ? `\n\nAdditional context: ${input}` : ''))
    .catch((error) => {
      console.error('Agent execution error:', error)
    })

  // Return execution ID immediately
  return NextResponse.json({
    executionId: execution.id,
    status: 'started',
    message: 'Agent execution started with enhanced AI engine. Check status at /api/executions/' + execution.id,
  })
}
