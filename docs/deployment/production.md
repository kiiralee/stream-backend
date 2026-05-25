# Production Deployment

> **Assumption:** в репозитории нет Dockerfile, Kubernetes manifests или CI/CD pipeline. Документ описывает ожидаемый production flow на основе кода и `package.json`.

## Build Artifact

```bash
yarn install --frozen-lockfile
npx prisma generate
yarn build
# Output: dist/src/main.js
```

## Runtime

```bash
NODE_ENV=production node dist/src/main.js
```

**Critical:** при `NODE_ENV=production` Nest `ConfigModule` **не** читает `.env` (`ignoreEnvFile: true`). Все переменные — из orchestrator (K8s secrets, ECS, etc.).

## Pre-deploy Checklist

- [ ] `npx prisma migrate deploy` against production DB
- [ ] Redis highly available (sessions)
- [ ] `SESSION_SECURE=true`, HTTPS termination
- [ ] `ALLOWED_ORIGIN` = production frontend URL
- [ ] Stripe/LiveKit webhooks pointed to production domain
- [ ] `STRIPE_WEBHOOK_SECRET` matches dashboard endpoint
- [ ] SMTP credentials valid
- [ ] Health check on `APPLICATION_PORT` *(no dedicated /health endpoint in code — gap)*

## Scaling Notes

| Component | Constraint |
|-----------|------------|
| App instances | In-memory GraphQL PubSub — multi-instance chat subscriptions need Redis adapter |
| Sessions | Redis must be shared across instances |
| Cron | `@nestjs/schedule` runs per instance — risk duplicate jobs; use leader election or external scheduler *(gap)* |
| DB | Connection pool via PrismaPg — tune pool size per instance |

## Observability (gaps)

- No structured logging framework beyond Nest `Logger` in cron
- No OpenTelemetry / metrics endpoints documented
- Recommend: add `/health`, request logging, Stripe webhook idempotency store

## Related

- [../infra/dependencies.md](../infra/dependencies.md)
- [../security/secrets.md](../security/secrets.md)
