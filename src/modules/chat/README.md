# Chat Module

## Overview

Текстовый чат привязанный к `Stream`: история сообщений, отправка, real-time подписка, настройки доступа (followers-only, premium).

## Responsibilities

- Persist `ChatMessage` records
- Enforce chat settings (`isChatEnabled`, followers-only flags)
- Publish `chatMessageAdded` subscription
- `changeChatSettings` mutation (stream owner)

## Architecture

- In-memory `PubSub` from `graphql-subscriptions` per resolver instance
- Filter subscription by `streamId`
- Auth: `sendChatMessage` requires `@Authorization()`

## Directory Structure

```
chat/
├── chat.module.ts
├── chat.service.ts
├── chat.resolver.ts
├── model/chat-message.model.ts
└── input/
```

## Environment Variables

None specific — uses shared DB/session config.

## Local Development

```graphql
subscription { chatMessageAdded(streamId: "...") { text user { username } } }
mutation { sendChatMessage(data: { streamId: "...", text: "hi" }) { id } }
```

## Build & Run

`yarn start:dev`

## API Overview

| Operation | Type | Auth |
|-----------|------|------|
| `findChatMessageByStream` | Query | No |
| `sendChatMessage` | Mutation | Yes |
| `changeChatSettings` | Mutation | Yes (owner) |
| `chatMessageAdded` | Subscription | No* |

*Subscription auth not enforced in resolver — **potential gap**.

## Integrations

- **Prisma** — `ChatMessage`, `Stream`, `Follow`, sponsorship for premium checks
- **GraphQL Subscriptions** — in-memory PubSub

## Dependencies

`ChatService` → `PrismaService`, follow/sponsorship logic in service

## Sequence

See [docs/architecture/sequences.md](../../../docs/architecture/sequences.md#chat-message-realtime).

## Observability

No dedicated logging for chat events.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Subscription silent | Same server instance? PubSub not shared across instances |
| Cannot send message | Chat disabled or follower/premium rules |

## Known Issues

- **Multi-instance:** PubSub not backed by Redis
- Subscription lacks auth guard

## Scaling Notes

Migrate to `graphql-redis-subscriptions` or similar for horizontal scale.

## Related

- [../stream/README.md](../stream/README.md)
- [../follow/README.md](../follow/README.md)
- [../sponsorship/README.md](../sponsorship/README.md)
