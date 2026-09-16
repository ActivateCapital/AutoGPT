'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bot, Check, Loader2, Zap, Crown, Rocket } from 'lucide-react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Subscription {
  id: string;
  plan: string;
  status: string;
  currentPeriodEnd: string;
  maxAgents: number;
  maxExecutions: number;
  usedExecutions: number;
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSubscription();
    }
  }, [status]);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscription');
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: string) => {
    setUpgrading(plan);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const { url } = await res.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setUpgrading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: 'FREE',
      period: '',
      icon: <Bot className="w-12 h-12 text-purple-400" />,
      description: 'Perfect for trying it out',
      features: [
        '3 active agents',
        '100 executions/month',
        '50+ pre-built templates',
        '50 integrations',
        'Email support',
        'Community access',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$199',
      period: '/month',
      icon: <Zap className="w-12 h-12 text-cyan-400" />,
      description: 'Most popular for businesses',
      features: [
        '10 active agents',
        '5,000 executions/month',
        '200+ templates',
        '200 integrations',
        'Priority support',
        'Multi-agent orchestration',
        'Team collaboration (5 seats)',
        'Custom branding',
      ],
      highlighted: true,
    },
    {
      id: 'business',
      name: 'Business',
      price: '$499',
      period: '/month',
      icon: <Crown className="w-12 h-12 text-yellow-400" />,
      description: 'For growing teams',
      features: [
        '50 active agents',
        '25,000 executions/month',
        'All templates',
        '500+ integrations',
        'Dedicated support',
        'Unlimited multi-agent',
        'Team features (20 seats)',
        'White-label options',
        'API access',
      ],
    },
  ];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  const currentPlan = subscription?.plan || 'free';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </Link>
          <Bot className="w-8 h-8 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Subscription Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Current Subscription Info */}
        {subscription && subscription.plan !== 'free' && (
          <div className="mb-8 bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-4">Current Subscription</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Plan</p>
                <p className="text-white text-lg font-semibold capitalize">{subscription.plan}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className={`text-lg font-semibold capitalize ${
                  subscription.status === 'active' ? 'text-emerald-400' : 'text-yellow-400'
                }`}>
                  {subscription.status}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Renews On</p>
                <p className="text-white text-lg font-semibold">
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Executions This Month</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((subscription.usedExecutions / subscription.maxExecutions) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-white font-mono text-sm">
                      {subscription.usedExecutions.toLocaleString()} / {subscription.maxExecutions.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Active Agents</p>
                  <p className="text-white font-mono">
                    Available: {subscription.maxAgents} agents
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {currentPlan === 'free' ? 'Upgrade Your Plan' : 'Available Plans'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentPlan;
              const canUpgrade = ['free', 'professional'].includes(currentPlan) && plan.id !== 'free';

              return (
                <div
                  key={plan.id}
                  className={`relative p-8 rounded-lg backdrop-blur-sm transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-purple-500/20 to-cyan-500/20 border-2 border-purple-500 scale-105'
                      : 'bg-white/5 border border-white/10'
                  } ${isCurrent ? 'ring-2 ring-emerald-500' : ''}`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-semibold rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">
                      CURRENT PLAN
                    </div>
                  )}

                  <div className="flex justify-center mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2 text-center">{plan.name}</h3>
                  <div className="mb-4 text-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 mb-6 text-center">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-3 bg-emerald-500/20 text-emerald-400 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : plan.id === 'free' ? (
                    <button
                      disabled
                      className="w-full py-3 bg-white/10 text-gray-400 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Downgrade via Support
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={upgrading !== null}
                      className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg shadow-purple-500/50'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {upgrading === plan.id ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5" />
                          Upgrade to {plan.name}
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            All plans include: ✓ 14-day money-back guarantee ✓ Cancel anytime ✓ No hidden fees
          </p>
          <p className="text-sm text-gray-500">
            Need a custom plan? <Link href="mailto:support@creai.dev" className="text-purple-400 hover:text-purple-300">Contact us</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
