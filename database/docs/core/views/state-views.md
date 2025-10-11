# 📊 State Views Documentation

🏠 [Back to Database Overview](../readme.md)

This documentation details the state-related views within the `mes_core` schema. These views provide clear, structured access to asset state data, useful for operational analysis, downtime tracking, and reporting.

---

## 📌 State Views

### 🔹 `vw_state_timeline`

State timeline detailing durations between state transitions.

| Column              | Description                         |
| ------------------- | ----------------------------------- |
| `state_log_id`      | State log identifier                |
| `asset_id`          | Asset identifier                    |
| `asset_name`        | Asset name                          |
| `state_id`          | State identifier                    |
| `state_name`        | Name of state                       |
| `state_color`       | State color code                    |
| `state_description` | Description of state                |
| `state_type_id`     | State type identifier               |
| `state_type_name`   | State type name                     |
| `is_downtime`       | Indicates if the state was downtime |
| `start_time`        | Timestamp when state started        |
| `end_time`          | Timestamp when state ended          |
| `duration_seconds`  | Duration of state in seconds        |
| `additional_info`   | Additional metadata                 |
| `logged_by`         | User who logged entry               |
| `updated_by`        | User who updated entry              |
| `updated_at`        | Timestamp of last update            |
| `removed`           | Soft delete indicator               |

---

### 🔹 `vw_state_active`

Current active state for each asset.

| Column                 | Description                      |
| ---------------------- | -------------------------------- |
| `asset_id`             | Asset identifier                 |
| `asset_name`           | Asset name                       |
| `state_log_id`         | State log identifier             |
| `state_name`           | Current state name               |
| `state_type_name`      | Current state type               |
| `state_start`          | Start timestamp of current state |
| `downtime_reason_id`   | Downtime reason identifier       |
| `downtime_reason_name` | Name of downtime reason          |
| `is_planned`           | Indicates if downtime is planned |
| `additional_info`      | Extra details                    |
| `logged_by`            | User who logged entry            |

---

### 🔹 `vw_state_duration_hourly`

Summarizes hourly durations spent by assets in each state type.

| Column                   | Description               |
| ------------------------ | ------------------------- |
| `asset_id`               | Asset identifier          |
| `asset_name`             | Asset name                |
| `state_type_name`        | State type                |
| `hour`                   | Hourly time bucket        |
| `total_duration_seconds` | Total duration in seconds |

---

### 🔹 `vw_state_duration_daily`

Summarizes daily durations spent by assets in each state type.

| Column                   | Description               |
| ------------------------ | ------------------------- |
| `asset_id`               | Asset identifier          |
| `asset_name`             | Asset name                |
| `state_type_name`        | State type                |
| `day`                    | Daily time bucket         |
| `total_duration_seconds` | Total duration in seconds |

---

### 🔹 `vw_state_downtime_events`

List of all downtime events including planned and unplanned.

| Column                 | Description                |
| ---------------------- | -------------------------- |
| `state_log_id`         | State log identifier       |
| `asset_id`             | Asset identifier           |
| `asset_name`           | Asset name                 |
| `state_name`           | State name                 |
| `state_type_name`      | State type                 |
| `is_downtime`          | Downtime status            |
| `downtime_reason_id`   | Downtime reason identifier |
| `downtime_reason_code` | Short code for downtime    |
| `downtime_reason_name` | Downtime reason            |
| `is_planned`           | Planned downtime indicator |
| `start_time`           | Downtime start timestamp   |
| `end_time`             | Downtime end timestamp     |
| `duration_seconds`     | Duration of downtime       |
| `additional_info`      | Additional metadata        |
| `logged_by`            | User who logged entry      |
| `updated_by`           | User who updated entry     |
| `updated_at`           | Timestamp of update        |
| `removed`              | Soft delete indicator      |
