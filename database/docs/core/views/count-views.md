# 📊 Count Views Documentation

🏠 [Back to Database Overview](../readme.md)

This documentation details the count-related views within the `mes_core` schema. These views provide structured access to production count data, facilitating count analysis, hourly and daily summaries, and delta tracking.

---

## 📌 Count Views

### 🔹 `vw_count_log`

Raw count events linked to production runs.

| Column              | Description                               |
| ------------------- | ----------------------------------------- |
| `count_log_id`      | Unique identifier for the count log entry |
| `asset_id`          | Asset identifier                          |
| `asset_name`        | Asset name                                |
| `production_log_id` | Associated production run identifier      |
| `count_type_id`     | Count type identifier                     |
| `count_type_name`   | Count type name                           |
| `count_type_unit`   | Unit of measure for the count             |
| `quantity`          | Quantity counted                          |
| `product_id`        | Product identifier                        |
| `product_name`      | Product name                              |
| `logged_by`         | User who logged entry                     |
| `logged_at`         | Timestamp when entry was logged           |
| `updated_by`        | User who updated entry                    |
| `updated_at`        | Timestamp of last update                  |
| `removed`           | Soft delete indicator                     |

---

### 🔹 `vw_count_summary_by_type_hourly`

Hourly summary of counts by type and asset.

| Column            | Description                            |
| ----------------- | -------------------------------------- |
| `asset_id`        | Asset identifier                       |
| `asset_name`      | Asset name                             |
| `product_id`      | Product identifier                     |
| `product_name`    | Product name                           |
| `count_type_id`   | Count type identifier                  |
| `count_type_name` | Count type name                        |
| `count_type_unit` | Count unit of measure                  |
| `hour`            | Hourly time bucket                     |
| `total_quantity`  | Total quantity counted within the hour |

---

### 🔹 `vw_count_summary_by_type_daily`

Daily summary of counts by type and asset.

| Column            | Description                           |
| ----------------- | ------------------------------------- |
| `asset_id`        | Asset identifier                      |
| `asset_name`      | Asset name                            |
| `product_id`      | Product identifier                    |
| `product_name`    | Product name                          |
| `count_type_id`   | Count type identifier                 |
| `count_type_name` | Count type name                       |
| `count_type_unit` | Count unit of measure                 |
| `day`             | Daily time bucket                     |
| `total_quantity`  | Total quantity counted within the day |

---

### 🔹 `vw_count_by_production`

Summarizes counts by production run.

| Column              | Description                           |
| ------------------- | ------------------------------------- |
| `production_log_id` | Production run identifier             |
| `asset_id`          | Asset identifier                      |
| `asset_name`        | Asset name                            |
| `product_id`        | Product identifier                    |
| `product_name`      | Product name                          |
| `count_type_id`     | Count type identifier                 |
| `count_type_name`   | Count type name                       |
| `count_type_unit`   | Count unit of measure                 |
| `total_quantity`    | Total quantity counted during the run |

---

### 🔹 `vw_count_delta_by_type`

Calculates the delta between consecutive count values.

| Column            | Description                  |
| ----------------- | ---------------------------- |
| `asset_id`        | Asset identifier             |
| `asset_name`      | Asset name                   |
| `count_type_id`   | Count type identifier        |
| `count_type_name` | Count type name              |
| `count_type_unit` | Count unit of measure        |
| `logged_at`       | Timestamp of the count event |
| `quantity`        | Quantity counted             |
| `quantity_delta`  | Delta from previous count    |
