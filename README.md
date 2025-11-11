# Solana Block Explorer

A monorepo application for querying Solana blockchain data. Built with NestJS, Next.js, Redis caching, and Docker.

## Features

- Query transaction counts for any Solana block
- Redis caching with 5-minute TTL
- Health monitoring endpoint
- Rate limiting (10 req/min)
- Interactive API documentation (Swagger)
- Docker containerization
- E2E testing

## Quick Start

**Local Development:**

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm dev
```

**Docker (Recommended):**

```bash
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs
- Health: http://localhost:3001/health

## API Endpoints

**Get Block Transaction Count:**

```bash
GET /solana/block/transaction-count?blockNumber=200000000
```

Response:
```json
{
  "blockNumber": 200000000,
  "transactionCount": 1234
}
```

**Health Check:**

```bash
GET /health
```

## Configuration

**API (.env):**

```env
PORT=3001
SOLANA_NETWORK=mainnet-beta
REDIS_HOST=localhost
REDIS_PORT=6379
CACHE_TTL=300
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env) - Optional:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project Structure

```
apps/
├── api/          # NestJS backend
│   ├── src/
│   │   ├── solana/
│   │   ├── health/
│   │   └── common/
│   └── test/     # E2E tests
└── web/          # Next.js frontend
```

## Commands

```bash
# Development
pnpm dev              # Start all
pnpm dev:api          # API only
pnpm dev:web          # Frontend only

# Testing
pnpm test:api         # Unit tests
pnpm test:e2e:api     # E2E tests

# Docker
pnpm docker:up        # Start services
pnpm docker:down      # Stop services
pnpm docker:logs      # View logs
```

## Tech Stack

**Backend:** NestJS, @solana/web3.js, Redis, Winston, Swagger

**Frontend:** Next.js 14, React, TypeScript, Tailwind CSS

**Infrastructure:** Docker, pnpm workspaces, Redis 7

## Testing

The project includes unit and E2E tests covering:
- Health check endpoint
- Block transaction queries
- Cache functionality
- Error handling

Run tests with `pnpm test:api` or `pnpm test:e2e:api`.

## Troubleshooting

**Port conflicts:** Stop conflicting services or modify ports in `docker-compose.yml`.

**Redis errors:** Ensure Redis is running. Check `REDIS_HOST` and `REDIS_PORT` in `.env`.

**Solana RPC slow:** Use a private RPC by setting `SOLANA_RPC_URL` in `.env`.

**Docker issues:** Run `docker-compose down -v` then `docker-compose up --build`.

## License

MIT
