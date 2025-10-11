export const typeDefs = `#graphql
  # Custom scalar types
  scalar DateTime
  scalar JSON

  # ===============================================================
  # Lookup Types
  # ===============================================================

  type AssetType {
    asset_type_id: ID!
    asset_type_name: String!
    asset_type_description: String
    created_by: String
    created_at: DateTime
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type StateType {
    state_type_id: ID!
    state_type_name: String!
    state_type_description: String
    state_type_color: String!
    is_downtime: Boolean!
    created_by: String
    created_at: DateTime
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type StateDefinition {
    state_id: ID!
    state_type_id: ID!
    state_type: StateType
    state_name: String!
    state_description: String
    state_color: String!
    created_by: String
    created_at: DateTime
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type DowntimeReason {
    downtime_reason_id: ID!
    downtime_reason_code: String!
    downtime_reason_name: String!
    downtime_reason_description: String
    is_planned: Boolean!
    created_by: String
    created_at: DateTime
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type CountType {
    count_type_id: ID!
    count_type_name: String!
    count_type_description: String
    count_type_unit: String!
    created_by: String
    created_at: DateTime
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type MeasurementType {
    measurement_type_id: ID!
    measurement_type_name: String!
    measurement_type_description: String
    measurement_type_unit: String!
    created_by: String
    created_at: DateTime
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type KpiDefinition {
    kpi_id: ID!
    kpi_name: String!
    kpi_description: String
    kpi_unit: String!
    kpi_formula: String
    created_by: String
    created_at: DateTime
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  # ===============================================================
  # Master Data Types
  # ===============================================================

  type AssetDefinition {
    asset_id: ID!
    asset_name: String!
    asset_description: String!
    asset_type_id: ID!
    asset_type: AssetType
    parent_asset_id: ID
    parent_asset: AssetDefinition
    tag_path: String
    created_by: String
    created_at: DateTime
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type ProductFamily {
    product_family_id: ID!
    product_family_name: String!
    product_family_description: String
    created_by: String
    created_at: DateTime
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type ProductDefinition {
    product_id: ID!
    product_name: String!
    product_description: String!
    product_family_id: ID
    product_family: ProductFamily
    unit_of_measure: String!
    tolerance: Float!
    ideal_cycle_time: Float
    created_by: String
    created_at: DateTime
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type PerformanceTarget {
    product_id: ID!
    product: ProductDefinition
    asset_id: ID!
    asset: AssetDefinition
    target_value: Float!
    target_unit: String
    created_by: String
    created_at: DateTime
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  # ===============================================================
  # Log Types
  # ===============================================================

  type StateLog {
    state_log_id: ID!
    asset_id: ID!
    asset_name: String!
    asset: AssetDefinition
    state_id: ID!
    state_name: String!
    state: StateDefinition
    state_type_id: ID!
    state_type_name: String!
    state_type: StateType
    from_state_id: ID
    additional_info: JSON
    downtime_reason_id: ID
    downtime_reason_code: String
    downtime_reason_name: String
    downtime_reason: DowntimeReason
    logged_by: String
    logged_at: DateTime!
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type StateLogNote {
    note_id: ID!
    state_log_id: ID!
    note: String!
    created_by: String
    created_at: DateTime!
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type ProductionLog {
    production_log_id: ID!
    asset_id: ID!
    asset_name: String!
    asset: AssetDefinition
    product_id: ID!
    product_name: String!
    product: ProductDefinition
    product_family_id: ID!
    product_family_name: String!
    product_family: ProductFamily
    start_ts: DateTime!
    end_ts: DateTime
    additional_info: JSON
    logged_by: String
    logged_at: DateTime!
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type ProductionLogNote {
    note_id: ID!
    production_log_id: ID!
    note: String!
    created_by: String
    created_at: DateTime!
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type CountLog {
    count_log_id: ID!
    asset_id: ID!
    asset_name: String!
    asset: AssetDefinition
    production_log_id: ID
    count_type_id: ID!
    count_type_name: String!
    count_type: CountType
    quantity: Float!
    product_id: ID!
    product_name: String!
    product: ProductDefinition
    product_family_id: ID!
    product_family_name: String!
    product_family: ProductFamily
    additional_info: JSON
    logged_by: String
    logged_at: DateTime!
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type CountLogNote {
    note_id: ID!
    count_log_id: ID!
    note: String!
    created_by: String
    created_at: DateTime!
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type MeasurementLog {
    measurement_log_id: ID!
    asset_id: ID!
    asset_name: String!
    asset: AssetDefinition
    product_id: ID
    product_name: String
    product: ProductDefinition
    product_family_id: ID!
    product_family_name: String!
    product_family: ProductFamily
    measurement_type_id: ID!
    measurement_type_name: String!
    measurement_type: MeasurementType
    target_value: Float
    actual_value: Float
    unit_of_measure: String
    tolerance: Float!
    in_tolerance: Boolean
    additional_info: JSON
    logged_by: String
    logged_at: DateTime!
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type MeasurementLogNote {
    note_id: ID!
    measurement_log_id: ID!
    note: String!
    created_by: String
    created_at: DateTime!
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type KpiLog {
    kpi_log_id: ID!
    asset_id: ID!
    asset_name: String!
    asset: AssetDefinition
    kpi_id: ID!
    kpi_name: String!
    kpi: KpiDefinition
    kpi_value: Float!
    start_ts: DateTime!
    end_ts: DateTime!
    additional_info: JSON
    logged_by: String
    logged_at: DateTime!
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type KpiLogNote {
    note_id: ID!
    kpi_log_id: ID!
    note: String!
    created_by: String
    created_at: DateTime!
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  type GeneralNote {
    note_id: ID!
    note: String!
    created_by: String
    created_at: DateTime!
    updated_by: String
    updated_at: DateTime
    removed: Boolean!
  }

  # ===============================================================
  # Input Types for Filters
  # ===============================================================

  input DateTimeRange {
    from: DateTime
    to: DateTime
  }

  input StateLogFilter {
    asset_id: ID
    state_id: ID
    state_type_id: ID
    downtime_reason_id: ID
    logged_at: DateTimeRange
  }

  input ProductionLogFilter {
    asset_id: ID
    product_id: ID
    product_family_id: ID
    start_ts: DateTimeRange
  }

  input CountLogFilter {
    asset_id: ID
    product_id: ID
    count_type_id: ID
    production_log_id: ID
    logged_at: DateTimeRange
  }

  input MeasurementLogFilter {
    asset_id: ID
    product_id: ID
    measurement_type_id: ID
    logged_at: DateTimeRange
  }

  input KpiLogFilter {
    asset_id: ID
    kpi_id: ID
    start_ts: DateTimeRange
  }

  # ===============================================================
  # Query Root Type
  # ===============================================================

  type Query {
    # Lookup queries
    assetTypes: [AssetType!]!
    assetType(asset_type_id: ID!): AssetType

    stateTypes: [StateType!]!
    stateType(state_type_id: ID!): StateType

    stateDefinitions(state_type_id: ID): [StateDefinition!]!
    stateDefinition(state_id: ID!): StateDefinition

    downtimeReasons(is_planned: Boolean): [DowntimeReason!]!
    downtimeReason(downtime_reason_id: ID!): DowntimeReason

    countTypes: [CountType!]!
    countType(count_type_id: ID!): CountType

    measurementTypes: [MeasurementType!]!
    measurementType(measurement_type_id: ID!): MeasurementType

    kpiDefinitions: [KpiDefinition!]!
    kpiDefinition(kpi_id: ID!): KpiDefinition

    # Master data queries
    assetDefinitions(asset_type_id: ID, parent_asset_id: ID): [AssetDefinition!]!
    assetDefinition(asset_id: ID!): AssetDefinition

    productFamilies: [ProductFamily!]!
    productFamily(product_family_id: ID!): ProductFamily

    productDefinitions(product_family_id: ID): [ProductDefinition!]!
    productDefinition(product_id: ID!): ProductDefinition

    performanceTargets(asset_id: ID, product_id: ID): [PerformanceTarget!]!
    performanceTarget(asset_id: ID!, product_id: ID!): PerformanceTarget

    # Log queries
    stateLogs(filter: StateLogFilter, limit: Int, offset: Int): [StateLog!]!
    stateLog(state_log_id: ID!): StateLog
    stateLogNotes(state_log_id: ID!): [StateLogNote!]!

    productionLogs(filter: ProductionLogFilter, limit: Int, offset: Int): [ProductionLog!]!
    productionLog(production_log_id: ID!): ProductionLog
    productionLogNotes(production_log_id: ID!): [ProductionLogNote!]!

    countLogs(filter: CountLogFilter, limit: Int, offset: Int): [CountLog!]!
    countLog(count_log_id: ID!): CountLog
    countLogNotes(count_log_id: ID!): [CountLogNote!]!

    measurementLogs(filter: MeasurementLogFilter, limit: Int, offset: Int): [MeasurementLog!]!
    measurementLog(measurement_log_id: ID!): MeasurementLog
    measurementLogNotes(measurement_log_id: ID!): [MeasurementLogNote!]!

    kpiLogs(filter: KpiLogFilter, limit: Int, offset: Int): [KpiLog!]!
    kpiLog(kpi_log_id: ID!): KpiLog
    kpiLogNotes(kpi_log_id: ID!): [KpiLogNote!]!

    generalNotes(limit: Int, offset: Int): [GeneralNote!]!
    generalNote(note_id: ID!): GeneralNote
  }

  # ===============================================================
  # Input Types for Mutations
  # ===============================================================

  # Lookup Table Inputs
  input CreateAssetTypeInput {
    asset_type_name: String!
    asset_type_description: String
  }

  input UpdateAssetTypeInput {
    asset_type_name: String
    asset_type_description: String
  }

  input CreateStateTypeInput {
    state_type_name: String!
    state_type_description: String
    state_type_color: String!
    is_downtime: Boolean!
  }

  input UpdateStateTypeInput {
    state_type_name: String
    state_type_description: String
    state_type_color: String
    is_downtime: Boolean
  }

  input CreateStateDefinitionInput {
    state_type_id: ID!
    state_name: String!
    state_description: String
    state_color: String!
  }

  input UpdateStateDefinitionInput {
    state_type_id: ID
    state_name: String
    state_description: String
    state_color: String
  }

  input CreateDowntimeReasonInput {
    downtime_reason_code: String!
    downtime_reason_name: String!
    downtime_reason_description: String
    is_planned: Boolean!
  }

  input UpdateDowntimeReasonInput {
    downtime_reason_code: String
    downtime_reason_name: String
    downtime_reason_description: String
    is_planned: Boolean
  }

  input CreateCountTypeInput {
    count_type_name: String!
    count_type_description: String
    count_type_unit: String!
  }

  input UpdateCountTypeInput {
    count_type_name: String
    count_type_description: String
    count_type_unit: String
  }

  input CreateMeasurementTypeInput {
    measurement_type_name: String!
    measurement_type_description: String
    measurement_type_unit: String!
  }

  input UpdateMeasurementTypeInput {
    measurement_type_name: String
    measurement_type_description: String
    measurement_type_unit: String
  }

  input CreateKpiDefinitionInput {
    kpi_name: String!
    kpi_description: String
    kpi_unit: String!
    kpi_formula: String
  }

  input UpdateKpiDefinitionInput {
    kpi_name: String
    kpi_description: String
    kpi_unit: String
    kpi_formula: String
  }

  # Master Data Inputs
  input CreateAssetDefinitionInput {
    asset_name: String!
    asset_description: String!
    asset_type_id: ID!
    parent_asset_id: ID
    tag_path: String
  }

  input UpdateAssetDefinitionInput {
    asset_name: String
    asset_description: String
    asset_type_id: ID
    parent_asset_id: ID
    tag_path: String
  }

  input CreateProductFamilyInput {
    product_family_name: String!
    product_family_description: String
  }

  input UpdateProductFamilyInput {
    product_family_name: String
    product_family_description: String
  }

  input CreateProductDefinitionInput {
    product_name: String!
    product_description: String!
    product_family_id: ID
    unit_of_measure: String!
    tolerance: Float!
    ideal_cycle_time: Float
  }

  input UpdateProductDefinitionInput {
    product_name: String
    product_description: String
    product_family_id: ID
    unit_of_measure: String
    tolerance: Float
    ideal_cycle_time: Float
  }

  input CreatePerformanceTargetInput {
    product_id: ID!
    asset_id: ID!
    target_value: Float!
    target_unit: String
  }

  input UpdatePerformanceTargetInput {
    target_value: Float
    target_unit: String
  }

  # Log Inputs (Create only)
  input CreateStateLogInput {
    asset_id: ID!
    state_id: ID!
    downtime_reason_id: ID
    additional_info: JSON
  }

  input CreateProductionLogInput {
    asset_id: ID!
    product_id: ID!
    product_family_id: ID!
    start_ts: DateTime!
    end_ts: DateTime
    additional_info: JSON
  }

  input CreateCountLogInput {
    asset_id: ID!
    production_log_id: ID
    count_type_id: ID!
    quantity: Float!
    product_id: ID!
    product_family_id: ID!
    additional_info: JSON
  }

  input CreateMeasurementLogInput {
    asset_id: ID!
    product_id: ID
    product_family_id: ID!
    measurement_type_id: ID!
    target_value: Float
    actual_value: Float
    unit_of_measure: String
    tolerance: Float!
    in_tolerance: Boolean
    additional_info: JSON
  }

  input CreateKpiLogInput {
    asset_id: ID!
    kpi_id: ID!
    kpi_value: Float!
    start_ts: DateTime!
    end_ts: DateTime!
    additional_info: JSON
  }

  # Note Inputs (Full CRUD)
  input CreateStateLogNoteInput {
    state_log_id: ID!
    note: String!
  }

  input UpdateStateLogNoteInput {
    note: String
  }

  input CreateProductionLogNoteInput {
    production_log_id: ID!
    note: String!
  }

  input UpdateProductionLogNoteInput {
    note: String
  }

  input CreateCountLogNoteInput {
    count_log_id: ID!
    note: String!
  }

  input UpdateCountLogNoteInput {
    note: String
  }

  input CreateMeasurementLogNoteInput {
    measurement_log_id: ID!
    note: String!
  }

  input UpdateMeasurementLogNoteInput {
    note: String
  }

  input CreateKpiLogNoteInput {
    kpi_log_id: ID!
    note: String!
  }

  input UpdateKpiLogNoteInput {
    note: String
  }

  input CreateGeneralNoteInput {
    note: String!
  }

  input UpdateGeneralNoteInput {
    note: String
  }

  # ===============================================================
  # Mutation Root Type
  # ===============================================================

  type Mutation {
    # Lookup Table Mutations (Full CRUD)
    createAssetType(input: CreateAssetTypeInput!): AssetType!
    updateAssetType(asset_type_id: ID!, input: UpdateAssetTypeInput!): AssetType!
    deleteAssetType(asset_type_id: ID!): AssetType!

    createStateType(input: CreateStateTypeInput!): StateType!
    updateStateType(state_type_id: ID!, input: UpdateStateTypeInput!): StateType!
    deleteStateType(state_type_id: ID!): StateType!

    createStateDefinition(input: CreateStateDefinitionInput!): StateDefinition!
    updateStateDefinition(state_id: ID!, input: UpdateStateDefinitionInput!): StateDefinition!
    deleteStateDefinition(state_id: ID!): StateDefinition!

    createDowntimeReason(input: CreateDowntimeReasonInput!): DowntimeReason!
    updateDowntimeReason(downtime_reason_id: ID!, input: UpdateDowntimeReasonInput!): DowntimeReason!
    deleteDowntimeReason(downtime_reason_id: ID!): DowntimeReason!

    createCountType(input: CreateCountTypeInput!): CountType!
    updateCountType(count_type_id: ID!, input: UpdateCountTypeInput!): CountType!
    deleteCountType(count_type_id: ID!): CountType!

    createMeasurementType(input: CreateMeasurementTypeInput!): MeasurementType!
    updateMeasurementType(measurement_type_id: ID!, input: UpdateMeasurementTypeInput!): MeasurementType!
    deleteMeasurementType(measurement_type_id: ID!): MeasurementType!

    createKpiDefinition(input: CreateKpiDefinitionInput!): KpiDefinition!
    updateKpiDefinition(kpi_id: ID!, input: UpdateKpiDefinitionInput!): KpiDefinition!
    deleteKpiDefinition(kpi_id: ID!): KpiDefinition!

    # Master Data Mutations (Full CRUD)
    createAssetDefinition(input: CreateAssetDefinitionInput!): AssetDefinition!
    updateAssetDefinition(asset_id: ID!, input: UpdateAssetDefinitionInput!): AssetDefinition!
    deleteAssetDefinition(asset_id: ID!): AssetDefinition!

    createProductFamily(input: CreateProductFamilyInput!): ProductFamily!
    updateProductFamily(product_family_id: ID!, input: UpdateProductFamilyInput!): ProductFamily!
    deleteProductFamily(product_family_id: ID!): ProductFamily!

    createProductDefinition(input: CreateProductDefinitionInput!): ProductDefinition!
    updateProductDefinition(product_id: ID!, input: UpdateProductDefinitionInput!): ProductDefinition!
    deleteProductDefinition(product_id: ID!): ProductDefinition!

    createPerformanceTarget(input: CreatePerformanceTargetInput!): PerformanceTarget!
    updatePerformanceTarget(asset_id: ID!, product_id: ID!, input: UpdatePerformanceTargetInput!): PerformanceTarget!
    deletePerformanceTarget(asset_id: ID!, product_id: ID!): PerformanceTarget!

    # Log Mutations (Create and Read only)
    createStateLog(input: CreateStateLogInput!): StateLog!
    createProductionLog(input: CreateProductionLogInput!): ProductionLog!
    createCountLog(input: CreateCountLogInput!): CountLog!
    createMeasurementLog(input: CreateMeasurementLogInput!): MeasurementLog!
    createKpiLog(input: CreateKpiLogInput!): KpiLog!

    # Note Mutations (Full CRUD)
    createStateLogNote(input: CreateStateLogNoteInput!): StateLogNote!
    updateStateLogNote(note_id: ID!, input: UpdateStateLogNoteInput!): StateLogNote!
    deleteStateLogNote(note_id: ID!): StateLogNote!

    createProductionLogNote(input: CreateProductionLogNoteInput!): ProductionLogNote!
    updateProductionLogNote(note_id: ID!, input: UpdateProductionLogNoteInput!): ProductionLogNote!
    deleteProductionLogNote(note_id: ID!): ProductionLogNote!

    createCountLogNote(input: CreateCountLogNoteInput!): CountLogNote!
    updateCountLogNote(note_id: ID!, input: UpdateCountLogNoteInput!): CountLogNote!
    deleteCountLogNote(note_id: ID!): CountLogNote!

    createMeasurementLogNote(input: CreateMeasurementLogNoteInput!): MeasurementLogNote!
    updateMeasurementLogNote(note_id: ID!, input: UpdateMeasurementLogNoteInput!): MeasurementLogNote!
    deleteMeasurementLogNote(note_id: ID!): MeasurementLogNote!

    createKpiLogNote(input: CreateKpiLogNoteInput!): KpiLogNote!
    updateKpiLogNote(note_id: ID!, input: UpdateKpiLogNoteInput!): KpiLogNote!
    deleteKpiLogNote(note_id: ID!): KpiLogNote!

    createGeneralNote(input: CreateGeneralNoteInput!): GeneralNote!
    updateGeneralNote(note_id: ID!, input: UpdateGeneralNoteInput!): GeneralNote!
    deleteGeneralNote(note_id: ID!): GeneralNote!
  }
`;
