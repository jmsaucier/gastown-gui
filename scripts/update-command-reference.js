#!/usr/bin/env node

/**
 * Script to update the Gas Town command reference
 * 
 * This script queries the installed `gt` CLI to discover available commands
 * and can be used to update src/lib/gastown-commands.ts
 * 
 * Usage:
 *   node scripts/update-command-reference.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function getGTHelp() {
  try {
    const output = execSync('gt --help', { encoding: 'utf8' });
    return output;
  } catch (error) {
    console.error('Error running gt --help:', error.message);
    console.error('Make sure gt is installed and in PATH');
    process.exit(1);
  }
}

function parseCommands(helpText) {
  const commands = [];
  const lines = helpText.split('\n');
  
  let currentCategory = null;
  
  for (const line of lines) {
    // Detect category headers
    if (line.match(/^[A-Z][a-z\s]+:$/)) {
      currentCategory = line.replace(':', '').trim();
      continue;
    }
    
    // Parse command lines (format: "  command    Description")
    const match = line.match(/^\s{2}(\S+)\s{2,}(.+)$/);
    if (match) {
      const [, name, description] = match;
      commands.push({
        name: name.trim(),
        description: description.trim(),
        category: currentCategory || 'Unknown',
      });
    }
  }
  
  return commands;
}

function main() {
  console.log('Fetching Gas Town command list...\n');
  
  const helpText = getGTHelp();
  const commands = parseCommands(helpText);
  
  console.log(`Found ${commands.length} commands:\n`);
  
  // Group by category
  const byCategory = {};
  for (const cmd of commands) {
    if (!byCategory[cmd.category]) {
      byCategory[cmd.category] = [];
    }
    byCategory[cmd.category].push(cmd);
  }
  
  // Display
  for (const [category, cmds] of Object.entries(byCategory)) {
    console.log(`${category}:`);
    for (const cmd of cmds) {
      console.log(`  - ${cmd.name.padEnd(20)} ${cmd.description}`);
    }
    console.log();
  }
  
  // Write to JSON file for reference
  const outputPath = path.join(projectRoot, 'gastown-commands-discovered.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify({ commands, discoveredAt: new Date().toISOString() }, null, 2)
  );
  
  console.log(`\nCommand list written to: ${outputPath}`);
  console.log('\nTo update src/lib/gastown-commands.ts, manually add any new commands.');
  console.log('See GASTOWN_REFERENCE.md for instructions.');
}

main();
