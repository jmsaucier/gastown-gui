'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { Plus, RefreshCw, Play } from 'lucide-react';
import type { Formula } from '@/types';

export default function FormulasPage() {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getFormulas();
      setFormulas(data);
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
            <h1 className="text-3xl font-bold">Formulas</h1>
            <p className="text-muted-foreground">Workflow templates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Formula
            </Button>
          </div>
        </div>

        {formulas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No formulas configured
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {formulas.map((formula, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{formula.name}</h3>
                      {formula.description && (
                        <p className="text-sm text-muted-foreground">
                          {formula.description}
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Use
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
