# Cron Module

## Overview

Фоновые задачи на `@nestjs/schedule`: очистка данных, напоминания 2FA, автоматическая верификация каналов, удаление старых уведомлений.

## Responsibilities

| Job | Schedule | Action |
|-----|----------|--------|
| `deleteDeactivateAccounts` | Daily 1AM | Hard-delete users deactivated > 7 days |
| `notifyUsersEnableTwoFactor` | Every 4 days | Email/Telegram/site reminder if no 2FA |
| `verifyChannel` | Daily 1AM | `isVerified=true` if followers > 10 |
| `deleteOldNotifications` | Daily 1AM | Delete notifications > 7 days |

## Architecture

`CronService` injects Prisma, Mail, Telegram, Notification.

> **Warning:** With multiple app instances, each runs cron — risk duplicate notifications/deletes.

## Directory Structure

```
cron/
├── cron.module.ts
└── cron.service.ts
```

## Environment Variables

Uses `MAIL_*`, `TELEGRAM_BOT_TOKEN` indirectly via services.

## Local Development

Cron runs automatically with `yarn start:dev`. For testing, temporarily uncomment `@Cron('*/10 * * * * *')` on a job *(dev only)*.

## Build & Run

No separate deploy — part of monolith.

## API Overview

None — internal scheduler only.

## Integrations

- Mail templates: account deletion, enable 2FA, verify channel
- Telegram parallel messages
- In-app notifications via `NotificationService`

## Observability

- `Logger` for mail/telegram failures in 2FA job
- `console.log` in `deleteDeactivateAccounts` — prefer structured logging

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Duplicate emails | Multiple instances running cron |
| Verified not applied | Job runs 1AM only; follower count query |

## Known Issues

- `verifyChannel` iterates **all users** daily — O(n) scalability concern
- No distributed lock for cron

## Scaling Notes

Extract to dedicated worker (BullMQ, separate CronJob K8s) with single leader.

## Related

- [../auth/README.md](../auth/README.md)
- [../notification/README.md](../notification/README.md)
- [docs/deployment/production.md](../../../docs/deployment/production.md)
