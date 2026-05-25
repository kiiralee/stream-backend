# REST Webhooks

Base path: `/webhook` (no GraphQL prefix).

Requires `rawBody: true` on Nest app (`main.ts` / `CoreModule`) for Stripe signature verification.

## LiveKit

```
POST /webhook/livekit
Header: Authorization: <livekit-signed-payload>
Body: raw event string
```

### Handled Events

| Event | Action |
|-------|--------|
| `ingress_started` | `Stream.isLive = true`, notify followers (site + Telegram) |
| `ingress_ended` | `Stream.isLive = false` |

Implementation: [`webhook.service.ts`](../../src/modules/webhook/webhook.service.ts)

## Stripe

```
POST /webhook/stripe
Header: stripe-signature
Body: raw body (Buffer/string)
```

Constructs event via `STRIPE_WEBHOOK_SECRET`, processes checkout/subscription events.

> Inspect `receiveWebhookStripe` for full event type list when extending.

## Security

- Missing `Authorization` / `stripe-signature` → `401 Unauthorized`
- Invalid Stripe signature → rejected in `constuctStripeEvent`

## Local Testing

Use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/webhook/stripe
```

## Related

- [../architecture/integrations.md](../architecture/integrations.md)
- [../../src/modules/webhook/README.md](../../src/modules/webhook/README.md)
