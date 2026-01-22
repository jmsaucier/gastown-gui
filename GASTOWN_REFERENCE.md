# Gas Town Command Reference

This document links to the [Gas Town repository](https://github.com/steveyegge/gastown) and provides a reference for all available commands that can be called from this GUI.

## Repository Link

- **Source Repository**: https://github.com/steveyegge/gastown
- **Documentation**: See the [Gas Town README](https://github.com/steveyegge/gastown#readme) for full documentation
- **Command Reference**: All commands are defined in `src/lib/gastown-commands.ts`

## Command Categories

### Work Management
Commands for managing work items (beads), convoys, and workflows:
- `bead`, `cat`, `close`, `commit`, `convoy`, `done`, `formula`, `gate`, `handoff`, `hook`, `mol`, `mq`, `orphans`, `park`, `ready`, `release`, `resume`, `show`, `sling`, `synthesis`, `trail`, `unsling`

### Agent Management
Commands for managing different types of agents:
- `agents`, `boot`, `callbacks`, `deacon`, `dog`, `mayor`, `polecat`, `refinery`, `role`, `session`, `witness`

### Communication
Commands for agent messaging and notifications:
- `broadcast`, `dnd`, `escalate`, `mail`, `notify`, `nudge`, `peek`

### Services
Commands for managing Gas Town services:
- `daemon`, `down`, `shutdown`, `start`, `up`

### Workspace
Commands for managing rigs, crews, and workspaces:
- `crew`, `git-init`, `init`, `install`, `namepool`, `rig`, `worktree`

### Configuration
Commands for configuring Gas Town:
- `account`, `completion`, `config`, `disable`, `enable`, `hooks`, `issue`, `plugin`, `shell`, `theme`, `uninstall`

### Diagnostics
Commands for monitoring and debugging:
- `activity`, `audit`, `checkpoint`, `costs`, `dashboard`, `doctor`, `feed`, `help`, `info`, `log`, `migrate-agents`, `patrol`, `prime`, `seance`, `stale`, `status`

## Usage in Code

### Type-Safe Command Building

```typescript
import { gt } from '@/lib/gastown-commands';
import { execGT } from '@/lib/cli-wrapper';

// Type-safe command building with autocomplete
const args = gt('convoy')
  .subcommand('create')
  .arg('Feature X')
  .flag('--issues', 'gt-abc12,gt-def34')
  .flag('--notify', 'human')
  .build();

await execGT(args);
```

### Direct Command Execution

```typescript
import { execGT } from '@/lib/cli-wrapper';

// Simple command
await execGT(['status', '--json', '--fast']);

// With subcommands
await execGT(['convoy', 'list', '--status', 'active']);
```

### Command Validation

```typescript
import { commandExists, getCommand } from '@/lib/gastown-commands';

if (commandExists('sling')) {
  const cmd = getCommand('sling');
  console.log(cmd.description); // "Assign work to an agent..."
}
```

## Currently Implemented Commands

The following commands are currently implemented in the API routes:

- ✅ `status` - System status
- ✅ `doctor` - Health checks
- ✅ `convoy` - Convoy management (list, create, add)
- ✅ `rig` - Rig management (list, add)
- ✅ `crew` - Crew management (list, add)
- ✅ `sling` - Work assignment
- ✅ `polecat` - Polecat control (spawn, stop, restart, peek, transcript)
- ✅ `formula` - Formula management
- ✅ `mail` - Mail system
- ✅ `work` (via `bd list`) - Work item listing

## Adding New Commands

To add support for a new command:

1. **Add API Route**: Create a new route in `src/app/api/[command]/route.ts`
2. **Update API Client**: Add method to `src/lib/api-client.ts`
3. **Update Types**: Add types to `src/types/api.ts` if needed
4. **Use Command Reference**: Reference `src/lib/gastown-commands.ts` for command structure

Example:

```typescript
// src/app/api/ready/route.ts
import { execGTJSON } from '@/lib/cli-wrapper';
import { gt } from '@/lib/gastown-commands';

export async function GET() {
  const args = gt('ready').flag('--json').build();
  const data = await execGTJSON(args);
  return NextResponse.json(data);
}
```

## Command Discovery

To discover available commands at runtime:

```typescript
import { getAllCommandNames, getCommandsByCategory } from '@/lib/gastown-commands';

// Get all commands
const allCommands = getAllCommandNames();

// Get commands by category
const workCommands = getCommandsByCategory('Work Management');
```

## Updating Command Reference

When Gas Town adds new commands:

1. Run `gt --help` to see new commands
2. Update `src/lib/gastown-commands.ts` with new command definitions
3. Update this document if needed
4. Add API routes for new commands as needed

## Related Files

- `src/lib/gastown-commands.ts` - TypeScript command definitions
- `src/lib/cli-wrapper.ts` - CLI execution utilities
- `src/lib/api-client.ts` - Frontend API client
- `src/app/api/**/route.ts` - API route implementations
