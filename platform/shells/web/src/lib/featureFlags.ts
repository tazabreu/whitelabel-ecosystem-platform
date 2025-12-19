/**
 * Feature flag evaluation for the web shell.
 * Reads flags from environment variables or API.
 */

// Feature flag names
export const FEATURE_FLAGS = {
  CREDIT_CARDS_PRE_APPROVED_OFFERS: "credit-cards.pre-approved-offers",
} as const;

type FeatureFlagName = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

// Cache for feature flags
let flagCache: Record<string, boolean> | null = null;

/**
 * Check if a feature flag is enabled.
 * For MVP, reads from environment variables.
 */
export function isFeatureEnabled(flagName: FeatureFlagName): boolean {
  // Check cache first
  if (flagCache && flagName in flagCache) {
    return flagCache[flagName];
  }

  // Convert flag name to env var format
  // 'credit-cards.pre-approved-offers' -> 'NEXT_PUBLIC_FEATURE_FLAG_CREDIT_CARDS_PRE_APPROVED_OFFERS'
  const envVarName = `NEXT_PUBLIC_FEATURE_FLAG_${flagName
    .toUpperCase()
    .replace(/[.-]/g, "_")}`;

  // Check environment variable
  const value = process.env[envVarName];
  const isEnabled = value === "true" || value === "1";

  // Cache the result
  if (!flagCache) {
    flagCache = {};
  }
  flagCache[flagName] = isEnabled;

  return isEnabled;
}

/**
 * Clear the feature flag cache (useful for testing).
 */
export function clearFlagCache(): void {
  flagCache = null;
}

/**
 * Set a flag value directly (useful for testing).
 */
export function setFlagForTesting(
  flagName: FeatureFlagName,
  value: boolean
): void {
  if (!flagCache) {
    flagCache = {};
  }
  flagCache[flagName] = value;
}

