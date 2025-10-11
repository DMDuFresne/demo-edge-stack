# Example GraphQL Queries

Test these queries in the GraphQL Playground at http://localhost:4000/graphql

## Lookup Tables

### Get All Asset Types
```graphql
query {
  assetTypes(removed: false) {
    asset_type_id
    asset_type_name
    asset_type_description
  }
}
```

### Get All State Types and Definitions
```graphql
query {
  stateTypes(removed: false) {
    state_type_id
    state_type_name
    state_type_color
    is_downtime
  }

  stateDefinitions(removed: false) {
    state_id
    state_name
    state_color
    state_type {
      state_type_name
    }
  }
}
```

### Get Downtime Reasons
```graphql
query {
  downtimeReasons(removed: false) {
    downtime_reason_id
    downtime_reason_code
    downtime_reason_name
    is_planned
  }
}
```

## Master Data

### Get Assets with Hierarchy
```graphql
query {
  assetDefinitions(removed: false) {
    asset_id
    asset_name
    asset_description
    asset_type {
      asset_type_name
    }
    parent_asset {
      asset_name
      parent_asset {
        asset_name
      }
    }
  }
}
```

### Get Specific Asset by ID
```graphql
query {
  assetDefinition(asset_id: "22") {
    asset_id
    asset_name
    asset_description
    asset_type {
      asset_type_name
    }
    parent_asset {
      asset_name
    }
  }
}
```

### Get Products with Families
```graphql
query {
  productDefinitions(removed: false) {
    product_id
    product_name
    product_description
    unit_of_measure
    ideal_cycle_time
    product_family {
      product_family_name
    }
  }
}
```

### Get Performance Targets
```graphql
query {
  performanceTargets(removed: false) {
    target_value
    target_unit
    asset {
      asset_name
    }
    product {
      product_name
    }
  }
}
```

## Log Queries

### Get Recent State Logs
```graphql
query {
  stateLogs(
    filter: { removed: false }
    limit: 10
  ) {
    state_log_id
    asset_name
    state_name
    state_type_name
    downtime_reason_code
    downtime_reason_name
    logged_at
  }
}
```

### Get State Logs for Specific Asset
```graphql
query {
  stateLogs(
    filter: {
      asset_id: "101"
      removed: false
    }
    limit: 50
  ) {
    state_log_id
    state_name
    state_type {
      state_type_color
    }
    downtime_reason {
      downtime_reason_name
      is_planned
    }
    logged_at
  }
}
```

### Get Production Logs with Date Filter
```graphql
query {
  productionLogs(
    filter: {
      asset_id: "101"
      start_ts: { from: "2024-01-01T00:00:00Z" }
      removed: false
    }
    limit: 20
  ) {
    production_log_id
    asset_name
    product_name
    product_family_name
    start_ts
    end_ts
    additional_info
  }
}
```

### Get Count Logs with Details
```graphql
query {
  countLogs(
    filter: { asset_id: "101" }
    limit: 100
  ) {
    count_log_id
    quantity
    count_type {
      count_type_name
      count_type_unit
    }
    product {
      product_name
      product_family {
        product_family_name
      }
    }
    logged_at
  }
}
```

### Get Measurement Logs
```graphql
query {
  measurementLogs(
    filter: {
      asset_id: "101"
      removed: false
    }
    limit: 50
  ) {
    measurement_log_id
    target_value
    actual_value
    in_tolerance
    measurement_type {
      measurement_type_name
      measurement_type_unit
    }
    product {
      product_name
    }
    logged_at
  }
}
```

### Get KPI Logs
```graphql
query {
  kpiLogs(
    filter: { asset_id: "101" }
    limit: 20
  ) {
    kpi_log_id
    kpi_name
    kpi_value
    start_ts
    end_ts
    asset {
      asset_name
    }
    kpi {
      kpi_unit
      kpi_formula
    }
  }
}
```

## Complex Queries

### Get Asset with All Related Data
```graphql
query {
  assetDefinition(asset_id: "101") {
    asset_id
    asset_name
    asset_description
    asset_type {
      asset_type_name
    }
    parent_asset {
      asset_name
      asset_type {
        asset_type_name
      }
    }
  }

  stateLogs(filter: { asset_id: "101" }, limit: 5) {
    state_log_id
    state_name
    logged_at
  }

  productionLogs(filter: { asset_id: "101" }, limit: 5) {
    production_log_id
    product_name
    start_ts
  }
}
```

### Get Production Run Details
```graphql
query {
  productionLog(production_log_id: "1") {
    production_log_id
    asset_name
    product_name
    start_ts
    end_ts
    additional_info
  }

  productionLogNotes(production_log_id: "1", removed: false) {
    note_id
    note
    created_by
    created_at
  }

  countLogs(filter: { production_log_id: "1" }, limit: 100) {
    count_log_id
    count_type_name
    quantity
    logged_at
  }
}
```

## Introspection Query

### Get Schema Information
```graphql
query {
  __schema {
    types {
      name
      kind
      description
    }
  }
}
```

### Get Available Queries
```graphql
query {
  __schema {
    queryType {
      fields {
        name
        description
        args {
          name
          type {
            name
          }
        }
      }
    }
  }
}
```
