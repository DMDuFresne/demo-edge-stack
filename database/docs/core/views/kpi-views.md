# 📊 KPI Views Documentation

🏠 [Back to Database Overview](../readme.md)

This documentation details the KPI-related views within the `mes_core` schema. These views provide access to both raw and latest key performance indicators, useful for tracking efficiency, availability, and measurement metrics.

---

## 📌 KPI Views

### 🔹 `vw_kpi_latest`

Latest KPI measurement per asset and KPI type.

| Column       | Description                   |
| ------------ | ----------------------------- |
| `asset_id`   | Asset identifier              |
| `asset_name` | Asset name                    |
| `kpi_id`     | KPI definition identifier     |
| `kpi_name`   | KPI name                      |
| `kpi_unit`   | Unit of measure for the KPI   |
| `kpi_value`  | Latest calculated value       |
| `start_ts`   | Start of KPI window           |
| `end_ts`     | End of KPI window             |
| `logged_at`  | Timestamp of latest KPI entry |
| `logged_by`  | User who logged the KPI       |
