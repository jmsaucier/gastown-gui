/**
 * Agent Type Definitions
 */

export interface Agent {
  name: string;
  role: 'coordinator' | 'worker' | 'monitor' | 'merger' | 'health-check';
  running: boolean;
  has_work?: boolean;
  hook?: string;
  last_seen?: string;
  status?: string;
  pid?: number;
  rig?: string;
  type?: string;
}

export interface Polecat extends Agent {
  role: 'worker';
  rig: string;
  type: string;
}

export interface Rig {
  name: string;
  path: string;
  url?: string;
  agents?: Agent[];
  witness?: Agent;
  refinery?: Agent;
  polecats?: Polecat[];
  config?: RigConfig;
}

export interface RigConfig {
  name: string;
  path: string;
  github?: {
    owner: string;
    repo: string;
  };
  hooks?: Record<string, any>;
}

export type AgentType = 
  | 'mayor'
  | 'deacon'
  | 'witness'
  | 'refinery'
  | 'polecat';

export interface AgentConfig {
  name: string;
  displayName: string;
  color: string;
  icon: string;
  description: string;
}

export const AGENT_TYPES: Record<AgentType, AgentConfig> = {
  mayor: {
    name: 'mayor',
    displayName: 'Mayor',
    color: '#FF6B6B',
    icon: '👔',
    description: 'Global coordinator for cross-rig work'
  },
  deacon: {
    name: 'deacon',
    displayName: 'Deacon',
    color: '#4ECDC4',
    icon: '⚙️',
    description: 'Daemon process manager'
  },
  witness: {
    name: 'witness',
    displayName: 'Witness',
    color: '#95E1D3',
    icon: '👁️',
    description: 'Per-rig monitor'
  },
  refinery: {
    name: 'refinery',
    displayName: 'Refinery',
    color: '#F38181',
    icon: '🔧',
    description: 'Merge queue processor'
  },
  polecat: {
    name: 'polecat',
    displayName: 'Polecat',
    color: '#AA96DA',
    icon: '🐾',
    description: 'Ephemeral worker agent'
  }
};

export const STATUS_COLORS = {
  running: '#4ECDC4',
  stopped: '#95A5A6',
  working: '#F39C12',
  error: '#E74C3C',
  idle: '#3498DB'
};

export function getAgentConfig(agentName: string): AgentConfig {
  const name = agentName.toLowerCase();
  
  if (name === 'mayor' || name.includes('mayor')) {
    return AGENT_TYPES.mayor;
  }
  if (name === 'deacon' || name.includes('deacon')) {
    return AGENT_TYPES.deacon;
  }
  if (name === 'witness' || name.includes('witness')) {
    return AGENT_TYPES.witness;
  }
  if (name === 'refinery' || name.includes('refinery')) {
    return AGENT_TYPES.refinery;
  }
  return AGENT_TYPES.polecat;
}
