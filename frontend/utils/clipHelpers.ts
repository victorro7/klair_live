/**
 * Clip Utility Functions
 * Pure helper functions for clip operations
 */

/**
 * Calculate the total clip duration label
 * @param preBuffer - Seconds before trigger
 * @param postBuffer - Seconds after trigger
 * @returns Formatted duration string (e.g., "2 MINS" or "90 SECS")
 */
export function calculateClipDuration(preBuffer: number, postBuffer: number): string {
    const totalDuration = preBuffer + postBuffer;

    if (totalDuration % 60 === 0) {
        const minutes = totalDuration / 60;
        return `${minutes} MIN${minutes > 1 ? 'S' : ''}`;
    }

    return `${totalDuration} SECS`;
}

/**
 * Format a timestamp to a readable time string
 * @param timestamp - Unix timestamp
 * @returns Formatted time string
 */
export function formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

/**
 * Get the backend URL from environment or default
 * @returns Backend URL
 */
export function getBackendUrl(): string {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
}
