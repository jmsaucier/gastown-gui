/**
 * Agent Type Configuration and Utilities
 */

export interface AgentTypeConfig {
  color: string;
  icon: string;
  label: string;
}

export const AGENT_TYPES: Record<string, AgentTypeConfig> = {
  mayor: { color: '#a855f7', icon: 'account_balance', label: 'Mayor' },
  witness: { color: '#3b82f6', icon: 'visibility', label: 'Witness' },
  deacon: { color: '#f59e0b', icon: 'gavel', label: 'Deacon' },
  refinery: { color: '#ef4444', icon: 'precision_manufacturing', label: 'Refinery' },
  polecat: { color: '#22c55e', icon: 'smart_toy', label: 'Polecat' },
  crew: { color: '#06b6d4', icon: 'groups', label: 'Crew' },
  human: { color: '#ec4899', icon: 'person', label: 'Human' },
  system: { color: '#6b7280', icon: 'settings', label: 'System' },
};

export const STATUS_ICONS: Record<string, string> = {
  idle: 'schedule',
  working: 'sync',
  waiting: 'hourglass_empty',
  error: 'error',
  complete: 'check_circle',
  running: 'play_circle',
  stopped: 'stop_circle',
};

export const STATUS_COLORS: Record<string, string> = {
  idle: '#6b7280',
  working: '#22c55e',
  waiting: '#f59e0b',
  error: '#ef4444',
  complete: '#22c55e',
  running: '#22c55e',
  stopped: '#6b7280',
};

/**
 * Detect agent type from agent path or role
 */
export function getAgentType(agentPath: string | null | undefined, role: string | null = null): string {
  // If role is explicitly provided, use it
  if (role && AGENT_TYPES[role.toLowerCase()]) {
    return role.toLowerCase();
  }

  if (!agentPath) return 'system';
  const lower = agentPath.toLowerCase();

  if (lower.includes('mayor')) return 'mayor';
  if (lower.includes('witness')) return 'witness';
  if (lower.includes('deacon')) return 'deacon';
  if (lower.includes('refinery')) return 'refinery';
  if (lower.includes('polecats/') || lower.includes('polecat')) return 'polecat';
  if (lower.includes('crew/')) return 'crew';
  if (lower === 'human' || lower === 'human/') return 'human';

  // Check if it's a polecat by name pattern (rig/name without special folders)
  const parts = agentPath.split('/');
  if (parts.length === 2 && !['mayor', 'witness', 'deacon', 'refinery'].includes(parts[1])) {
    return 'polecat'; // Likely a polecat like "rig/slit"
  }

  return 'system';
}

/**
 * Get agent config for a given path/role
 */
export function getAgentConfig(agentPath: string | null | undefined, role: string | null = null): AgentTypeConfig {
  const type = getAgentType(agentPath, role);
  return AGENT_TYPES[type] || AGENT_TYPES.system;
}

/**
 * Get short display name from agent path
 */
export function formatAgentName(name: string | null | undefined): string {
  if (!name) return 'unknown';
  const parts = name.split('/');
  return parts[parts.length - 1] || parts[0];
}
