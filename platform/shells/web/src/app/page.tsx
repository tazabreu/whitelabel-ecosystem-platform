"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession, type Session } from "@/lib/session";
import { cn } from "@/lib/cn";
import { PreapprovedOfferWidget } from "@/components/credit-card/PreapprovedOfferWidget";
import { CreditCardView } from "@/components/credit-card/CreditCardView";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSessionState] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cardStatus, setCardStatus] = useState<"loading" | "pre_approved" | "onboarded">("loading");

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.push("/login");
      return;
    }
    setSessionState(currentSession);
    setIsLoading(false);
    // Default to pre_approved, widget will update based on API response
    setCardStatus("pre_approved");
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const handleOnboardingComplete = () => {
    setCardStatus("onboarded");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-foreground">
                ACME Ecosystem
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session?.username}
                {session?.role === "ADMIN" && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                    Admin
                  </span>
                )}
              </span>
              <button
                onClick={handleLogout}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg",
                  "text-muted-foreground hover:text-foreground",
                  "hover:bg-accent transition-colors"
                )}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome to your ACME Ecosystem dashboard
          </p>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Credit Card Widget */}
          {cardStatus === "pre_approved" && (
            <PreapprovedOfferWidget onOnboardingComplete={handleOnboardingComplete} />
          )}
          {cardStatus === "onboarded" && <CreditCardView />}
        </div>

        {/* Debug Info (dev only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
            <h3 className="text-sm font-medium text-foreground mb-2">
              Session Info (dev only)
            </h3>
            <pre className="text-xs text-muted-foreground overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

