# Sponsorship Domain

## Overview

Монетизация каналов: тарифные планы (Stripe Products), подписки спонсоров, транзакции и Checkout.

## Responsibilities

| Submodule | Role |
|-----------|------|
| `plan/` | Creator defines plans (`createSponsorshipPlan`, remove) |
| `subscription/` | Active sponsors per channel |
| `transaction/` | `makePayment` → Stripe Checkout URL, history |

## Architecture

```
Creator → SponsorshipPlan (stripeProductId, stripePlanId)
Viewer → makePayment → Stripe Checkout
Stripe webhook → Transaction + SponsorshipSubscription
```

Prisma table typo: `sposorship_plans`.

## Directory Structure

```
sponsorship/
├── plan/
├── subscription/
└── transaction/
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | API |
| `STRIPE_WEBHOOK_SECRET` | Payment confirmation |
| `ALLOWED_ORIGIN` | Checkout success/cancel URLs |

## API Overview

| Operation | Auth |
|-----------|------|
| `createSponsorshipPlan` | Yes (channel owner) |
| `findMySponsorshipPlans` | Yes |
| `makePayment` | Yes |
| `findMyTransactions` | Yes |
| `findSponsorsByChannel` | No |
| `findMySponsors` | Yes |

## Integrations

- **Stripe** — products, checkout, webhooks
- **Notification** — `NEW_SPONSORSHIP`
- **Chat** — premium follower checks

## Sequence

See [docs/architecture/sequences.md](../../../docs/architecture/sequences.md#sponsorship-payment).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Payment stuck PENDING | Webhook not received / wrong secret |
| Plan not created | Stripe API keys, channel ownership |

## Known Issues

- Webhook idempotency not documented in code
- Float `price` in DB — prefer Stripe integer cents long-term

## Scaling Notes

Stripe handles payment scale; store minimal state in Postgres.

## Related

- [../webhook/README.md](../webhook/README.md)
- [../libs/README.md](../libs/README.md)
