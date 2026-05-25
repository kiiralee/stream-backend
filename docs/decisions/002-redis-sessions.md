# ADR-002: Redis Session Store

## Status

Accepted

## Context

GraphQL API needs stateful auth with logout/session list across server restarts.

## Decision

`express-session` + `connect-redis` with configurable `SESSION_FOLDER` key prefix.

## Implementation

- [`src/main.ts`](../../src/main.ts) — session middleware
- [`src/core/redis/redis.service.ts`](../../src/core/redis/redis.service.ts) — Redis client
- [`src/modules/auth/session/session.service.ts`](../../src/modules/auth/session/session.service.ts) — list/revoke sessions

## Consequences

**Positive:** Horizontal scaling possible if all instances share Redis.

**Negative:** Redis outage = auth broken; requires Redis HA in production.

## Alternatives

JWT stateless tokens — not chosen; session revocation and device list are first-class.
