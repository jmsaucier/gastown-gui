/**
 * Gas Town Command Reference
 * 
 * This file provides TypeScript types and definitions for all available
 * Gas Town CLI commands. It serves as a reference for:
 * - Type safety when calling gt commands
 * - Autocomplete/IntelliSense support
 * - Command validation
 * - Documentation
 * 
 * Source: https://github.com/steveyegge/gastown
 */

/**
 * Base command structure for all gt commands
 */
export interface GTCommand {
  name: string;
  description: string;
  category: GTCommandCategory;
  subcommands?: string[];
  flags?: Record<string, GTFlag>;
  examples?: string[];
}

export interface GTFlag {
  name: string;
  short?: string;
  description: string;
  type: 'string' | 'boolean' | 'number';
  required?: boolean;
  default?: any;
}

export type GTCommandCategory =
  | 'Work Management'
  | 'Agent Management'
  | 'Communication'
  | 'Services'
  | 'Workspace'
  | 'Configuration'
  | 'Diagnostics';

/**
 * Complete registry of all Gas Town commands
 * Based on: gt --help output
 */
export const GASTOWN_COMMANDS: Record<string, GTCommand> = {
  // === Work Management ===
  bead: {
    name: 'bead',
    description: 'Bead management utilities',
    category: 'Work Management',
  },
  cat: {
    name: 'cat',
    description: 'Display bead content',
    category: 'Work Management',
  },
  close: {
    name: 'close',
    description: 'Close one or more beads',
    category: 'Work Management',
  },
  commit: {
    name: 'commit',
    description: 'Git commit with automatic agent identity',
    category: 'Work Management',
  },
  convoy: {
    name: 'convoy',
    description: 'Track batches of work across rigs',
    category: 'Work Management',
    subcommands: ['list', 'create', 'show', 'add'],
    flags: {
      '--status': {
        name: '--status',
        description: 'Filter by status',
        type: 'string',
      },
      '--issues': {
        name: '--issues',
        description: 'Comma-separated list of issue IDs',
        type: 'string',
      },
      '--notify': {
        name: '--notify',
        description: 'Notification level',
        type: 'string',
      },
      '--human': {
        name: '--human',
        description: 'Mark convoy as human-managed',
        type: 'boolean',
      },
      '--json': {
        name: '--json',
        description: 'Output as JSON',
        type: 'boolean',
      },
    },
    examples: [
      'gt convoy list',
      'gt convoy create "Feature X" --issues gt-abc12,gt-def34',
      'gt convoy show <id>',
    ],
  },
  done: {
    name: 'done',
    description: 'Signal work ready for merge queue',
    category: 'Work Management',
  },
  formula: {
    name: 'formula',
    description: 'Manage workflow formulas',
    category: 'Work Management',
    subcommands: ['list', 'create', 'use'],
  },
  gate: {
    name: 'gate',
    description: 'Gate coordination commands',
    category: 'Work Management',
  },
  handoff: {
    name: 'handoff',
    description: 'Hand off to a fresh session, work continues from hook',
    category: 'Work Management',
  },
  hook: {
    name: 'hook',
    description: 'Show or attach work on your hook',
    category: 'Work Management',
  },
  mol: {
    name: 'mol',
    description: 'Agent molecule workflow commands',
    category: 'Work Management',
  },
  mq: {
    name: 'mq',
    description: 'Merge queue operations',
    category: 'Work Management',
  },
  orphans: {
    name: 'orphans',
    description: 'Find lost polecat work',
    category: 'Work Management',
  },
  park: {
    name: 'park',
    description: 'Park work on a gate for async resumption',
    category: 'Work Management',
  },
  ready: {
    name: 'ready',
    description: 'Show work ready across town',
    category: 'Work Management',
  },
  release: {
    name: 'release',
    description: 'Release stuck in_progress issues back to pending',
    category: 'Work Management',
  },
  resume: {
    name: 'resume',
    description: 'Resume from parked work or check for handoff messages',
    category: 'Work Management',
  },
  show: {
    name: 'show',
    description: 'Show details of a bead',
    category: 'Work Management',
  },
  sling: {
    name: 'sling',
    description: 'Assign work to an agent (THE unified work dispatch command)',
    category: 'Work Management',
    flags: {
      '--quality': {
        name: '--quality',
        description: 'Quality level (shiny, normal, etc.)',
        type: 'string',
        default: 'shiny',
      },
      '--molecule': {
        name: '--molecule',
        description: 'Molecule identifier',
        type: 'string',
      },
      '--agent': {
        name: '--agent',
        description: 'Override runtime agent',
        type: 'string',
      },
    },
    examples: [
      'gt sling gt-abc12 myproject',
      'gt sling gt-abc12 myproject --agent cursor',
    ],
  },
  synthesis: {
    name: 'synthesis',
    description: 'Manage convoy synthesis steps',
    category: 'Work Management',
  },
  trail: {
    name: 'trail',
    description: 'Show recent agent activity',
    category: 'Work Management',
  },
  unsling: {
    name: 'unsling',
    description: 'Remove work from an agent\'s hook',
    category: 'Work Management',
  },

  // === Agent Management ===
  agents: {
    name: 'agents',
    description: 'Switch between Gas Town agent sessions',
    category: 'Agent Management',
    subcommands: ['list', 'attach', 'detach'],
  },
  boot: {
    name: 'boot',
    description: 'Manage Boot (Deacon watchdog)',
    category: 'Agent Management',
  },
  callbacks: {
    name: 'callbacks',
    description: 'Handle agent callbacks',
    category: 'Agent Management',
  },
  deacon: {
    name: 'deacon',
    description: 'Manage the Deacon (town-level watchdog)',
    category: 'Agent Management',
  },
  dog: {
    name: 'dog',
    description: 'Manage dogs (cross-rig infrastructure workers)',
    category: 'Agent Management',
  },
  mayor: {
    name: 'mayor',
    description: 'Manage the Mayor (Chief of Staff for cross-rig coordination)',
    category: 'Agent Management',
    subcommands: ['attach', 'detach', 'start', 'stop'],
    flags: {
      '--agent': {
        name: '--agent',
        description: 'Override runtime agent',
        type: 'string',
      },
    },
    examples: [
      'gt mayor attach',
      'gt mayor start --agent auggie',
    ],
  },
  polecat: {
    name: 'polecat',
    description: 'Manage polecats (ephemeral workers, one task then nuked)',
    category: 'Agent Management',
    subcommands: ['spawn', 'stop', 'restart', 'peek', 'transcript'],
    examples: [
      'gt polecat spawn myproject mypolecat',
      'gt polecat peek myproject mypolecat',
    ],
  },
  refinery: {
    name: 'refinery',
    description: 'Manage the Refinery (merge queue processor)',
    category: 'Agent Management',
  },
  role: {
    name: 'role',
    description: 'Show or manage agent role',
    category: 'Agent Management',
  },
  session: {
    name: 'session',
    description: 'Manage polecat sessions',
    category: 'Agent Management',
  },
  witness: {
    name: 'witness',
    description: 'Manage the Witness (per-rig polecat health monitor)',
    category: 'Agent Management',
  },

  // === Communication ===
  broadcast: {
    name: 'broadcast',
    description: 'Send a nudge message to all workers',
    category: 'Communication',
  },
  dnd: {
    name: 'dnd',
    description: 'Toggle Do Not Disturb mode for notifications',
    category: 'Communication',
  },
  escalate: {
    name: 'escalate',
    description: 'Escalation system for critical issues',
    category: 'Communication',
  },
  mail: {
    name: 'mail',
    description: 'Agent messaging system',
    category: 'Communication',
    subcommands: ['check', 'send', 'inject'],
    flags: {
      '--filter': {
        name: '--filter',
        description: 'Filter messages',
        type: 'string',
      },
      '--inject': {
        name: '--inject',
        description: 'Inject message into current session',
        type: 'boolean',
      },
    },
  },
  notify: {
    name: 'notify',
    description: 'Set notification level',
    category: 'Communication',
  },
  nudge: {
    name: 'nudge',
    description: 'Send a synchronous message to any Gas Town worker',
    category: 'Communication',
  },
  peek: {
    name: 'peek',
    description: 'View recent output from a polecat or crew session',
    category: 'Communication',
  },

  // === Services ===
  daemon: {
    name: 'daemon',
    description: 'Manage the Gas Town daemon',
    category: 'Services',
  },
  down: {
    name: 'down',
    description: 'Stop all Gas Town services',
    category: 'Services',
  },
  shutdown: {
    name: 'shutdown',
    description: 'Shutdown Gas Town with cleanup',
    category: 'Services',
  },
  start: {
    name: 'start',
    description: 'Start Gas Town or a crew workspace',
    category: 'Services',
  },
  up: {
    name: 'up',
    description: 'Bring up all Gas Town services',
    category: 'Services',
  },

  // === Workspace ===
  crew: {
    name: 'crew',
    description: 'Manage crew workers (persistent workspaces for humans)',
    category: 'Workspace',
    subcommands: ['add', 'list', 'remove'],
    flags: {
      '--rig': {
        name: '--rig',
        description: 'Rig name',
        type: 'string',
      },
    },
    examples: [
      'gt crew add yourname --rig myproject',
    ],
  },
  'git-init': {
    name: 'git-init',
    description: 'Initialize git repository for a Gas Town HQ',
    category: 'Workspace',
  },
  init: {
    name: 'init',
    description: 'Initialize current directory as a Gas Town rig',
    category: 'Workspace',
  },
  install: {
    name: 'install',
    description: 'Create a new Gas Town HQ (workspace)',
    category: 'Workspace',
    flags: {
      '--git': {
        name: '--git',
        description: 'Initialize git repository',
        type: 'boolean',
      },
    },
    examples: [
      'gt install ~/gt --git',
    ],
  },
  namepool: {
    name: 'namepool',
    description: 'Manage polecat name pools',
    category: 'Workspace',
  },
  rig: {
    name: 'rig',
    description: 'Manage rigs in the workspace',
    category: 'Workspace',
    subcommands: ['add', 'list', 'remove', 'show'],
    flags: {
      '--path': {
        name: '--path',
        description: 'Custom path for rig',
        type: 'string',
      },
    },
    examples: [
      'gt rig add myproject https://github.com/you/repo.git',
      'gt rig list',
    ],
  },
  worktree: {
    name: 'worktree',
    description: 'Create worktree in another rig for cross-rig work',
    category: 'Workspace',
  },

  // === Configuration ===
  account: {
    name: 'account',
    description: 'Manage Claude Code accounts',
    category: 'Configuration',
  },
  completion: {
    name: 'completion',
    description: 'Generate the autocompletion script for the specified shell',
    category: 'Configuration',
  },
  config: {
    name: 'config',
    description: 'Manage Gas Town configuration',
    category: 'Configuration',
    subcommands: ['show', 'set', 'get', 'agent', 'default-agent'],
    examples: [
      'gt config show',
      'gt config agent set claude-glm "claude-glm --model glm-4"',
      'gt config default-agent claude-glm',
    ],
  },
  disable: {
    name: 'disable',
    description: 'Disable Gas Town system-wide',
    category: 'Configuration',
  },
  enable: {
    name: 'enable',
    description: 'Enable Gas Town system-wide',
    category: 'Configuration',
  },
  hooks: {
    name: 'hooks',
    description: 'List all Claude Code hooks in the workspace',
    category: 'Configuration',
    subcommands: ['list', 'repair'],
  },
  issue: {
    name: 'issue',
    description: 'Manage current issue for status line display',
    category: 'Configuration',
  },
  plugin: {
    name: 'plugin',
    description: 'Plugin management',
    category: 'Configuration',
  },
  shell: {
    name: 'shell',
    description: 'Manage shell integration',
    category: 'Configuration',
  },
  theme: {
    name: 'theme',
    description: 'View or set tmux theme for the current rig',
    category: 'Configuration',
  },
  uninstall: {
    name: 'uninstall',
    description: 'Remove Gas Town from the system',
    category: 'Configuration',
  },

  // === Diagnostics ===
  activity: {
    name: 'activity',
    description: 'Emit and view activity events',
    category: 'Diagnostics',
  },
  audit: {
    name: 'audit',
    description: 'Query work history by actor',
    category: 'Diagnostics',
  },
  checkpoint: {
    name: 'checkpoint',
    description: 'Manage session checkpoints for crash recovery',
    category: 'Diagnostics',
  },
  costs: {
    name: 'costs',
    description: 'Show costs for running Claude sessions [DISABLED]',
    category: 'Diagnostics',
  },
  dashboard: {
    name: 'dashboard',
    description: 'Start the convoy tracking web dashboard',
    category: 'Diagnostics',
    flags: {
      '--port': {
        name: '--port',
        description: 'Port to run dashboard on',
        type: 'number',
        default: 8080,
      },
    },
  },
  doctor: {
    name: 'doctor',
    description: 'Run health checks on the workspace',
    category: 'Diagnostics',
    flags: {
      '--json': {
        name: '--json',
        description: 'Output as JSON',
        type: 'boolean',
      },
    },
  },
  feed: {
    name: 'feed',
    description: 'Show real-time activity feed from beads and gt events',
    category: 'Diagnostics',
  },
  help: {
    name: 'help',
    description: 'Help about any command',
    category: 'Diagnostics',
  },
  info: {
    name: 'info',
    description: 'Show Gas Town information and what\'s new',
    category: 'Diagnostics',
  },
  log: {
    name: 'log',
    description: 'View town activity log',
    category: 'Diagnostics',
  },
  'migrate-agents': {
    name: 'migrate-agents',
    description: 'Migrate agent beads to two-level architecture',
    category: 'Diagnostics',
  },
  patrol: {
    name: 'patrol',
    description: 'Patrol digest management',
    category: 'Diagnostics',
  },
  prime: {
    name: 'prime',
    description: 'Output role context for current directory',
    category: 'Diagnostics',
  },
  seance: {
    name: 'seance',
    description: 'Talk to your predecessor sessions',
    category: 'Diagnostics',
  },
  stale: {
    name: 'stale',
    description: 'Check if the gt binary is stale',
    category: 'Diagnostics',
  },
  status: {
    name: 'status',
    description: 'Show overall town status',
    category: 'Diagnostics',
    flags: {
      '--json': {
        name: '--json',
        description: 'Output as JSON',
        type: 'boolean',
      },
      '--fast': {
        name: '--fast',
        description: 'Fast status check',
        type: 'boolean',
      },
    },
    examples: [
      'gt status',
      'gt status --json --fast',
    ],
  },
};

/**
 * Get command definition by name
 */
export function getCommand(name: string): GTCommand | undefined {
  return GASTOWN_COMMANDS[name];
}

/**
 * Get all commands in a category
 */
export function getCommandsByCategory(category: GTCommandCategory): GTCommand[] {
  return Object.values(GASTOWN_COMMANDS).filter(cmd => cmd.category === category);
}

/**
 * Check if a command exists
 */
export function commandExists(name: string): boolean {
  return name in GASTOWN_COMMANDS;
}

/**
 * Get all available command names
 */
export function getAllCommandNames(): string[] {
  return Object.keys(GASTOWN_COMMANDS);
}

/**
 * Type-safe command builder
 * This provides autocomplete and type checking for gt commands
 */
export class GTCommandBuilder {
  private command: string;
  private args: string[] = [];
  private flags: Record<string, string | boolean> = {};

  constructor(command: string) {
    if (!commandExists(command)) {
      console.warn(`Unknown gt command: ${command}`);
    }
    this.command = command;
  }

  /**
   * Add a subcommand
   */
  subcommand(sub: string): this {
    this.args.push(sub);
    return this;
  }

  /**
   * Add a positional argument
   */
  arg(value: string): this {
    this.args.push(value);
    return this;
  }

  /**
   * Add multiple positional arguments
   */
  args(values: string[]): this {
    this.args.push(...values);
    return this;
  }

  /**
   * Add a flag
   */
  flag(name: string, value?: string | boolean): this {
    if (value === undefined || value === true) {
      this.flags[name] = true;
    } else if (value === false) {
      // Don't add the flag
    } else {
      this.flags[name] = value;
    }
    return this;
  }

  /**
   * Build the final command array for execGT
   */
  build(): string[] {
    const cmd = [this.command];
    
    // Add subcommands and args
    cmd.push(...this.args);
    
    // Add flags
    for (const [name, value] of Object.entries(this.flags)) {
      if (value === true) {
        cmd.push(name);
      } else if (typeof value === 'string') {
        cmd.push(name, value);
      }
    }
    
    return cmd;
  }

  /**
   * Get the command definition
   */
  getDefinition(): GTCommand | undefined {
    return getCommand(this.command);
  }
}

/**
 * Helper function to create a command builder
 */
export function gt(command: string): GTCommandBuilder {
  return new GTCommandBuilder(command);
}
