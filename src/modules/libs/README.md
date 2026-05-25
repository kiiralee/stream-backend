# Integration Libraries (`libs`)

## Overview

Адаптеры внешних сервисов, переиспользуемые feature-модулями. Не бизнес-домен — инфраструктурные границы.

## Responsibilities

| Package | Wrapper | Purpose |
|---------|---------|---------|
| `mail/` | `MailService` | SMTP + React Email templates |
| `stripe/` | `StripeService` | Stripe SDK, dynamic module |
| `livekit/` | `LivekitService` | Ingress API, webhook receiver |
| `telegram/` | `TelegramService` | Telegraf bot, notifications |

## Directory Structure

```
libs/
├── mail/
│   ├── mail.module.ts
│   ├── mail.service.ts
│   └── templates/*.tsx
├── stripe/
├── livekit/
└── telegram/
```

## Environment Variables

| Lib | Variables |
|-----|-----------|
| Mail | `MAIL_HOST`, `MAIL_PORT`, `MAIL_LOGIN`, `MAIL_PASSWORD` |
| Stripe | `STRIPE_SECRET_KEY` |
| LiveKit | `LIVEKIT_API_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` |
| Telegram | `TELEGRAM_BOT_TOKEN` |

Configs: [`src/core/config/`](../../core/config/)

## Registration

```typescript
// core.module.ts
LivekitModule.registerAsync({ useFactory: getLivekitConfig })
StripeModule.registerAsync({ useFactory: getStripeConfig })
MailModule // via getMailerConfig
TelegramModule // via getTelegrafConfig (telegrag.config.ts)
```

## Mail Templates

| Template | Trigger |
|----------|---------|
| `verification.template.tsx` | Email verify |
| `password-recovery.template.tsx` | Reset password |
| `enable-two-factor.template.tsx` | Cron 2FA reminder |
| `verify-channel.template.tsx` | Channel verified |

## API Overview

No GraphQL — injected services only.

## Troubleshooting

| Lib | Issue |
|-----|-------|
| Mail | SMTP auth / port |
| Stripe | Test vs live keys |
| LiveKit | API URL must match project |
| Telegram | Webhook vs polling — check Telegraf module config |

## Known Issues

- `telegrag.config.ts` filename typo
- LiveKit SDK pinned `1.2.7`

## Scaling Notes

External APIs scale independently; rate-limit Telegram sends in high-traffic cron.

## Related

- [docs/architecture/integrations.md](../../../docs/architecture/integrations.md)
- [../webhook/README.md](../webhook/README.md)
