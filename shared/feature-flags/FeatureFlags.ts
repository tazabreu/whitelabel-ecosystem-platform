/**
 * Feature flag provider interface.
 * Implementations can be env-based (MVP), LaunchDarkly, Flagsmith, etc.
 */
export interface FeatureFlagProvider {
  /**
   * Check if a feature flag is enabled.
   * @param flagName - Dot-delimited flag name (e.g., 'credit-cards.pre-approved-offers')
   * @param context - Optional context for evaluation (user, environment, etc.)
   */
  isEnabled(flagName: string, context?: FeatureFlagContext): boolean;

  /**
   * Get a string value for a feature flag.
   * @param flagName - Dot-delimited flag name
   * @param defaultValue - Default value if flag is not set
   * @param context - Optional context for evaluation
   */
  getString(
    flagName: string,
    defaultValue: string,
    context?: FeatureFlagContext
  ): string;

  /**
   * Get a number value for a feature flag.
   * @param flagName - Dot-delimited flag name
   * @param defaultValue - Default value if flag is not set
   * @param context - Optional context for evaluation
   */
  getNumber(
    flagName: string,
    defaultValue: number,
    context?: FeatureFlagContext
  ): number;
}

/**
 * Context for feature flag evaluation.
 */
export interface FeatureFlagContext {
  userId?: string;
  userEcosystemId?: string;
  environment?: string;
  attributes?: Record<string, string | number | boolean>;
}

/**
 * Known feature flags in the ecosystem.
 * Add new flags here for type safety and documentation.
 */
export const FEATURE_FLAGS = {
  CREDIT_CARDS_PRE_APPROVED_OFFERS: "credit-cards.pre-approved-offers",
  // Add more flags as needed
} as const;

export type FeatureFlagName =
  (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

