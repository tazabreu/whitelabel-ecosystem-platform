import { nanoid } from "nanoid";

const JOURNEY_ID_KEY = "ecosystem_journeyId";
const JOURNEY_ID_PREFIX = "jrn_";

/**
 * Get the current journey ID from session storage, or generate a new one.
 * The journey ID persists for the duration of the browser session.
 */
export function getJourneyId(): string {
  if (typeof window === "undefined") {
    // Server-side: generate a new ID (will be replaced on hydration)
    return generateJourneyId();
  }

  let journeyId = sessionStorage.getItem(JOURNEY_ID_KEY);

  if (!journeyId) {
    journeyId = generateJourneyId();
    sessionStorage.setItem(JOURNEY_ID_KEY, journeyId);
  }

  return journeyId;
}

/**
 * Generate a new journey ID with the standard prefix.
 */
export function generateJourneyId(): string {
  return `${JOURNEY_ID_PREFIX}${nanoid(21)}`;
}

/**
 * Reset the journey ID (e.g., on logout).
 * A new journey will be created on the next getJourneyId() call.
 */
export function resetJourneyId(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(JOURNEY_ID_KEY);
  }
}

/**
 * Check if a string is a valid journey ID format.
 */
export function isValidJourneyId(id: string): boolean {
  return id.startsWith(JOURNEY_ID_PREFIX) && id.length >= 24;
}

