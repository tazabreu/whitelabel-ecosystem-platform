"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView, trackNavigation } from "@/lib/analytics";
import { getJourneyId } from "@/lib/journey";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Analytics tracking provider that tracks route changes.
 */
function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    // Ensure journey ID is initialized
    getJourneyId();
  }, []);

  useEffect(() => {
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    
    // Track navigation if path changed
    if (previousPath.current && previousPath.current !== currentPath) {
      trackNavigation(previousPath.current, currentPath);
    }

    // Track page view
    trackPageView(currentPath);

    // Update previous path
    previousPath.current = currentPath;
  }, [pathname, searchParams]);

  return <>{children}</>;
}

/**
 * Root providers wrapper for the application.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <AnalyticsProvider>
      {children}
    </AnalyticsProvider>
  );
}

