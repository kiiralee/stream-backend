# Stream Domain

## Overview

Управление live-стримами пользователя: метаданные, категория, thumbnail, статус `isLive`, интеграция с LiveKit Ingress, JWT для зрителей.

## Responsibilities

| Component | Role |
|-----------|------|
| `stream/` | Stream CRUD, discovery, tokens, chat settings on stream |
| `ingress/` | Create/reset LiveKit ingress (RTMP/WHIP) |

## Architecture

- 1:1 `User` ↔ `Stream` in Prisma
- LiveKit ingress stored: `ingressId`, `serverUrl`, `streamKey`
- `isLive` toggled by **webhooks**, not GraphQL directly

## Directory Structure

```
stream/
├── stream.module.ts
├── stream.service.ts
├── stream.resolver.ts
├── models/
├── inputs/
└── ingress/
    ├── ingress.service.ts
    └── ingress.resolver.ts
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `LIVEKIT_API_URL` | LiveKit server |
| `LIVEKIT_API_KEY` | API auth |
| `LIVEKIT_API_SECRET` | Token signing & webhooks |

## Local Development

1. Configure LiveKit cloud/self-hosted
2. `createIngress(ingressType)` as authenticated streamer
3. Use returned `serverUrl` + `streamKey` in OBS
4. Webhook updates `isLive` (needs public URL — ngrok)

## Build & Run

Monolith module — `yarn start:dev`.

## API Overview

| Operation | Auth | Description |
|-----------|------|-------------|
| `createIngress` | Yes | Create LiveKit ingress |
| `changeStreamInfo` | Yes | Title, category |
| `changeChatSettings` | Yes | Chat flags on stream |
| `generateStreamToken` | Yes | Viewer JWT |
| `findAllStreams` | No | Discovery |
| `findRandomStreams` | No | Homepage |

## Integrations

- **LiveKit** — `libs/livekit`, ingress SDK
- **Webhook** — `ingress_started` / `ingress_ended`
- **Category** — `categoryId` relation

## Dependencies

`LivekitService`, `PrismaService`, `ConfigService`

## Sequence (Go Live)

See [docs/architecture/sequences.md](../../../docs/architecture/sequences.md#go-live-livekit).

## Observability

- Ingress failures → `BadRequestException`
- No stream-specific metrics

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Ingress null url/key | LiveKit credentials / quota |
| isLive stuck true | Webhook not reaching `/webhook/livekit` |
| WHIP vs RTMP | `ingressType` enum from LiveKit SDK |

## Known Issues

- Ingress reset deletes previous ingresses on each `create`

## Scaling Notes

LiveKit handles media scale; API only manages metadata and webhooks.

## Related

- [../webhook/README.md](../webhook/README.md)
- [../chat/README.md](../chat/README.md)
- [../libs/README.md](../libs/README.md)
