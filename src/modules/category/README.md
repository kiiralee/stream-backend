# Category Module

## Overview

Категории контента для стримов (как на Twitch): slug, title, thumbnail, список стримов в категории.

## Responsibilities

- List all categories
- Find by slug
- Random categories for UI sections
- Link streams via `Stream.categoryId`

## Directory Structure

```
category/
├── category.module.ts
├── category.service.ts
├── category.resolver.ts
└── model/category.model.ts
```

## Environment Variables

None.

## API Overview

| Query | Description |
|-------|-------------|
| `findAllCategories` | Full list |
| `findCategoryBySlug` | Single category + streams |
| `findRandomCategories` | Random subset |

## Integrations

- Prisma `Category`, `Stream`
- Seed data: [`src/core/prisma/data/categories.data.ts`](../../core/prisma/data/categories.data.ts)

## Dependencies

`PrismaService`

## Troubleshooting

Empty categories — run `yarn db:seed`.

## Scaling Notes

Read-heavy — cache category list in Redis *(not implemented)*.

## Related

- [../stream/README.md](../stream/README.md)
