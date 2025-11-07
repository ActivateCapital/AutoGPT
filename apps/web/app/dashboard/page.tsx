'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Bot, Play, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
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
  executions: Execution[];
}

interface Execution {
  id: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAgents();
    }
  }, [status]);

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">CreAI Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              {session?.user?.name || session?.user?.email}
            </span>
            <Link
              href="/dashboard/subscription"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all"
            >
              Upgrade
            </Link>
            <Link
              href="/api/auth/signout"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-6 h-6 text-purple-400" />
              <span className="text-gray-400">Total Agents</span>
            </div>
            <p className="text-4xl font-bold text-white">{agents.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Play className="w-6 h-6 text-cyan-400" />
              <span className="text-gray-400">Total Executions</span>
            </div>
            <p className="text-4xl font-bold text-white">
              {agents.reduce((sum, agent) => sum + agent.totalExecutions, 0)}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <span className="text-gray-400">Active Agents</span>
            </div>
            <p className="text-4xl font-bold text-white">
              {agents.filter(a => a.active).length}
            </p>
          </div>
        </div>

        {/* Create Agent Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Your Agents</h2>
          <Link
            href="/dashboard/agents/new"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Agent
          </Link>
        </div>

        {/* Agents List */}
        {agents.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-12 backdrop-blur-sm text-center">
            <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No agents yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first AI agent to automate your workflows
            </p>
            <Link
              href="/dashboard/agents/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg"
            >
              <Plus className="w-5 h-5" />
              Create Your First Agent
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
                      {agent.active ? (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {agent.description || 'No description'}
                    </p>
                    <p className="text-gray-300 text-sm">
                      <span className="text-gray-500">Goal:</span> {agent.goal.substring(0, 150)}
                      {agent.goal.length > 150 && '...'}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/agents/${agent.id}`}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Run Agent
                  </Link>
                </div>

                {/* Agent Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <Play className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{agent.totalExecutions} executions</span>
                  </div>
                  {agent.lastExecutedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">
                        Last run: {formatDate(agent.lastExecutedAt)}
                      </span>
                    </div>
                  )}

                  {/* Recent Executions */}
                  {agent.executions.length > 0 && (
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-sm text-gray-400">Recent:</span>
                      <div className="flex gap-1">
                        {agent.executions.slice(0, 5).map((exec) => (
                          <div key={exec.id} className="relative group">
                            {getStatusIcon(exec.status)}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {exec.status} - {formatDate(exec.createdAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
