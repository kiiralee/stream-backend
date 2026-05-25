# Core Module

## Overview

Инфраструктурный слой приложения: конфигурация, Prisma, Redis, GraphQL setup, seed data. Регистрирует все feature-модули через [`core.module.ts`](core.module.ts).

## Responsibilities

- Global `ConfigModule` (`.env` in development only)
- `PrismaModule` — PostgreSQL via `PrismaPg` adapter
- `RedisModule` — session store client
- `GraphQLModule` — Apollo, schema generation
- Async registration: LiveKit, Stripe, Mail, Telegram

## Directory Structure

```
src/core/
├── core.module.ts      # Root Nest module
├── config/             # Factory configs (graphql, mailer, stripe, livekit, telegram)
├── graphql/shema.gql   # Auto-generated GraphQL schema
├── prisma/
│   ├── prisma.module.ts
│   ├── prisma.service.ts
│   ├── prisma.seed.ts
│   └── data/           # Seed fixtures
└── redis/
    ├── redis.module.ts
    ├── redis.service.ts
    └── redis-options.util.ts
```

## Environment Variables

| Variable | Used in |
|----------|---------|
| `DATABASE_URL` / `POSTGRES_URI` | PrismaService, prisma.config.ts, seed |
| `REDIS_URI`, `REDIS_ACL` | RedisService |
| `GRAPHQL_PREFIX` | graphql.config.ts |
| `NODE_ENV` | is-dev, ConfigModule env file |
| `LIVEKIT_*`, `STRIPE_*`, `MAIL_*`, `TELEGRAM_BOT_TOKEN` | respective config factories |

Full list: [`.env.example`](../../.env.example)

## Local Development

Imported by `src/main.ts` — no separate start command.

```bash
yarn start:dev
```

## Build & Run

Compiled as part of monolith `yarn build` → `dist/src/core/`.

## API Overview

No public API — infrastructure only. GraphQL schema emitted to `graphql/shema.gql`.

## Integrations

Wires third-party modules from `src/modules/libs/`.

## Dependencies

- All `src/modules/*` imported in `CoreModule`
- `@nestjs/config`, `@nestjs/graphql`, `@nestjs/apollo`

## Observability

- Prisma query logging: not enabled by default
- No dedicated health controller

## Troubleshooting

| Issue | Check |
|-------|-------|
| `DATABASE_URL` error on boot | `.env` POSTGRES_URI |
| GraphQL path 404 | `GRAPHQL_PREFIX` |
| Prisma client outdated | `npx prisma generate` |

## Known Issues

- `MailModule` imported twice in `core.module.ts` (duplicate import)
- Config filename typo: `telegrag.config.ts`

## Scaling Notes

Shared Prisma/Redis connections per process — tune pool sizes for multi-instance deploy.

## Related

- [docs/architecture/overview.md](../../docs/architecture/overview.md)
- [docs/architecture/data-model.md](../../docs/architecture/data-model.md)
