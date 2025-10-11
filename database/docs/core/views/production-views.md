# 📊 Production Views Documentation

🏠 [Back to Database Overview](../readme.md)

This documentation details the production-related views within the `mes_core` schema. These views provide clear, structured access to production data, facilitating production run analysis, throughput calculations, yield tracking, and reporting.

---

## 📌 Production Views

### 🔹 `vw_production_log`

Full production log entries with asset and product details.

| Column              | Description                     |
| ------------------- | ------------------------------- |
| `production_log_id` | Production run identifier       |
| `asset_id`          | Asset identifier                |
| `asset_name`        | Asset name                      |
| `product_id`        | Product identifier              |
| `product_name`      | Product name                    |
| `start_ts`          | Production start timestamp      |
| `end_ts`            | Production end timestamp        |
| `total_count`       | Total quantity produced         |
| `additional_info`   | Extra metadata                  |
| `logged_by`         | User who logged entry           |
| `logged_at`         | Timestamp when entry was logged |
| `updated_by`        | User who updated entry          |
| `updated_at`        | Timestamp of last update        |
| `removed`           | Soft delete indicator           |

---

### 🔹 `vw_production_current`

Currently active (open) production logs.

| Column              | Description                       |
| ------------------- | --------------------------------- |
| `production_log_id` | Production run identifier         |
| `asset_id`          | Asset identifier                  |
| `asset_name`        | Asset name                        |
| `product_id`        | Product identifier                |
| `product_name`      | Product name                      |
| `start_ts`          | Production start timestamp        |
| `total_count`       | Total quantity produced (to date) |
| `additional_info`   | Additional metadata               |
| `logged_by`         | User who logged entry             |
| `logged_at`         | Timestamp when entry was logged   |

---

### 🔹 `vw_production_yield`

Yield calculation summary per production log.

| Column              | Description               |
| ------------------- | ------------------------- |
| `production_log_id` | Production run identifier |
| `asset_id`          | Asset identifier          |
| `asset_name`        | Asset name                |
| `product_id`        | Product identifier        |
| `product_name`      | Product name              |
| `good_quantity`     | Quantity considered good  |
| `total_quantity`    | Total quantity produced   |
| `yield_percent`     | Yield percentage          |

---

### 🔹 `vw_production_throughput_rate`

Throughput and performance percentage based on actual vs. ideal production rates.

| Column                 | Description                               |
| ---------------------- | ----------------------------------------- |
| `production_log_id`    | Production run identifier                 |
| `asset_id`             | Asset identifier                          |
| `asset_name`           | Asset name                                |
| `product_id`           | Product identifier                        |
| `product_name`         | Product name                              |
| `ideal_cycle_time`     | Ideal cycle time per unit                 |
| `start_ts`             | Production start timestamp                |
| `end_ts`               | Production end timestamp                  |
| `run_duration_seconds` | Total run duration in seconds             |
| `total_count`          | Total units produced                      |
| `actual_rate`          | Actual production rate (units/second)     |
| `ideal_rate`           | Ideal production rate (units/second)      |
| `performance_percent`  | Performance as a percentage of ideal rate |

---

### 🔹 `vw_production_state_summary`

State category duration summary per production run.

| Column              | Description                              |
| ------------------- | ---------------------------------------- |
| `production_log_id` | Production run identifier                |
| `asset_id`          | Asset identifier                         |
| `asset_name`        | Asset name                               |
| `product_id`        | Product identifier                       |
| `product_name`      | Product name                             |
| `state_type_name`   | State category name                      |
| `duration_seconds`  | Total duration in seconds spent in state |

---

### 🔹 `vw_production_count_summary`

Count summary by type during production runs.

| Column              | Description               |
| ------------------- | ------------------------- |
| `production_log_id` | Production run identifier |
| `asset_id`          | Asset identifier          |
| `asset_name`        | Asset name                |
| `product_id`        | Product identifier        |
| `product_name`      | Product name              |
| `count_type_id`     | Count type identifier     |
| `count_type_name`   | Count type name           |
| `count_type_unit`   | Count unit of measure     |
| `total_quantity`    | Total quantity counted    |

---

### 🔹 `vw_production_measurement_summary`

Measurement summaries per production run.

| Column                  | Description                         |
| ----------------------- | ----------------------------------- |
| `production_log_id`     | Production run identifier           |
| `asset_id`              | Asset identifier                    |
| `asset_name`            | Asset name                          |
| `product_id`            | Product identifier                  |
| `product_name`          | Product name                        |
| `measurement_type_id`   | Measurement type identifier         |
| `measurement_type_name` | Measurement type name               |
| `measurement_type_unit` | Unit of measure                     |
| `sample_count`          | Number of measurement samples taken |
| `avg_actual_value`      | Average actual value measured       |
| `min_actual_value`      | Minimum actual value measured       |
| `max_actual_value`      | Maximum actual value measured       |
