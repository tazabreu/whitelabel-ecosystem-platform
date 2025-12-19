import { api } from "./api";
import { getJourneyId } from "./journey";
import { getSession } from "./session";

export interface AnalyticsEvent {
  eventName: string;
  domain: "user" | "credit-card" | "analytics" | "platform";
  entity?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Send an analytics event to the backend.
 * Uses best-effort delivery - failures are logged but don't affect UX.
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const session = getSession();
    const journeyId = getJourneyId();

    await api.post("/api/analytics/events", {
      eventName: event.eventName,
      domain: event.domain,
      entity: event.entity,
      action: event.action,
      timestamp: new Date().toISOString(),
      journeyId,
      userEcosystemId: session?.userEcosystemId,
      source: "web-shell",
      metadata: event.metadata,
    });
  } catch (error) {
    // Best-effort: log but don't throw
    console.warn("Failed to track analytics event:", error);
  }
}

/**
 * Track a navigation event.
 */
export function trackNavigation(from: string, to: string): void {
  trackEvent({
    eventName: "navigation",
    domain: "platform",
    entity: "navigation",
    action: "navigated",
    metadata: { from, to },
  });
}

/**
 * Track a page view.
 */
export function trackPageView(path: string): void {
  trackEvent({
    eventName: "page_viewed",
    domain: "platform",
    entity: "page",
    action: "viewed",
    metadata: { path },
  });
}

// === Credit Card Events ===

export function trackOfferViewed(offerId: string, limit: number): void {
  trackEvent({
    eventName: "offer_viewed",
    domain: "credit-card",
    entity: "offer",
    action: "viewed",
    metadata: { offerId, limit },
  });
}

export function trackOnboardingSigned(accountId: string): void {
  trackEvent({
    eventName: "onboarding_signed",
    domain: "credit-card",
    entity: "onboarding",
    action: "signed",
    metadata: { accountId },
  });
}

export function trackPurchaseSimulated(
  amount: number,
  status: "approved" | "declined"
): void {
  trackEvent({
    eventName: "purchase_simulated",
    domain: "credit-card",
    entity: "purchase",
    action: "simulated",
    metadata: { amount, status },
  });
}

export function trackLimitRaised(oldLimit: number, newLimit: number): void {
  trackEvent({
    eventName: "limit_raised",
    domain: "credit-card",
    entity: "limit",
    action: "raised",
    metadata: { oldLimit, newLimit },
  });
}

export function trackAccountReset(): void {
  trackEvent({
    eventName: "account_reset",
    domain: "credit-card",
    entity: "account",
    action: "reset",
  });
}

