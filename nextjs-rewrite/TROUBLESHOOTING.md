# Troubleshooting Guide

## "Command not found: gt" Error

### Problem
When starting the Next.js dev server, you may see:
```
GET /api/status 500
Error: Command not found: gt
```

### Root Cause
Next.js runs with a limited PATH environment that may not include:
- `~/go/bin/gt` (where Gas Town CLI is installed)
- Other custom binary locations

### ✅ Solution Applied
The CLI wrapper (`src/lib/cli-wrapper.ts`) now automatically checks common binary paths:
- `~/go/bin` (for Go binaries like `gt`)
- `~/.local/bin`
- `~/bin`
- `/usr/local/bin`
- `/opt/homebrew/bin`

### Testing the Fix

1. **Restart your dev server** (if running):
   ```bash
   # Stop the current server (Ctrl+C)
   cd nextjs-rewrite
   pnpm run dev
   ```

2. **Test the status endpoint**:
   ```bash
   curl http://localhost:3000/api/status
   ```

3. **Expected result**:
   ```json
   {
     "rigs": [...],
     "agents": [...],
     "timestamp": "..."
   }
   ```

### Alternative: Set PATH in .env.local

If the automatic path detection doesn't work, you can manually set the PATH:

```bash
# In nextjs-rewrite/.env.local
PATH=/Users/msaucier/go/bin:/usr/local/bin:/usr/bin:/bin
GASTOWN_PORT=7667
HOST=127.0.0.1
GT_ROOT=~/gt
```

Then restart the dev server.

### Verify gt Installation

To confirm `gt` is installed and accessible:

```bash
which gt
# Should output: /Users/msaucier/go/bin/gt

gt status --json --fast
# Should output JSON status data
```

## Other Common Issues

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm run dev -- -p 3001
```

### TypeScript Errors After Updates

**Error**: Various TypeScript compilation errors

**Solution**:
```bash
# Clean and rebuild
rm -rf .next node_modules
pnpm install
pnpm run build
```

### WebSocket Connection Fails

**Error**: WebSocket status shows "disconnected"

**Cause**: WebSocket server needs to be running alongside Next.js

**Solution**: 
The Next.js app doesn't include a WebSocket server yet. This is a future enhancement. For now, you can:
1. Run the original `server.js` from the parent directory for WebSocket support
2. Or implement a custom WebSocket server in Next.js (see IMPLEMENTATION_SUMMARY.md for details)

### Missing Environment Variables

**Error**: API routes return unexpected data or errors

**Solution**: Ensure `.env.local` exists with required variables:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### Build Fails with Module Not Found

**Error**: `Module not found: Can't resolve '@/...'`

**Solution**: Check `tsconfig.json` paths configuration:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Getting Help

1. **Check the logs**: Look at the terminal output for detailed error messages
2. **Verify dependencies**: Run `pnpm install` to ensure all packages are installed
3. **Check CLI access**: Verify `gt`, `gh`, `tmux` commands work from your terminal
4. **Review environment**: Check `.env.local` has correct values for GT_ROOT and other paths

## Debugging Tips

### Enable Verbose Logging

Add to your API route:
```typescript
console.log('[DEBUG] Environment:', {
  PATH: process.env.PATH,
  GT_ROOT: process.env.GT_ROOT,
  HOME: process.env.HOME,
});
```

### Test CLI Wrapper Directly

Create a test script:
```typescript
// test-cli.ts
import { execGT } from '@/lib/cli-wrapper';

async function test() {
  try {
    const result = await execGT(['status', '--json', '--fast']);
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
```

Run with: `tsx test-cli.ts`

## Status

- ✅ Path detection implemented
- ✅ Common binary locations checked
- ✅ Better error messages
- ⏳ WebSocket server integration (future enhancement)
- ⏳ Complete environment variable validation (future enhancement)
