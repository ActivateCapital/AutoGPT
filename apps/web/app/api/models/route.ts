import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { EnhancedAgentEngine } from '@/lib/enhanced-agent-engine';
import { prisma } from '@creai/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    const subscriptionPlan = subscription?.plan || 'free';

    // Get available models for this subscription tier
    const availableModels = EnhancedAgentEngine.getAvailableModels(subscriptionPlan);

    return NextResponse.json({
      subscription: {
        plan: subscriptionPlan,
        status: subscription?.status || 'active',
      },
      models: availableModels,
      count: availableModels.length,
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available models' },
      { status: 500 }
    );
  }
}
