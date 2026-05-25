# AI-Friendly Documentation Guide

Рекомендации для Cursor и других AI-ассистентов при работе с `teastream-backend`.

## Context Loading Order

1. [README.md](../README.md) — scope & commands
2. [docs/architecture/overview.md](architecture/overview.md) — stack
3. [docs/architecture/modules.md](architecture/modules.md) — where code lives
4. Target module `src/modules/<domain>/README.md`
5. [src/core/graphql/shema.gql](../src/core/graphql/shema.gql) — API contract
6. [prisma/schema.prisma](../prisma/schema.prisma) — data model

## Reduce Hallucinations

| Do | Don't |
|----|-------|
| Cite real file paths | Invent microservices not in repo |
| Mark *assumption* when CI/deploy unknown | Assume `.env` keys not in `.env.example` |
| Read `core.module.ts` for module list | Guess REST routes beyond `/webhook` |
| Use `shema.gql` for GraphQL operations | Hand-edit `shema.gql` |

## Cursor Rules

Project rule: [`.cursor/rules/learning-explanations.mdc`](../.cursor/rules/learning-explanations.mdc) — explain fixes in Russian.

Suggested additions:

```markdown
# .cursor/rules/teastream-context.mdc
- Monolith NestJS; GraphQL at GRAPHQL_PREFIX
- Auth: session cookie + GqlAuthGuard
- DB: Prisma + PostgreSQL; sessions: Redis
- Before schema changes: prisma migrate + generate
```

## Contracts & Examples

| Artifact | Location |
|----------|----------|
| GraphQL schema | `src/core/graphql/shema.gql` |
| Prisma models | `prisma/schema.prisma` |
| Env contract | `.env.example` |
| Webhook routes | `docs/api/webhooks.md` |

## Discoverability Tips

- Keep module README **Overview + API + Env** at top
- Link ADRs when changing auth/session/payment flows
- Add `## Related` sections with relative links (already used in docs/)

## Safe Edit Zones

| High risk | Lower risk |
|-----------|------------|
| `webhook.service.ts`, Stripe handlers | New query in category module |
| `session.service.ts`, guards | Docs only |
| `prisma/schema.prisma` | Mail templates copy |

## Known AI Traps

1. Typo `teleram_id` in DB — not `telegram_id`
2. Table `sposorship_plans` — not `sponsorship_plans`
3. `IS_DEV_ENV` uses `process.env.NODE_ENV` at import time
4. Production entry: `dist/src/main.js` not `dist/main.js`
5. Filename `shema.gql` (typo) — search using exact name
