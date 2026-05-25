# First Contribution

## Recommended First Tasks

1. Добавить unit-тест для существующего service (сейчас покрытие минимально — см. `test/`).
2. Исправить typo в schema (`teleram_id`, `sposorship_plans`) — требует миграции.
3. Документировать недостающий `.env` в `.env.example` при добавлении новых `getOrThrow`.
4. Расширить GraphQL schema comments для AI discoverability.

## Workflow

1. Создайте ветку от `main` / `develop` *(уточните у команды — CI config отсутствует в репозитории)*.
2. `yarn start:dev` + проверьте сценарий в Playground.
3. `yarn lint:check && yarn format:check && yarn test`.
4. PR с описанием по [../contributing/pull-requests.md](../contributing/pull-requests.md).

## Code Touch Points

| Change type | Files to check |
|-------------|----------------|
| New GraphQL field | `*.resolver.ts`, `*.model.ts`, auto `shema.gql` |
| DB change | `prisma/schema.prisma`, migration, seed |
| New env var | `.env.example`, module README, `docs/security/secrets.md` |
| Webhook | `webhook.controller.ts`, `webhook.service.ts`, `docs/api/webhooks.md` |

## Getting Help

- Architecture: [../architecture/overview.md](../architecture/overview.md)
- Auth flows: [../security/auth-sessions.md](../security/auth-sessions.md)
- Cursor AI: [../ai-friendly.md](../ai-friendly.md)
