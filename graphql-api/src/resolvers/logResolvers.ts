import { query } from '../db/pool';
import { buildWhereClause, buildPagination } from '../utils/queryBuilder';

export const logResolvers = {
  Query: {
    // State Logs
    stateLogs: async (_: any, args: { filter?: any; limit?: number; offset?: number }) => {
      const filter = { ...args.filter, removed: false };
      const { whereClause, values } = buildWhereClause(filter);
      const pagination = buildPagination(args.limit, args.offset);
      const sql = `SELECT * FROM state_log ${whereClause} ORDER BY logged_at DESC ${pagination}`;
      const result = await query(sql, values);
      return result.rows;
    },

    stateLog: async (_: any, args: { state_log_id: string }) => {
      const result = await query(
        'SELECT * FROM state_log WHERE state_log_id = $1 AND removed = false',
        [args.state_log_id]
      );
      return result.rows[0];
    },

    stateLogNotes: async (_: any, args: { state_log_id: string }) => {
      const filter: any = { state_log_id: args.state_log_id, removed: false };

      const { whereClause, values } = buildWhereClause(filter);
      const sql = `SELECT * FROM state_log_note ${whereClause} ORDER BY created_at DESC`;
      const result = await query(sql, values);
      return result.rows;
    },

    // Production Logs
    productionLogs: async (_: any, args: { filter?: any; limit?: number; offset?: number }) => {
      const filter = { ...args.filter, removed: false };
      const { whereClause, values } = buildWhereClause(filter);
      const pagination = buildPagination(args.limit, args.offset);
      const sql = `SELECT * FROM production_log ${whereClause} ORDER BY start_ts DESC ${pagination}`;
      const result = await query(sql, values);
      return result.rows;
    },

    productionLog: async (_: any, args: { production_log_id: string }) => {
      const result = await query(
        'SELECT * FROM production_log WHERE production_log_id = $1 AND removed = false',
        [args.production_log_id]
      );
      return result.rows[0];
    },

    productionLogNotes: async (_: any, args: { production_log_id: string }) => {
      const filter: any = { production_log_id: args.production_log_id, removed: false };

      const { whereClause, values } = buildWhereClause(filter);
      const sql = `SELECT * FROM production_log_note ${whereClause} ORDER BY created_at DESC`;
      const result = await query(sql, values);
      return result.rows;
    },

    // Count Logs
    countLogs: async (_: any, args: { filter?: any; limit?: number; offset?: number }) => {
      const filter = { ...args.filter, removed: false };
      const { whereClause, values } = buildWhereClause(filter);
      const pagination = buildPagination(args.limit, args.offset);
      const sql = `SELECT * FROM count_log ${whereClause} ORDER BY logged_at DESC ${pagination}`;
      const result = await query(sql, values);
      return result.rows;
    },

    countLog: async (_: any, args: { count_log_id: string }) => {
      const result = await query(
        'SELECT * FROM count_log WHERE count_log_id = $1 AND removed = false',
        [args.count_log_id]
      );
      return result.rows[0];
    },

    countLogNotes: async (_: any, args: { count_log_id: string }) => {
      const filter: any = { count_log_id: args.count_log_id, removed: false };

      const { whereClause, values } = buildWhereClause(filter);
      const sql = `SELECT * FROM count_log_note ${whereClause} ORDER BY created_at DESC`;
      const result = await query(sql, values);
      return result.rows;
    },

    // Measurement Logs
    measurementLogs: async (_: any, args: { filter?: any; limit?: number; offset?: number }) => {
      const filter = { ...args.filter, removed: false };
      const { whereClause, values } = buildWhereClause(filter);
      const pagination = buildPagination(args.limit, args.offset);
      const sql = `SELECT * FROM measurement_log ${whereClause} ORDER BY logged_at DESC ${pagination}`;
      const result = await query(sql, values);
      return result.rows;
    },

    measurementLog: async (_: any, args: { measurement_log_id: string }) => {
      const result = await query(
        'SELECT * FROM measurement_log WHERE measurement_log_id = $1 AND removed = false',
        [args.measurement_log_id]
      );
      return result.rows[0];
    },

    measurementLogNotes: async (_: any, args: { measurement_log_id: string }) => {
      const filter: any = { measurement_log_id: args.measurement_log_id, removed: false };

      const { whereClause, values } = buildWhereClause(filter);
      const sql = `SELECT * FROM measurement_log_note ${whereClause} ORDER BY created_at DESC`;
      const result = await query(sql, values);
      return result.rows;
    },

    // KPI Logs
    kpiLogs: async (_: any, args: { filter?: any; limit?: number; offset?: number }) => {
      const filter = { ...args.filter, removed: false };
      const { whereClause, values } = buildWhereClause(filter);
      const pagination = buildPagination(args.limit, args.offset);
      const sql = `SELECT * FROM kpi_log ${whereClause} ORDER BY start_ts DESC ${pagination}`;
      const result = await query(sql, values);
      return result.rows;
    },

    kpiLog: async (_: any, args: { kpi_log_id: string }) => {
      const result = await query(
        'SELECT * FROM kpi_log WHERE kpi_log_id = $1 AND removed = false',
        [args.kpi_log_id]
      );
      return result.rows[0];
    },

    kpiLogNotes: async (_: any, args: { kpi_log_id: string }) => {
      const filter: any = { kpi_log_id: args.kpi_log_id, removed: false };

      const { whereClause, values } = buildWhereClause(filter);
      const sql = `SELECT * FROM kpi_log_note ${whereClause} ORDER BY created_at DESC`;
      const result = await query(sql, values);
      return result.rows;
    },

    // General Notes
    generalNotes: async (_: any, args: { limit?: number; offset?: number }) => {
      const filter: any = { removed: false };

      const { whereClause, values } = buildWhereClause(filter);
      const pagination = buildPagination(args.limit, args.offset);
      const sql = `SELECT * FROM general_note ${whereClause} ORDER BY created_at DESC ${pagination}`;
      const result = await query(sql, values);
      return result.rows;
    },

    generalNote: async (_: any, args: { note_id: string }) => {
      const result = await query(
        'SELECT * FROM general_note WHERE note_id = $1 AND removed = false',
        [args.note_id]
      );
      return result.rows[0];
    },
  },

  // Field resolvers
  StateLog: {
    asset: async (parent: any) => {
      const result = await query(
        'SELECT * FROM asset_definition WHERE asset_id = $1',
        [parent.asset_id]
      );
      return result.rows[0];
    },
    state: async (parent: any) => {
      const result = await query(
        'SELECT * FROM state_definition WHERE state_id = $1',
        [parent.state_id]
      );
      return result.rows[0];
    },
    state_type: async (parent: any) => {
      const result = await query(
        'SELECT * FROM state_type WHERE state_type_id = $1',
        [parent.state_type_id]
      );
      return result.rows[0];
    },
    downtime_reason: async (parent: any) => {
      if (!parent.downtime_reason_id) return null;
      const result = await query(
        'SELECT * FROM downtime_reason WHERE downtime_reason_id = $1',
        [parent.downtime_reason_id]
      );
      return result.rows[0];
    },
  },

  ProductionLog: {
    asset: async (parent: any) => {
      const result = await query(
        'SELECT * FROM asset_definition WHERE asset_id = $1',
        [parent.asset_id]
      );
      return result.rows[0];
    },
    product: async (parent: any) => {
      const result = await query(
        'SELECT * FROM product_definition WHERE product_id = $1',
        [parent.product_id]
      );
      return result.rows[0];
    },
    product_family: async (parent: any) => {
      const result = await query(
        'SELECT * FROM product_family WHERE product_family_id = $1',
        [parent.product_family_id]
      );
      return result.rows[0];
    },
  },

  CountLog: {
    asset: async (parent: any) => {
      const result = await query(
        'SELECT * FROM asset_definition WHERE asset_id = $1',
        [parent.asset_id]
      );
      return result.rows[0];
    },
    count_type: async (parent: any) => {
      const result = await query(
        'SELECT * FROM count_type WHERE count_type_id = $1',
        [parent.count_type_id]
      );
      return result.rows[0];
    },
    product: async (parent: any) => {
      const result = await query(
        'SELECT * FROM product_definition WHERE product_id = $1',
        [parent.product_id]
      );
      return result.rows[0];
    },
    product_family: async (parent: any) => {
      const result = await query(
        'SELECT * FROM product_family WHERE product_family_id = $1',
        [parent.product_family_id]
      );
      return result.rows[0];
    },
  },

  MeasurementLog: {
    asset: async (parent: any) => {
      const result = await query(
        'SELECT * FROM asset_definition WHERE asset_id = $1',
        [parent.asset_id]
      );
      return result.rows[0];
    },
    product: async (parent: any) => {
      if (!parent.product_id) return null;
      const result = await query(
        'SELECT * FROM product_definition WHERE product_id = $1',
        [parent.product_id]
      );
      return result.rows[0];
    },
    product_family: async (parent: any) => {
      const result = await query(
        'SELECT * FROM product_family WHERE product_family_id = $1',
        [parent.product_family_id]
      );
      return result.rows[0];
    },
    measurement_type: async (parent: any) => {
      const result = await query(
        'SELECT * FROM measurement_type WHERE measurement_type_id = $1',
        [parent.measurement_type_id]
      );
      return result.rows[0];
    },
  },

  KpiLog: {
    asset: async (parent: any) => {
      const result = await query(
        'SELECT * FROM asset_definition WHERE asset_id = $1',
        [parent.asset_id]
      );
      return result.rows[0];
    },
    kpi: async (parent: any) => {
      const result = await query(
        'SELECT * FROM kpi_definition WHERE kpi_id = $1',
        [parent.kpi_id]
      );
      return result.rows[0];
    },
  },
};
