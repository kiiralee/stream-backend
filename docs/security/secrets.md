# Secrets Management

## Required Secrets

| Variable | Sensitivity |
|----------|-------------|
| `SESSION_SECRET` | Critical |
| `COOKIE_SECRET` | Critical |
| `DATABASE_URL` / `POSTGRES_URI` | Critical |
| `REDIS_URI` / `REDIS_PASSWORD` | Critical |
| `STRIPE_SECRET_KEY` | Critical |
| `STRIPE_WEBHOOK_SECRET` | Critical |
| `LIVEKIT_API_SECRET` | Critical |
| `TELEGRAM_BOT_TOKEN` | High |
| `MAIL_PASSWORD` | High |

## Storage

- **Local:** `.env` (gitignored)
- **Production:** platform secrets manager *(assumption)* — never commit `.env`

Template: [`.env.example`](../../.env.example)

## Rotation

| Secret | Rotation impact |
|--------|-----------------|
| `SESSION_SECRET` | Invalidates all sessions |
| `STRIPE_WEBHOOK_SECRET` | Update Stripe dashboard + redeploy |
| `LIVEKIT_API_SECRET` | Regenerate in LiveKit console |

## Webhook Verification

- **Stripe:** `stripe-signature` header + `STRIPE_WEBHOOK_SECRET`
- **LiveKit:** `Authorization` header validated by SDK receiver

## Gaps

- No `.env.example` was in repo before documentation pass — now added
- `UserModel.password` exposed in GraphQL schema — **security risk** for clients
