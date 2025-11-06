'use client';

import { useState } from 'react';
import { ArrowRight, Check, Sparkles, Zap, Users, TrendingUp, X, ChevronDown } from 'lucide-react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Connect to actual API
    console.log('Waitlist signup:', email);

    // For now, just show success
    setSubmitted(true);
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Beta Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Now in Beta - Join the Waitlist</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Build AI Agents That
            <br />
            <span className="gradient-text">Actually Work For You</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
            The first no-code platform to create autonomous AI agents
            that automate your business workflows. No coding required.
          </p>

          {/* Waitlist Form */}
          {!submitted ? (
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-in">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-6 py-4 w-full sm:w-96 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 w-full sm:w-auto shadow-lg shadow-purple-500/50"
              >
                Join Waitlist
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 mb-8">
              <Check className="w-5 h-5" />
              <span className="font-semibold">You're on the list! Check your email for updates.</span>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Set up in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>500+ integrations</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">5,000+</div>
              <div className="text-gray-400">Businesses building agents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-gray-400">Agents created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-gray-400">Tasks automated</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Still Wasting 20+ Hours a Week on This?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                problem: 'Manual Research',
                description: 'Spending hours researching leads on LinkedIn, competitors, and market trends manually',
                cost: '$2,000/month',
                costDesc: 'on a VA who still needs supervision',
              },
              {
                problem: 'Copy-Paste Hell',
                description: 'Moving data between 10 different tools because nothing talks to each other',
                cost: '15+ hours/week',
                costDesc: 'of mind-numbing repetitive work',
              },
              {
                problem: 'Broken Automations',
                description: 'Zapier workflows break when anything changes. More work than doing it manually',
                cost: 'Constant fixes',
                costDesc: 'and maintenance needed',
              },
              {
                problem: '"AI" That Doesn\'t Act',
                description: 'ChatGPT can answer questions but can\'t actually DO anything useful for your business',
                cost: 'Just fancy chat',
                costDesc: 'that can\'t execute tasks',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <div className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.problem}</h3>
                    <p className="text-gray-400 mb-3">{item.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-red-400">{item.cost}</span>
                      <span className="text-gray-500">{item.costDesc}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-2xl text-purple-300 font-semibold">There's a better way. ↓</p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Your New AI Workforce
            </h2>
            <p className="text-xl text-gray-300">
              Agents that think, plan, and execute - while you sleep
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Sparkles className="w-12 h-12 text-purple-400" />,
                title: 'THINKS',
                subtitle: 'Understands Complex Instructions',
                description: 'Describe what you need in plain English. Your agent understands context and nuance.',
              },
              {
                icon: <Zap className="w-12 h-12 text-cyan-400" />,
                title: 'ADAPTS',
                subtitle: 'Handles the Unexpected',
                description: 'When things don\'t go as planned, agents adjust their approach and keep going.',
              },
              {
                icon: <Users className="w-12 h-12 text-emerald-400" />,
                title: 'COLLABORATES',
                subtitle: 'Multiple Agents Work Together',
                description: 'Build teams of specialized agents that collaborate on complex workflows.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-8 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm hover:border-purple-500/50 transition-all"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-purple-300 font-semibold mb-3">{item.subtitle}</p>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: 'FREE',
                period: '',
                description: 'Perfect for trying it out',
                features: [
                  '3 active agents',
                  '100 executions/month',
                  '50+ pre-built templates',
                  '50 integrations',
                  'Email support',
                  'Community access',
                ],
                cta: 'Start Free',
                highlighted: false,
              },
              {
                name: 'Professional',
                price: '$199',
                period: '/month',
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
                cta: 'Start 14-day Trial',
                highlighted: true,
              },
              {
                name: 'Business',
                price: '$499',
                period: '/month',
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
                cta: 'Start 14-day Trial',
                highlighted: false,
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-lg backdrop-blur-sm transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-purple-500/20 to-cyan-500/20 border-2 border-purple-500 scale-105'
                    : 'bg-white/5 border border-white/10 hover:border-purple-500/30'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-semibold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center text-gray-400">
            <p>All plans include: ✓ No credit card to start ✓ Cancel anytime ✓ 14-day money-back guarantee</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stop Wasting Time on Repetitive Tasks
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join 5,000+ businesses building AI agents that actually work for them
          </p>

          {!submitted ? (
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-6 py-4 w-full sm:w-96 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 w-full sm:w-auto shadow-lg shadow-purple-500/50"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 mb-8">
              <Check className="w-5 h-5" />
              <span className="font-semibold">You're on the list! Check your email for updates.</span>
            </div>
          )}

          <p className="text-gray-400">
            No credit card required • Set up in 5 min • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-gray-400">
            <p>© 2025 CreAI. All rights reserved. Built with ❤️ using AutoGPT + n8n</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
