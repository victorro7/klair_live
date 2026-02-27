/**
 * Score Utility Functions
 * Shared helpers for viral score display
 */

/**
 * Get Tailwind color class based on viral score
 * @param score - Viral score (0-100)
 * @returns Tailwind text color class
 */
export function getScoreColor(score: number | undefined | null): string {
    if (!score) return "text-gray-500";
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
}

/**
 * Get border/ring color class for score pill styling
 * @param score - Viral score (0-100)
 * @returns Object with border and text color classes
 */
export function getScorePillClasses(score: number | undefined | null): string {
    if (!score) return "border-gray-500/30 text-gray-400";
    if (score >= 90) return "border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]";
    if (score >= 70) return "border-yellow-500/30 text-yellow-400";
    return "border-red-500/30 text-red-400";
}

/**
 * Check if score qualifies as "viral"
 * @param score - Viral score
 * @returns True if score >= 85
 */
export function isViralScore(score: number | undefined | null): boolean {
    return score !== null && score !== undefined && score >= 85;
}
