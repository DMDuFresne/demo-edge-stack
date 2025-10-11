# 📊 Unified Event Views Documentation

🏠 [Back to Database Overview](../readme.md)

This documentation describes the unified event view within the `mes_core` schema. This view combines multiple log sources into a single timeline, offering a consolidated record of all relevant MES events for an asset.

---

## 📌 Unified View

### 🔹 `vw_unified_event_log`

Unified log combining state, production, count, measurement, and KPI events into a single stream.

**⚠️ Performance Warning:** This view queries 5 hypertables with UNION ALL. Always filter by `logged_at` or `asset_id` to avoid full table scans!

**Example:**
```sql
-- ✅ Good - Filter by time
SELECT * FROM mes_core.vw_unified_event_log
WHERE logged_at >= NOW() - INTERVAL '7 days';

-- ✅ Good - Filter by asset and time
SELECT * FROM mes_core.vw_unified_event_log
WHERE asset_id = 1 AND logged_at >= NOW() - INTERVAL '1 day';

-- ❌ Bad - No filters (scans all 5 tables completely)
SELECT * FROM mes_core.vw_unified_event_log;
```

| Column       | Description                                          |
| ------------ | ---------------------------------------------------- |
| `event_type` | Type of event (`state`, `production`, `count`, etc.) |
| `event_id`   | Identifier of the specific event                     |
| `asset_id`   | Asset identifier                                     |
| `product_id` | Product identifier (if applicable)                   |
| `value`      | Main value or quantity for the event (as text)       |
| `unit`       | Associated unit or KPI/count/measurement label       |
| `start_ts`   | Start timestamp of the event                         |
| `end_ts`     | End timestamp (if applicable)                        |
| `note`       | Optional note or annotation                          |
| `logged_at`  | Timestamp when the event was logged                  |

This view unifies data from the following tables:

* `state_log`
* `production_log`
* `count_log`
* `measurement_log`
* `kpi_log`

It includes related notes when available:

* `state_log_note`
* `production_log_note`
* `count_log_note`
* `measurement_log_note`
* `kpi_log_note`

This view is ideal for:

* Building chronological dashboards
* Investigating event timelines
* Driving external notification or workflow engines
