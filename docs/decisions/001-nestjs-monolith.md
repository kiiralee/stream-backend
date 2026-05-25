# ADR-001: NestJS Modular Monolith

## Status

Accepted (inferred from codebase)

## Context

Teastream backend needs auth, streaming, chat, payments, notifications in one deployable unit.

## Decision

Single NestJS application with feature modules under `src/modules/`, not separate microservices.

## Consequences

**Positive:**

- Simple local dev and deploy
- Shared Prisma client and transactions
- Single GraphQL endpoint for frontend

**Negative:**

- Scaling chat subscriptions requires extra work (PubSub)
- Cron duplication risk with multiple instances
- Large codebase coupling over time

## Alternatives Considered

*(Not documented in repo — assumption)* Microservices split by stream/chat/billing rejected for MVP complexity.
