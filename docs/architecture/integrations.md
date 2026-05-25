# External Integrations

## LiveKit

- **Purpose:** RTMP/WHIP ingress, stream lifecycle webhooks
- **Config:** `LIVEKIT_API_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
- **Code:** `src/modules/libs/livekit/`, `src/modules/stream/ingress/`
- **Webhook:** `POST /webhook/livekit` — `ingress_started` / `ingress_ended` → updates `Stream.isLive`, notifies followers

## Stripe

- **Purpose:** Sponsorship plans, Checkout, subscription webhooks
- **Config:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Code:** `src/modules/libs/stripe/`, `src/modules/sponsorship/`
- **Webhook:** `POST /webhook/stripe` (raw body + signature)

## SMTP (Mail)

- **Purpose:** Verification, password reset, 2FA reminders, channel verified, account deletion
- **Config:** `MAIL_HOST`, `MAIL_PORT`, `MAIL_LOGIN`, `MAIL_PASSWORD`
- **Templates:** `src/modules/libs/mail/templates/*.tsx` (React Email)

## Telegram

- **Purpose:** Notifications, account linking via `TELEGRAM_AUTH` token
- **Config:** `TELEGRAM_BOT_TOKEN`
- **Code:** `src/modules/libs/telegram/`

## PostgreSQL & Redis

- **Postgres:** primary persistence (Prisma)
- **Redis:** session store (`connect-redis`), prefix `SESSION_FOLDER`

## Frontend Origin

- `ALLOWED_ORIGIN` — CORS + Stripe redirect URLs + email deep links

## Integration Matrix

| Integration | Protocol | Auth | Failure mode |
|-------------|----------|------|--------------|
| LiveKit | HTTPS + webhook JWT | API key/secret | Ingress creation throws `BadRequestException` |
| Stripe | HTTPS API + webhook HMAC | Secret key | Webhook rejects invalid signature |
| SMTP | SMTP | User/pass | Cron logs mail errors, continues |
| Telegram | Bot API | Bot token | Cron logs per-user errors |

See [sequences.md](sequences.md) for end-to-end flows.
