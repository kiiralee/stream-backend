# Documentation Gaps & Assumptions

Документ фиксирует неясности, выявленные при reverse-engineering кодовой базы.

## Undocumented Areas (before this pass)

- [x] `.env.example` — создан
- [ ] CI/CD pipeline
- [ ] Production Dockerfile
- [ ] Health check endpoint
- [ ] Frontend repository link
- [ ] Stripe webhook event matrix (full list in code)

## Architectural Inconsistencies

| Issue | Location |
|-------|----------|
| `MailModule` imported twice | `core.module.ts` |
| `DATABASE_URL` vs `POSTGRES_URI` dual naming | Prisma service vs prisma.config.ts |
| GraphQL `UserModel.password` exposed | `shema.gql` |
| In-memory PubSub vs multi-instance | `chat.resolver.ts` |
| Cron runs on every instance | `cron.service.ts` |
| DB typos: `teleram_id`, `sposorship_plans` | `schema.prisma` |

## Missing Configs

- No `.github/workflows`
- No `Dockerfile` for app (only `docker-compose` for Postgres/Redis)
- No GraphQL codegen config
- No test database setup

## Risky Assumptions

| Assumption | Risk |
|------------|------|
| DB name `teastream` in connection string | Compose doesn't create DB explicitly |
| Branching `main` vs `develop` | Not defined in repo |
| Production deploy via `node dist/src/main.js` | No process manager documented |
| Avatar storage | `avatar` is string — storage backend unknown |

## Technical Debt

- Minimal test coverage
- `verifyChannel` scans all users daily
- Chat subscription without auth
- `console.log` in production cron path
- `noImplicitAny: false` in tsconfig

## Documentation Maintenance

When changing code, update:

1. Module `README.md` if API/env/integrations change
2. `.env.example`
3. `shema.gql` (auto) + `docs/api/graphql.md` if operations added
4. ADR in `docs/decisions/` for architectural shifts
