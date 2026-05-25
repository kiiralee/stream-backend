# Authentication & Sessions

## Model

**Cookie-based sessions** (not JWT for primary API).

1. `loginUser` → `SessionService` sets `req.session.userId`
2. Session stored in **Redis** via `connect-redis` (`SESSION_FOLDER` prefix)
3. Cookie name: `SESSION_NAME`, signed with `SESSION_SECRET`
4. GraphQL requests send cookie; context exposes `{ req, res }`

## Guards & Decorators

```typescript
// Protected resolver pattern
@Authorization()
@Query(() => UserModel)
findProfile(@Authorized() user: User) { ... }
```

- `GqlAuthGuard` — checks `session.userId`, loads `User` into `req.user`
- `@Authorization()` — applies guard
- `@Authorized('id')` — extracts field from `req.user`

## 2FA (TOTP)

- `generateTotpSecret` / `enableTotp` / `disableTotp`
- Login accepts optional `pin` in `LoginInput`
- Secrets stored in `User.totpSecret` (ensure not exposed in GraphQL — verify resolvers)

## Tokens (email / telegram)

`Token` model with expiry — used for:

- Email verification
- Password reset
- Account deactivation confirmation
- Telegram account linking

## Session Management

- `findSessionsByUser` — list active sessions (Redis keys)
- `removeSession` — revoke specific session
- `logoutUser` / `clearSessionCookie` — destroy session

## Security Settings

| Env | Production recommendation |
|-----|---------------------------|
| `SESSION_SECURE` | `true` (HTTPS only) |
| `SESSION_HTTP_ONLY` | `true` |
| `COOKIE_SECRET` | Strong random |
| `SESSION_SECRET` | Strong random, ≠ cookie secret |

## CORS

`ALLOWED_ORIGIN` + `credentials: true` — frontend must send cookies.

## Related

- [secrets.md](secrets.md)
- [../api/graphql.md](../api/graphql.md)
