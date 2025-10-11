# 📊 Production Logs

🏠 [Back to Database Overview](../readme.md)

This section documents the TimescaleDB hypertables used to record real-time production data. These logs support OEE, root-cause analysis, and continuous improvement by tracking asset states, outputs, measurements, and performance.

## 📋 Common Fields

All log tables include these standard fields:

| Field        | Type         | Description                                |
|--------------|--------------|--------------------------------------------|
| `logged_at`  | TIMESTAMPTZ  | Used as the hypertable time dimension      |
| `logged_by`  | TEXT         | Username who created the record            |
| `created_by` | TEXT         | Username who created the record            |
| `created_at` | TIMESTAMPTZ  | When the record was created                |
| `updated_by` | TEXT         | Username who last updated the record       |
| `updated_at` | TIMESTAMPTZ  | When the record was last updated           |
| `removed`    | BOOLEAN      | Soft delete flag (default FALSE)           |

**Note**: Denormalized `_name` columns are **snapshots** at log time - they preserve historical names even if master data is renamed later.

---

## 🔹 `state_log`

Logs every change in asset state, including optional downtime reasons.

| Column                  | Type         | Description                                     |
|-------------------------|--------------|-------------------------------------------------|
| `state_log_id`          | BIGINT       | Primary key (hypertable identity)               |
| `asset_id`              | BIGINT       | FK to `asset_definition`                        |
| `asset_name`            | TEXT         | **Snapshot** of asset name at log time          |
| `state_id`              | BIGINT       | FK to `state_definition`                        |
| `state_name`            | TEXT         | **Snapshot** of state name at log time          |
| `state_type_id`         | BIGINT       | FK to `state_type`                              |
| `state_type_name`       | TEXT         | **Snapshot** of state type name at log time     |
| `from_state_id`         | BIGINT       | Optional link to previous state                 |
| `downtime_reason_id`    | BIGINT       | Optional FK to `downtime_reason`                |
| `downtime_reason_code`  | TEXT         | **Snapshot** of downtime reason code            |
| `downtime_reason_name`  | TEXT         | **Snapshot** of downtime reason name            |
| `additional_info`       | JSONB        | Freeform metadata (e.g., cause codes, notes)    |
| `logged_at`             | TIMESTAMPTZ  | State transition timestamp                      |
| `logged_by`             | TEXT         | Actor username                                  |
| _Audit Columns_         | —            | Includes `created_at`, `updated_at`, `removed`  |

**Indexes:**
- `idx_state_log_asset_logged_at` on `(asset_id, logged_at DESC)`
- `idx_state_log_downtime_reason_id` on `downtime_reason_id`
- `idx_state_log_state_id` on `state_id`

---

## 🔹 `production_log`

Represents an active production run for a specific product and asset.

| Column                  | Type         | Description                                     |
|-------------------------|--------------|-------------------------------------------------|
| `production_log_id`     | BIGINT       | Primary key (hypertable identity)               |
| `asset_id`              | BIGINT       | FK to `asset_definition`                        |
| `asset_name`            | TEXT         | **Snapshot** of asset name at log time          |
| `product_id`            | BIGINT       | FK to `product_definition`                      |
| `product_name`          | TEXT         | **Snapshot** of product name at log time        |
| `product_family_id`     | BIGINT       | FK to `product_family`                          |
| `product_family_name`   | TEXT         | **Snapshot** of product family name             |
| `start_ts`              | TIMESTAMPTZ  | Run start timestamp                             |
| `end_ts`                | TIMESTAMPTZ  | Optional run end timestamp (NULL = active)      |
| `additional_info`       | JSONB        | Extra context (e.g., lot number, operator ID)   |
| `logged_at`             | TIMESTAMPTZ  | Event insertion timestamp                       |
| `logged_by`             | TEXT         | Who created the record                          |
| _Audit Columns_         | —            | Includes `created_at`, `updated_at`, `removed`  |

**Indexes:**
- `idx_production_log_asset_time` on `(asset_id, start_ts)`
- `idx_production_log_product_id` on `product_id`

---

## 🔹 `count_log`

Tracks infeed, outfeed, good parts, scrap, and other production counts.

| Column                  | Type         | Description                                     |
|-------------------------|--------------|-------------------------------------------------|
| `count_log_id`          | BIGINT       | Primary key (hypertable identity)               |
| `asset_id`              | BIGINT       | FK to `asset_definition`                        |
| `asset_name`            | TEXT         | **Snapshot** of asset name at log time          |
| `production_log_id`     | BIGINT       | Optional FK to `production_log` (validated)     |
| `count_type_id`         | BIGINT       | FK to `count_type`                              |
| `count_type_name`       | TEXT         | **Snapshot** of count type name                 |
| `quantity`              | NUMERIC      | Count amount (default 0)                        |
| `product_id`            | BIGINT       | FK to `product_definition`                      |
| `product_name`          | TEXT         | **Snapshot** of product name at log time        |
| `product_family_id`     | BIGINT       | FK to `product_family`                          |
| `product_family_name`   | TEXT         | **Snapshot** of product family name             |
| `additional_info`       | JSONB        | Extra metadata                                  |
| `logged_at`             | TIMESTAMPTZ  | Timestamp of count                              |
| `logged_by`             | TEXT         | Who entered the count                           |
| _Audit Columns_         | —            | Includes `created_at`, `updated_at`, `removed`  |

**Indexes:**
- `idx_count_log_product_id` on `product_id`
- `idx_count_log_production_log_id_logged_at` on `(production_log_id, logged_at)`

---

## 🔹 `measurement_log`

Records quality measurements from the line for process monitoring.

| Column                  | Type         | Description                                     |
|-------------------------|--------------|-------------------------------------------------|
| `measurement_log_id`    | BIGINT       | Primary key (hypertable identity)               |
| `asset_id`              | BIGINT       | FK to `asset_definition`                        |
| `asset_name`            | TEXT         | **Snapshot** of asset name at log time          |
| `product_id`            | BIGINT       | Optional FK to `product_definition`             |
| `product_name`          | TEXT         | **Snapshot** of product name at log time        |
| `product_family_id`     | BIGINT       | FK to `product_family`                          |
| `product_family_name`   | TEXT         | **Snapshot** of product family name             |
| `measurement_type_id`   | BIGINT       | FK to `measurement_type`                        |
| `measurement_type_name` | TEXT         | **Snapshot** of measurement type name           |
| `target_value`          | NUMERIC      | Expected value                                  |
| `actual_value`          | NUMERIC      | Measured value                                  |
| `unit_of_measure`       | TEXT         | Optional unit string (e.g., "mm", "°C")         |
| `tolerance`             | NUMERIC      | Allowed variance (default 0)                    |
| `in_tolerance`          | BOOLEAN      | Was value within target bounds?                 |
| `additional_info`       | JSONB        | Extra metadata                                  |
| `logged_at`             | TIMESTAMPTZ  | Measurement timestamp                           |
| `logged_by`             | TEXT         | Who logged the entry                            |
| _Audit Columns_         | —            | Includes `created_at`, `updated_at`, `removed`  |

**Indexes:**
- `idx_measurement_log_asset_product_type_logged` on `(asset_id, product_id, measurement_type_id, logged_at)`
- `idx_measurement_log_product_type` on `(product_id, measurement_type_id)`

---

## 🔹 `kpi_log`

Captures time-bucketed KPIs such as OEE, availability, performance, or scrap rate.

| Column           | Type         | Description                                     |
|------------------|--------------|-------------------------------------------------|
| `kpi_log_id`     | BIGINT       | Primary key (hypertable identity)               |
| `asset_id`       | BIGINT       | FK to `asset_definition`                        |
| `asset_name`     | TEXT         | **Snapshot** of asset name at log time          |
| `kpi_id`         | BIGINT       | FK to `kpi_definition`                          |
| `kpi_name`       | TEXT         | **Snapshot** of KPI name at log time            |
| `kpi_value`      | NUMERIC      | Calculated KPI value                            |
| `start_ts`       | TIMESTAMPTZ  | Start of KPI time window                        |
| `end_ts`         | TIMESTAMPTZ  | End of KPI time window                          |
| `additional_info`| JSONB        | Extra metadata (e.g., component breakdown)      |
| `logged_at`      | TIMESTAMPTZ  | When this record was logged                     |
| `logged_by`      | TEXT         | Actor who submitted the values                  |
| _Audit Columns_  | —            | Includes `created_at`, `updated_at`, `removed`  |

**Indexes:**
- `idx_kpi_log_asset_kpi_start` on `(asset_id, kpi_id, start_ts)`

---

## ⏱ TimescaleDB Features

All production log tables are **hypertables** with the following configuration:

| Feature         | Setting                                 |
|-----------------|-----------------------------------------|
| Partition Column| `logged_at`                             |
| Chunk Interval  | 1 week                                  |
| Compression     | ✅ Enabled after 3 months               |
| Compression By  | `asset_id` and related dimension columns|
| Retention       | ✅ Auto-delete after 3 years            |

**Benefits:**
- Fast time-range queries (`WHERE logged_at >= NOW() - INTERVAL '1 day'`)
- Automatic compression saves ~90% disk space on old data
- Automatic cleanup of ancient data
- Optimized for high-volume writes

---

## 🔗 Foreign Key Notes

Foreign keys are enforced using **validation triggers** (not native FK constraints) for hypertable-to-hypertable references due to TimescaleDB limitations. Regular table references use native FK constraints.

**Trigger-validated FKs:**
- `count_log.production_log_id` → `production_log.production_log_id`

All other FKs use standard PostgreSQL foreign key constraints.
