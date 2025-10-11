# 📏 Database Style Guide

**For Developers**: Standards and best practices for the Abelara MES database.

## 🎯 Design Philosophy

This database follows **time-series best practices** for industrial MES systems:

1. **Schema-based organization** - Separate namespaces for core, audit, and custom
2. **Denormalized logs** - Snapshot descriptive names for historical accuracy
3. **TimescaleDB optimization** - Hypertables, compression, retention policies
4. **Soft deletes** - Never lose historical data
5. **Automatic auditing** - Track all changes to master data

**Remember**: These are **gospel** - don't deviate without good reason!

---

## 🏗️ Schema Organization

### Three Schemas

```sql
mes_core    -- Main production data (equipment, logs, KPIs)
mes_audit   -- Automatic change tracking
mes_custom  -- Project-specific customizations
```

**Intent & Separation:**

- **`mes_core`** = The "gospel" - Universal MES schema that works for any manufacturing operation
  - Designed to handle 80% of all manufacturing use cases
  - Can be version-controlled and upgraded independently
  - Never modified per-project (treat as read-only in production)
  - Safe to drop and recreate during upgrades

- **`mes_custom`** = Your playground - Project-specific extensions
  - Customer-specific fields, tables, and logic
  - Industry-specific requirements (pharma validation, food safety, etc.)
  - Custom KPIs unique to this facility
  - Persists across core schema upgrades
  - If `mes_core` gets updated to v2.0, `mes_custom` stays intact

**Why This Matters:**

Imagine you have 5 manufacturing sites. Each runs the same `mes_core` schema, but:
- **Site A (Food)**: Adds `mes_custom.allergen_tracking`
- **Site B (Pharma)**: Adds `mes_custom.batch_validation`
- **Site C (Auto)**: Adds `mes_custom.paint_booth_logs`

When you release `mes_core` v2.0 with bug fixes:
- All 5 sites upgrade core schema (safe, tested, standard)
- Each site keeps their custom tables untouched
- No risk of breaking site-specific logic

**Rule of Thumb:**
- If it applies to ALL manufacturing → `mes_core`
- If it's specific to THIS project → `mes_custom`

**Never** put custom tables in `mes_core`. Keep core clean and portable!

### Schema Prefixing

All tables are schema-qualified:
```sql
✅ mes_core.state_log
✅ mes_audit.change_log
✅ mes_custom.custom_report

❌ lk_state_type  (Old style - don't do this)
❌ public.asset   (Don't use public schema)
```

---

## 🏷️ Naming Conventions

### Table Names
- **snake_case** always
- **Descriptive** and **singular** for entities, **plural** for collections
- **Suffix `_log`** for time-series tables
- **Suffix `_note`** for annotation tables

```sql
✅ asset_definition
✅ state_log
✅ state_log_note
✅ product_family

❌ AssetDefinition   (No CamelCase)
❌ assets            (Entity tables are singular)
❌ state_logs        (Log tables use singular_log)
❌ lk_state_type     (No prefixes - use schema instead)
```

### Column Names
- **snake_case** always
- **Descriptive** - include context
- **Consistent** across related tables
- **ID columns** match table name + `_id`

```sql
✅ asset_id
✅ asset_name
✅ logged_at
✅ downtime_reason_code

❌ id               (Too generic)
❌ assetId          (No camelCase)
❌ asset_name_1     (No numbers)
```

### Standard Audit Columns

**Every table** gets these:

```sql
created_by   TEXT DEFAULT CURRENT_USER,
created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
updated_by   TEXT,
updated_at   TIMESTAMPTZ,
removed      BOOLEAN DEFAULT FALSE
```

**Ordering**: Always last in table definition.

### Index Names

```sql
idx_{table}_{columns}              -- Regular index
idx_{table}_unique_{columns}        -- Unique index (partial or full)
```

Examples:
```sql
CREATE INDEX idx_state_log_asset_logged_at
ON state_log(asset_id, logged_at);

CREATE UNIQUE INDEX idx_production_log_unique_asset_open
ON production_log (asset_id)
WHERE end_ts IS NULL;
```

**No** `pk_`, `fk_`, `uq_` prefixes - let PostgreSQL auto-name PKs/FKs.

---

## 📊 Table Design Standards

### Primary Keys

Always use **BIGINT** with **IDENTITY**:

```sql
✅ asset_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY

❌ id SERIAL PRIMARY KEY          (Don't use SERIAL)
❌ asset_id BIGSERIAL PRIMARY KEY (Don't use BIGSERIAL)
```

**Why BIGINT?** IIoT systems generate massive data. Better safe than sorry.

### Foreign Keys

Use **actual foreign key constraints** (not triggers) when possible:

```sql
✅ asset_id BIGINT NOT NULL REFERENCES asset_definition(asset_id)

❌ asset_id BIGINT NOT NULL  -- Missing FK constraint
```

**Exception**: Hypertable-to-hypertable FKs (like `count_log.production_log_id`) use validation triggers due to TimescaleDB limitations.

### Data Types

| Use Case | Type | Notes |
|----------|------|-------|
| Text | `TEXT` | Never `VARCHAR(n)` |
| Timestamps | `TIMESTAMPTZ` | Always with timezone |
| Booleans | `BOOLEAN` | Never `CHAR(1)` or `INT` |
| Decimals | `NUMERIC(p,s)` | For money, precise measurements |
| JSON | `JSONB` | Never plain `JSON` |
| IP Addresses | `INET` | Built-in validation |

```sql
✅ asset_name TEXT NOT NULL
✅ logged_at TIMESTAMPTZ NOT NULL
✅ removed BOOLEAN DEFAULT FALSE
✅ tolerance NUMERIC(5,4)

❌ asset_name VARCHAR(255)    (TEXT is better)
❌ logged_at TIMESTAMP         (Missing timezone)
❌ removed CHAR(1)             (Use BOOLEAN)
```

### Constraints

Always add:
- **NOT NULL** for required fields
- **DEFAULT** values where sensible
- **CHECK** constraints for validation
- **UNIQUE** where needed

```sql
✅ state_type_color TEXT NOT NULL DEFAULT '#D5D5D5'
✅ tolerance NUMERIC(5,4) DEFAULT 0 CHECK (tolerance >= 0)
✅ state_type_name TEXT NOT NULL UNIQUE

❌ state_type_color TEXT  -- Missing NOT NULL and DEFAULT
❌ tolerance NUMERIC       -- Missing precision and CHECK
```

---

## 🕐 TimescaleDB Standards

### Creating Hypertables

All `*_log` tables are hypertables:

```sql
SELECT create_hypertable(
    'mes_core.state_log',
    'logged_at',
    chunk_time_interval => INTERVAL '1 week',
    if_not_exists => TRUE
);
```

**Standard chunk interval**: **1 week** for all log tables.

### Compression Policies

```sql
ALTER TABLE mes_core.state_log
SET (
    timescaledb.compress = true,
    timescaledb.compress_segmentby = 'asset_id',
    timescaledb.compress_orderby = 'logged_at DESC'
);

SELECT add_compression_policy('mes_core.state_log', INTERVAL '3 months');
```

**Standard**: Compress after **3 months**.

### Retention Policies

```sql
SELECT add_retention_policy('mes_core.state_log', INTERVAL '3 years');
```

**Standard**: Retain for **3 years**, then auto-delete.

---

## 📈 Indexing Strategy

### Always Index

1. **Foreign key columns**
2. **Time columns** on hypertables
3. **Frequently filtered columns**
4. **Join columns**

```sql
-- FK index
CREATE INDEX idx_state_log_asset_id ON state_log(asset_id);

-- Time + FK composite (common query pattern)
CREATE INDEX idx_state_log_asset_logged_at
ON state_log(asset_id, logged_at DESC);

-- Lookup column
CREATE INDEX idx_state_log_state_id ON state_log(state_id);
```

### Partial Unique Indexes

Use for **logical uniqueness** with soft deletes:

```sql
-- Only ONE active production run per asset
CREATE UNIQUE INDEX idx_production_log_unique_asset_open
ON production_log (asset_id)
WHERE end_ts IS NULL AND removed IS DISTINCT FROM TRUE;
```

---

## ⚙️ Functions & Triggers

### Naming

```sql
fn_*        -- Regular functions
trgfn_*     -- Trigger functions
trg_*       -- Triggers themselves
```

Examples:
```sql
CREATE FUNCTION fn_search_asset_ancestors(...)
CREATE FUNCTION trgfn_set_updated_at()
CREATE TRIGGER trg_state_log_updated_at
```

### Trigger Structure

```sql
CREATE TRIGGER trg_{table}_{purpose}
BEFORE/AFTER {operation} ON {table}
FOR EACH ROW
[WHEN (condition)]
EXECUTE FUNCTION trgfn_{function_name}();
```

Examples:
```sql
CREATE TRIGGER trg_state_log_updated_at
BEFORE UPDATE ON state_log
FOR EACH ROW
WHEN (OLD IS DISTINCT FROM NEW)
EXECUTE FUNCTION trgfn_set_updated_at();
```

### Function Best Practices

```sql
CREATE OR REPLACE FUNCTION fn_validate_record_exists(
    table_name TEXT,
    column_name TEXT,
    record_id BIGINT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE  -- ← Optimization hint
AS $$
DECLARE
    exists_flag BOOLEAN;
BEGIN
    -- Clear logic
    -- Good error messages
    RETURN exists_flag;
END;
$$;

COMMENT ON FUNCTION fn_validate_record_exists IS
    'Validates that a given record_id exists in the specified table and column.';
```

**Always**:
- Add function comments
- Use parameter validation
- Return consistent types
- Handle edge cases

---

## 👁️ Views

### Naming

```sql
vw_*                 -- Regular views
cagg_*               -- Continuous aggregates (TimescaleDB)
mv_*                 -- Materialized views
```

Examples:
```sql
CREATE VIEW vw_state_active AS ...
CREATE MATERIALIZED VIEW cagg_state_duration_hourly WITH (timescaledb.continuous) AS ...
```

### View Standards

```sql
CREATE OR REPLACE VIEW mes_core.vw_state_active AS
SELECT DISTINCT ON (sl.asset_id)
    sl.asset_id,
    sl.asset_name,
    sl.state_name,
    sl.logged_at AS state_since
FROM mes_core.state_log sl
WHERE sl.removed IS DISTINCT FROM TRUE
ORDER BY sl.asset_id, sl.logged_at DESC;

COMMENT ON VIEW mes_core.vw_state_active IS
    'Returns the current (most recent) state for each asset.';
```

**Always**:
- Schema-qualify all table references
- Add view comments
- Filter out `removed = TRUE` records
- Use clear column aliases

---

## 📝 Documentation Standards

### SQL File Headers

```sql
-- ===============================================================
-- File: 13-core-tables-log.sql
-- Description: Core event logging tables (hypertables)
--
-- Author(s):
-- -- Dylan DuFresne
-- ===============================================================

SET search_path TO mes_core;
```

### Table Comments

```sql
COMMENT ON TABLE mes_core.state_log IS
    'Logs asset state transitions, tracking the state type and time.';

COMMENT ON COLUMN mes_core.state_log.asset_name IS
    'Snapshot of the asset name at time of state change.';
```

**Always** comment:
- Tables (purpose)
- Complex columns (especially denormalized snapshots)
- Views (what they show)
- Functions (what they do)

---

## 🔒 Security Standards

### Roles

```sql
mes_user  -- Application role (read/write to mes_core, mes_custom)
```

Never use superuser for applications!

### Permissions

```sql
-- Grant on existing objects
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA mes_core TO mes_user;

-- Grant on future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA mes_core
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO mes_user;
```

---

## 🎨 Formatting Standards

### SQL Formatting

```sql
-- ✅ Good formatting
SELECT
    asset_id,
    asset_name,
    logged_at
FROM mes_core.state_log
WHERE asset_id = 1
  AND logged_at >= NOW() - INTERVAL '1 day'
  AND removed IS DISTINCT FROM TRUE
ORDER BY logged_at DESC
LIMIT 100;

-- ❌ Bad formatting
select asset_id,asset_name from mes_core.state_log where asset_id=1 and logged_at>=now()-interval '1 day' limit 100;
```

**Rules**:
- **Keywords**: UPPERCASE
- **Identifiers**: lowercase
- **Indentation**: 4 spaces (not tabs)
- **Line length**: Max 120 characters
- **Alignment**: Align ON, AND, OR vertically

### Comments

```sql
-- Single-line comment

/*
 * Multi-line comment
 * for complex explanations
 */
```

---

## ✅ Code Review Checklist

Before committing:

- [ ] Schema-qualified table names (`mes_core.*`)
- [ ] Standard audit columns present
- [ ] Foreign keys defined (where possible)
- [ ] Indexes on FK and time columns
- [ ] Table/column comments added
- [ ] NOT NULL constraints appropriate
- [ ] DEFAULT values set
- [ ] CHECK constraints for validation
- [ ] Soft delete (`removed`) implemented
- [ ] TimescaleDB policies configured (compression, retention)
- [ ] Views filter `removed IS DISTINCT FROM TRUE`
- [ ] DBML schema updated
- [ ] Documentation updated

---

## 🚀 Common Patterns

### Denormalized Snapshots

```sql
-- Log tables store both ID and name
CREATE TABLE state_log (
    asset_id BIGINT NOT NULL REFERENCES asset_definition(asset_id),
    asset_name TEXT NOT NULL,  -- ← Snapshot at log time
    ...
);

-- Trigger populates snapshot
CREATE OR REPLACE FUNCTION trgfn_state_log_populate_descriptives()
RETURNS TRIGGER AS $$
BEGIN
    SELECT asset_name INTO NEW.asset_name
    FROM asset_definition WHERE asset_id = NEW.asset_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE;
```

### Soft Deletes

```sql
-- All tables have removed column
removed BOOLEAN DEFAULT FALSE

-- Queries always filter
WHERE removed IS DISTINCT FROM TRUE

-- "Delete" = UPDATE
UPDATE asset_definition SET removed = TRUE WHERE asset_id = 1;
```

### Automatic Timestamps

```sql
CREATE OR REPLACE FUNCTION trgfn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    NEW.updated_by := CURRENT_USER;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE TRIGGER trg_{table}_updated_at
BEFORE UPDATE ON {table}
FOR EACH ROW
WHEN (OLD IS DISTINCT FROM NEW)
EXECUTE FUNCTION trgfn_set_updated_at();
```

---

## 📚 References

- [TimescaleDB Best Practices](https://docs.timescale.com/use-timescale/latest/schema-management/)
- [PostgreSQL Style Guide](https://www.postgresql.org/docs/current/sql-syntax.html)
- [ISA-95 Standard](https://www.isa.org/standards-and-publications/isa-standards/isa-standards-committees/isa95) - Manufacturing operations hierarchy

---

**Remember**: These standards ensure consistency, performance, and maintainability. When in doubt, look at existing code!
