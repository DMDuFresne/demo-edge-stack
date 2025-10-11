# Validation Functions

[← Back to Database Overview](../../readme.md)

This document describes the validation functions used in the Abelara MES database system.

## Overview

Validation functions ensure data integrity by checking:
- Record existence
- Foreign key relationships
- Data type constraints
- Business rules

## Functions

### Record Validation

#### `fn_validate_record_exists(table_name text, id bigint)`
Validates that a record exists in the specified table.

**Parameters:**
- `table_name`: Name of the table to check
- `id`: Record identifier to validate

**Returns:**
- `boolean`: True if record exists, false otherwise

**Usage:**
```sql
SELECT fn_validate_record_exists('asset', 123);
```

### Foreign Key Validation

#### `trgfn_validate_fk()`
Trigger function that validates foreign key relationships before insert/update operations.

**Usage:**
```sql
CREATE TRIGGER trg_validate_fk
    BEFORE INSERT OR UPDATE ON table_name
    FOR EACH ROW
    EXECUTE FUNCTION trgfn_validate_fk();
```

## Notes

- Validation functions are used in triggers and constraints
- Functions include proper error handling
- Performance is optimized for frequent validation checks
- Validation results are cached where appropriate 