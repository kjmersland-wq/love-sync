// Unified Feature Flags Configuration for Love Sync v1.0
// Ensures unfinished features are hidden from users and can be toggled without changing code.

export type FeatureKey =
  | 'aiFeatures'
  | 'videoProfiles'
  | 'voiceMessages'
  | 'idVerification'
  | 'referralProgram'
  | 'giftSubscriptions'
  | 'advancedMatching'
  | 'paymentStripe'
  | 'experimental';

class FeatureFlagsService {
  private flags: Record<FeatureKey, boolean> = {
    aiFeatures: false,          // AI helper components
    videoProfiles: false,       // Video uploads (disabled for launch)
    voiceMessages: false,       // Audio messaging (disabled for launch)
    idVerification: true,       // Government ID and verification portal (fully polished)
    referralProgram: false,     // User invite programs (disabled for launch)
    giftSubscriptions: false,   // Billed subscription gifting (disabled for launch)
    advancedMatching: true,     // Weighted compatibility metrics
    paymentStripe: true,        // Stripe integration is now active and primary
    experimental: false
  };

  constructor() {
    // Read from environment variables if present
    if (typeof process !== 'undefined' && process.env) {
      this.loadFromEnv();
    }
  }

  private loadFromEnv() {
    const prefix = 'NEXT_PUBLIC_FEAT_';
    (Object.keys(this.flags) as FeatureKey[]).forEach(key => {
      const envKey = `${prefix}${this.toEnvFormat(key)}`;
      const envVal = process.env[envKey];
      if (envVal !== undefined) {
        this.flags[key] = envVal === 'true';
      }
    });
  }

  private toEnvFormat(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toUpperCase();
  }

  /**
   * Check if a feature is enabled.
   */
  public isEnabled(feature: FeatureKey): boolean {
    return this.flags[feature] ?? false;
  }

  /**
   * Temporarily override feature flags (for administrative sessions).
   */
  public setOverride(feature: FeatureKey, enabled: boolean): void {
    this.flags[feature] = enabled;
  }

  /**
   * Retrieve the complete state of all flags.
   */
  public getAllFlags(): Record<FeatureKey, boolean> {
    return { ...this.flags };
  }
}

export const featureFlags = new FeatureFlagsService();
export default featureFlags;
