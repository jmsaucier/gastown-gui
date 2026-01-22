# CLI Usage Guide

## Overview

The Next.js rewrite includes a powerful CLI for launching and managing the application.

## Installation

### Option 1: Local (Development)

```bash
cd /Users/msaucier/personal/gastown-gui/nextjs-rewrite

# Install dependencies
pnpm install

# Link CLI globally (for development)
pnpm link --global
```

Now you can run `gastown-gui` from anywhere!

### Option 2: NPM Package (When Published)

```bash
npm install -g gastown-gui-nextjs
# or
pnpm install -g gastown-gui-nextjs
```

## Commands

### `gastown-gui dev` (Default)

Start the development server with hot reload:

```bash
gastown-gui dev
# or
gastown-gui
```

**Options:**
- `--port, -p <port>`: Custom port (default: 3000)
- `--open, -o`: Open browser automatically

**Examples:**
```bash
gastown-gui dev --port 8080
gastown-gui dev --open
gastown-gui --port 3001 --open
```

### `gastown-gui build`

Build for production:

```bash
gastown-gui build
```

This creates an optimized production build in `.next/`.

### `gastown-gui start`

Run the production build:

```bash
gastown-gui start
```

**Options:**
- `--port, -p <port>`: Custom port (default: 3000)
- `--open, -o`: Open browser automatically

**Note:** You must run `gastown-gui build` first!

### `gastown-gui doctor`

Check your Gas Town installation and prerequisites:

```bash
gastown-gui doctor
```

This verifies:
- ✅ Node.js version (>= 18)
- ✅ pnpm installed
- ✅ `gt` CLI (with auto-detection in `~/go/bin`, etc.)
- ✅ `bd` (beads) CLI
- ✅ `gh` (GitHub CLI) and authentication
- ✅ `tmux` (for polecat control)
- ✅ GT_ROOT directory exists
- ✅ Dependencies installed
- ℹ️ Production build status

**Example output:**
```
Gas Town GUI Doctor (Next.js)

Checking prerequisites...

✅ Node.js v22.12.0 (>= 18 required)
✅ pnpm 9.15.4
✅ gt found at /Users/msaucier/go/bin/gt (auto-detection)
   Version: gastown 0.1.0
✅ bd (beads) installed
✅ GitHub CLI: gh version 2.63.2 (2024-12-04)
   ✅ Authenticated
✅ tmux installed (for polecat control)
✅ GT_ROOT exists: /Users/msaucier/gt
   Found 3 rig(s): myrig, testrig, prodrig
✅ Dependencies installed
ℹ️ No production build (run 'gastown-gui build' for production)

✅ All critical prerequisites met!

Run: gastown-gui dev      # Start development server
Or:  gastown-gui build    # Build for production
     gastown-gui start    # Run production build
```

### `gastown-gui version`

Show version information:

```bash
gastown-gui version
# or
gastown-gui -v
```

**Example output:**
```
gastown-gui (Next.js) v0.1.0
Node.js v22.12.0
gt: gastown 0.1.0
    Location: /Users/msaucier/go/bin/gt
gh: gh version 2.63.2 (2024-12-04)
pnpm: 9.15.4
```

### `gastown-gui help`

Show help message:

```bash
gastown-gui help
# or
gastown-gui --help
```

## PATH Detection: How It Works

### When You Run the CLI from Terminal ✅

Your `.zshrc` has loaded, so `gt` is in your PATH:

```bash
# Your .zshrc adds gt to PATH
export PATH="$HOME/go/bin:$PATH"

# Then you run the CLI
gastown-gui dev
```

**Result:** ✅ `gt` command is found via inherited PATH

### When Launched Other Ways ⚠️

If the CLI is launched from:
- Desktop app launcher
- System service (launchd/systemd)
- Cron job
- macOS Login Items

The `.zshrc` is **not loaded**, so `gt` won't be in PATH by default.

**Result:** ✅ Still works! Auto-detection finds `gt` in common locations:
- `~/go/bin/gt`
- `~/.local/bin/gt`
- `/usr/local/bin/gt`
- `/opt/homebrew/bin/gt`

### Three Layers of Protection 🛡️

1. **Inherited PATH** (from your terminal session)
2. **Auto-detection** (checks common binary locations)
3. **Environment variables** (`.env.local` can set PATH explicitly)

This ensures the CLI works **everywhere**, regardless of how it's launched!

## Environment Variables

The CLI respects these environment variables:

### Required
- `GT_ROOT`: Gas Town root directory (default: `~/gt`)

### Optional
- `PORT`: Server port (default: 3000)
- `PATH`: Binary search path (auto-augmented if needed)

### Setting Environment Variables

**Option 1: Shell profile (`.zshrc`)**
```bash
export GT_ROOT=~/my-custom-gt-root
export PATH="$HOME/go/bin:$PATH"
```

**Option 2: `.env.local` file**
```bash
# In nextjs-rewrite/.env.local
GT_ROOT=~/gt
PATH=/Users/msaucier/go/bin:/usr/local/bin:/usr/bin:/bin
```

**Option 3: Command line**
```bash
GT_ROOT=~/custom pnpm gastown-gui dev
```

## Typical Workflows

### Development

```bash
# First time setup
cd nextjs-rewrite
pnpm install
pnpm link --global

# Check everything is working
gastown-gui doctor

# Start dev server
gastown-gui dev --open

# Make changes (hot reload works automatically)
```

### Production Deployment

```bash
# Build
gastown-gui build

# Test production build locally
gastown-gui start --port 8080

# Deploy
# (copy .next/, public/, package.json, node_modules/ to server)

# Run on server
GT_ROOT=/path/to/gt gastown-gui start --port 80
```

### Quick Testing

```bash
# Run on different port to test alongside original version
gastown-gui dev --port 3001 --open
```

## Comparison: Original vs Next.js CLI

| Feature | Original (`bin/cli.js`) | Next.js (`bin/cli.js`) |
|---------|-------------------------|------------------------|
| Start server | `gastown-gui start` | `gastown-gui dev` (dev)<br>`gastown-gui start` (prod) |
| Port option | `--port` ✅ | `--port` ✅ |
| Open browser | `--open` ✅ | `--open` ✅ |
| Dev mode | `--dev` flag | `dev` command |
| Doctor check | `doctor` ✅ | `doctor` ✅ (enhanced) |
| Version info | `version` ✅ | `version` ✅ (enhanced) |
| Build command | N/A | `build` command |
| PATH detection | Inherits from shell | **3-layer detection** |
| Server | Express.js | Next.js |
| Hot reload | Manual restart | Automatic ✅ |

## Troubleshooting

### "Command not found: gastown-gui"

**Solution:** Link the CLI:
```bash
cd nextjs-rewrite
pnpm link --global
```

Or run directly:
```bash
cd nextjs-rewrite
node bin/cli.js dev
```

### "Command not found: gt"

**Solution 1:** Run doctor to check:
```bash
gastown-gui doctor
```

**Solution 2:** Verify `gt` location:
```bash
which gt
# Should output: /Users/msaucier/go/bin/gt
```

**Solution 3:** The CLI should auto-detect it! If not, set PATH explicitly:
```bash
# In .env.local
PATH=/Users/msaucier/go/bin:$PATH
```

### "Production build not found"

**Solution:** Build first:
```bash
gastown-gui build
gastown-gui start
```

### Port already in use

**Solution:** Use a different port:
```bash
gastown-gui dev --port 3001
```

## Advanced Usage

### Custom GT_ROOT

```bash
GT_ROOT=~/custom-gt-root gastown-gui dev
```

### Multiple Instances

```bash
# Terminal 1: Dev server
gastown-gui dev --port 3000

# Terminal 2: Production test
gastown-gui build
gastown-gui start --port 3001

# Terminal 3: Original version (for comparison)
cd ..
node server.js
```

### Development with Auto-open

```bash
# Perfect for daily development
gastown-gui dev --open
```

### CI/CD Pipeline

```bash
#!/bin/bash
# deploy.sh

set -e

echo "Installing dependencies..."
pnpm install

echo "Running doctor check..."
node bin/cli.js doctor

echo "Building for production..."
node bin/cli.js build

echo "Starting server..."
node bin/cli.js start --port 8080
```

## Summary

The Next.js CLI provides a robust, production-ready way to launch your Gas Town GUI with:

✅ **Smart PATH detection** (works even without `.zshrc`)  
✅ **Multiple commands** (dev, build, start, doctor)  
✅ **Auto-open browser**  
✅ **Hot reload in dev mode**  
✅ **Comprehensive health checks**  
✅ **Works everywhere** (terminal, service, cron, etc.)

**Get started now:**
```bash
gastown-gui dev --open
```

🚀 Enjoy your modern Gas Town GUI!
