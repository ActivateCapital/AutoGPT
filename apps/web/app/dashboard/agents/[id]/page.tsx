'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Bot, Play, Loader2, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  description: string;
  goal: string;
  active: boolean;
  totalExecutions: number;
  lastExecutedAt: string | null;
  createdAt: string;
}

interface Execution {
  id: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  duration: number | null;
  error: string | null;
  output: any;
}

export default function AgentPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null);
  const [additionalInput, setAdditionalInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAgent();
    fetchExecutions();
  }, [agentId]);

  // Poll for execution status
  useEffect(() => {
    if (!currentExecutionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/executions/${currentExecutionId}`);
        const execution = await res.json();

        if (execution.status === 'completed' || execution.status === 'failed') {
          setExecuting(false);
          setCurrentExecutionId(null);
          fetchExecutions();
          fetchAgent();
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Failed to poll execution:', error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [currentExecutionId]);

  const fetchAgent = async () => {
    try {
      const res = await fetch(`/api/agents/${agentId}`);
      if (!res.ok) throw new Error('Failed to fetch agent');
      const data = await res.json();
      setAgent(data);
    } catch (error) {
      console.error('Failed to fetch agent:', error);
      setError('Failed to load agent');
    } finally {
      setLoading(false);
    }
  };

  const fetchExecutions = async () => {
    try {
      const res = await fetch(`/api/agents/${agentId}/executions`);
      if (!res.ok) throw new Error('Failed to fetch executions');
      const data = await res.json();
      setExecutions(data);
    } catch (error) {
      console.error('Failed to fetch executions:', error);
    }
  };

  const handleExecute = async () => {
    setError('');
    setExecuting(true);

    try {
      const res = await fetch(`/api/agents/${agentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: additionalInput || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to execute agent');
      }

      const { executionId } = await res.json();
      setCurrentExecutionId(executionId);
      setAdditionalInput('');
    } catch (err: any) {
      setError(err.message);
      setExecuting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Agent Not Found</h2>
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </Link>
          <Bot className="w-8 h-8 text-purple-400" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
            {agent.description && (
              <p className="text-sm text-gray-400">{agent.description}</p>
            )}
          </div>
          {agent.active ? (
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded">
              Active
            </span>
          ) : (
            <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm rounded">
              Inactive
            </span>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Agent Details & Execution */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Goal */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-3">Agent Goal</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{agent.goal}</p>
            </div>

            {/* Execute Agent */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Run Agent</h2>

              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {executing && (
                <div className="mb-4 p-4 bg-cyan-500/10 border border-cyan-500/50 rounded-lg flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  <div>
                    <p className="text-cyan-400 font-semibold">Agent is running...</p>
                    <p className="text-gray-400 text-sm">
                      This may take a few minutes. You can leave this page and check back later.
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={additionalInput}
                  onChange={(e) => setAdditionalInput(e.target.value)}
                  disabled={executing}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  placeholder="Add any specific instructions or context for this execution..."
                />
              </div>

              <button
                onClick={handleExecute}
                disabled={executing}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {executing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Execute Agent
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Stats & History */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Statistics</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Total Executions</p>
                  <p className="text-2xl font-bold text-white">{agent.totalExecutions}</p>
                </div>
                {agent.lastExecutedAt && (
                  <div>
                    <p className="text-gray-400 text-sm">Last Executed</p>
                    <p className="text-white">{formatDate(agent.lastExecutedAt)}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 text-sm">Created</p>
                  <p className="text-white">{formatDate(agent.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Execution History */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Execution History</h2>
              {executions.length === 0 ? (
                <p className="text-gray-400 text-sm">No executions yet</p>
              ) : (
                <div className="space-y-3">
                  {executions.slice(0, 10).map((execution) => (
                    <div
                      key={execution.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(execution.status)}
                        <div>
                          <p className="text-sm text-white capitalize">{execution.status}</p>
                          <p className="text-xs text-gray-400">
                            {formatDate(execution.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {execution.duration && (
                          <span className="text-xs text-gray-400">
                            {formatDuration(execution.duration)}
                          </span>
                        )}
                        {execution.status === 'completed' && (
                          <Link
                            href={`/dashboard/executions/${execution.id}`}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4 text-purple-400" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
