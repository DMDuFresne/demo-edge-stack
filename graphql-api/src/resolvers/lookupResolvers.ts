import { query } from '../db/pool';
import { buildWhereClause } from '../utils/queryBuilder';

export const lookupResolvers = {
  Query: {
    // Asset Types
    assetTypes: async () => {
      const { whereClause, values } = buildWhereClause({ removed: false });
      const sql = `SELECT * FROM asset_type ${whereClause} ORDER BY asset_type_name`;
      const result = await query(sql, values);
      return result.rows;
    },

    assetType: async (_: any, args: { asset_type_id: string }) => {
      const result = await query(
        'SELECT * FROM asset_type WHERE asset_type_id = $1 AND removed = false',
        [args.asset_type_id]
      );
      return result.rows[0];
    },

    // State Types
    stateTypes: async () => {
      const { whereClause, values } = buildWhereClause({ removed: false });
      const sql = `SELECT * FROM state_type ${whereClause} ORDER BY state_type_name`;
      const result = await query(sql, values);
      return result.rows;
    },

    stateType: async (_: any, args: { state_type_id: string }) => {
      const result = await query(
        'SELECT * FROM state_type WHERE state_type_id = $1 AND removed = false',
        [args.state_type_id]
      );
      return result.rows[0];
    },

    // State Definitions
    stateDefinitions: async (_: any, args: { state_type_id?: string }) => {
      const filter: any = { removed: false };
      if (args.state_type_id) filter.state_type_id = args.state_type_id;

      const { whereClause, values } = buildWhereClause(filter);
      const sql = `SELECT * FROM state_definition ${whereClause} ORDER BY state_name`;
      const result = await query(sql, values);
      return result.rows;
    },

    stateDefinition: async (_: any, args: { state_id: string }) => {
      const result = await query(
        'SELECT * FROM state_definition WHERE state_id = $1 AND removed = false',
        [args.state_id]
      );
      return result.rows[0];
    },

    // Downtime Reasons
    downtimeReasons: async (_: any, args: { is_planned?: boolean }) => {
      const filter: any = { removed: false };
      if (args.is_planned !== undefined) filter.is_planned = args.is_planned;

      const { whereClause, values } = buildWhereClause(filter);
      const sql = `SELECT * FROM downtime_reason ${whereClause} ORDER BY downtime_reason_code`;
      const result = await query(sql, values);
      return result.rows;
    },

    downtimeReason: async (_: any, args: { downtime_reason_id: string }) => {
      const result = await query(
        'SELECT * FROM downtime_reason WHERE downtime_reason_id = $1 AND removed = false',
        [args.downtime_reason_id]
      );
      return result.rows[0];
    },

    // Count Types
    countTypes: async () => {
      const { whereClause, values } = buildWhereClause({ removed: false });
      const sql = `SELECT * FROM count_type ${whereClause} ORDER BY count_type_name`;
      const result = await query(sql, values);
      return result.rows;
    },

    countType: async (_: any, args: { count_type_id: string }) => {
      const result = await query(
        'SELECT * FROM count_type WHERE count_type_id = $1 AND removed = false',
        [args.count_type_id]
      );
      return result.rows[0];
    },

    // Measurement Types
    measurementTypes: async () => {
      const { whereClause, values } = buildWhereClause({ removed: false });
      const sql = `SELECT * FROM measurement_type ${whereClause} ORDER BY measurement_type_name`;
      const result = await query(sql, values);
      return result.rows;
    },

    measurementType: async (_: any, args: { measurement_type_id: string }) => {
      const result = await query(
        'SELECT * FROM measurement_type WHERE measurement_type_id = $1 AND removed = false',
        [args.measurement_type_id]
      );
      return result.rows[0];
    },

    // KPI Definitions
    kpiDefinitions: async () => {
      const { whereClause, values } = buildWhereClause({ removed: false });
      const sql = `SELECT * FROM kpi_definition ${whereClause} ORDER BY kpi_name`;
      const result = await query(sql, values);
      return result.rows;
    },

    kpiDefinition: async (_: any, args: { kpi_id: string }) => {
      const result = await query(
        'SELECT * FROM kpi_definition WHERE kpi_id = $1 AND removed = false',
        [args.kpi_id]
      );
      return result.rows[0];
    },
  },

  // Field resolvers
  StateDefinition: {
    state_type: async (parent: any) => {
      const result = await query(
        'SELECT * FROM state_type WHERE state_type_id = $1',
        [parent.state_type_id]
      );
      return result.rows[0];
    },
  },
};
