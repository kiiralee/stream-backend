# Teastream Backend

Backend API для платформы live-стриминга **Teastream**: аутентификация, каналы, стримы (LiveKit), чат, подписки (Stripe), уведомления (email / Telegram / in-app).

## Возможности

- GraphQL API (queries, mutations, subscriptions)
- Сессии в Redis + cookie-based auth
- Live-стриминг через LiveKit Ingress
- Чат в реальном времени (GraphQL Subscriptions)
- Подписки и платежи (Stripe Checkout + webhooks)
- Email (React Email) и Telegram-бот
- Фоновые задачи (`@nestjs/schedule`)

## Архитектура (кратко)

Один deployable-сервис — **NestJS monolith**. Доменная логика разбита на модули в `src/modules/`. Подробности: [docs/architecture/overview.md](docs/architecture/overview.md).

```
Client → GraphQL (/graphql) + REST webhooks (/webhook/*)
              ↓
        NestJS (CoreModule)
    ┌─────────┼─────────┐
    ↓         ↓         ↓
 PostgreSQL  Redis   LiveKit / Stripe / SMTP / Telegram
```

## Структура репозитория

| Путь | Назначение |
|------|------------|
| [`src/core/`](src/core/README.md) | Prisma, Redis, GraphQL config, bootstrap |
| [`src/modules/auth/`](src/modules/auth/README.md) | Регистрация, сессии, 2FA, профиль |
| [`src/modules/stream/`](src/modules/stream/README.md) | Стримы, LiveKit ingress, токены |
| [`src/modules/chat/`](src/modules/chat/README.md) | Чат и подписки на сообщения |
| [`src/modules/channel/`](src/modules/channel/README.md) | Публичные каналы |
| [`src/modules/category/`](src/modules/category/README.md) | Категории контента |
| [`src/modules/follow/`](src/modules/follow/README.md) | Подписки на каналы |
| [`src/modules/notification/`](src/modules/notification/README.md) | In-app уведомления |
| [`src/modules/sponsorship/`](src/modules/sponsorship/README.md) | Планы, подписки, платежи |
| [`src/modules/webhook/`](src/modules/webhook/README.md) | LiveKit & Stripe webhooks |
| [`src/modules/cron/`](src/modules/cron/README.md) | Планировщик задач |
| [`src/modules/libs/`](src/modules/libs/README.md) | Интеграции (Mail, Stripe, LiveKit, Telegram) |
| [`prisma/`](prisma/schema.prisma) | Схема БД и миграции |
| [`docs/`](docs/README.md) | Централизованная документация |

## Quick Start

### Требования

- Node.js 22+
- Yarn
- Docker (PostgreSQL + Redis)

### 1. Зависимости и env

```bash
yarn install
cp .env.example .env
# Отредактируйте .env под локальную среду
```

### 2. Инфраструктура

```bash
docker compose up -d
```

PostgreSQL: `localhost:5433`, Redis: `localhost:6379` (см. [docs/infra/docker-compose.md](docs/infra/docker-compose.md)).

### 3. База данных

```bash
npx prisma migrate deploy
npx prisma generate
yarn db:seed   # опционально: демо-данные
```

### 4. Запуск

```bash
yarn start:dev
```

- GraphQL Playground (только `NODE_ENV=development`): `http://localhost:3000/graphql`
- Схема: [`src/core/graphql/shema.gql`](src/core/graphql/shema.gql)

## Основные команды

| Команда | Описание |
|---------|----------|
| `yarn start:dev` | Dev-сервер с hot reload |
| `yarn build` | Production build → `dist/` |
| `yarn start:prod` | `node dist/src/main.js` |
| `yarn lint:check` | ESLint |
| `yarn format:check` | Prettier |
| `yarn test` | Unit tests (Jest) |
| `yarn test:e2e` | E2E tests |
| `yarn db:seed` | Seed БД |

## Документация

| Раздел | Ссылка |
|--------|--------|
| Навигация по docs | [docs/README.md](docs/README.md) |
| Onboarding | [docs/onboarding/developer-setup.md](docs/onboarding/developer-setup.md) |
| Архитектура | [docs/architecture/overview.md](docs/architecture/overview.md) |
| API (GraphQL) | [docs/api/graphql.md](docs/api/graphql.md) |
| Deployment | [docs/deployment/local.md](docs/deployment/local.md) |
| Contributing | [docs/contributing/code-standards.md](docs/contributing/code-standards.md) |
| Security | [docs/security/auth-sessions.md](docs/security/auth-sessions.md) |
| ADR | [docs/decisions/](docs/decisions/) |
| AI / Cursor | [docs/ai-friendly.md](docs/ai-friendly.md) |

## Onboarding

Новому разработчику: [docs/onboarding/developer-setup.md](docs/onboarding/developer-setup.md) → [docs/onboarding/first-contribution.md](docs/onboarding/first-contribution.md).

## License

UNLICENSED (private).
