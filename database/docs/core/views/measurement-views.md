# 📊 Measurement Views Documentation

🏠 [Back to Database Overview](../readme.md)

This documentation details the measurement-related views within the `mes_core` schema. These views support measurement analysis by exposing raw measurement data, summary statistics, and exception reporting.

---

## 📌 Measurement Views

### 🔹 `vw_measurement_summary_by_product`

Summarizes measurement metrics per product and measurement type.

| Column                  | Description                 |
| ----------------------- | --------------------------- |
| `product_id`            | Product identifier          |
| `product_name`          | Product name                |
| `measurement_type_id`   | Measurement type identifier |
| `measurement_type_name` | Measurement type name       |
| `measurement_type_unit` | Measurement unit of measure |
| `sample_count`          | Number of measurement samples   |
| `avg_actual_value`      | Average measured value      |
| `min_actual_value`      | Minimum measured value      |
| `max_actual_value`      | Maximum measured value      |

---

### 🔹 `vw_measurement_out_of_tolerance`

Identifies measurement events where actual value was out of tolerance.

| Column                  | Description                                 |
| ----------------------- | ------------------------------------------- |
| `measurement_log_id`    | Unique identifier for the measurement entry |
| `asset_id`              | Asset identifier                            |
| `asset_name`            | Asset name                                  |
| `product_id`            | Product identifier                          |
| `product_name`          | Product name                                |
| `measurement_type_id`   | Measurement type identifier                 |
| `measurement_type_name` | Measurement type name                       |
| `measurement_type_unit` | Measurement unit of measure                 |
| `target_value`          | Target value for measurement                |
| `actual_value`          | Actual value recorded                       |
| `tolerance`             | Tolerance range for measurement             |
| `unit_of_measure`       | Optional override for unit label            |
| `in_tolerance`          | FALSE or NULL if out of tolerance           |
| `logged_by`             | User who logged entry                       |
| `logged_at`             | Timestamp of logging                        |
| `additional_info`       | Additional context                          | 