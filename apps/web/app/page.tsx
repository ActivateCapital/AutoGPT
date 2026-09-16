import { ArrowRight, Check, Sparkles, Zap, Mail, FileText, Target, Package, Wrench, ChevronDown } from 'lucide-react';
import { kits, bundle, doneForYou, CONTACT_EMAIL, PAYMENT_LINK_PENDING, type Product } from '@/lib/products';

const kitIcons: Record<string, React.ReactNode> = {
  'lead-qualifier-kit': <Target className="w-10 h-10 text-purple-400" />,
  'inbox-triage-kit': <Mail className="w-10 h-10 text-cyan-400" />,
  'content-repurposer-kit': <FileText className="w-10 h-10 text-emerald-400" />,
};

function BuyButton({ product, highlighted = false }: { product: Product; highlighted?: boolean }) {
  const pending = product.paymentLink === PAYMENT_LINK_PENDING;
  const classes = `w-full py-3 rounded-lg font-semibold transition-all text-center block ${
    pending
      ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
      : highlighted
        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg shadow-purple-500/50'
        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
  }`;

  if (pending) {
    return <span className={classes}>Launching soon</span>;
  }
  return (
    <a href={product.paymentLink} className={classes} rel="noopener">
      Buy {product.price} — instant download
    </a>
  );
}

export default function Home() {
  const contactReady = CONTACT_EMAIL !== 'CONTACT_EMAIL_PENDING';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-purple-400" />
            <span className="text-2xl font-bold text-white">CreAI</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#kits"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all"
            >
              Get the Kits
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm mb-8">
            <Zap className="w-4 h-4" />
            <span>Not a platform. Not a waitlist. Working automations you own.</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Ship a Working AI Agent
            <br />
            <span className="gradient-text">This Afternoon</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            CreAI Automation Kits are complete, ready-to-run agent automations — the prompt
            system, the runnable code, the no-code recipe, and the setup guide. Buy one,
            follow the 15-minute guide, and it&apos;s doing real work today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <a
              href="#kits"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-purple-500/50"
            >
              See the Kits
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#done-for-you"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all border border-white/20"
            >
              Or have us build it for you
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>15-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>You own the code — no subscription</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Runs on your own Claude API key</span>
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Why kits, not another SaaS */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why a Kit Beats Another Subscription
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Package className="w-10 h-10 text-purple-400" />,
                title: 'You own it',
                description:
                  'One payment. The prompts, code, and recipes are yours to run, edit, and reuse forever. No per-seat pricing, no vendor lock-in.',
              },
              {
                icon: <Wrench className="w-10 h-10 text-cyan-400" />,
                title: 'It actually runs',
                description:
                  'Every kit ships runnable code with sample data and tests — not a PDF of ideas. If you can paste an API key, you can run it.',
              },
              {
                icon: <Sparkles className="w-10 h-10 text-emerald-400" />,
                title: 'Built on frontier AI',
                description:
                  'Each kit is engineered around the Claude API with structured outputs, so results are consistent enough to trust in a real workflow.',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm hover:border-purple-500/50 transition-all">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kits */}
      <section id="kits" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Kits</h2>
            <p className="text-xl text-gray-300">
              Pick the workflow that hurts most. Each kit is complete on its own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {kits.map((kit) => (
              <div
                key={kit.id}
                className="flex flex-col p-8 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm hover:border-purple-500/30 transition-all"
              >
                <div className="mb-4">{kitIcons[kit.id]}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{kit.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{kit.price}</span>
                  <span className="text-gray-400"> one-time</span>
                </div>
                <p className="text-gray-400 mb-6">{kit.tagline}</p>

                <p className="text-sm font-semibold text-purple-300 mb-2">What you get done:</p>
                <ul className="space-y-2 mb-6">
                  {kit.outcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{o}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm font-semibold text-purple-300 mb-2">In the box:</p>
                <ul className="space-y-2 mb-8">
                  {kit.contents.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 text-sm">{c}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <BuyButton product={kit} />
                </div>
              </div>
            ))}
          </div>

          {/* Bundle */}
          <div className="relative p-8 rounded-lg bg-gradient-to-b from-purple-500/20 to-cyan-500/20 border-2 border-purple-500 max-w-2xl mx-auto text-center">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-semibold rounded-full">
              BEST VALUE
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{bundle.name}</h3>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">{bundle.price}</span>
              <span className="text-gray-400"> one-time</span>
            </div>
            <p className="text-gray-300 mb-6">{bundle.tagline}</p>
            <ul className="space-y-2 mb-8 inline-block text-left">
              {bundle.outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{o}</span>
                </li>
              ))}
            </ul>
            <BuyButton product={bundle} highlighted />
          </div>
        </div>
      </section>

      {/* Done-for-you */}
      <section id="done-for-you" className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{doneForYou.name}</h2>
          <div className="mb-4">
            <span className="text-3xl font-bold text-white">{doneForYou.price}</span>
            <span className="text-gray-400"> · fixed scope, fixed price</span>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{doneForYou.tagline}</p>
          {contactReady ? (
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(doneForYou.contactSubject)}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/50"
            >
              Tell us about your workflow
              <ArrowRight className="w-5 h-5" />
            </a>
          ) : (
            <span className="inline-block px-8 py-4 bg-white/5 text-gray-500 border border-white/10 rounded-lg font-semibold cursor-not-allowed">
              Launching soon
            </span>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Straight Answers</h2>
          <div className="space-y-8">
            {[
              {
                q: 'What exactly do I download?',
                a: 'A zip with the full kit: the prompt system (editable markdown), a small Python command-line tool, a no-code recipe for Zapier or similar, sample data, a test suite, and a step-by-step setup guide. Nothing is hosted by us; it all runs on your side.',
              },
              {
                q: 'What do I need to run it?',
                a: 'An Anthropic (Claude) API key, and either Python 3.10+ for the CLI or a Zapier-style account for the no-code recipe. API usage is billed by Anthropic to you and typically costs cents per run at these workloads.',
              },
              {
                q: 'Is this a subscription?',
                a: 'No. One payment, yours forever, including updates to the kit you bought. The only recurring cost is your own Claude API usage.',
              },
              {
                q: 'What if it doesn’t work for me?',
                a: '14-day money-back guarantee, no questions asked. Email us your receipt and you get a refund.',
              },
              {
                q: 'Is this the CreAI no-code platform?',
                a: 'Not yet. The visual agent-builder platform is on our roadmap, and kit customers get first access when it ships. The kits are how we deliver value today instead of asking you to join a waitlist.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The Work Is Piling Up While You Read This
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            One kit, one afternoon, one workflow off your plate — for less than an hour of anyone&apos;s time.
          </p>
          <a
            href="#kits"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/50"
          >
            Pick Your Kit
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400 space-y-2">
          <p>© 2026 CreAI. All rights reserved.</p>
          <p className="text-sm">
            Kits are independent products built on the Claude API. Claude is a trademark of Anthropic; CreAI is not
            affiliated with or endorsed by Anthropic.
          </p>
        </div>
      </footer>
    </div>
  );
}
