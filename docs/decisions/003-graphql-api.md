# ADR-003: GraphQL as Primary API

## Status

Accepted

## Context

Frontend needs flexible queries for channels, streams, chat, notifications.

## Decision

`@nestjs/graphql` + Apollo Driver, code-first decorators, schema export to `shema.gql`.

Subscriptions for chat via `graphql-subscriptions` in-memory PubSub.

## Consequences

**Positive:** Single endpoint, typed schema, subscriptions.

**Negative:**

- Webhooks remain REST (dual protocol)
- In-memory PubSub limits multi-instance chat
- `UserModel.password` in schema — client exposure risk

## Exceptions

REST only for `/webhook/*` (LiveKit, Stripe raw body).
