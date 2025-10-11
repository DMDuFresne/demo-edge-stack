# MES Database

**For Controls Engineers**: This explains how your production data is stored and organized.

## What's a Database (In Simple Terms)?

Think of a database like an electronic filing cabinet:
- **Tables** = Folders (e.g., "Equipment", "Production Logs", "Alarms")
- **Rows** = Individual records (e.g., one pump, one production run)
- **Columns** = Fields on a form (e.g., equipment name, temperature, timestamp)

**Why TimescaleDB?**
- TimescaleDB is PostgreSQL + time-series superpowers
- Handles millions of sensor readings efficiently
- Automatically compresses old data
- Fast queries for trends ("show me last 24 hours")

## Database Schemas (Organization)

The database is organized into 3 separate schemas (like separate filing cabinets):

### `mes_core` - Main Production Data
Where all your equipment, production logs, and sensor readings live:
- **Master Data**: Equipment definitions, products, performance targets
- **Lookup Tables**: State types, measurement types, downtime reasons
- **Log Tables** (TimescaleDB Hypertables): State changes, production runs, counts, measurements, KPIs
- **Note Tables**: Comments and annotations for log entries

### `mes_audit` - Change Tracking
Automatically tracks every change to your data:
- Who changed what
- When they changed it
- What the old value was
- Stores 3 years of history

### `mes_custom` - Your Customizations
Reserved for project-specific extensions without modifying core schema.

## Key Tables (What You'll Use Most)

### Equipment & Products
- **`asset_definition`** - List of all equipment (pumps, valves, lines)
- **`asset_type`** - Equipment categories (Machine, Line, Cell)
- **`product_definition`** - Products you manufacture
- **`product_family`** - Product groupings

### Real-Time Logs (TimescaleDB Hypertables)
- **`state_log`** - Equipment state changes (Running → Stopped → Alarm)
- **`production_log`** - Production runs (start/end times, which product)
- **`count_log`** - Production counters (parts made, scrap, infeed/outfeed)
- **`measurement_log`** - Quality measurements (weight, temperature, dimensions)
- **`kpi_log`** - Calculated KPIs (OEE, availability, performance)

### Reference Data
- **`state_type`** - State categories (Operating, Downtime, Idle)
- **`state_definition`** - Specific states mapped to categories
- **`downtime_reason`** - Why equipment stopped (Planned Maintenance, Breakdown, etc.)
- **`count_type`** - Types of counts (Good, Scrap, Infeed, Outfeed)
- **`measurement_type`** - Types of measurements (Weight, Length, Temperature)

## Viewing the Database (Hands-On)

**Using pgAdmin** (Web Interface):

1. Open http://localhost:5050 in your browser
2. Login with credentials from your `.env` file
3. Right-click **Servers** → **Register** → **Server**
4. **Connection** tab:
   - Host: `mes-database`
   - Port: `5432`
   - Database: `mes`
   - Username: your `POSTGRES_USER` from `.env`
   - Password: your `POSTGRES_PASSWORD` from `.env`
5. Click **Save**
6. Browse tables under `mes` → `Schemas` → `mes_core` → `Tables`

✅ **You're connected!** You can now explore your data visually.

**Quick Tips:**
- **Master data tables** = equipment and product definitions (change rarely)
- **Log tables** = time-series data (change constantly, compressed automatically)
- **Note tables** = comments linked to specific log entries

## Example Queries (Try These!)

Let's run some queries to see your data in action.

**See all equipment:**
```sql
SELECT
    asset_id,
    asset_name,
    asset_description
FROM mes_core.asset_definition
WHERE removed = FALSE
ORDER BY asset_name;
```

**What this shows:** All active equipment in your system, sorted alphabetically.

**Last 10 state changes:**
```sql
SELECT
    logged_at,
    asset_name,
    state_name,
    state_type_name,
    downtime_reason_name
FROM mes_core.state_log
ORDER BY logged_at DESC
LIMIT 10;
```

**What this shows:** Most recent equipment state changes (Running, Stopped, Alarm, etc.) with timestamps and downtime reasons.

**Current state of all assets:**
```sql
SELECT
    asset_name,
    state_name,
    state_type_name,
    logged_at AS state_since
FROM mes_core.vw_state_active
ORDER BY asset_name;
```

**What this shows:** The current state of every asset—think of it as a real-time dashboard snapshot.

**Production runs today:**
```sql
SELECT
    asset_name,
    product_name,
    start_ts,
    end_ts,
    EXTRACT(EPOCH FROM (end_ts - start_ts)) / 3600 AS runtime_hours
FROM mes_core.production_log
WHERE start_ts >= CURRENT_DATE
ORDER BY start_ts DESC;
```

**What this shows:** All production runs that started today, with calculated runtime in hours.

## Key Database Features (Built-In)

### Automatic Timestamps
Every record automatically gets:
- `created_at` - When the record was first added
- `created_by` - Who/what added it (defaults to database user)
- `updated_at` - When it was last changed
- `updated_by` - Who/what changed it

### Soft Deletes
- Records are never truly deleted (unless you explicitly want to)
- `removed = FALSE` means active
- `removed = TRUE` means logically deleted
- Historical queries still work

### Denormalized Names (Snapshots)
Log tables store both IDs and names:
```sql
-- state_log stores:
asset_id = 5           -- Reference to asset_definition
asset_name = "Pump-101"  -- Snapshot of name at log time
```

**Why?** If you rename equipment later, historical reports show the old name (what it was called at the time).

### TimescaleDB Hypertables
All log tables (`*_log`) are TimescaleDB hypertables:
- **Automatic partitioning** by time (1-week chunks)
- **Compression** after 3 months (saves ~90% space)
- **Retention policy** - auto-delete data older than 3 years
- **Fast time-range queries** - "last 24 hours" is instant

### Audit Trail
Every change to master data is automatically tracked in `mes_audit.change_log`:
- What table was changed
- Which record (by ID)
- What columns changed (old value → new value)
- Who made the change
- When it happened

## Useful Views (Pre-Built Queries)

Views are like saved queries you can run anytime:

### State Monitoring
- **`vw_state_active`** - Current state of each asset
- **`vw_state_timeline`** - State changes with durations calculated
- **`vw_state_downtime_events`** - All downtime events
- **`vw_state_duration_hourly/daily`** - Aggregated state durations

### Production Tracking
- **`vw_production_current`** - Active production runs
- **`vw_production_yield`** - Good vs. scrap by run
- **`vw_production_throughput_rate`** - Actual vs. ideal rates
- **`vw_production_count_summary`** - Counts by type per run

### Performance Metrics
- **`vw_kpi_latest`** - Most recent KPI value per asset
- **`vw_measurement_out_of_tolerance`** - Failed quality checks
- **`vw_unified_event_log`** - All events combined (states, counts, measurements, KPIs)

## Built-In Functions

### Asset Hierarchy
- **`fn_search_asset_ancestors(asset_id)`** - Find all parent assets
- **`fn_search_asset_descendants(asset_id)`** - Find all child assets
- **`fn_get_asset_tree(root_asset_id)`** - Full hierarchy tree

### Validation
- **`fn_assets_without_state()`** - Assets missing state logs
- **`fn_validate_record_exists(table, column, id)`** - Check if FK exists

## For Developers

**Documentation**:
- [Detailed Table Docs](docs/readme.md) - All tables explained with examples
- [Style Guide](style-guide.md) - Naming conventions and best practices
- [Creation Scripts](creation/) - SQL scripts that build the schema
- [DBML Schema](schema.dbml) - Visual database diagram

**Schema Organization**:
- `00-db-init.sql` - Creates schemas, roles, audit system
- `11-core-tables-lookup.sql` - Lookup/reference tables
- `12-core-tables-master.sql` - Master data tables
- `13-core-tables-log.sql` - Time-series log tables
- `15-core-hypertables.sql` - TimescaleDB configuration
- `31-core-functions.sql` - Utility functions
- `41-core-views.sql` - Pre-built views

**Making Changes**:
1. Never modify creation scripts directly (they're "gospel")
2. Create new migration scripts for changes
3. Update DBML schema diagram
4. Document in relevant docs
5. Test thoroughly!

## Common Questions

**Q: Why are table names not prefixed?**
A: The schema provides the namespace (`mes_core.state_log`). No need for `lk_state_type` when it's `mes_core.state_type`.

**Q: Can I delete old data?**
A: Yes, but you don't need to! TimescaleDB compression and retention policies handle this automatically. Data older than 3 years is auto-deleted.

**Q: What if I rename equipment?**
A: No problem! New logs use the new name, but historical logs keep the old name (snapshot). This is intentional.

**Q: How do I add custom tables?**
A: Create them in the `mes_custom` schema to keep them separate from core tables.

**Q: What's a hypertable?**
A: Think of it like a supercharged table that automatically splits data by time and compresses old chunks. You use it exactly like a normal table.

## Performance Tips

1. **Always filter by time** on log tables:
   ```sql
   WHERE logged_at >= NOW() - INTERVAL '1 day'
   ```

2. **Use views** instead of writing complex joins

3. **Check if asset exists before logging:**
   ```sql
   SELECT fn_assets_without_state();
   ```

4. **Monitor table sizes:**
   ```sql
   SELECT * FROM timescaledb_information.hypertables;
   ```

## Learning Resources

**New to PostgreSQL?**
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)

**New to TimescaleDB?**
- [TimescaleDB Docs](https://docs.timescale.com/)
- [Getting Started Guide](https://docs.timescale.com/getting-started/latest/)

**Understanding the Schema?**
- [DBML Diagram](https://dbdiagram.io/) - Paste our schema.dbml to visualize
- [Detailed Docs](docs/readme.md) - Deep dive into each table

---

**Remember**: This is a Proof-of-Concept database. The goal is to learn how industrial data can be structured and queried efficiently!
