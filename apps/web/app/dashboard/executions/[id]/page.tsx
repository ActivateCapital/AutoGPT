'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Clock, Loader2, Copy, Download } from 'lucide-react';
import Link from 'next/link';

interface Step {
  step: number;
  action: string;
  thought: string;
  result: string;
  timestamp?: string;
}

interface Execution {
  id: string;
  agentId: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  duration: number | null;
  error: string | null;
  input: string | null;
  output: any;
  steps: Step[];
  tokensUsed: number | null;
  cost: number | null;
  agent: {
    id: string;
    name: string;
  };
}

export default function ExecutionResultsPage() {
  const params = useParams();
  const executionId = params.id as string;

  const [execution, setExecution] = useState<Execution | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchExecution();
  }, [executionId]);

  const fetchExecution = async () => {
    try {
      const res = await fetch(`/api/executions/${executionId}`);
      if (!res.ok) throw new Error('Failed to fetch execution');
      const data = await res.json();
      setExecution(data);
    } catch (error) {
      console.error('Failed to fetch execution:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResults = () => {
    if (!execution) return;

    const data = {
      agent: execution.agent.name,
      executionId: execution.id,
      status: execution.status,
      createdAt: execution.createdAt,
      completedAt: execution.completedAt,
      duration: formatDuration(execution.duration),
      input: execution.input,
      steps: execution.steps,
      output: execution.output,
      tokensUsed: execution.tokensUsed,
      cost: execution.cost,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution-${execution.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Execution Not Found</h2>
          <Link href="/dashboard" className="text-purple-400 hover:text-purple-300">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/agents/${execution.agentId}`}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Execution Results</h1>
                <p className="text-sm text-gray-400">
                  {execution.agent.name} • {formatDate(execution.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={downloadResults}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              {execution.status === 'completed' ? (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </span>
              ) : execution.status === 'failed' ? (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Failed
                </span>
              ) : execution.status === 'running' ? (
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm rounded flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Metadata */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Metadata</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="text-white font-mono">{formatDuration(execution.duration)}</p>
                </div>
                {execution.tokensUsed && (
                  <div>
                    <p className="text-gray-400">Tokens Used</p>
                    <p className="text-white font-mono">{execution.tokensUsed.toLocaleString()}</p>
                  </div>
                )}
                {execution.cost && (
                  <div>
                    <p className="text-gray-400">Cost</p>
                    <p className="text-white font-mono">${execution.cost.toFixed(4)}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400">Steps</p>
                  <p className="text-white font-mono">{execution.steps?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Input */}
            {execution.input && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-3">Input</h2>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{execution.input}</p>
              </div>
            )}
          </div>

          {/* Right Column - Execution Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Error */}
            {execution.error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-red-400 mb-3">Error</h2>
                <p className="text-red-300 text-sm font-mono">{execution.error}</p>
              </div>
            )}

            {/* Execution Steps */}
            {execution.steps && execution.steps.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4">Execution Steps</h2>
                <div className="space-y-4">
                  {execution.steps.map((step, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-mono rounded">
                            Step {step.step}
                          </span>
                          <span className="text-sm text-gray-400 capitalize">
                            {step.action}
                          </span>
                        </div>
                      </div>
                      {step.thought && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Thought:</p>
                          <p className="text-sm text-gray-300">{step.thought}</p>
                        </div>
                      )}
                      {step.result && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Result:</p>
                          <div className="bg-black/30 rounded p-3 overflow-x-auto">
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                              {typeof step.result === 'string'
                                ? step.result
                                : JSON.stringify(step.result, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Output */}
            {execution.output && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Final Output</h2>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        typeof execution.output === 'string'
                          ? execution.output
                          : JSON.stringify(execution.output, null, 2)
                      )
                    }
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white rounded transition-colors flex items-center gap-2 text-sm"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                    {typeof execution.output === 'string'
                      ? execution.output
                      : JSON.stringify(execution.output, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
