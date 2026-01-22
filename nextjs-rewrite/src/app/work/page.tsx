'use client';

/**
 * Work Page
 * List and manage work items (beads)
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
import type { WorkItem } from '@/types';

export default function WorkPage() {
  const [work, setWork] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getWork(
        filter === 'all' ? {} : { status: filter }
      );
      setWork(data);
    } catch (error) {
      console.error('Failed to load work:', error);
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
            <h1 className="text-3xl font-bold tracking-tight">Work Items</h1>
            <p className="text-muted-foreground">
              Track and manage tasks (beads)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'open' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('open')}
          >
            Open
          </Button>
          <Button
            variant={filter === 'closed' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('closed')}
          >
            Completed
          </Button>
        </div>

        {/* Work List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : work.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                No work items found. Create one to get started.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {work.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">
                          {item.id}
                        </span>
                        <Badge variant={item.status === 'open' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                        {item.priority && item.priority !== 'normal' && (
                          <Badge variant="outline">{item.priority}</Badge>
                        )}
                      </div>
                      <h3 className="font-medium">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>Created {formatRelativeTime(item.created)}</span>
                        {item.labels && item.labels.length > 0 && (
                          <span>• {item.labels.join(', ')}</span>
                        )}
                      </div>
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
