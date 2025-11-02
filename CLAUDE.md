# MES Edge Stack - ADR Quick Reference
**Last Updated:** 2025-10-26

## Architecture Decisions Summary

### Phase 0 (Weeks 1-2) - Foundation
- **ADR-015: Testing Strategy** - Proposed
  - Jest unit tests, Testcontainers integration tests, E2E tests
  - Target: 80%+ coverage
- **ADR-017: Configuration Management** - Proposed
  - Joi validation, type-safe config loader
  - Validate at startup, not runtime

### Phase 1 (Weeks 3-4) - PostGraphile Setup & Schema Design
- **ADR-019: PostGraphile Over Custom GraphQL** - Accepted ✅ ⭐
  - Auto-generate GraphQL API from PostgreSQL schema
  - Schema-first development: DB schema is source of truth
  - Maintainability: Plant engineers modify SQL DDL, not resolvers
  - Built-in DataLoader, N+1 prevention, connection pooling
- **ADR-003: TimescaleDB Optimization** - Accepted
  - Time-first queries for chunk exclusion
  - Trigger-based referential integrity (no FKs on hypertables)
  - Indexes with time column first
- **ADR-014: TypeScript Strict Mode** - Proposed
  - Enable strict: true, eliminate `any`
  - Define proper DTOs for custom plugins

### Phase 2 (Weeks 5-6) - Authentication & Security
- **ADR-008: Authentication & Authorization** - Proposed (Modified)
  - JWT-based auth using PostGraphile plugins
  - RLS (Row-Level Security) in PostgreSQL for fine-grained access
  - RBAC: VIEWER, OPERATOR, ENGINEER, ADMIN
  - Plugin: postgraphile-plugin-connection-filter-polymorphic
- **ADR-009: Error Handling** - Proposed
  - Custom error handling via PostGraphile plugins
  - Safe client errors, Sentry integration
- **ADR-013: Rate Limiting** - Proposed
  - Express rate limit (1000 req/15min)
  - GraphQL complexity analysis via plugin

### Phase 3 (Weeks 7-10) - Custom Business Logic Plugins
- **ADR-010: Circuit Breaker** - Proposed
  - Replace process.exit() with graceful degradation
  - Implement via custom PostGraphile plugin for external calls
  - States: CLOSED, OPEN, HALF_OPEN
- Custom computed fields via makeExtendSchemaPlugin
- Custom mutations for complex business logic
- Event triggers for real-time updates

### Phase 4 (Weeks 11-14) - TimescaleDB Optimization
- **ADR-012: Continuous Aggregates** - Accepted
  - Replace views with auto-updating materialized views
  - Expected: 90% faster dashboards (5-10s → <500ms)
  - Expose via PostGraphile computed fields
- **ADR-011: Connection Pool Sizing** - Accepted
  - Increase max from 10 → 20 connections
  - Add monitoring, query timeout 30s
  - Configure via PostGraphile pool settings

### Phase 5 (Weeks 15-18) - Caching & Performance
- **ADR-004: Multi-Tier Caching** - Proposed (Modified)
  - L1: PostGraphile built-in memoization (per-request)
  - L2: Redis plugin for computed fields (15-60min TTL)
  - L3: PostgreSQL materialized views for aggregates
  - Expected: 95% query reduction for lookups

### Phase 6 (Weeks 19-22) - Observability
- **ADR-016: Observability & Monitoring** - Proposed
  - Winston structured logging (JSON)
  - Prometheus metrics via PostGraphile plugin
  - Grafana dashboards
  - Health checks at /health

### Phase 7 (Future) - Scale & Federation
- **ADR-018: Docker Compose vs K8s** - Accepted (Compose)
  - Keep Docker Compose for edge deployments
  - Design for K8s compatibility (stateless, health checks)
  - Future: PostGraphile with multiple schemas for domain separation

## Superseded ADRs (Replaced by ADR-019: PostGraphile)
- **ADR-001: Service Layer Pattern** - Superseded
  - Replaced by schema-driven PostGraphile auto-generation
- **ADR-002: DataLoader for N+1** - Superseded
  - Built into PostGraphile by default
- **ADR-005: Repository Pattern** - Superseded
  - Database schema is the repository
- **ADR-006: Domain-Driven Structure** - Superseded
  - Use PostgreSQL schemas for domain separation
- **ADR-007: GraphQL Schema Organization** - Superseded
  - GraphQL schema auto-generated from database schema

## Key Technical Decisions

**GraphQL API:**
- PostGraphile auto-generates GraphQL from PostgreSQL schema
- Schema-first development: Database DDL is the source of truth
- Built-in DataLoader batching and connection pooling
- Extensibility via custom plugins for business logic

**Database:**
- TimescaleDB hypertables (no FKs, time-first queries)
- PostgreSQL Row-Level Security (RLS) for authorization
- Connection pool: min=5, max=20
- Continuous aggregates for analytics
- Database schemas for domain separation

**Caching:**
- L1: PostGraphile built-in per-request memoization
- L2: Redis plugin for computed fields (15-60min TTL)
- L3: PostgreSQL materialized views for aggregates
- Automatic cache invalidation via database triggers

**Security:**
- JWT authentication via PostGraphile plugin
- Row-Level Security (RLS) in PostgreSQL
- Role-based authorization: VIEWER, OPERATOR, ENGINEER, ADMIN
- Rate limiting: 1000 req/15min, complexity max 1000

**Architecture:**
- Schema-driven, not code-driven
- Database → PostGraphile → GraphQL API
- Custom business logic via PostGraphile plugins
- Domain separation via PostgreSQL schemas

**Maintainability:**
- Plant engineers modify SQL DDL, not resolvers
- Migrations using Flyway or db-migrate
- Type-safe TypeScript client auto-generated from schema
- Minimal custom code, maximum leverage of PostGraphile

**Resilience:**
- Circuit breaker pattern for external calls
- Proper error classification via plugins
- Health checks & monitoring
- Graceful degradation, no process.exit()

## Status Legend
- ✅ Accepted: Implemented or approved
- 📋 Proposed: Under consideration
- ⭐ High Priority Quick Win
- 🔄 Superseded: Replaced by newer decision

## Quick Reference: Current Pain Points → Solutions
- **N+1 queries** → PostGraphile built-in batching (ADR-019)
- **No caching** → Multi-tier: PostGraphile + Redis + Materialized Views (ADR-004)
- **Fat resolvers** → Schema-driven auto-generation (ADR-019)
- **Monolithic schema** → PostgreSQL schema modules (ADR-019)
- **Maintainability** → Schema-first development, SQL DDL not resolvers (ADR-019)
- **No auth** → JWT + RLS + RBAC (ADR-008)
- **process.exit()** → Circuit breaker (ADR-010)
- **Slow dashboards** → Continuous aggregates (ADR-012)
- **Small connection pool** → Increase to 20 (ADR-011)
- **Complex business logic** → Custom PostGraphile plugins (Phase 3)