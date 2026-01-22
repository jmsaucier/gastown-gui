/**
 * CLI Wrapper Utilities
 * Execute Gas Town CLI commands from Next.js API routes
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';
import { existsSync } from 'fs';

const execFileAsync = promisify(execFile);

const HOME = process.env.HOME || os.homedir();
const GT_ROOT = process.env.GT_ROOT || path.join(HOME, 'gt');

// Common binary paths to check (in order of preference)
const COMMON_BIN_PATHS = [
  path.join(HOME, 'go', 'bin'),
  path.join(HOME, '.local', 'bin'),
  path.join(HOME, 'bin'),
  '/usr/local/bin',
  '/opt/homebrew/bin',
];

// Augment PATH with common binary locations
const augmentedPath = [
  ...COMMON_BIN_PATHS,
  ...(process.env.PATH || '').split(':'),
].filter(Boolean).join(':');

/**
 * Quote a shell argument to prevent injection
 */
export function quoteArg(arg: string): string {
  if (!arg || typeof arg !== 'string') return "''";
  
  // If argument contains no special characters, return as-is
  if (/^[a-zA-Z0-9_\-\.\/]+$/.test(arg)) {
    return arg;
  }
  
  // Escape single quotes and wrap in single quotes
  return "'" + arg.replace(/'/g, "'\\''") + "'";
}

/**
 * Cache for command paths to avoid repeated filesystem checks
 */
const commandPathCache = new Map<string, string>();

/**
 * Use 'which' command to find the full path to a binary
 */
async function whichCommand(command: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync('which', [command], {
      env: {
        ...process.env,
        PATH: augmentedPath,
      },
    });
    const foundPath = stdout.trim();
    if (foundPath && existsSync(foundPath)) {
      return foundPath;
    }
  } catch (error) {
    // which command failed
  }
  return null;
}

/**
 * Find the full path to a command by checking common binary locations
 */
function findCommandSync(command: string): string {
  // Check cache first
  if (commandPathCache.has(command)) {
    return commandPathCache.get(command)!;
  }

  // If it's already an absolute path and exists, use it
  if (path.isAbsolute(command) && existsSync(command)) {
    console.log(`[CLI] Found command at absolute path: ${command}`);
    commandPathCache.set(command, command);
    return command;
  }

  // Check common binary paths
  for (const binPath of COMMON_BIN_PATHS) {
    const fullPath = path.join(binPath, command);
    try {
      if (existsSync(fullPath)) {
        console.log(`[CLI] Found command at: ${fullPath}`);
        commandPathCache.set(command, fullPath);
        return fullPath;
      }
    } catch (error) {
      console.warn(`[CLI] Error checking path ${fullPath}:`, error);
    }
  }

  // Fall back to command name (will be searched in PATH)
  console.log(`[CLI] Command not found in common paths, falling back to PATH search: ${command}`);
  commandPathCache.set(command, command);
  return command;
}

/**
 * Execute a CLI command
 */
export async function execCLI(
  command: string,
  args: string[] = [],
  options: {
    cwd?: string;
    timeout?: number;
    maxBuffer?: number;
  } = {}
): Promise<string> {
  const cwd = options.cwd || GT_ROOT;
  const timeout = options.timeout || 30000;
  const maxBuffer = options.maxBuffer || 10 * 1024 * 1024; // 10MB

  // Find the full path to the command
  const commandPath = findCommandSync(command);
  console.log(`[CLI] Resolved command path: ${commandPath}`);
  console.log(`[CLI] Executing with args:`, args);

  try {
    const { stdout, stderr} = await execFileAsync(commandPath, args, {
      cwd,
      timeout,
      maxBuffer,
      env: {
        ...process.env,
        PATH: augmentedPath,
        GT_ROOT,
        HOME,
      },
    });

    if (stderr && !stdout) {
      throw new Error(stderr);
    }

    return stdout;
  } catch (error: any) {
    console.error(`[CLI] Command execution failed:`, {
      command,
      commandPath,
      args,
      error: error.message,
      code: error.code,
      signal: error.signal,
      cwd,
      env_PATH: augmentedPath.split(':').slice(0, 3).join(':') + '...',
    });

    // Handle timeout
    if (error.killed && error.signal === 'SIGTERM') {
      throw new Error(`Command timed out after ${timeout}ms`);
    }

    // Handle command not found
    if (error.code === 'ENOENT') {
      const searchedPaths = COMMON_BIN_PATHS.map(p => path.join(p, command)).join(', ');
      throw new Error(
        `Command not found: ${command}\n` +
        `Tried: ${searchedPaths}\n` +
        `PATH: ${augmentedPath}`
      );
    }

    throw error;
  }
}

/**
 * Execute gt command
 */
export async function execGT(args: string[], options?: { cwd?: string; timeout?: number }): Promise<string> {
  return execCLI('gt', args, options);
}

/**
 * Execute bd (bead) command
 */
export async function execBD(args: string[], options?: { cwd?: string; timeout?: number }): Promise<string> {
  return execCLI('bd', args, options);
}

/**
 * Execute gh (GitHub CLI) command
 */
export async function execGH(args: string[], options?: { cwd?: string; timeout?: number }): Promise<string> {
  return execCLI('gh', args, options);
}

/**
 * Execute tmux command
 */
export async function execTmux(args: string[], options?: { cwd?: string; timeout?: number }): Promise<string> {
  return execCLI('tmux', args, options);
}

/**
 * Parse JSON output from CLI command
 */
export async function execGTJSON<T = any>(args: string[], options?: { cwd?: string; timeout?: number }): Promise<T> {
  const output = await execGT(args, options);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`Failed to parse JSON output: ${output.substring(0, 200)}`);
  }
}

/**
 * Check if a command exists
 */
export async function commandExists(command: string): Promise<boolean> {
  try {
    await execFileAsync('which', [command]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get GT root directory
 */
export function getGTRoot(): string {
  return GT_ROOT;
}

/**
 * Get rig path
 */
export function getRigPath(rigName: string): string {
  return path.join(GT_ROOT, rigName);
}
