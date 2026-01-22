'use client';

/**
 * Dashboard Page
 * System overview with metrics and health
 */

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import { useAppState } from '@/contexts/app-state-context';
import { RefreshCw, Activity, Users, FolderGit, AlertCircle } from 'lucide-react';
import type { StatusResponse, HealthCheckResponse } from '@/types';

export default function DashboardPage() {
  const { dispatch } = useAppState();
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statusData, healthData] = await Promise.all([
        api.getStatus(),
        api.getHealth(),
      ]);
      
      setStatus(statusData);
      setHealth(healthData);
      
      // Update global state
      dispatch({ type: 'SET_STATUS', payload: statusData });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  const rigs = status?.rigs || [];
  const agents = status?.agents || [];
  const runningAgents = agents.filter(a => a.running).length;
  const healthStatus = health?.status || 'unknown';

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
            <p className="text-muted-foreground">
              Monitor your Gas Town infrastructure
            </p>
          </div>
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rigs</CardTitle>
              <FolderGit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rigs.length}</div>
              <p className="text-xs text-muted-foreground">
                Configured projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{runningAgents} / {agents.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold capitalize ${
                healthStatus === 'healthy' ? 'text-green-500' :
                healthStatus === 'warning' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {healthStatus}
              </div>
              <p className="text-xs text-muted-foreground">
                {health?.checks.length || 0} checks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hooked Work</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {status?.hook ? '1' : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                {status?.hook ? `On ${status.hook.agent}` : 'No work hooked'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rigs List */}
        <Card>
          <CardHeader>
            <CardTitle>Configured Rigs</CardTitle>
            <CardDescription>
              Your project repositories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rigs.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No rigs configured. Add a rig to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {rigs.map((rig, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-md border"
                  >
                    <div>
                      <div className="font-medium">{rig.name}</div>
                      <div className="text-sm text-muted-foreground">{rig.path}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {rig.agents?.length || 0} agents
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
