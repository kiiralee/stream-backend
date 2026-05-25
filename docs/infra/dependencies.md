# Infrastructure Dependencies

## Runtime Dependencies

| Service | Version (compose) | Purpose |
|---------|-------------------|---------|
| PostgreSQL | 15.2 | Primary database |
| Redis | 5.0 | Session store |

## External SaaS (required for full features)

| Service | Required for |
|---------|--------------|
| LiveKit | Streaming ingress, webhooks |
| Stripe | Sponsorship payments |
| SMTP | Email flows |
| Telegram | Bot notifications |

## Application

| Property | Value |
|----------|-------|
| Package manager | Yarn |
| Node | 22+ recommended |
| Build output | `dist/` |
| Process entry | `dist/src/main.js` |

## Network

```
Browser ──HTTPS──► API (NestJS)
                      ├──► PostgreSQL
                      ├──► Redis
                      ├──► LiveKit API
                      ├──► Stripe API
                      ├──► SMTP
                      └──► Telegram API

LiveKit ──webhook──► API /webhook/livekit
Stripe  ──webhook──► API /webhook/stripe
```

## Not in Repository

> Documented as gaps:

- Application Dockerfile
- CI/CD (GitHub Actions, etc.)
- Kubernetes / Terraform
- CDN / object storage for avatars *(avatars stored as string — likely URL)*

## Related

- [docker-compose.md](docker-compose.md)
- [../deployment/production.md](../deployment/production.md)
