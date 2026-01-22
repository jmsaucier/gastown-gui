'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { HealthCheckResponse } from '@/types';

export default function HealthPage() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.runDoctor();
      setHealth(data);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Health</h1>
            <p className="text-muted-foreground">Verify Gas Town configuration</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Run Doctor
          </Button>
        </div>

        {health && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Overall Status</CardTitle>
                <Badge variant={
                  health.status === 'healthy' ? 'default' :
                  health.status === 'warning' ? 'secondary' :
                  'destructive'
                } className="capitalize">
                  {health.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {health.checks.map((check, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-md border">
                    {check.status === 'pass' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : check.status === 'warn' ? (
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{check.name}</div>
                      <div className="text-sm text-muted-foreground">{check.message}</div>
                      {check.details && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {check.details}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
