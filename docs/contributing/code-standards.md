# Code Standards

## Tooling

| Tool | Config | Command |
|------|--------|---------|
| ESLint 9 | `eslint.config.mjs` | `yarn lint` / `yarn lint:check` |
| Prettier | `.prettierrc` | `yarn format` / `yarn format:check` |
| TypeScript | `tsconfig.json`, strict null checks | `yarn build` |

## Conventions (from codebase)

### NestJS modules

- One domain per folder: `*.module.ts`, `*.service.ts`, `*.resolver.ts`
- GraphQL models: `*.model.ts` with `@ObjectType()`
- Inputs: `inputs/*.input.ts` with `class-validator`

### Naming

- Resolvers: explicit `{ name: 'findProfile' }` on `@Query` / `@Mutation`
- Prisma: snake_case columns via `@map`, camelCase in TS

### Auth

- Protected resolvers: `@Authorization()` + `@Authorized()` / `@Authorized('id')`
- Guard: `GqlAuthGuard` reads `req.session.userId`

### Imports

- Prefer path aliases `@/src/...`, `@/prisma/generated/...`
- Sort imports via Prettier plugin `@trivago/prettier-plugin-sort-imports`

### Language

- User-facing errors often in Russian (e.g. guards, webhooks)
- Code comments mix RU/EN — acceptable for this project

## Prisma

- Run `npx prisma generate` after schema changes
- Commit migrations under `prisma/migrations/`
- Generated client in `prisma/generated/` — tracked in git (per current repo state)

## Do Not

- Commit `.env` or secrets
- Skip migrations for schema changes
- Modify `shema.gql` manually (auto-generated)

## Related

- [branching.md](branching.md)
- [pull-requests.md](pull-requests.md)
