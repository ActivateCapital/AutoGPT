'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bot, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AGENT_TEMPLATES } from '@/lib/templates';

export default function NewAgentPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTemplateSelect = (templateId: string) => {
    const template = AGENT_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setName(template.name);
      setDescription(template.description);
      setGoal(template.defaultGoal);
    }
  };

  const handleCustom = () => {
    setSelectedTemplate('custom');
    setName('');
    setDescription('');
    setGoal('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const template = AGENT_TEMPLATES.find((t) => t.id === selectedTemplate);

      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          goal,
          templateId: selectedTemplate === 'custom' ? null : selectedTemplate,
          config: template?.config || {},
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create agent');
      }

      const agent = await res.json();
      router.push(`/dashboard/agents/${agent.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-white">Create New Agent</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Template Selection */}
        {!selectedTemplate && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Choose a Template</h2>
              <p className="text-gray-400">
                Start with a pre-built template or create a custom agent from scratch
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pre-built Templates */}
              {AGENT_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/50 transition-all text-left group"
                >
                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {template.config.actions.map((action) => (
                      <span
                        key={action}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                      >
                        {action.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </button>
              ))}

              {/* Custom Agent Option */}
              <button
                onClick={handleCustom}
                className="bg-white/5 border-2 border-dashed border-white/20 rounded-lg p-6 backdrop-blur-sm hover:bg-white/10 hover:border-cyan-500/50 transition-all text-left group"
              >
                <Sparkles className="w-10 h-10 text-cyan-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Custom Agent
                </h3>
                <p className="text-gray-400 text-sm">
                  Create your own agent from scratch with custom goals and configuration
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Agent Configuration Form */}
        {selectedTemplate && (
          <div>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to templates
            </button>

            <div className="bg-white/5 border border-white/10 rounded-lg p-8 backdrop-blur-sm max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Configure Your Agent</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., My Lead Research Agent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Brief description of what this agent does"
                  />
                </div>

                {/* Goal */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Goal *
                  </label>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    required
                    rows={8}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe what you want this agent to accomplish. Be specific about the task, expected output, and any constraints."
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Tip: The more specific your goal, the better the agent will perform. Include
                    details about data sources, output format, and success criteria.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(null)}
                    className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Bot className="w-5 h-5" />
                        Create Agent
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
