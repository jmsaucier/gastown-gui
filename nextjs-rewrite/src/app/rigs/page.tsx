'use client';

/**
 * Rigs Page
 * Manage project rigs
 */

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import { Plus, RefreshCw, Play, Square, RotateCw, Trash2 } from 'lucide-react';
import type { Rig } from '@/types';

export default function RigsPage() {
  const [rigs, setRigs] = useState<Rig[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getRigs();
      setRigs(data);
    } catch (error) {
      console.error('Failed to load rigs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rigs</h1>
            <p className="text-muted-foreground">
              Manage project repositories
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Rig
            </Button>
          </div>
        </div>

        {/* Rig List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : rigs.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                No rigs configured. Add a rig to get started.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rigs.map((rig, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{rig.name}</CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">
                        {rig.path}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Agents */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Agents</h4>
                      {rig.agents && rig.agents.length > 0 ? (
                        <div className="space-y-2">
                          {rig.agents.map((agent, j) => (
                            <div
                              key={j}
                              className="flex items-center justify-between p-3 rounded-md border"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  agent.running ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                                <span className="text-sm font-medium">{agent.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({agent.role})
                                </span>
                              </div>
                              
                              <div className="flex gap-1">
                                {agent.running ? (
                                  <>
                                    <Button size="sm" variant="ghost">
                                      <RotateCw className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Square className="h-3 w-3" />
                                    </Button>
                                  </>
                                ) : (
                                  <Button size="sm" variant="ghost">
                                    <Play className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No agents configured
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
