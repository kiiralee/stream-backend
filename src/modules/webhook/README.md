# Webhook Module

## Overview

REST endpoints для асинхронных событий от **LiveKit** и **Stripe**. Единственный non-GraphQL HTTP API поверх Express.

## Responsibilities

- Validate webhook signatures
- Update `Stream.isLive` on ingress lifecycle
- Notify followers on stream start
- Process Stripe checkout/subscription events
- Update transactions and sponsorship subscriptions

## Architecture

```
POST /webhook/livekit  → WebhookService.receiveWebhookLivekit
POST /webhook/stripe   → WebhookService.receiveWebhookStripe (raw body)
```

Registered in `WebhookController`, module imported in `CoreModule` with `rawBody: true`.

## Directory Structure

```
webhook/
├── webhook.module.ts
├── webhook.controller.ts
└── webhook.service.ts
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `STRIPE_WEBHOOK_SECRET` | Stripe signature |
| `LIVEKIT_API_KEY` / `SECRET` | LiveKit receiver |
| Implicit | LiveKit webhook auth via SDK |

## Local Development

Use ngrok + Stripe CLI — see [docs/api/webhooks.md](../../../docs/api/webhooks.md).

## API Overview

| Method | Path | Body |
|--------|------|------|
| POST | `/webhook/livekit` | string + Authorization header |
| POST | `/webhook/stripe` | raw + stripe-signature |

## Integrations

- `LivekitService`, `StripeService`
- `NotificationService`, `TelegramService`
- `PrismaService`

## Dependencies

Listed above — webhook orchestrates side effects.

## Observability

- Unauthorized → 401 with RU messages
- No structured event logging / idempotency table

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Stripe 401 signature | Raw body middleware, correct `STRIPE_WEBHOOK_SECRET` |
| LiveKit 401 | Authorization header from LiveKit config |
| Followers not notified | `ingress_started` + follower `notificationSettings` |

## Known Issues

- Typo method name `constuctStripeEvent`
- Must not parse body as JSON before Stripe verify

## Scaling Notes

Webhooks should be fast — offload heavy work to queue *(not implemented)*.

## Related

- [docs/api/webhooks.md](../../../docs/api/webhooks.md)
- [../stream/README.md](../stream/README.md)
- [../sponsorship/README.md](../sponsorship/README.md)
