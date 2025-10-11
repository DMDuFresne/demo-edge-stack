# MES GraphQL API

A comprehensive GraphQL API for the MES Core database—query production data, equipment status, and time-series logs without writing SQL.

**Built for developers** who need programmatic access to manufacturing data. This API provides type-safe access to all MES database tables through a modern GraphQL interface.

## Features

- **Complete schema coverage** - All MES database tables accessible via GraphQL
- **TypeScript implementation** - Full type safety from database to API
- **TimescaleDB integration** - Optimized for time-series queries
- **Connection pooling** - Efficient database access for high-throughput
- **Docker ready** - Containerized and integrated with the stack
- **Health checks** - Built-in monitoring endpoints

## Architecture

### Database Schema Coverage

The API provides GraphQL types and queries for:

**Lookup Tables:**
- Asset Types
- State Types & Definitions
- Downtime Reasons
- Count Types
- Measurement Types
- KPI Definitions

**Master Data:**
- Asset Definitions (with hierarchical relationships)
- Product Families
- Product Definitions
- Performance Targets

**Event Logs (TimescaleDB Hypertables):**
- State Logs
- Production Logs
- Count Logs
- Measurement Logs
- KPI Logs
- Notes for all log types

## Getting Started

### What You'll Need

- **Node.js** 20+ ([download](https://nodejs.org/))
- **Docker & Docker Compose** (for running the database)
- **Access to TimescaleDB** instance (included in the stack)

**Time Required:** About 5 minutes

---

### Local Development

**1. Install dependencies:**
```bash
cd graphql-api
npm install
```

**What this does:** Downloads all required npm packages including Apollo Server, TypeScript, and database drivers.

**2. Create your configuration file:**
```bash
cp .env.example .env
```

**3. Configure environment variables in `.env`:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mes
DB_USER=admin
DB_PASSWORD=password
DB_SCHEMA=mes_core
PORT=4000
```

**What this does:** Tells the API how to connect to your database. If you're using the Docker stack, set `DB_HOST=mes-database` instead of `localhost`.

**4. Run in development mode:**
```bash
npm run dev
```

**Expected output:**
```
🚀 Server ready at http://localhost:4000/graphql
🔗 Database connected to mes@mes-database:5432
```

✅ **Your API is running!** Let's explore it.

**5. Access Apollo Studio:**

Open http://localhost:4000/graphql in your browser.

You'll see the Apollo Studio interface where you can explore the schema and run queries interactively.

### Docker Deployment

The GraphQL API is included in the main docker-compose.yml. When you start the full stack, the API starts automatically:

```bash
# Start the entire MES stack (including API)
docker-compose up -d

# Or restart just the API after code changes
docker-compose restart graphql-api
```

**What this does:** Starts the API container connected to the TimescaleDB database. The API automatically rebuilds from TypeScript source on startup.

The service will be available at http://localhost:4000/graphql

**Verify it's running:**
```bash
curl http://localhost:4000/health
```

**Expected output:**
```json
{"status":"ok","database":"connected"}
```

## Example Queries

Let's explore some common queries you can run in Apollo Studio.

### Get All Assets

**Use case:** List all active equipment in your facility with their types and parent relationships.

```graphql
query {
  assetDefinitions(removed: false) {
    asset_id
    asset_name
    asset_description
    asset_type {
      asset_type_name
    }
    parent_asset {
      asset_name
    }
  }
}
```

**What this returns:** Array of all active assets with their type and parent asset (if any).

### Get Production Logs with Filters

**Use case:** Query production runs for a specific asset since January 1st, including product family details.

```graphql
query {
  productionLogs(
    filter: {
      asset_id: "1"
      start_ts: { from: "2024-01-01T00:00:00Z" }
      removed: false
    }
    limit: 100
  ) {
    production_log_id
    asset_name
    product_name
    start_ts
    end_ts
    product {
      product_family {
        product_family_name
      }
    }
  }
}
```

**What this returns:** Up to 100 production runs for asset #1 that started on or after January 1st, with nested product and product family data.

### Get State Logs with Downtime Reasons

**Use case:** Analyze equipment state changes and downtime events for a specific asset.

```graphql
query {
  stateLogs(
    filter: {
      asset_id: "1"
      logged_at: { from: "2024-01-01T00:00:00Z" }
    }
    limit: 50
  ) {
    state_log_id
    state_name
    state_type_name
    downtime_reason {
      downtime_reason_name
      is_planned
    }
    logged_at
  }
}
```

**What this returns:** Last 50 state changes for asset #1 since January 1st, including whether downtime was planned or unplanned.

### Get Count Logs with Related Data

**Use case:** Track production counts (good parts, scrap, infeed, outfeed) for an asset with product context.

```graphql
query {
  countLogs(
    filter: { asset_id: "1" }
    limit: 100
  ) {
    count_log_id
    quantity
    count_type {
      count_type_name
      count_type_unit
    }
    product {
      product_name
      product_family {
        product_family_name
      }
    }
    logged_at
  }
}
```

**What this returns:** Last 100 count events with the count type (Good, Scrap, etc.), quantity with units, and associated product information.

## API Structure

### Directory Layout
```
graphql-api/
├── src/
│   ├── db/
│   │   └── pool.ts           # Database connection pool
│   ├── resolvers/
│   │   ├── index.ts          # Resolver aggregation
│   │   ├── lookupResolvers.ts
│   │   ├── masterDataResolvers.ts
│   │   └── logResolvers.ts
│   ├── types/
│   │   └── schema.ts         # GraphQL type definitions
│   ├── utils/
│   │   ├── scalars.ts        # Custom scalar types
│   │   └── queryBuilder.ts   # SQL query helpers
│   └── index.ts              # Server entry point
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `mes` |
| `DB_USER` | Database user | `admin` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_SCHEMA` | PostgreSQL schema | `mes_core` |
| `DB_POOL_MIN` | Min pool connections | `2` |
| `DB_POOL_MAX` | Max pool connections | `10` |

## Development

### Build TypeScript

```bash
npm run build
```

**What this does:** Compiles TypeScript source files to JavaScript in the `dist/` directory.

### Run Production Build

```bash
npm start
```

**What this does:** Runs the compiled JavaScript (requires `npm run build` first). Used by the Docker container.

### Type Checking

```bash
npm run lint
```

**What this does:** Checks TypeScript code for type errors and style issues using ESLint.

## Health Checks

The server exposes a health check endpoint for monitoring:

```bash
curl http://localhost:4000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-10-11T12:34:56.789Z"
}
```

**What this checks:** Verifies the API server is running and can connect to the database.

**Use this for:**
- Docker healthcheck configuration
- Load balancer health monitoring
- Automated deployment validation

## Performance Considerations

- Connection pooling is configured for optimal database access
- TimescaleDB hypertables provide efficient time-series queries
- Pagination is supported on all log queries
- Field-level resolvers enable efficient data fetching

## Security

### Before Production Deployment

**Required actions:**

1. **Never commit `.env` files:**
   ```bash
   # Verify .env is in .gitignore
   cat .gitignore | grep .env
   ```

2. **Change default credentials:**
   - Update database passwords in `.env`
   - Use strong passwords (32+ characters)

3. **Implement authentication:**
   - This API currently has **no authentication**
   - Add JWT middleware or API key validation before exposing publicly
   - Consider role-based access control (RBAC)

4. **Use HTTPS in production:**
   - Never expose GraphQL endpoints over HTTP in production
   - Use a reverse proxy (Traefik, Nginx, Caddy) with TLS termination

5. **Implement rate limiting:**
   - Prevent abuse with rate limiting middleware
   - Recommended: 100 requests per minute per IP

**Why this matters:** Without authentication, anyone with network access can query or modify all production data.

## Contributing

When adding new tables or modifying the schema:

1. Update the GraphQL schema in `src/types/schema.ts`
2. Add resolvers in the appropriate resolver file
3. Update this README with example queries
4. Test all queries in GraphQL Playground

## License

MIT
