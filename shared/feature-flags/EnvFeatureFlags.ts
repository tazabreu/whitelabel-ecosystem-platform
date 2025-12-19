import type {
  FeatureFlagProvider,
  FeatureFlagContext,
} from "./FeatureFlags.js";

/**
 * Environment variable-based feature flag provider.
 * Suitable for MVP and simple deployments.
 *
 * Flag naming convention:
 * - Flag name: 'credit-cards.pre-approved-offers'
 * - Env var: FEATURE_FLAG_CREDIT_CARDS_PRE_APPROVED_OFFERS
 */
export class EnvFeatureFlagProvider implements FeatureFlagProvider {
  private envSource: Record<string, string | undefined>;

  constructor(envSource?: Record<string, string | undefined>) {
    // Use provided source or process.env
    this.envSource = envSource ?? (process?.env as Record<string, string | undefined>) ?? {};
  }

  /**
   * Convert flag name to environment variable name.
   * 'credit-cards.pre-approved-offers' -> 'FEATURE_FLAG_CREDIT_CARDS_PRE_APPROVED_OFFERS'
   */
  private flagNameToEnvVar(flagName: string): string {
    return (
      "FEATURE_FLAG_" +
      flagName.toUpperCase().replace(/[.-]/g, "_")
    );
  }

  isEnabled(flagName: string, _context?: FeatureFlagContext): boolean {
    const envVar = this.flagNameToEnvVar(flagName);
    const value = this.envSource[envVar];

    if (value === undefined || value === "") {
      return false; // Default to off
    }

    return value.toLowerCase() === "true" || value === "1";
  }

  getString(
    flagName: string,
    defaultValue: string,
    _context?: FeatureFlagContext
  ): string {
    const envVar = this.flagNameToEnvVar(flagName);
    const value = this.envSource[envVar];
    return value ?? defaultValue;
  }

  getNumber(
    flagName: string,
    defaultValue: number,
    _context?: FeatureFlagContext
  ): number {
    const envVar = this.flagNameToEnvVar(flagName);
    const value = this.envSource[envVar];

    if (value === undefined || value === "") {
      return defaultValue;
    }

    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
}

/**
 * Create a singleton instance for the application.
 */
let defaultProvider: FeatureFlagProvider | null = null;

export function getFeatureFlagProvider(): FeatureFlagProvider {
  if (!defaultProvider) {
    defaultProvider = new EnvFeatureFlagProvider();
  }
  return defaultProvider;
}

/**
 * Set a custom provider (useful for testing).
 */
export function setFeatureFlagProvider(provider: FeatureFlagProvider): void {
  defaultProvider = provider;
}

