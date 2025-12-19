const SESSION_KEY = "ecosystem_session";

export interface Session {
  token: string;
  userEcosystemId: string;
  username: string;
  role: string;
}

/**
 * Get the current session from storage.
 */
export function getSession(): Session | null {
  if (typeof window === "undefined") {
    return null;
  }

  const sessionData = sessionStorage.getItem(SESSION_KEY);
  if (!sessionData) {
    return null;
  }

  try {
    return JSON.parse(sessionData) as Session;
  } catch {
    return null;
  }
}

/**
 * Save a session to storage.
 */
export function setSession(session: Session): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  sessionStorage.setItem("userEcosystemId", session.userEcosystemId);
}

/**
 * Clear the current session.
 */
export function clearSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem("userEcosystemId");
}

/**
 * Check if the user is authenticated.
 */
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

