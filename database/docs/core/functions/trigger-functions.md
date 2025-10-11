# Trigger Functions

[← Back to Database Overview](../../readme.md)

This document describes the trigger functions used in the Abelara MES database system.

## Overview

Trigger functions are used to automate database operations and maintain data integrity. They handle tasks such as:
- Setting audit timestamps
- Logging changes
- Populating descriptive fields
- Validating foreign keys

## Functions

### Audit Functions

#### `trgfn_set_updated_at()`
Sets the `updated_at` timestamp when a record is modified.

**Usage:**
```sql
CREATE TRIGGER trg_set_updated_at
    BEFORE UPDATE ON table_name
    FOR EACH ROW
    EXECUTE FUNCTION trgfn_set_updated_at();
```

#### `trgfn_log_change()`
Logs changes to specified tables in the audit log.

**Usage:**
```sql
CREATE TRIGGER trg_log_change
    AFTER INSERT OR UPDATE OR DELETE ON table_name
    FOR EACH ROW
    EXECUTE FUNCTION trgfn_log_change();
```

### Validation Functions

#### `trgfn_validate_fk()`
Validates foreign key relationships before insert/update operations.

**Usage:**
```sql
CREATE TRIGGER trg_validate_fk
    BEFORE INSERT OR UPDATE ON table_name
    FOR EACH ROW
    EXECUTE FUNCTION trgfn_validate_fk();
```

### Log Population Functions

#### `trgfn_state_log_populate_descriptives()`
Populates descriptive fields in state log entries.

**Usage:**
```sql
CREATE TRIGGER trg_state_log_populate_descriptives
    BEFORE INSERT ON state_log
    FOR EACH ROW
    EXECUTE FUNCTION trgfn_state_log_populate_descriptives();
```

#### `trgfn_production_log_populate_descriptives()`
Populates descriptive fields in production log entries.

**Usage:**
```sql
CREATE TRIGGER trg_production_log_populate_descriptives
    BEFORE INSERT ON production_log
    FOR EACH ROW
    EXECUTE FUNCTION trgfn_production_log_populate_descriptives();
```

#### `trgfn_count_log_populate_descriptives()`
Populates descriptive fields in count log entries.

**Usage:**
```sql
CREATE TRIGGER trg_count_log_populate_descriptives
    BEFORE INSERT ON count_log
    FOR EACH ROW
    EXECUTE FUNCTION trgfn_count_log_populate_descriptives();
```

#### `trgfn_measurement_log_populate_descriptives()`
Populates descriptive fields in measurement log entries.

**Usage:**
```sql
CREATE TRIGGER trg_measurement_log_populate_descriptives
    BEFORE INSERT ON measurement_log
    FOR EACH ROW
    EXECUTE FUNCTION trgfn_measurement_log_populate_descriptives();
```

#### `trgfn_kpi_log_populate_descriptives()`
Populates descriptive fields in KPI log entries.

**Usage:**
```sql
CREATE TRIGGER trg_kpi_log_populate_descriptives
    BEFORE INSERT ON kpi_log
    FOR EACH ROW
    EXECUTE FUNCTION trgfn_kpi_log_populate_descriptives();
```

## Notes

- All trigger functions are created with `CREATE OR REPLACE FUNCTION`
- Functions are designed to be idempotent
- Error handling is implemented to prevent cascading failures
- Performance impact is minimized through efficient querying 