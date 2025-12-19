"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";
import { trackOfferViewed, trackOnboardingSigned } from "@/lib/analytics";

interface CreditCardOffer {
  offerId: string;
  preApprovedLimit: number;
  status: "PRE_APPROVED" | "ONBOARDED" | "ACTIVE";
}

interface PreapprovedOfferWidgetProps {
  onOnboardingComplete?: () => void;
}

export function PreapprovedOfferWidget({
  onOnboardingComplete,
}: PreapprovedOfferWidgetProps) {
  const [offer, setOffer] = useState<CreditCardOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [signatureText, setSignatureText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOffer();
  }, []);

  const fetchOffer = async () => {
    try {
      const response = await api.get<CreditCardOffer>("/api/credit-card/offer");
      setOffer(response);
      
      // Track offer viewed
      if (response.status === "PRE_APPROVED") {
        trackOfferViewed(response.offerId, response.preApprovedLimit);
      }
    } catch (err) {
      setError("Unable to load offer");
      console.error("Failed to fetch offer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignature = async () => {
    if (signatureText.toLowerCase() !== "i agree") {
      setError('Please type "I agree" to confirm');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post("/api/credit-card/onboarding/sign", {
        signature: signatureText,
      });

      // Track onboarding
      trackOnboardingSigned(offer?.offerId || "");

      // Refresh offer to get updated status
      await fetchOffer();
      setIsOnboarding(false);
      onOnboardingComplete?.();
    } catch (err) {
      setError("Failed to complete onboarding. Please try again.");
      console.error("Onboarding error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  if (!offer) {
    return null;
  }

  // Show onboarded state
  if (offer.status !== "PRE_APPROVED") {
    return null; // CreditCardView component will handle onboarded state
  }

  // Onboarding flow
  if (isOnboarding) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Complete Your Card Onboarding
          </h3>
          <p className="mt-2 text-muted-foreground">
            Your pre-approved limit:{" "}
            <span className="font-bold text-foreground">
              ${offer.preApprovedLimit.toLocaleString()}
            </span>
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">Terms & Conditions</p>
          <p>
            By typing "I agree" below, you confirm that you have read and accept
            our credit card terms and conditions.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="signature"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Digital Signature
            </label>
            <input
              id="signature"
              type="text"
              value={signatureText}
              onChange={(e) => setSignatureText(e.target.value)}
              placeholder='Type "I agree" to confirm'
              className={cn(
                "w-full rounded-lg border border-input bg-background px-4 py-3",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setIsOnboarding(false)}
              className={cn(
                "flex-1 px-4 py-3 rounded-lg font-medium",
                "border border-border text-foreground",
                "hover:bg-accent transition-colors"
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleSignature}
              disabled={isSubmitting}
              className={cn(
                "flex-1 px-4 py-3 rounded-lg font-medium",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isSubmitting ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pre-approved offer card (Airbnb-style)
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        "hover:shadow-lg transition-all duration-300"
      )}
    >
      {/* Header gradient */}
      <div className="h-2 bg-gradient-to-r from-primary/60 to-primary/20"></div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Pre-approved
            </span>
            <h3 className="mt-2 text-xl font-semibold text-foreground">
              Credit Card
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
        </div>

        <p className="text-muted-foreground mb-4">
          You have a pre-approved credit card waiting for you!
        </p>

        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground">Your limit</p>
          <p className="text-3xl font-bold text-foreground">
            ${offer.preApprovedLimit.toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => setIsOnboarding(true)}
          className={cn(
            "w-full px-4 py-3 rounded-lg font-medium",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors"
          )}
        >
          Activate Now
        </button>
      </div>
    </div>
  );
}

