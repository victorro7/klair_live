/**
 * Time Utility Functions
 * Shared helpers for parsing and formatting time values
 */

/**
 * Parse a time string to seconds
 * Supports formats: "MM:SS", "HH:MM:SS", or raw seconds as string
 * @param t - Time string to parse
 * @returns Number of seconds, or null if invalid/missing
 */
export function parseTime(t: string | undefined): number | null {
    if (!t) return null;
    if (t.includes(':')) {
        const parts = t.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
        }
        if (parts.length === 3) {
            return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
        }
    }
    const val = parseFloat(t);
    return isNaN(val) ? null : val;
}

/**
 * Calculate duration between two time strings
 * @param start - Start time string
 * @param end - End time string
 * @returns Duration in seconds, or 0 if invalid
 */
export function calculateDuration(start: string | undefined, end: string | undefined): number {
    if (!start || !end) return 0;
    const s = parseTime(start);
    const e = parseTime(end);
    return (s !== null && e !== null) ? e - s : 0;
}

/**
 * Format seconds as MM:SS string
 * @param seconds - Total seconds
 * @returns Formatted time string
 */
export function formatTimeMMSS(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds as display timestamp (used in transcript view)
 * @param seconds - Timestamp in seconds
 * @returns Formatted string like "01:30"
 */
export function formatTimestamp(seconds: number): string {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
}
