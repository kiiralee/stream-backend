# Notification Module

## Overview

In-app уведомления (`Notification` model) и настройки доставки (`NotificationSettings`: site + Telegram).

## Responsibilities

- CRUD notifications for user
- Unread count
- `changeNotificationsSettings` — toggles + optional `telegramAuthToken`
- Factory methods: stream start, new follower, sponsorship, 2FA, verified channel

## Directory Structure

```
notification/
├── notification.module.ts
├── notification.service.ts
├── notification.resolver.ts
├── models/
└── inputs/
```

## API Overview

| Operation | Auth |
|-----------|------|
| `findNotificationsByUser` | Yes |
| `findNotificationsUnreadCount` | Yes |
| `changeNotificationsSettings` | Yes |

## Integrations

- **Telegram** — linking via `TELEGRAM_AUTH` token
- **Mail** — not sent from this module directly
- **Webhook/Cron/Follow** — create notifications

## Notification Types

`STREAM_START`, `NEW_FOLLOWER`, `NEW_SPONSORSHIP`, `ENABLE_TWO_FACTOR`, `VERIFIED_CHANNEL`

## Dependencies

`PrismaService`, `generateToken` util for Telegram auth

## Observability

Cron deletes notifications older than 7 days.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Telegram not working | User needs `telegramId` + bot token |
| Unread count wrong | Check `isRead` updates |

## Known Issues

- Site vs Telegram toggles independent — user may get duplicate channels

## Scaling Notes

Paginate `findNotificationsByUser` for large inboxes *(not implemented)*.

## Related

- [../libs/README.md](../libs/README.md)
- [../cron/README.md](../cron/README.md)
