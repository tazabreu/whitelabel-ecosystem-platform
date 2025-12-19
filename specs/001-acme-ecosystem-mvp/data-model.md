# Data Model: ACME Ecosystem MVP

**Feature**: `001-acme-ecosystem-mvp`  
**Date**: 2025-12-19

This document defines the conceptual data model for the MVP (implementation-agnostic).

## Global identifiers

- **userEcosystemId**: stable identifier used across all domains and future products.
- **journeyId**: identifier created at frontend entry and propagated end-to-end across services/events.

## User Domain

### User

- **userEcosystemId** (string, stable)
- **username** (string)
- **role** (enum: `user`, `admin`)
- **status** (enum: `active`, `disabled`)

**Rules**:
- Demo auth uses `user:user` and `admin:admin` credentials.
- Future: Supabase identity provider replaces demo auth.

## Credit Card Domain

### CreditCardAccount

- **userEcosystemId** (string)
- **status** (enum: `preapproved`, `onboarded`)
- **preapprovedLimit** (number, currency minor units recommended)
- **currentLimit** (number)
- **availableLimit** (number)
- **createdAt** (timestamp)
- **updatedAt** (timestamp)

### DigitalSignature

- **userEcosystemId** (string)
- **signedAt** (timestamp)
- **signatureText** (string) — MVP expects “I agree” (exact requirement defined in contracts)

### Purchase

- **purchaseId** (string)
- **userEcosystemId** (string)
- **amount** (number)
- **approved** (boolean)
- **reason** (string, optional) — when rejected (e.g., “INSUFFICIENT_LIMIT”)
- **createdAt** (timestamp)

### State transitions

- `preapproved` → `onboarded` when digital signature is accepted.
- Purchases decrement `availableLimit` only when approved.
- `raiseLimit` increases `currentLimit` and `availableLimit` by a defined policy.
- `reset` returns to a baseline state (keeps onboarding status unless explicitly reset).

## Analytics Domain (TypeScript service)

### AnalyticsEvent

- **eventId** (string)
- **eventName** (string; aligns to `com.ecosystem.{domain}.{entity}.{action}`)
- **occurredAt** (timestamp)
- **journeyId** (string)
- **userEcosystemId** (string)
- **channel** (enum: `web` | future: `mobile`, `backoffice`, etc.)
- **actorRole** (optional enum: `user`, `admin`)
- **metadata** (map/object; JSON)

Examples of events:
- `com.ecosystem.user.session.logged_in`
- `com.ecosystem.shell.navigation.clicked`
- `com.ecosystem.credit-card.offer.viewed`
- `com.ecosystem.credit-card.onboarding.signed`
- `com.ecosystem.credit-card.purchase.simulated`

### Journey (derived)

- **journeyId**
- **userEcosystemId**
- **startedAt**
- **endedAt** (optional)
- **events** (list/derived via query)

## Data Lakehouse / Mesh (Customer 360)

Customer 360 is a curated, query-friendly view that consolidates user + product engagement.

### Customer360 (curated view)

- **userEcosystemId**
- **firstSeenAt**
- **lastSeenAt**
- **products** (list; e.g., includes `credit-card`)
- **creditCardStatus** (enum: `none`, `preapproved`, `onboarded`)
- **creditCardCurrentLimit** (number, optional)
- **creditCardAvailableLimit** (number, optional)
- **engagementScore** (number, optional; computed later)
- **lastNavigationAt** (timestamp, optional)
- **lastTransactionAt** (timestamp, optional)

**Notes**:
- MVP can populate a minimal subset: `userEcosystemId`, `lastSeenAt`, `creditCardStatus`, and basic counters.
- Future: add risk/score, tickets, next-best-offer, contact freshness, loyalty, and AI outcomes.


