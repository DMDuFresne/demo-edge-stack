# 🕵️ Audit Tables Reference

🏠 [Back to Database Overview](../readme.md)

This section documents the tables and functions in the `mes_audit` schema used to track all changes to definitional and lookup tables across the MES system. These tables help ensure compliance, traceability, and accountability.

All audit tables are optimized using TimescaleDB features such as hypertables, compression, and retention.

## 🔐 Schema: `mes_audit`

The schema `mes_audit` is dedicated to tracking audit events across the `mes_core` and `mes_custom` schemas.

## 📋 `change_log`

Primary audit log that stores metadata about every insert, update, or delete event on tracked tables.

| Column             | Type        | Description                                                  |
|--------------------|-------------|--------------------------------------------------------------|
| `audit_id`         | BIGINT      | Surrogate primary key                                        |
| `schema_name`      | TEXT        | Schema name where the change occurred                        |
| `table_name`       | TEXT        | Table name affected                                          |
| `operation`        | TEXT        | One of: `INSERT`, `UPDATE`, `DELETE`                         |
| `record_id`        | TEXT        | Primary key value(s) for the modified row                    |
| `column_changes`   | JSONB       | JSON object of changed columns with old and new values       |
| `changed_by`       | TEXT        | PostgreSQL user who initiated the change                     |
| `changed_at`       | TIMESTAMPTZ | Timestamp of when the change occurred                        |
| `session_username` | TEXT        | Session-level PostgreSQL user                                |
| `application_name` | TEXT        | Name of the connecting client application                    |
| `client_addr`      | INET        | IP address of the client machine                             |

### Notes

- `column_changes` is only populated on `UPDATE` operations.
- The table is a TimescaleDB hypertable partitioned on `changed_at`.
- Includes compression policy (after 3 months) and retention (after 3 years).

## ⚙️ Function: `mes_audit.trgfn_log_change()`

This function is used as a generic audit trigger function across all definitional and lookup tables.

### Behavior

- Collects all primary keys for the row.
- On `UPDATE`, detects which columns changed (excluding audit fields).
- Writes a new row to `mes_audit.change_log`.

### Applied As Trigger

```sql
AFTER INSERT OR UPDATE OR DELETE
ON [table_name]
FOR EACH ROW
EXECUTE FUNCTION mes_audit.trgfn_log_change();
```

## 🧠 Notes

- The audit log supports schema and table-level filtering.
- No FK relationships are defined to the original tables to maintain independence.
- Changes are ordered by `changed_at` for time-series analysis.
- All lookup tables and master definitions (e.g., `asset_type`, `state_type`, `product_definition`) are tracked.

## 🧪 TimescaleDB Configuration

| Property       | Value                        |
|----------------|------------------------------|
| Hypertable     | Yes (`changed_at`)           |
| Compression    | Enabled (`changed_at DESC`)  |
| Retention      | 3 years                      |
| Chunk Interval | 1 month                      |
| Segment By     | `schema_name, table_name`    |

> ➡️ All settings are applied using TimescaleDB native policies and background workers.
