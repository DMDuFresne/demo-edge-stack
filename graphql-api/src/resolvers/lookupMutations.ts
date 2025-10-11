import { query } from '../db/pool';

export const lookupMutations = {
  // Asset Type Mutations
  createAssetType: async (_: any, args: { input: any }) => {
    const { asset_type_name, asset_type_description } = args.input;
    const sql = `
      INSERT INTO asset_type (asset_type_name, asset_type_description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await query(sql, [asset_type_name, asset_type_description]);
    return result.rows[0];
  },

  updateAssetType: async (_: any, args: { asset_type_id: string; input: any }) => {
    const { asset_type_id, input } = args;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.asset_type_name !== undefined) {
      updates.push(`asset_type_name = $${paramIndex++}`);
      values.push(input.asset_type_name);
    }
    if (input.asset_type_description !== undefined) {
      updates.push(`asset_type_description = $${paramIndex++}`);
      values.push(input.asset_type_description);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(asset_type_id);
    const sql = `
      UPDATE asset_type
      SET ${updates.join(', ')}
      WHERE asset_type_id = $${paramIndex} AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      throw new Error('Asset type not found');
    }
    return result.rows[0];
  },

  deleteAssetType: async (_: any, args: { asset_type_id: string }) => {
    const sql = `
      UPDATE asset_type
      SET removed = TRUE
      WHERE asset_type_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.asset_type_id]);
    if (result.rows.length === 0) {
      throw new Error('Asset type not found or already deleted');
    }
    return result.rows[0];
  },

  // State Type Mutations
  createStateType: async (_: any, args: { input: any }) => {
    const { state_type_name, state_type_description, state_type_color, is_downtime } = args.input;
    const sql = `
      INSERT INTO state_type (state_type_name, state_type_description, state_type_color, is_downtime)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(sql, [state_type_name, state_type_description, state_type_color, is_downtime]);
    return result.rows[0];
  },

  updateStateType: async (_: any, args: { state_type_id: string; input: any }) => {
    const { state_type_id, input } = args;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.state_type_name !== undefined) {
      updates.push(`state_type_name = $${paramIndex++}`);
      values.push(input.state_type_name);
    }
    if (input.state_type_description !== undefined) {
      updates.push(`state_type_description = $${paramIndex++}`);
      values.push(input.state_type_description);
    }
    if (input.state_type_color !== undefined) {
      updates.push(`state_type_color = $${paramIndex++}`);
      values.push(input.state_type_color);
    }
    if (input.is_downtime !== undefined) {
      updates.push(`is_downtime = $${paramIndex++}`);
      values.push(input.is_downtime);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(state_type_id);
    const sql = `
      UPDATE state_type
      SET ${updates.join(', ')}
      WHERE state_type_id = $${paramIndex} AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      throw new Error('State type not found');
    }
    return result.rows[0];
  },

  deleteStateType: async (_: any, args: { state_type_id: string }) => {
    const sql = `
      UPDATE state_type
      SET removed = TRUE
      WHERE state_type_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.state_type_id]);
    if (result.rows.length === 0) {
      throw new Error('State type not found or already deleted');
    }
    return result.rows[0];
  },

  // State Definition Mutations
  createStateDefinition: async (_: any, args: { input: any }) => {
    const { state_type_id, state_name, state_description, state_color } = args.input;
    const sql = `
      INSERT INTO state_definition (state_type_id, state_name, state_description, state_color)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(sql, [state_type_id, state_name, state_description, state_color]);
    return result.rows[0];
  },

  updateStateDefinition: async (_: any, args: { state_id: string; input: any }) => {
    const { state_id, input } = args;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.state_type_id !== undefined) {
      updates.push(`state_type_id = $${paramIndex++}`);
      values.push(input.state_type_id);
    }
    if (input.state_name !== undefined) {
      updates.push(`state_name = $${paramIndex++}`);
      values.push(input.state_name);
    }
    if (input.state_description !== undefined) {
      updates.push(`state_description = $${paramIndex++}`);
      values.push(input.state_description);
    }
    if (input.state_color !== undefined) {
      updates.push(`state_color = $${paramIndex++}`);
      values.push(input.state_color);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(state_id);
    const sql = `
      UPDATE state_definition
      SET ${updates.join(', ')}
      WHERE state_id = $${paramIndex} AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      throw new Error('State definition not found');
    }
    return result.rows[0];
  },

  deleteStateDefinition: async (_: any, args: { state_id: string }) => {
    const sql = `
      UPDATE state_definition
      SET removed = TRUE
      WHERE state_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.state_id]);
    if (result.rows.length === 0) {
      throw new Error('State definition not found or already deleted');
    }
    return result.rows[0];
  },

  // Downtime Reason Mutations
  createDowntimeReason: async (_: any, args: { input: any }) => {
    const { downtime_reason_code, downtime_reason_name, downtime_reason_description, is_planned } = args.input;
    const sql = `
      INSERT INTO downtime_reason (downtime_reason_code, downtime_reason_name, downtime_reason_description, is_planned)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(sql, [downtime_reason_code, downtime_reason_name, downtime_reason_description, is_planned]);
    return result.rows[0];
  },

  updateDowntimeReason: async (_: any, args: { downtime_reason_id: string; input: any }) => {
    const { downtime_reason_id, input } = args;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.downtime_reason_code !== undefined) {
      updates.push(`downtime_reason_code = $${paramIndex++}`);
      values.push(input.downtime_reason_code);
    }
    if (input.downtime_reason_name !== undefined) {
      updates.push(`downtime_reason_name = $${paramIndex++}`);
      values.push(input.downtime_reason_name);
    }
    if (input.downtime_reason_description !== undefined) {
      updates.push(`downtime_reason_description = $${paramIndex++}`);
      values.push(input.downtime_reason_description);
    }
    if (input.is_planned !== undefined) {
      updates.push(`is_planned = $${paramIndex++}`);
      values.push(input.is_planned);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(downtime_reason_id);
    const sql = `
      UPDATE downtime_reason
      SET ${updates.join(', ')}
      WHERE downtime_reason_id = $${paramIndex} AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      throw new Error('Downtime reason not found');
    }
    return result.rows[0];
  },

  deleteDowntimeReason: async (_: any, args: { downtime_reason_id: string }) => {
    const sql = `
      UPDATE downtime_reason
      SET removed = TRUE
      WHERE downtime_reason_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.downtime_reason_id]);
    if (result.rows.length === 0) {
      throw new Error('Downtime reason not found or already deleted');
    }
    return result.rows[0];
  },

  // Count Type Mutations
  createCountType: async (_: any, args: { input: any }) => {
    const { count_type_name, count_type_description, count_type_unit } = args.input;
    const sql = `
      INSERT INTO count_type (count_type_name, count_type_description, count_type_unit)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await query(sql, [count_type_name, count_type_description, count_type_unit]);
    return result.rows[0];
  },

  updateCountType: async (_: any, args: { count_type_id: string; input: any }) => {
    const { count_type_id, input } = args;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.count_type_name !== undefined) {
      updates.push(`count_type_name = $${paramIndex++}`);
      values.push(input.count_type_name);
    }
    if (input.count_type_description !== undefined) {
      updates.push(`count_type_description = $${paramIndex++}`);
      values.push(input.count_type_description);
    }
    if (input.count_type_unit !== undefined) {
      updates.push(`count_type_unit = $${paramIndex++}`);
      values.push(input.count_type_unit);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(count_type_id);
    const sql = `
      UPDATE count_type
      SET ${updates.join(', ')}
      WHERE count_type_id = $${paramIndex} AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      throw new Error('Count type not found');
    }
    return result.rows[0];
  },

  deleteCountType: async (_: any, args: { count_type_id: string }) => {
    const sql = `
      UPDATE count_type
      SET removed = TRUE
      WHERE count_type_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.count_type_id]);
    if (result.rows.length === 0) {
      throw new Error('Count type not found or already deleted');
    }
    return result.rows[0];
  },

  // Measurement Type Mutations
  createMeasurementType: async (_: any, args: { input: any }) => {
    const { measurement_type_name, measurement_type_description, measurement_type_unit } = args.input;
    const sql = `
      INSERT INTO measurement_type (measurement_type_name, measurement_type_description, measurement_type_unit)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await query(sql, [measurement_type_name, measurement_type_description, measurement_type_unit]);
    return result.rows[0];
  },

  updateMeasurementType: async (_: any, args: { measurement_type_id: string; input: any }) => {
    const { measurement_type_id, input } = args;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.measurement_type_name !== undefined) {
      updates.push(`measurement_type_name = $${paramIndex++}`);
      values.push(input.measurement_type_name);
    }
    if (input.measurement_type_description !== undefined) {
      updates.push(`measurement_type_description = $${paramIndex++}`);
      values.push(input.measurement_type_description);
    }
    if (input.measurement_type_unit !== undefined) {
      updates.push(`measurement_type_unit = $${paramIndex++}`);
      values.push(input.measurement_type_unit);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(measurement_type_id);
    const sql = `
      UPDATE measurement_type
      SET ${updates.join(', ')}
      WHERE measurement_type_id = $${paramIndex} AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      throw new Error('Measurement type not found');
    }
    return result.rows[0];
  },

  deleteMeasurementType: async (_: any, args: { measurement_type_id: string }) => {
    const sql = `
      UPDATE measurement_type
      SET removed = TRUE
      WHERE measurement_type_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.measurement_type_id]);
    if (result.rows.length === 0) {
      throw new Error('Measurement type not found or already deleted');
    }
    return result.rows[0];
  },

  // KPI Definition Mutations
  createKpiDefinition: async (_: any, args: { input: any }) => {
    const { kpi_name, kpi_description, kpi_unit, kpi_formula } = args.input;
    const sql = `
      INSERT INTO kpi_definition (kpi_name, kpi_description, kpi_unit, kpi_formula)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(sql, [kpi_name, kpi_description, kpi_unit, kpi_formula]);
    return result.rows[0];
  },

  updateKpiDefinition: async (_: any, args: { kpi_id: string; input: any }) => {
    const { kpi_id, input } = args;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.kpi_name !== undefined) {
      updates.push(`kpi_name = $${paramIndex++}`);
      values.push(input.kpi_name);
    }
    if (input.kpi_description !== undefined) {
      updates.push(`kpi_description = $${paramIndex++}`);
      values.push(input.kpi_description);
    }
    if (input.kpi_unit !== undefined) {
      updates.push(`kpi_unit = $${paramIndex++}`);
      values.push(input.kpi_unit);
    }
    if (input.kpi_formula !== undefined) {
      updates.push(`kpi_formula = $${paramIndex++}`);
      values.push(input.kpi_formula);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(kpi_id);
    const sql = `
      UPDATE kpi_definition
      SET ${updates.join(', ')}
      WHERE kpi_id = $${paramIndex} AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      throw new Error('KPI definition not found');
    }
    return result.rows[0];
  },

  deleteKpiDefinition: async (_: any, args: { kpi_id: string }) => {
    const sql = `
      UPDATE kpi_definition
      SET removed = TRUE
      WHERE kpi_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.kpi_id]);
    if (result.rows.length === 0) {
      throw new Error('KPI definition not found or already deleted');
    }
    return result.rows[0];
  },
};
