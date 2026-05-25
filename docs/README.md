# Teastream Backend — Documentation Hub

Центральная навигация по инженерной документации. Главный README — краткий entrypoint; детали — здесь.

## Architecture

| Документ | Описание |
|----------|----------|
| [architecture/overview.md](architecture/overview.md) | Обзор системы, стек, паттерны |
| [architecture/modules.md](architecture/modules.md) | Карта NestJS-модулей и зависимостей |
| [architecture/data-model.md](architecture/data-model.md) | Prisma-модели и связи |
| [architecture/integrations.md](architecture/integrations.md) | LiveKit, Stripe, Mail, Telegram |
| [architecture/sequences.md](architecture/sequences.md) | Sequence-диаграммы ключевых потоков |

## Onboarding

| Документ | Описание |
|----------|----------|
| [onboarding/developer-setup.md](onboarding/developer-setup.md) | Локальная среда с нуля |
| [onboarding/first-contribution.md](onboarding/first-contribution.md) | Первый PR / задача |

## Development

| Документ | Описание |
|----------|----------|
| [contributing/code-standards.md](contributing/code-standards.md) | Стиль кода, линтеры |
| [contributing/branching.md](contributing/branching.md) | Ветки и workflow |
| [contributing/pull-requests.md](contributing/pull-requests.md) | Чеклист PR |
| [testing/strategy.md](testing/strategy.md) | Jest, e2e, покрытие |

## Operations

| Документ | Описание |
|----------|----------|
| [deployment/local.md](deployment/local.md) | Локальный запуск |
| [deployment/production.md](deployment/production.md) | Production deploy *(assumptions)* |
| [infra/dependencies.md](infra/dependencies.md) | Внешние сервисы |
| [infra/docker-compose.md](infra/docker-compose.md) | Postgres + Redis |

## API & Security

| Документ | Описание |
|----------|----------|
| [api/graphql.md](api/graphql.md) | GraphQL endpoints, auth |
| [api/webhooks.md](api/webhooks.md) | REST webhooks |
| [security/auth-sessions.md](security/auth-sessions.md) | Сессии, guards, 2FA |
| [security/secrets.md](security/secrets.md) | Секреты и env |

## Decisions (ADR)

| ADR | Тема |
|-----|------|
| [decisions/001-nestjs-monolith.md](decisions/001-nestjs-monolith.md) | Monolith vs microservices |
| [decisions/002-redis-sessions.md](decisions/002-redis-sessions.md) | Redis session store |
| [decisions/003-graphql-api.md](decisions/003-graphql-api.md) | GraphQL как основной API |

## Gaps & Assumptions

| Документ | Описание |
|----------|----------|
| [gaps-and-assumptions.md](gaps-and-assumptions.md) | Пробелы, долг, assumptions |

## AI Assistants

| Документ | Описание |
|----------|----------|
| [ai-friendly.md](ai-friendly.md) | Контекст для Cursor / AI |

## Service READMEs (модули)

См. [architecture/modules.md](architecture/modules.md) — ссылки на `src/**/README.md`.
