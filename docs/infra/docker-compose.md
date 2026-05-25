# Docker Compose

File: [`docker-compose.yml`](../../docker-compose.yml)

## Services

### PostgreSQL (`db`)

| Property | Value |
|----------|-------|
| Container | `tea_postgres` |
| Image | `postgres:15.2` |
| Host port | **5433** → 5432 |
| Env | `POSTGRES_USER`, `POSTGRES_PASSWORD` from `.env` |
| Volume | `postgres_data` |

Example connection string:

```
postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5433/teastream
```

> **Assumption:** database name `teastream` — not set in compose file; may need manual `CREATE DATABASE` or default to `POSTGRES_USER` name.

### Redis (`redis`)

| Property | Value |
|----------|-------|
| Container | `redis` |
| Image | `redis:5.0` |
| Port | 6379 |
| Auth | `--requirepass ${REDIS_PASSWORD}` |

Example URI:

```
redis://:${REDIS_PASSWORD}@localhost:6379
```

## Commands

```bash
docker compose up -d
docker compose ps
docker compose logs -f db
docker compose down
```

## Network

All services on `teastream-backend` bridge network.

## Limitations

- No LiveKit, Mail, or Stripe containers — external only
- No healthcheck definitions
- Postgres DB name not explicitly created in compose
