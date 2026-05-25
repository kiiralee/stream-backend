# Pull Request Checklist

## Before Opening PR

- [ ] Ветка актуальна относительно base branch
- [ ] `yarn lint:check` — pass
- [ ] `yarn format:check` — pass
- [ ] `yarn build` — pass
- [ ] `yarn test` — pass (если затронута логика)
- [ ] Prisma: `migrate` + `generate` при изменении schema
- [ ] `.env.example` обновлён при новых env vars
- [ ] README / `docs/` обновлены при изменении поведения API или deploy

## PR Description Template

```markdown
## Summary
- What changed and why

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Docs
- [ ] Chore

## Test plan
- [ ] Manual steps (GraphQL mutations/queries)
- [ ] Unit/e2e tests added or updated

## Breaking changes
- None / describe

## Screenshots / logs
(if applicable)
```

## Review Focus Areas

| Area | Reviewer checks |
|------|-----------------|
| Auth | Session side effects, guard coverage |
| Webhooks | Idempotency, signature validation |
| Payments | Stripe event handling, DB consistency |
| GraphQL | Breaking schema changes for clients |
| Security | No secrets, no password leaks in models |

## Related

- [code-standards.md](code-standards.md)
- [../testing/strategy.md](../testing/strategy.md)
