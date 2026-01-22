#!/usr/bin/env node

/**
 * Gas Town GUI (Next.js) CLI
 *
 * Command-line interface for starting the Gas Town GUI Next.js app.
 *
 * Usage:
 *   gastown-gui [command] [options]
 *
 * Commands:
 *   start         Start the GUI server (production)
 *   dev           Start in development mode (default)
 *   build         Build for production
 *   version       Show version
 *   doctor        Check Gas Town installation
 *   help          Show help
 *
 * Options:
 *   --port, -p    Port to run on (default: 3000)
 *   --open, -o    Open browser after starting
 */

import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');

// Parse arguments
const args = process.argv.slice(2);

// Check for help/version flags first
if (args.includes('--help') || (args.includes('-h') && args.length === 1)) {
  showHelp();
  process.exit(0);
}
if (args.includes('--version') || args.includes('-v')) {
  showVersion();
  process.exit(0);
}

const command = args.find(a => !a.startsWith('-')) || 'dev';
const options = {
  port: getOption(['--port', '-p']) || '3000',
  open: hasFlag(['--open', '-o']),
};

function getOption(flags) {
  for (const flag of flags) {
    const idx = args.indexOf(flag);
    if (idx !== -1 && args[idx + 1]) {
      return args[idx + 1];
    }
  }
  return null;
}

function hasFlag(flags) {
  return flags.some(f => args.includes(f));
}

function showHelp() {
  console.log(`
Gas Town GUI (Next.js) - Modern web interface for Gas Town

Usage:
  gastown-gui [command] [options]

Commands:
  dev           Start in development mode (default, hot reload)
  start         Start production server (run 'build' first)
  build         Build for production
  version       Show version information
  doctor        Check Gas Town installation and prerequisites
  help          Show this help message

Options:
  --port, -p <port>   Port to run on (default: 3000)
  --open, -o          Open browser after starting

Environment Variables:
  GT_ROOT      Gas Town root directory (default: ~/gt)
  PATH         Should include gt, gh, bd, tmux binaries

Examples:
  gastown-gui                    # Start dev server on port 3000
  gastown-gui dev --port 8080    # Start dev server on port 8080
  gastown-gui dev --open         # Start and open browser
  gastown-gui build              # Build for production
  gastown-gui start              # Run production build
  gastown-gui doctor             # Check installation

Prerequisites:
  - Node.js 18+ 
  - npm or pnpm (package manager)
  - Gas Town CLI (gt) in PATH or ~/go/bin/gt
  - GitHub CLI (gh) for PR/issue tracking (optional)

More info: https://github.com/web3dev1337/gastown-gui
`);
}

function showVersion() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  console.log(`gastown-gui (Next.js) v${packageJson.version}`);
  console.log(`Node.js ${process.version}`);

  // Check gt version and path
  try {
    const gtPath = execSync('which gt 2>/dev/null || echo "not in PATH"', { encoding: 'utf8' }).trim();
    const gtVersion = execSync('gt version 2>/dev/null || echo "not installed"', { encoding: 'utf8' }).trim();
    console.log(`gt: ${gtVersion}`);
    if (gtPath && gtPath !== 'not in PATH') {
      console.log(`    Location: ${gtPath}`);
    }
  } catch {
    console.log('gt: not found in PATH');
    // Check common locations
    const home = os.homedir();
    const commonPaths = [
      path.join(home, 'go', 'bin', 'gt'),
      path.join(home, '.local', 'bin', 'gt'),
      '/usr/local/bin/gt',
    ];
    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        console.log(`    Found at: ${p} (will auto-detect)`);
        break;
      }
    }
  }

  // Check gh version
  try {
    const ghVersion = execSync('gh --version 2>/dev/null | head -1 || echo "not installed"', { encoding: 'utf8' }).trim();
    console.log(`gh: ${ghVersion}`);
  } catch {
    console.log('gh: not found in PATH (optional)');
  }

  // Check package manager
  const hasPnpmLock = fs.existsSync(path.join(packageRoot, 'pnpm-lock.yaml'));
  if (hasPnpmLock) {
    try {
      const pnpmVersion = execSync('pnpm --version 2>/dev/null', { encoding: 'utf8' }).trim();
      console.log(`pnpm: ${pnpmVersion}`);
    } catch {
      console.log('pnpm: not found (install: npm install -g pnpm)');
    }
  } else {
    const npmVersion = execSync('npm --version 2>/dev/null', { encoding: 'utf8' }).trim();
    console.log(`npm: ${npmVersion}`);
  }
}

function runDoctor() {
  console.log('Gas Town GUI Doctor (Next.js)\n');
  console.log('Checking prerequisites...\n');

  let allGood = true;
  const home = os.homedir();

  // Check Node.js version
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  if (major >= 18) {
    console.log(`✅ Node.js ${nodeVersion} (>= 18 required)`);
  } else {
    console.log(`❌ Node.js ${nodeVersion} (>= 18 required)`);
    allGood = false;
  }

  // Check for package manager (npm or pnpm)
  const hasPackageLock = fs.existsSync(path.join(packageRoot, 'package-lock.json'));
  const hasPnpmLock = fs.existsSync(path.join(packageRoot, 'pnpm-lock.yaml'));
  
  if (hasPnpmLock) {
    try {
      const pnpmVersion = execSync('pnpm --version 2>/dev/null', { encoding: 'utf8' }).trim();
      console.log(`✅ pnpm ${pnpmVersion}`);
    } catch {
      console.log('❌ pnpm not found (pnpm-lock.yaml exists)');
      console.log('   Install: npm install -g pnpm');
      allGood = false;
    }
  } else {
    // Using npm
    const npmVersion = execSync('npm --version 2>/dev/null', { encoding: 'utf8' }).trim();
    console.log(`✅ npm ${npmVersion}`);
  }

  // Check gt (with auto-detection)
  let gtFound = false;
  let gtPath = null;
  
  try {
    gtPath = execSync('which gt 2>/dev/null', { encoding: 'utf8' }).trim();
    if (gtPath) {
      gtFound = true;
      const gtVersion = execSync('gt version 2>/dev/null', { encoding: 'utf8' }).trim();
      console.log(`✅ gt installed at ${gtPath}`);
      console.log(`   Version: ${gtVersion}`);
    }
  } catch {
    // Check common locations (auto-detection fallback)
    const commonPaths = [
      path.join(home, 'go', 'bin', 'gt'),
      path.join(home, '.local', 'bin', 'gt'),
      '/usr/local/bin/gt',
      '/opt/homebrew/bin/gt',
    ];
    
    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        gtFound = true;
        gtPath = p;
        console.log(`✅ gt found at ${p} (auto-detection)`);
        try {
          const gtVersion = execSync(`${p} version 2>/dev/null`, { encoding: 'utf8' }).trim();
          console.log(`   Version: ${gtVersion}`);
        } catch {}
        break;
      }
    }
    
    if (!gtFound) {
      console.log('❌ gt not found in PATH or common locations');
      console.log('   Searched: ' + commonPaths.join(', '));
      console.log('   Install: go install github.com/steveyegge/gastown@latest');
      allGood = false;
    }
  }

  // Check bd
  try {
    execSync('which bd 2>/dev/null', { encoding: 'utf8' });
    console.log('✅ bd (beads) installed');
  } catch {
    console.log('⚠️  bd (beads) not found - some features may not work');
  }

  // Check gh
  try {
    const ghVersion = execSync('gh --version 2>/dev/null | head -1', { encoding: 'utf8' }).trim();
    console.log(`✅ GitHub CLI: ${ghVersion}`);

    // Check auth
    try {
      execSync('gh auth status 2>&1', { encoding: 'utf8' });
      console.log('   ✅ Authenticated');
    } catch {
      console.log('   ⚠️  Not authenticated - run: gh auth login');
    }
  } catch {
    console.log('⚠️  GitHub CLI (gh) not found - PR/issue tracking disabled');
  }

  // Check tmux
  try {
    execSync('which tmux 2>/dev/null', { encoding: 'utf8' });
    console.log('✅ tmux installed (for polecat control)');
  } catch {
    console.log('⚠️  tmux not found - polecat restart may not work');
  }

  // Check GT_ROOT
  const gtRoot = process.env.GT_ROOT || path.join(home, 'gt');
  if (fs.existsSync(gtRoot)) {
    console.log(`✅ GT_ROOT exists: ${gtRoot}`);
    try {
      const rigs = fs.readdirSync(gtRoot).filter(f => {
        const fullPath = path.join(gtRoot, f);
        return fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'config.json'));
      });
      console.log(`   Found ${rigs.length} rig(s): ${rigs.join(', ') || '(none)'}`);
    } catch {
      // Ignore
    }
  } else {
    console.log(`⚠️  GT_ROOT not found: ${gtRoot}`);
    console.log('   Initialize: gt init');
  }

  // Check if dependencies are installed
  const nodeModulesPath = path.join(packageRoot, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log(`✅ Dependencies installed`);
  } else {
    const packageManager = hasPnpmLock ? 'pnpm' : 'npm';
    console.log(`⚠️  Dependencies not installed`);
    console.log(`   Run: ${packageManager} install`);
    allGood = false;
  }

  // Check if built for production
  const nextBuildPath = path.join(packageRoot, '.next');
  if (fs.existsSync(nextBuildPath)) {
    console.log(`✅ Production build exists`);
  } else {
    console.log(`ℹ️  No production build (run 'gastown-gui build' for production)`);
  }

  console.log('');
  if (allGood) {
    console.log('✅ All critical prerequisites met!');
    console.log('');
    console.log('Run: gastown-gui dev      # Start development server');
    console.log('Or:  gastown-gui build    # Build for production');
    console.log('     gastown-gui start    # Run production build');
  } else {
    console.log('❌ Some critical prerequisites missing. Fix issues above and try again.');
    process.exit(1);
  }
}

function ensureDependencies() {
  const nodeModulesPath = path.join(packageRoot, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('Dependencies not found. Installing...');
    
    // Detect package manager
    const hasPackageLock = fs.existsSync(path.join(packageRoot, 'package-lock.json'));
    const hasPnpmLock = fs.existsSync(path.join(packageRoot, 'pnpm-lock.yaml'));
    const packageManager = hasPnpmLock ? 'pnpm' : hasPackageLock ? 'npm' : 'npm';
    
    try {
      execSync(`${packageManager} install`, { cwd: packageRoot, stdio: 'inherit' });
    } catch (error) {
      console.error('Failed to install dependencies');
      process.exit(1);
    }
  }
}

function startDev() {
  console.log(`Starting Gas Town GUI (Next.js) in development mode...`);
  console.log(`Port: ${options.port}`);
  console.log('');

  ensureDependencies();

  const env = {
    ...process.env,
    PORT: options.port,
    // Ensure GT_ROOT is set
    GT_ROOT: process.env.GT_ROOT || path.join(os.homedir(), 'gt'),
  };

  // Detect package manager (prefer npm since package-lock.json exists)
  const hasPackageLock = fs.existsSync(path.join(packageRoot, 'package-lock.json'));
  const hasPnpmLock = fs.existsSync(path.join(packageRoot, 'pnpm-lock.yaml'));
  const packageManager = hasPnpmLock ? 'pnpm' : hasPackageLock ? 'npm' : 'npm';

  console.log(`Using package manager: ${packageManager}`);

  // Next.js automatically uses the PORT environment variable, so no need to pass -p
  const child = spawn(packageManager, ['run', 'dev'], {
    env,
    stdio: 'inherit',
    cwd: packageRoot,
    shell: true,
  });

  // Open browser if requested
  if (options.open) {
    setTimeout(() => {
      const url = `http://localhost:${options.port}`;
      const openCmd = process.platform === 'darwin' ? 'open' :
                      process.platform === 'win32' ? 'start' : 'xdg-open';
      try {
        execSync(`${openCmd} ${url}`, { stdio: 'ignore' });
        console.log(`Opening browser: ${url}`);
      } catch {
        console.log(`\nOpen browser manually: ${url}`);
      }
    }, 3000);
  }

  child.on('error', (err) => {
    console.error('Failed to start dev server:', err.message);
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });

  // Handle signals
  process.on('SIGINT', () => {
    child.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
  });
}

function startProduction() {
  console.log(`Starting Gas Town GUI (Next.js) in production mode...`);
  console.log(`Port: ${options.port}`);
  console.log('');

  // Check if built
  const nextBuildPath = path.join(packageRoot, '.next');
  if (!fs.existsSync(nextBuildPath)) {
    console.error('❌ Production build not found. Run: gastown-gui build');
    process.exit(1);
  }

  ensureDependencies();

  const env = {
    ...process.env,
    PORT: options.port,
    GT_ROOT: process.env.GT_ROOT || path.join(os.homedir(), 'gt'),
  };

  // Detect package manager
  const hasPackageLock = fs.existsSync(path.join(packageRoot, 'package-lock.json'));
  const hasPnpmLock = fs.existsSync(path.join(packageRoot, 'pnpm-lock.yaml'));
  const packageManager = hasPnpmLock ? 'pnpm' : hasPackageLock ? 'npm' : 'npm';

  // Next.js automatically uses the PORT environment variable
  const child = spawn(packageManager, ['run', 'start'], {
    env,
    stdio: 'inherit',
    cwd: packageRoot,
    shell: true,
  });

  // Open browser if requested
  if (options.open) {
    setTimeout(() => {
      const url = `http://localhost:${options.port}`;
      const openCmd = process.platform === 'darwin' ? 'open' :
                      process.platform === 'win32' ? 'start' : 'xdg-open';
      try {
        execSync(`${openCmd} ${url}`, { stdio: 'ignore' });
        console.log(`Opening browser: ${url}`);
      } catch {
        console.log(`\nOpen browser manually: ${url}`);
      }
    }, 2000);
  }

  child.on('error', (err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });

  // Handle signals
  process.on('SIGINT', () => {
    child.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
  });
}

function buildProduction() {
  console.log('Building Gas Town GUI for production...');
  console.log('');

  ensureDependencies();

  // Detect package manager
  const hasPackageLock = fs.existsSync(path.join(packageRoot, 'package-lock.json'));
  const hasPnpmLock = fs.existsSync(path.join(packageRoot, 'pnpm-lock.yaml'));
  const packageManager = hasPnpmLock ? 'pnpm' : hasPackageLock ? 'npm' : 'npm';

  try {
    execSync(`${packageManager} run build`, {
      cwd: packageRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        GT_ROOT: process.env.GT_ROOT || path.join(os.homedir(), 'gt'),
      },
    });
    console.log('');
    console.log('✅ Build complete!');
    console.log('');
    console.log('Run: gastown-gui start    # Start production server');
  } catch (error) {
    console.error('❌ Build failed');
    process.exit(1);
  }
}

// Main
switch (command) {
  case 'dev':
    startDev();
    break;
  case 'start':
    startProduction();
    break;
  case 'build':
    buildProduction();
    break;
  case 'version':
  case '-v':
  case '--version':
    showVersion();
    break;
  case 'doctor':
    runDoctor();
    break;
  case 'help':
  case '--help':
    showHelp();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error('Run: gastown-gui help');
    process.exit(1);
}
