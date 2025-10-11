# 📂 Lookup Tables Reference

🏠 [Back to Database Overview](../readme.md)

This reference documents the lookup tables in the `mes_core` schema. These tables define enumerations, codes, and classifications referenced by production, measurement, and logging events.

All tables include full audit metadata:

- `created_by`, `created_at`
- `updated_by`, `updated_at`
- `removed` (soft delete)

---

## 🔹 `asset_type`

Describes classifications for assets in the system (e.g., enterprise hierarchy).

| Column                   | Type          | Description                               |
|--------------------------|---------------|-------------------------------------------|
| `asset_type_id`          | BIGINT        | Primary key                               |
| `asset_type_name`        | TEXT UNIQUE   | Asset type name                           |
| `asset_type_description` | TEXT          | Description of asset type                 |
| _Audit Columns_          | —             | See above                                 |

---

## 🔹 `state_type`

Defines categories of machine or asset states.

| Column                   | Type        | Description                                 |
|--------------------------|-------------|---------------------------------------------|
| `state_type_id`          | BIGINT      | Primary key                                 |
| `state_type_name`        | TEXT UNIQUE | Name of the state type                      |
| `state_type_description` | TEXT        | Description of the state type               |
| `state_type_color`       | TEXT        | HEX color code for UI                       |
| `is_downtime`            | BOOLEAN     | True if this state type indicates downtime  |
| _Audit Columns_          | —           | See above                                   |

---

## 🔹 `state_definition`

Defines the actual named states used in logging, tied to a `StateType`.

| Column                | Type    | Description                                |
|-----------------------|---------|--------------------------------------------|
| `state_id`            | BIGINT  | Primary key                                |
| `state_type_id`       | BIGINT  | FK to `state_type`                         |
| `state_name`          | TEXT    | State label (e.g., `Running`, `Blocked`)   |
| `state_description`   | TEXT    | Human-readable explanation                 |
| `state_color`         | TEXT    | UI visualization color                     |
| _Audit Columns_       | —       | See above                                  |

---

## 🔹 `downtime_reason`

Enumerates reasons for planned or unplanned downtime.

| Column                        | Type    | Description                                |
|-------------------------------|---------|--------------------------------------------|
| `downtime_reason_id`          | BIGINT  | Primary key                                |
| `downtime_reason_code`        | TEXT    | Short code (e.g., `PM`, `FAIL_CTRL`)       |
| `downtime_reason_name`        | TEXT    | Name for reporting                         |
| `downtime_reason_description` | TEXT    | Detailed description                       |
| `is_planned`                  | BOOLEAN | True if planned downtime                   |
| _Audit Columns_               | —       | See above                                  |

---

## 🔹 `count_type`

Defines types of production counts.

| Column                   | Type     | Description                                |
|--------------------------|----------|--------------------------------------------|
| `count_type_id`          | BIGINT   | Primary key                                |
| `count_type_name`        | TEXT     | Name (e.g., `Infeed`, `Waste`)             |
| `count_type_description` | TEXT     | Explanation                                |
| `count_type_unit`        | TEXT     | Unit of measure (e.g., `units`, `kg`)      |
| _Audit Columns_          | —        | See above                                  |

---

## 🔹 `measurement_type`

Types of process measurements.

| Column                         | Type     | Description                                |
|--------------------------------|----------|--------------------------------------------|
| `measurement_type_id`          | BIGINT   | Primary key                                |
| `measurement_type_name`        | TEXT     | Name (e.g., `Weight`, `Temperature`)       |
| `measurement_type_description` | TEXT     | Full description                           |
| `measurement_type_unit`        | TEXT     | Unit of measure (e.g., `mm`, `°C`)         |
| _Audit Columns_                | —        | See above                                  |

---

## 🔹 `kpi_definition`

Key Performance Indicators definitions.

| Column             | Type     | Description                                |
|--------------------|----------|--------------------------------------------|
| `kpi_id`           | BIGINT   | Primary key                                |
| `kpi_name`         | TEXT     | Unique name (e.g., `OEE`, `ScrapRate`)     |
| `kpi_description`  | TEXT     | Description of what is measured            |
| `kpi_unit`         | TEXT     | Unit of measure (e.g., `%`, `units/hr`)    |
| `kpi_formula`      | TEXT     | Optional expression or calculation         |
| _Audit Columns_    | —        | See above                                  |
