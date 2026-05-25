# Follow Module

## Overview

Социальный граф: подписка на канал (follower → following), счётчики, списки подписок текущего пользователя.

## Responsibilities

- `followChannel` / `unfollowChannel`
- `findMyFollowers`, `findMyFollowings`
- `findFollowersCountByChannel`
- Trigger downstream notifications (via other services on follow — check callers)

## Directory Structure

```
follow/
├── follow.module.ts
├── follow.service.ts
├── follow.resolver.ts
└── models/follow.model.ts
```

## API Overview

| Operation | Auth |
|-----------|------|
| `followChannel` | Yes |
| `unfollowChannel` | Yes |
| `findMyFollowers` | Yes |
| `findMyFollowings` | Yes |
| `findFollowersCountByChannel` | No |

## Integrations

- Prisma `Follow` with unique `[followerId, followingId]`
- **Notification** — `NEW_FOLLOWER` (when implemented in service)
- **Webhook** — stream start notifies followers
- **Cron** — `verifyChannel` when followers > 10

## Dependencies

`PrismaService`, possibly `NotificationService`

## Known Issues

Follow notification creation — verify in `follow.service.ts` when extending.

## Scaling Notes

Indexes exist on `followerId`, `followingId` — good for lookups.

## Related

- [../channel/README.md](../channel/README.md)
- [../notification/README.md](../notification/README.md)
