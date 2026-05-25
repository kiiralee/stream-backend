# GraphQL API

## Endpoint

- **Path:** `GRAPHQL_PREFIX` (default `/graphql`)
- **Playground:** enabled only when `NODE_ENV=development`
- **Schema file:** [`src/core/graphql/shema.gql`](../../src/core/graphql/shema.gql) (auto-generated, do not edit manually)

## Authentication

Send session cookie from `loginUser` mutation. Playground: enable credentials (configured in `graphql.config.ts`).

## Operations Overview

### Queries (public unless noted)

| Operation | Auth | Description |
|-----------|------|-------------|
| `findProfile` | Yes | Current user |
| `findCurrentSession` | Yes | Active session metadata |
| `findSessionsByUser` | Yes | All sessions |
| `findChannelByUsername` | No | Public channel |
| `findAllStreams` | No | Stream discovery with filters |
| `findChatMessageByStream` | No | Chat history |
| `findAllCategories` | No | Categories |
| `findNotificationsByUser` | Yes | Notifications |
| `generateTotpSecret` | Yes | 2FA setup |

### Mutations (selection)

| Operation | Description |
|-----------|-------------|
| `createUser` | Registration |
| `loginUser` / `logoutUser` | Session |
| `createIngress` | LiveKit ingress setup |
| `changeStreamInfo` | Stream metadata |
| `sendChatMessage` | Post chat message |
| `followChannel` / `unfollowChannel` | Follow graph |
| `createSponsorshipPlan` | Creator monetization |
| `makePayment` | Stripe checkout URL |
| `changeNotificationsSettings` | Site + Telegram prefs |

### Subscriptions

| Operation | Args | Description |
|-----------|------|-------------|
| `chatMessageAdded` | `streamId` | Real-time chat |

## Filters

`FiltersInput`: `searchTerm`, `skip`, `take` — used in stream discovery queries.

## Errors

NestJS exceptions → GraphQL errors. Many messages in Russian.

## Client Generation

Recommend codegen from `shema.gql`:

```bash
# Assumption — not configured in repo
npx graphql-codegen --schema src/core/graphql/shema.gql
```

## Related

- [webhooks.md](webhooks.md)
- [../architecture/sequences.md](../architecture/sequences.md)
