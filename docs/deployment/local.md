# Local Deployment

См. также [../onboarding/developer-setup.md](../onboarding/developer-setup.md).

## Stack

```bash
docker compose up -d   # PostgreSQL :5433, Redis :6379
yarn start:dev         # NestJS hot reload
```

## Ports (default assumptions)

| Service | Port |
|---------|------|
| API | `APPLICATION_PORT` (3000) |
| GraphQL | same host + `GRAPHQL_PREFIX` |
| PostgreSQL | 5433 (host) → 5432 (container) |
| Redis | 6379 |

## Build (production-like local)

```bash
yarn build
yarn start:prod
# Runs: node dist/src/main.js
```

Ensure `bootstrap-paths.ts` is compiled — registered from `main.ts` import.

## Webhooks locally

LiveKit/Stripe webhooks require public URL. Use ngrok/cloudflared:

```bash
# Example
ngrok http 3000
# Point LiveKit webhook to https://<id>.ngrok.io/webhook/livekit
# Point Stripe webhook to https://<id>.ngrok.io/webhook/stripe
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Prisma connection error | Check `DATABASE_URL`, Docker postgres up |
| Redis connection refused | Check `REDIS_URI`, password in docker-compose |
| Session not persisted | Cookie `secure` must be `false` on HTTP localhost |
| GraphQL 404 | Verify `GRAPHQL_PREFIX` path |

See module READMEs for domain-specific issues.
