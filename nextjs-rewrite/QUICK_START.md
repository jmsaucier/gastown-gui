# Quick Start Guide

## Prerequisites

Ensure you have these installed and accessible:

1. **Gas Town CLI (`gt`)**: 
   ```bash
   which gt
   # Should output: /Users/msaucier/go/bin/gt (or similar)
   ```

2. **Node.js 18+**:
   ```bash
   node --version
   # Should be v18.0.0 or higher
   ```

3. **pnpm**:
   ```bash
   pnpm --version
   # If not installed: npm install -g pnpm
   ```

## Installation

```bash
cd /Users/msaucier/personal/gastown-gui/nextjs-rewrite

# Install dependencies
pnpm install

# Set up environment (if not already done)
cp .env.example .env.local
# Edit .env.local if needed
```

## Running the App

### Development Mode

```bash
pnpm run dev
```

The app will be available at **http://localhost:3000**

### Production Build

```bash
# Build
pnpm run build

# Start production server
pnpm start
```

## First Steps

1. **Open the app**: Navigate to http://localhost:3000
2. **Check the Dashboard**: Should show system status, rigs, and agents
3. **Test navigation**: Try different views (Convoys, Work, Agents, etc.)
4. **Verify API**: Check the browser console for any API errors

## Verification Checklist

- [ ] Dashboard loads without errors
- [ ] Status API returns data (not 500 error)
- [ ] Navigation between views works
- [ ] Theme toggle works (dark/light mode)
- [ ] No console errors in browser dev tools

## Common First-Run Issues

### "Command not found: gt"

**Fix**: The CLI wrapper now automatically finds `gt` in common locations including `~/go/bin`. If you still see this error:

1. Verify `gt` is installed: `which gt`
2. Restart the dev server: `Ctrl+C`, then `pnpm run dev`
3. Check TROUBLESHOOTING.md for more details

### Port 3000 already in use

**Fix**:
```bash
# Use a different port
pnpm run dev -- -p 3001
```

### TypeScript errors during build

**Fix**:
```bash
rm -rf .next node_modules
pnpm install
pnpm run build
```

## Project Structure

```
nextjs-rewrite/
├── src/
│   ├── app/              # Pages & API routes (Next.js App Router)
│   │   ├── page.tsx      # Dashboard
│   │   ├── convoys/      # Convoys view
│   │   ├── work/         # Work items view
│   │   └── api/          # API routes (22 endpoints)
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── layout/       # Layout components
│   ├── contexts/         # React Context (state, WebSocket)
│   ├── lib/              # Utilities
│   │   ├── api-client.ts # API client
│   │   ├── cli-wrapper.ts# CLI execution
│   │   └── cache.ts      # Server-side caching
│   └── types/            # TypeScript types
└── public/assets/        # Static assets
```

## Development Tips

### Hot Reload
- Changes to pages and components reload automatically
- API route changes require manual refresh
- Type changes may need server restart

### Browser DevTools
- **Console**: Check for errors and warnings
- **Network**: Monitor API requests and responses
- **React DevTools**: Inspect component state and props

### Keyboard Shortcuts (in browser)
- `Ctrl+K` / `Cmd+K`: Search (if implemented)
- `Cmd+Shift+L`: Toggle theme

## Next Steps

1. **Explore the codebase**: Start with `src/app/page.tsx` (Dashboard)
2. **Review the docs**:
   - `README.md` - Full documentation
   - `MIGRATION.md` - Changes from vanilla version
   - `IMPLEMENTATION_SUMMARY.md` - Technical details
   - `TROUBLESHOOTING.md` - Solutions to common issues
3. **Customize**: Add your own features and components
4. **Test**: Try creating convoys, managing work, etc.

## Getting Help

- **Error messages**: Check the terminal output and browser console
- **Documentation**: See README.md and TROUBLESHOOTING.md
- **Gas Town CLI**: Verify with `gt status --json --fast`

---

**Ready to go?** Run `pnpm run dev` and start exploring! 🚀
