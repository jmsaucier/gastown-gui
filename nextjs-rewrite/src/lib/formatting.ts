/**
 * Formatting Utilities
 */

/**
 * Format a date/time string for display
 */
export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return 'Unknown';
  
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  
  if (isNaN(date.getTime())) return 'Invalid date';
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Less than a minute
  if (seconds < 60) {
    return seconds <= 5 ? 'Just now' : `${seconds}s ago`;
  }
  
  // Less than an hour
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  
  // Less than a day
  if (hours < 24) {
    return `${hours}h ago`;
  }
  
  // Less than a week
  if (days < 7) {
    return `${days}d ago`;
  }
  
  // Full date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Format a timestamp as a relative time
 */
export function formatRelativeTime(timestamp: string | Date | null | undefined): string {
  return formatDate(timestamp);
}

/**
 * Format a duration in milliseconds
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Format agent name from path
 */
export function formatAgentName(name: string | null | undefined): string {
  if (!name) return 'unknown';
  const parts = name.split('/');
  return parts[parts.length - 1] || parts[0];
}

/**
 * Format rig name
 */
export function formatRigName(rig: string | null | undefined): string {
  if (!rig) return 'Unknown';
  return rig.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Pluralize a word based on count
 */
export function pluralize(word: string, count: number): string {
  return count === 1 ? word : `${word}s`;
}
