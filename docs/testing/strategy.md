# Testing Strategy

## Current State

| Type | Location | Runner |
|------|----------|--------|
| Unit | `src/**/*.spec.ts` *(sparse)* | `yarn test` (Jest, `rootDir: src`) |
| E2E | `test/app.e2e-spec.ts` | `yarn test:e2e` |

> **Gap:** большинство domain services не имеют unit-тестов. E2E — boilerplate Nest starter.

## Commands

```bash
yarn test          # unit
yarn test:watch    # watch mode
yarn test:cov      # coverage → coverage/
yarn test:e2e      # supertest e2e
```

## Recommended Pyramid

1. **Unit** — services with business rules (auth, sponsorship, chat permissions)
2. **Integration** — Prisma + test DB (docker postgres)
3. **E2E** — critical GraphQL flows: login, create ingress, send chat, makePayment
4. **Contract** — export `shema.gql` snapshot tests for frontend

## Test DB

> **Assumption:** отдельная `DATABASE_URL` для test не настроена. Рекомендация:

```env
# .env.test
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/teastream_test
```

## CI (recommended)

```yaml
# Assumption — not present in repo
- yarn lint:check
- yarn format:check
- yarn test
- yarn build
```

## Related

- [../contributing/pull-requests.md](../contributing/pull-requests.md)
