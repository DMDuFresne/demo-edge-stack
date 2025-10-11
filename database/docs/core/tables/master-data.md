# 📦 Master Data Reference

🏠 [Back to Database Overview](../readme.md)

This section describes the foundational master data used in the Open MES schema. These tables define the structure of assets and products and serve as the contextual backbone for runtime logs, measurement records, and KPIs.

All master data tables include full audit metadata:

- `created_by`, `created_at`
- `updated_by`, `updated_at`
- `removed` (soft delete)

---

## 🔹 `asset_definition`

Represents physical or logical assets in a hierarchical structure. Assets may be nested under other assets.

| Column              | Type     | Description                                                  |
|---------------------|----------|--------------------------------------------------------------|
| `asset_id`          | BIGINT   | Primary key                                                  |
| `asset_name`        | TEXT     | Human-readable label for the asset                           |
| `asset_description` | TEXT     | Longer description                                           |
| `asset_type_id`     | BIGINT   | FK to `asset_type`                                           |
| `parent_asset_id`   | BIGINT   | Optional self-reference for hierarchy                        |
| `tag_path`          | TEXT     | Optional SCADA/PLC tag reference                             |
| _Audit Columns_     | —        | See above                                                    |

Example structure: `Enterprise` → `Site` → `Area` → `Line` → `Cell` → `Equipment`

---

## 🔹 `product_family`

Groups multiple related products under a single category.

| Column                      | Type     | Description                                  |
|-----------------------------|----------|----------------------------------------------|
| `product_family_id`         | BIGINT   | Primary key                                  |
| `product_family_name`       | TEXT     | Unique family label                          |
| `product_family_description`| TEXT     | Optional long-form description               |
| _Audit Columns_             | —        | See above                                    |

---

## 🔹 `product_definition`

Defines a specific manufactured product.

| Column               | Type          | Description                                        |
|----------------------|---------------|----------------------------------------------------|
| `product_id`         | BIGINT        | Primary key                                        |
| `product_name`       | TEXT          | Product display name                               |
| `product_description`| TEXT          | Description of the product                         |
| `product_family_id`  | BIGINT        | FK to `product_family`                             |
| `unit_of_measure`    | TEXT          | Unit of production (e.g., `lbs.`, `each`)          |
| `tolerance`          | NUMERIC(5,4)  | Allowed tolerance for measurement checks              |
| `ideal_cycle_time`   | NUMERIC(10,2) | Ideal time per unit in seconds                     |
| _Audit Columns_      | —             | See above                                          |

---

## 🔹 `performance_target`

Overrides default cycle time for specific product and asset pairings.

| Column           | Type          | Description                                           |
|------------------|---------------|-------------------------------------------------------|
| `product_id`     | BIGINT        | FK to `product_definition`                            |
| `asset_id`       | BIGINT        | FK to `asset_definition`                              |
| `target_value`   | NUMERIC(10,2) | Ideal cycle time override for the product on asset    |
| `target_unit`    | TEXT          | Optional unit (e.g., `sec/unit`, `units/hr`)          |
| _Audit Columns_  | —             | See above                                             |

Primary Key: Composite (`product_id`, `asset_id`)
