# Developer Setup

Пошаговая настройка локальной среды для `teastream-backend`.

## Prerequisites

- **Node.js** 22+ (см. `@types/node` в package.json)
- **Yarn** (lockfile: `yarn.lock`)
- **Docker** + Docker Compose
- Аккаунты/ключи *(для полного функционала)*: LiveKit, Stripe (test mode), SMTP, Telegram Bot

## Steps

### 1. Clone & install

```bash
git clone <repository-url>
cd teastream-backend
yarn install
```

### 2. Environment

```bash
cp .env.example .env
```

Обязательные переменные для старта без внешних интеграций:

- `APPLICATION_PORT`, `ALLOWED_ORIGIN`, `GRAPHQL_PREFIX`
- `SESSION_*`, `COOKIE_SECRET`
- `DATABASE_URL` или `POSTGRES_URI`
- `REDIS_URI`

Для стримов/платежей дополнительно: `LIVEKIT_*`, `STRIPE_*`, `MAIL_*`, `TELEGRAM_BOT_TOKEN`.

> В development `ConfigModule` загружает `.env` (`ignoreEnvFile: !IS_DEV_ENV` в `core.module.ts`). В production env задаётся платформой *(assumption)*.

### 3. Start infrastructure

```bash
docker compose up -d
```

См. [../infra/docker-compose.md](../infra/docker-compose.md).

### 4. Database

```bash
npx prisma generate
npx prisma migrate deploy
yarn db:seed   # optional
```

### 5. Run application

```bash
yarn start:dev
```

Откройте GraphQL Playground: `http://localhost:<APPLICATION_PORT><GRAPHQL_PREFIX>` (по умолчанию `/graphql`).

**Playground cookies:** в dev включён `request.credentials: same-origin` — иначе logout может затронуть неверную сессию (см. комментарий в `graphql.config.ts`).

### 6. Verify

```bash
yarn lint:check
yarn test
```

## Path Aliases

| Alias | Path |
|-------|------|
| `@/src/*` | `src/*` |
| `@/prisma/generated/*` | `prisma/generated/*` |

Production: `src/bootstrap-paths.ts` переназначает `@/src/*` → `dist/src/*`.

## Next Steps

- [first-contribution.md](first-contribution.md)
- [../api/graphql.md](../api/graphql.md)
- Module READMEs в `src/modules/*/README.md`
