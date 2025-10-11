import { query } from '../db/pool';

export const logMutations = {
  // ===============================================================
  // Log Create Mutations (Create and Read only)
  // ===============================================================

  // State Log
  createStateLog: async (_: any, args: { input: any }) => {
    const { asset_id, state_id, downtime_reason_id, additional_info } = args.input;
    const sql = `
      INSERT INTO state_log (asset_id, state_id, downtime_reason_id, additional_info)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(sql, [asset_id, state_id, downtime_reason_id, additional_info]);
    return result.rows[0];
  },

  // Production Log
  createProductionLog: async (_: any, args: { input: any }) => {
    const { asset_id, product_id, product_family_id, start_ts, end_ts, additional_info } = args.input;
    const sql = `
      INSERT INTO production_log (asset_id, product_id, product_family_id, start_ts, end_ts, additional_info)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await query(sql, [asset_id, product_id, product_family_id, start_ts, end_ts, additional_info]);
    return result.rows[0];
  },

  // Count Log
  createCountLog: async (_: any, args: { input: any }) => {
    const { asset_id, production_log_id, count_type_id, quantity, product_id, product_family_id, additional_info } = args.input;
    const sql = `
      INSERT INTO count_log (asset_id, production_log_id, count_type_id, quantity, product_id, product_family_id, additional_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await query(sql, [asset_id, production_log_id, count_type_id, quantity, product_id, product_family_id, additional_info]);
    return result.rows[0];
  },

  // Measurement Log
  createMeasurementLog: async (_: any, args: { input: any }) => {
    const { asset_id, product_id, product_family_id, measurement_type_id, target_value, actual_value, unit_of_measure, tolerance, in_tolerance, additional_info } = args.input;
    const sql = `
      INSERT INTO measurement_log (asset_id, product_id, product_family_id, measurement_type_id, target_value, actual_value, unit_of_measure, tolerance, in_tolerance, additional_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await query(sql, [asset_id, product_id, product_family_id, measurement_type_id, target_value, actual_value, unit_of_measure, tolerance, in_tolerance, additional_info]);
    return result.rows[0];
  },

  // KPI Log
  createKpiLog: async (_: any, args: { input: any }) => {
    const { asset_id, kpi_id, kpi_value, start_ts, end_ts, additional_info } = args.input;
    const sql = `
      INSERT INTO kpi_log (asset_id, kpi_id, kpi_value, start_ts, end_ts, additional_info)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await query(sql, [asset_id, kpi_id, kpi_value, start_ts, end_ts, additional_info]);
    return result.rows[0];
  },

  // ===============================================================
  // Note Mutations (Full CRUD)
  // ===============================================================

  // State Log Notes
  createStateLogNote: async (_: any, args: { input: any }) => {
    const { state_log_id, note } = args.input;
    const sql = `
      INSERT INTO state_log_note (state_log_id, note)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await query(sql, [state_log_id, note]);
    return result.rows[0];
  },

  updateStateLogNote: async (_: any, args: { note_id: string; input: any }) => {
    const { note_id, input } = args;
    if (!input.note) {
      throw new Error('Note text is required');
    }
    const sql = `
      UPDATE state_log_note
      SET note = $1
      WHERE note_id = $2 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [input.note, note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found');
    }
    return result.rows[0];
  },

  deleteStateLogNote: async (_: any, args: { note_id: string }) => {
    const sql = `
      UPDATE state_log_note
      SET removed = TRUE
      WHERE note_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found or already deleted');
    }
    return result.rows[0];
  },

  // Production Log Notes
  createProductionLogNote: async (_: any, args: { input: any }) => {
    const { production_log_id, note } = args.input;
    const sql = `
      INSERT INTO production_log_note (production_log_id, note)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await query(sql, [production_log_id, note]);
    return result.rows[0];
  },

  updateProductionLogNote: async (_: any, args: { note_id: string; input: any }) => {
    const { note_id, input } = args;
    if (!input.note) {
      throw new Error('Note text is required');
    }
    const sql = `
      UPDATE production_log_note
      SET note = $1
      WHERE note_id = $2 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [input.note, note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found');
    }
    return result.rows[0];
  },

  deleteProductionLogNote: async (_: any, args: { note_id: string }) => {
    const sql = `
      UPDATE production_log_note
      SET removed = TRUE
      WHERE note_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found or already deleted');
    }
    return result.rows[0];
  },

  // Count Log Notes
  createCountLogNote: async (_: any, args: { input: any }) => {
    const { count_log_id, note } = args.input;
    const sql = `
      INSERT INTO count_log_note (count_log_id, note)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await query(sql, [count_log_id, note]);
    return result.rows[0];
  },

  updateCountLogNote: async (_: any, args: { note_id: string; input: any }) => {
    const { note_id, input } = args;
    if (!input.note) {
      throw new Error('Note text is required');
    }
    const sql = `
      UPDATE count_log_note
      SET note = $1
      WHERE note_id = $2 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [input.note, note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found');
    }
    return result.rows[0];
  },

  deleteCountLogNote: async (_: any, args: { note_id: string }) => {
    const sql = `
      UPDATE count_log_note
      SET removed = TRUE
      WHERE note_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found or already deleted');
    }
    return result.rows[0];
  },

  // Measurement Log Notes
  createMeasurementLogNote: async (_: any, args: { input: any }) => {
    const { measurement_log_id, note } = args.input;
    const sql = `
      INSERT INTO measurement_log_note (measurement_log_id, note)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await query(sql, [measurement_log_id, note]);
    return result.rows[0];
  },

  updateMeasurementLogNote: async (_: any, args: { note_id: string; input: any }) => {
    const { note_id, input } = args;
    if (!input.note) {
      throw new Error('Note text is required');
    }
    const sql = `
      UPDATE measurement_log_note
      SET note = $1
      WHERE note_id = $2 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [input.note, note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found');
    }
    return result.rows[0];
  },

  deleteMeasurementLogNote: async (_: any, args: { note_id: string }) => {
    const sql = `
      UPDATE measurement_log_note
      SET removed = TRUE
      WHERE note_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found or already deleted');
    }
    return result.rows[0];
  },

  // KPI Log Notes
  createKpiLogNote: async (_: any, args: { input: any }) => {
    const { kpi_log_id, note } = args.input;
    const sql = `
      INSERT INTO kpi_log_note (kpi_log_id, note)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await query(sql, [kpi_log_id, note]);
    return result.rows[0];
  },

  updateKpiLogNote: async (_: any, args: { note_id: string; input: any }) => {
    const { note_id, input } = args;
    if (!input.note) {
      throw new Error('Note text is required');
    }
    const sql = `
      UPDATE kpi_log_note
      SET note = $1
      WHERE note_id = $2 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [input.note, note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found');
    }
    return result.rows[0];
  },

  deleteKpiLogNote: async (_: any, args: { note_id: string }) => {
    const sql = `
      UPDATE kpi_log_note
      SET removed = TRUE
      WHERE note_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found or already deleted');
    }
    return result.rows[0];
  },

  // General Notes
  createGeneralNote: async (_: any, args: { input: any }) => {
    const { note } = args.input;
    const sql = `
      INSERT INTO general_note (note)
      VALUES ($1)
      RETURNING *
    `;
    const result = await query(sql, [note]);
    return result.rows[0];
  },

  updateGeneralNote: async (_: any, args: { note_id: string; input: any }) => {
    const { note_id, input } = args;
    if (!input.note) {
      throw new Error('Note text is required');
    }
    const sql = `
      UPDATE general_note
      SET note = $1
      WHERE note_id = $2 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [input.note, note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found');
    }
    return result.rows[0];
  },

  deleteGeneralNote: async (_: any, args: { note_id: string }) => {
    const sql = `
      UPDATE general_note
      SET removed = TRUE
      WHERE note_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.note_id]);
    if (result.rows.length === 0) {
      throw new Error('Note not found or already deleted');
    }
    return result.rows[0];
  },
};
