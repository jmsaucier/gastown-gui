'use client';

/**
 * Agents Page
 * View and manage agents
 */

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAppState } from '@/contexts/app-state-context';
import { api } from '@/lib/api-client';
import { RefreshCw, Eye, Play, Square } from 'lucide-react';
import { getAgentConfig } from '@/lib/agent-types';
import type { StatusResponse } from '@/types';

export default function AgentsPage() {
  const { state } = useAppState();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'running' | 'idle' | 'working'>('all');

  const loadData = async () => {
    try {
      setLoading(true);
      await api.getStatus();
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const agents = state.agents || [];
  const filteredAgents = agents.filter(agent => {
    if (filter === 'all') return true;
    if (filter === 'running') return agent.running;
    if (filter === 'idle') return agent.running && !agent.has_work;
    if (filter === 'working') return agent.running && agent.has_work;
    return true;
  });

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Agents</h1>
            <p className="text-muted-foreground">
              Monitor and control worker agents
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Agents
          </Button>
          <Button
            variant={filter === 'running' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('running')}
          >
            Running
          </Button>
          <Button
            variant={filter === 'idle' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('idle')}
          >
            Idle
          </Button>
          <Button
            variant={filter === 'working' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('working')}
          >
            Working
          </Button>
        </div>

        {/* Agent Grid */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : filteredAgents.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                No agents found with the selected filter.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent, i) => {
              const config = getAgentConfig(agent.name, agent.role);
              return (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                      </div>
                      <Badge variant={agent.running ? 'default' : 'secondary'}>
                        {agent.running ? 'Running' : 'Stopped'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <div>Role: {config.label}</div>
                        {agent.rig && <div>Rig: {agent.rig}</div>}
                        {agent.hook && <div>Hook: {agent.hook}</div>}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Peek
                        </Button>
                        {agent.running ? (
                          <Button size="sm" variant="outline">
                            <Square className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
