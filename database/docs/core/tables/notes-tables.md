# 📒 Notes Tables Reference

🏠 [Back to Database Overview](../readme.md)

This section describes the note tables in the `mes_core` schema. Each table stores annotations for related logs (1:N). Because TimescaleDB hypertables do not support foreign key constraints, integrity is validated using the dynamic trigger `trgfn_validate_fk()`.

All note tables include:

- `created_by`, `created_at`, `updated_by`, `updated_at`
- `removed` soft delete flag
- `trgfn_set_updated_at()` trigger for audit
- `trgfn_log_change()` trigger for audit trail
- `trgfn_validate_fk()` for referential validation

---

## 📝 `state_log_note`

| Column         | Type        | Description                                         |
|----------------|-------------|-----------------------------------------------------|
| `note_id`      | BIGINT      | Surrogate primary key                               |
| `state_log_id` | BIGINT      | Reference to `state_log` (validated via trigger)    |
| `note`         | TEXT        | Freeform note content                               |
| _Audit Columns_| —           | Created, updated, soft delete fields                |

---

## 📝 `production_log_note`

| Column               | Type        | Description                                         |
|----------------------|-------------|-----------------------------------------------------|
| `note_id`            | BIGINT      | Surrogate primary key                               |
| `production_log_id`  | BIGINT      | Reference to `production_log`                       |
| `note`               | TEXT        | Annotation for the run                              |
| _Audit Columns_      | —           | Standard audit metadata                             |

---

## 📝 `count_log_note`

| Column         | Type        | Description                                         |
|----------------|-------------|-----------------------------------------------------|
| `note_id`      | BIGINT      | Surrogate primary key                               |
| `count_log_id` | BIGINT      | Reference to `count_log`                            |
| `note`         | TEXT        | Commentary on the count event                       |
| _Audit Columns_| —           | Includes audit + `removed`                          |

---

## 📝 `measurement_log_note`

| Column               | Type        | Description                                         |
|----------------------|-------------|-----------------------------------------------------|
| `note_id`            | BIGINT      | Surrogate primary key                               |
| `measurement_log_id` | BIGINT      | Reference to `measurement_log`                      |
| `note`               | TEXT        | Description or observation                          |
| _Audit Columns_      | —           | Created, updated, removed                           |

---

## 📝 `kpi_log_note`

| Column         | Type        | Description                                         |
|----------------|-------------|-----------------------------------------------------|
| `note_id`      | BIGINT      | Surrogate primary key                               |
| `kpi_log_id`   | BIGINT      | Reference to `kpi_log`                              |
| `note`         | TEXT        | KPI-related commentary                              |
| _Audit Columns_| —           | Full audit trail support                            |

---

## 📝 `general_note`

Standalone note table for process observations or non-linked comments.

| Column         | Type        | Description                                         |
|----------------|-------------|-----------------------------------------------------|
| `note_id`      | BIGINT      | Surrogate primary key                               |
| `note`         | TEXT        | Independent comment                                 |
| _Audit Columns_| —           | All metadata fields + soft delete                   |
