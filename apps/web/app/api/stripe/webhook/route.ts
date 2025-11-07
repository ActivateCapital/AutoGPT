import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@creai/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription') {
          const userId = session.metadata?.userId;
          const plan = session.metadata?.plan;
          const maxAgents = parseInt(session.metadata?.maxAgents || '3');
          const maxExecutions = parseInt(session.metadata?.maxExecutions || '100');
          const subscriptionId = session.subscription as string;

          if (userId) {
            // Create or update subscription in database
            await prisma.subscription.upsert({
              where: { userId },
              create: {
                userId,
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: session.customer as string,
                plan: plan || 'free',
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                maxAgents,
                maxExecutions,
                usedExecutions: 0,
              },
              update: {
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: session.customer as string,
                plan: plan || 'free',
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                maxAgents,
                maxExecutions,
              },
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        // Find subscription by Stripe subscription ID
        const dbSubscription = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (dbSubscription) {
          await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
              status: subscription.status === 'active' ? 'active' : 'cancelled',
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const dbSubscription = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (dbSubscription) {
          // Revert to free plan
          await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
              status: 'cancelled',
              plan: 'free',
              maxAgents: 3,
              maxExecutions: 100,
            },
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          const dbSubscription = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: invoice.subscription as string },
          });

          if (dbSubscription) {
            // Reset monthly usage on successful payment
            await prisma.subscription.update({
              where: { id: dbSubscription.id },
              data: {
                usedExecutions: 0,
                status: 'active',
              },
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          const dbSubscription = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: invoice.subscription as string },
          });

          if (dbSubscription) {
            await prisma.subscription.update({
              where: { id: dbSubscription.id },
              data: { status: 'past_due' },
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
