# 🧠 Function Reference: Asset Utilities

🏠 [Back to Database Overview](../readme.md)

This section documents utility functions related to assets in the mes_core schema.

## 🔁 Ancestors: `fn_search_asset_ancestors(target_asset_id, max_level DEFAULT 10)`

Recursively returns the parent chain for a given asset, starting from the asset and walking up through its `parent_asset_id`.

### 🔧 Example: Ancestors

```sql
SELECT * FROM mes_core.fn_search_asset_ancestors(42);
```

Returns all ancestors of asset 42, up to 10 levels deep.

#### 📌 Use Cases: Ancestors

- Display full context path in UI (e.g., "Enterprise > Site > Line > Equipment")
- Validate asset hierarchy
- Filter production dashboards by plant/site/area using inherited scope

## 🔁 Descendants: `fn_search_asset_descendants(target_asset_id, max_level DEFAULT 10)`

Recursively returns all child assets of the specified asset, including nested equipment.

### 🔧 Example: Descendants

```sql
SELECT * FROM mes_core.fn_search_asset_descendants(3);
```

Fetches all levels of children under asset 3 (e.g., a Line), including Cells and Equipment.

### 📌 Use Cases: Descendants

- Populate dropdowns or tree menus dynamically
- Limit analytics queries to only the assets under a selected scope
- Aggregate KPIs across all machines under a line or area

## 🌳 Tree: `fn_get_asset_tree(root_asset_id, max_level DEFAULT 10)`

Returns a full flattened tree of all assets under a root asset (inclusive), with level tracking.

### 🔧 Example: Asset Tree

```sql
SELECT * FROM mes_core.fn_get_asset_tree(1);
```

Generates the entire tree under enterprise or site ID 1.

### 📌 Use Cases: Asset Tree

- Render nested asset trees (e.g., Accordion or Tree components)
- Generate breadcrumbs or path selectors
- Structure multi-level asset reports with indentation or grouping by `level`

## 🔍 Validation: `fn_assets_without_state()`

Returns assets that have no state log entries. Useful for identifying newly created assets that need initial state setup.

### 🔧 Example: Assets Without State

```sql
SELECT * FROM mes_core.fn_assets_without_state();
```

Returns all assets that have never had a state logged.

### 📌 Use Cases: Assets Without State

- Validate data after creating new assets
- Identify assets that need initial state configuration
- Quality assurance checks for MES setup
- Onboarding checklists for new equipment
