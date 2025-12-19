# Feature Flags

This module provides a simple, environment-based feature flag system for the ACME Ecosystem.

## Naming Convention

Feature flags use a dot-delimited naming convention:

```
{domain}.{feature-or-capability}
```

Examples:
- `credit-cards.pre-approved-offers`
- `user.two-factor-auth`
- `analytics.enhanced-tracking`

## Environment Variables

Flags are configured via environment variables:

```bash
# Convert flag name to env var:
# credit-cards.pre-approved-offers -> FEATURE_FLAG_CREDIT_CARDS_PRE_APPROVED_OFFERS

FEATURE_FLAG_CREDIT_CARDS_PRE_APPROVED_OFFERS=true
```

For the web shell (Next.js), use `NEXT_PUBLIC_` prefix:

```bash
NEXT_PUBLIC_FEATURE_FLAG_CREDIT_CARDS_PRE_APPROVED_OFFERS=true
```

## Usage

### TypeScript

```typescript
import { getFeatureFlagProvider, FEATURE_FLAGS } from '@ecosystem/feature-flags';

const flags = getFeatureFlagProvider();

if (flags.isEnabled(FEATURE_FLAGS.CREDIT_CARDS_PRE_APPROVED_OFFERS)) {
  // Feature is enabled
}
```

### Java (Spring Boot)

```java
@Value("${feature.flags.credit-cards.pre-approved-offers:false}")
private boolean preApprovedOffersEnabled;
```

## Current Flags

| Flag Name | Description | Default | Owner |
|-----------|-------------|---------|-------|
| `credit-cards.pre-approved-offers` | Show pre-approved credit card offers widget | `false` | Credit Card Team |

## Flag Lifecycle

1. **Creation**: Add flag with default `false` (off)
2. **Rollout**: Enable for specific users/environments
3. **Full Rollout**: Enable for all users
4. **Cleanup**: Remove flag after feature is stable

## Ownership

Every flag MUST have:
- **Owner**: Team responsible for the flag
- **Created Date**: When the flag was added
- **Retirement Plan**: When/how the flag will be removed

## Testing

```typescript
import { setFlagForTesting, clearFlagCache } from '@ecosystem/feature-flags';

beforeEach(() => {
  clearFlagCache();
});

test('feature is enabled', () => {
  setFlagForTesting(FEATURE_FLAGS.CREDIT_CARDS_PRE_APPROVED_OFFERS, true);
  // Test with flag enabled
});
```

