/**
 * Feature flags for development and testing
 */

/**
 * Check if payout requirements are disabled
 * Useful for local development when testing with multiple accounts
 */
export function isPayoutRequirementsDisabled(): boolean {
  return process.env.NEXT_PUBLIC_DISABLE_PAYOUT_REQUIREMENTS === 'true';
}
