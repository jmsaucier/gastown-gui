'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { Plus, RefreshCw } from 'lucide-react';
import type { Crew } from '@/types';

export default function CrewsPage() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getCrews();
      setCrews(data);
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
            <h1 className="text-3xl font-bold">Crews</h1>
            <p className="text-muted-foreground">Teams of polecats</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Crew
            </Button>
          </div>
        </div>
        
        {crews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No crews configured
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {crews.map((crew, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="font-medium">{crew.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {crew.members.length} members
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
