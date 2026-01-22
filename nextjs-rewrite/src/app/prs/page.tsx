'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatting';
import type { GitHubPR } from '@/types';

export default function PRsPage() {
  const [prs, setPRs] = useState<GitHubPR[]>([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<'open' | 'merged' | 'closed' | 'all'>('open');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getGitHubPRs({ state });
      setPRs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [state]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pull Requests</h1>
            <p className="text-muted-foreground">GitHub PRs across repositories</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="flex gap-2">
          {['open', 'merged', 'closed', 'all'].map((s) => (
            <Button
              key={s}
              variant={state === s ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setState(s as any)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>

        {prs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No pull requests found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {prs.map((pr) => (
              <Card key={pr.number} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">
                          #{pr.number}
                        </span>
                        <Badge>{pr.state}</Badge>
                      </div>
                      <h3 className="font-medium mb-1">{pr.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        by {pr.author} • {formatRelativeTime(pr.created_at)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={pr.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
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
