'use client';

/**
 * Convoys Page
 * List and manage convoys
 */

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import { Plus, RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatting';
import type { Convoy } from '@/types';

export default function ConvoysPage() {
  const [convoys, setConvoys] = useState<Convoy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'all'>('active');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getConvoys(
        filter === 'all' ? {} : { status: 'active' }
      );
      setConvoys(data);
    } catch (error) {
      console.error('Failed to load convoys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Convoys</h1>
            <p className="text-muted-foreground">
              Track groups of related work items
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Convoy
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'active' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'all' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All History
          </Button>
        </div>

        {/* Convoy List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : convoys.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                No convoys found. Create one to get started.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {convoys.map((convoy) => (
              <Card key={convoy.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{convoy.name}</CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">
                        Created {formatRelativeTime(convoy.created)}
                      </div>
                    </div>
                    <Badge variant={convoy.status === 'active' ? 'default' : 'secondary'}>
                      {convoy.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {convoy.issues.length} tracked issues
                  </div>
                  {convoy.progress && (
                    <div className="mt-2">
                      <div className="text-sm mb-1">
                        {convoy.progress.completed} / {convoy.progress.total} completed
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${(convoy.progress.completed / convoy.progress.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
