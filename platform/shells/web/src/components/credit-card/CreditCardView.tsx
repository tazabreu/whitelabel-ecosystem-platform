"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";
import {
  trackPurchaseSimulated,
  trackLimitRaised,
  trackAccountReset,
} from "@/lib/analytics";

interface CreditCardAccount {
  accountId: string;
  status: string;
  creditLimit: number;
  availableLimit: number;
}

interface PurchaseResult {
  status: "approved" | "declined";
  amount: number;
  message: string;
  remainingLimit: number;
}

export function CreditCardView() {
  const [account, setAccount] = useState<CreditCardAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [lastPurchase, setLastPurchase] = useState<PurchaseResult | null>(null);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      const response = await api.get<CreditCardAccount>("/api/credit-card/account");
      setAccount(response);
    } catch (err) {
      console.error("Failed to fetch account:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatePurchase = async () => {
    setActionLoading("purchase");
    setLastPurchase(null);

    try {
      const result = await api.post<PurchaseResult>(
        "/api/credit-card/actions/simulate-purchase"
      );
      setLastPurchase(result);
      trackPurchaseSimulated(result.amount, result.status);

      // Update account with new limit
      if (account) {
        setAccount({
          ...account,
          availableLimit: result.remainingLimit,
        });
      }
    } catch (err) {
      console.error("Purchase simulation failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRaiseLimit = async () => {
    setActionLoading("raise");

    try {
      const result = await api.post<{ newLimit: number; message: string }>(
        "/api/credit-card/actions/raise-limit"
      );

      if (account) {
        trackLimitRaised(account.creditLimit, result.newLimit);
        setAccount({
          ...account,
          creditLimit: result.newLimit,
          availableLimit: account.availableLimit + (result.newLimit - account.creditLimit),
        });
      }
    } catch (err) {
      console.error("Raise limit failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReset = async () => {
    setActionLoading("reset");
    setLastPurchase(null);

    try {
      await api.post("/api/credit-card/actions/reset");
      trackAccountReset();
      await fetchAccount();
    } catch (err) {
      console.error("Reset failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
        <div className="h-40 bg-muted rounded-lg mb-4"></div>
        <div className="h-10 bg-muted rounded w-full"></div>
      </div>
    );
  }

  if (!account) {
    return null;
  }

  const usedAmount = account.creditLimit - account.availableLimit;
  const usedPercentage = (usedAmount / account.creditLimit) * 100;
  const isLimitExceeded = account.availableLimit <= 0;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Card Visual */}
      <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
        {/* Card chip */}
        <div className="absolute top-6 left-6">
          <div className="w-10 h-8 bg-yellow-400/80 rounded-md flex items-center justify-center">
            <div className="w-6 h-4 border border-yellow-600/50 rounded-sm"></div>
          </div>
        </div>

        {/* Card number placeholder */}
        <div className="absolute bottom-12 left-6 font-mono text-lg tracking-wider">
          •••• •••• •••• 4242
        </div>

        {/* Card name */}
        <div className="absolute bottom-6 left-6 text-sm text-white/70">
          ACME ECOSYSTEM
        </div>

        {/* Contactless icon */}
        <div className="absolute top-6 right-6">
          <svg
            className="w-8 h-8 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 18.5a6.5 6.5 0 100-13M12 14.5a2.5 2.5 0 100-5"
            />
          </svg>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-6 space-y-6">
        {/* Limit Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Available</span>
            <span className="font-medium text-foreground">
              ${account.availableLimit.toLocaleString()} / ${account.creditLimit.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                isLimitExceeded
                  ? "bg-destructive"
                  : usedPercentage > 80
                  ? "bg-yellow-500"
                  : "bg-green-500"
              )}
              style={{ width: `${Math.min(usedPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Last Purchase Result */}
        {lastPurchase && (
          <div
            className={cn(
              "p-4 rounded-lg text-sm",
              lastPurchase.status === "approved"
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            )}
          >
            <p className="font-medium">
              {lastPurchase.status === "approved" ? "✓ Purchase Approved" : "✗ Purchase Declined"}
            </p>
            <p className="mt-1">
              Amount: ${lastPurchase.amount.toFixed(2)} - {lastPurchase.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleSimulatePurchase}
            disabled={actionLoading !== null}
            className={cn(
              "px-3 py-2.5 rounded-lg text-sm font-medium",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {actionLoading === "purchase" ? "..." : "Purchase"}
          </button>

          <button
            onClick={handleRaiseLimit}
            disabled={actionLoading !== null}
            className={cn(
              "px-3 py-2.5 rounded-lg text-sm font-medium",
              "border border-border text-foreground",
              "hover:bg-accent transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {actionLoading === "raise" ? "..." : "Raise Limit"}
          </button>

          <button
            onClick={handleReset}
            disabled={actionLoading !== null}
            className={cn(
              "px-3 py-2.5 rounded-lg text-sm font-medium",
              "border border-border text-muted-foreground",
              "hover:bg-accent hover:text-foreground transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {actionLoading === "reset" ? "..." : "Reset"}
          </button>
        </div>
      </div>
    </div>
  );
}

