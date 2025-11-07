import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../../../packages/db';
import { EnhancedAgentEngine } from '../../../../../lib/enhanced-agent-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id: agentId } = params;
  const body = await request.json();
  const { input } = body;

  // Get agent
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
  });

  if (!agent) {
    return new Response('Agent not found', { status: 404 });
  }

  if (agent.userId !== session.user.id) {
    return new Response('Forbidden', { status: 403 });
  }

  // Check subscription limits
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const executionsUsed = subscription?.usedExecutions || 0;
  const maxExecutions = subscription?.maxExecutions || 100;

  if (executionsUsed >= maxExecutions) {
    return new Response(
      JSON.stringify({
        error: `Execution limit reached. You have used ${executionsUsed}/${maxExecutions} executions this month.`,
      }),
      { status: 403 }
    );
  }

  // Create execution record
  const execution = await prisma.execution.create({
    data: {
      userId: session.user.id,
      agentId,
      input,
      status: 'pending',
    },
  });

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Helper function to send SSE data
      const sendEvent = (event: string, data: any) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      try {
        sendEvent('start', {
          executionId: execution.id,
          agentName: agent.name,
          status: 'starting',
        });

        // Execute agent with streaming
        const engine = new EnhancedAgentEngine();

        await engine.executeAgentStreaming(
          execution.id,
          agent.goal + (input ? `\n\nAdditional context: ${input}` : ''),
          (update) => {
            // Send each update to the client
            if (update.type === 'step') {
              sendEvent('step', update);
            } else if (update.type === 'text') {
              sendEvent('text', update);
            }
          }
        );

        // Send completion event
        sendEvent('complete', {
          executionId: execution.id,
          status: 'completed',
        });

        controller.close();
      } catch (error: any) {
        sendEvent('error', {
          executionId: execution.id,
          error: error.message,
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering for nginx
    },
  });
}
