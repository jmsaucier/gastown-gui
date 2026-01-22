/**
 * Convoy Type Definitions
 */

export interface Convoy {
  id: string;
  name: string;
  issues: string[];
  status: 'active' | 'completed' | 'paused';
  created: string;
  updated?: string;
  notify?: string;
  progress?: {
    total: number;
    completed: number;
    pending: number;
  };
}

export interface ConvoyCreateRequest {
  name: string;
  issues?: string[];
  notify?: string;
}
