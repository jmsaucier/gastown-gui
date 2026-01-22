/**
 * Work/Bead Type Definitions
 */

export interface WorkItem {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed' | 'completed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  labels?: string[];
  created: string;
  updated?: string;
  assignee?: string;
  rig?: string;
  type?: 'bead' | 'issue' | 'formula';
}

export interface BeadCreateRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  labels?: string[];
  sling_now?: boolean;
}

export interface SlingRequest {
  bead: string;
  target: string;
  quality?: 'basic' | 'shiny' | 'chrome';
  molecule?: string;
  args?: string[];
}

export interface Formula {
  name: string;
  description?: string;
  template: string;
  created?: string;
}

export interface FormulaCreateRequest {
  name: string;
  description?: string;
  template: string;
}

export interface FormulaUseRequest {
  name: string;
  target: string;
  args?: string[];
}
