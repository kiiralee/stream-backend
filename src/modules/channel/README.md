# Channel Module

## Overview

Публичное представление канала (стримера): поиск по `username`, рекомендации, связь с `User` + `Stream`.

## Responsibilities

- `findChannelByUsername` — public channel page data
- `findRecommendedChannels` — discovery feed

## Architecture

Channel ≡ `User` with associated `Stream` and profile fields. No separate Prisma `Channel` model.

## Directory Structure

```
channel/
├── channel.module.ts
├── channel.service.ts
└── channel.resolver.ts
```

## Environment Variables

None module-specific.

## Local Development

```graphql
query { findChannelByUsername(username: "demo") { displayName stream { isLive } } }
```

## API Overview

| Query | Auth | Description |
|-------|------|-------------|
| `findChannelByUsername` | No | Channel by username |
| `findRecommendedChannels` | No | Suggested channels |

## Integrations

- Prisma `User`, `Stream`, `Follow`

## Dependencies

`PrismaService`

## Observability

Standard Nest logging only.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| User not found | Check username uniqueness |
| No stream on channel | User may lack `Stream` row (seed creates them) |

## Known Issues

Verified badge (`isVerified`) set by cron when followers > 10 — not in this module.

## Scaling Notes

Discovery queries may need DB indexes on `username`, follower counts for recommendations.

## Related

- [../auth/README.md](../auth/README.md)
- [../follow/README.md](../follow/README.md)
- [../cron/README.md](../cron/README.md)
