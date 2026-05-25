# Branching Strategy

> **Assumption:** в репозитории нет `.github/workflows` или documented branching policy. Ниже — рекомендуемая схема для mature team; согласуйте с владельцами репозитория.

## Recommended Model (GitHub Flow)

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready, deployable |
| `feature/<ticket>-<short-desc>` | New features |
| `fix/<ticket>-<short-desc>` | Bug fixes |
| `chore/<desc>` | Tooling, docs, deps |

## Rules

1. Короткоживущие feature-ветки, merge через PR.
2. `main` защищён: required checks (lint, test, build) — **настроить в GitHub** *(currently missing)*.
3. Database migrations только в forward direction; destructive changes — отдельный ADR.

## Release Tags

> **Assumption:** версионирование `0.0.1` в package.json — semver для API не формализован.

Рекомендация: tag releases `v0.x.y` при deploy в production.

## Related

- [pull-requests.md](pull-requests.md)
- [../deployment/production.md](../deployment/production.md)
