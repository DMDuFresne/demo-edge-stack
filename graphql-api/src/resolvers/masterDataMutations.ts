import { query } from '../db/pool';

export const masterDataMutations = {
  // Asset Definition Mutations
  createAssetDefinition: async (_: any, args: { input: any }) => {
    const { asset_name, asset_description, asset_type_id, parent_asset_id, tag_path } = args.input;
    const sql = `
      INSERT INTO asset_definition (asset_name, asset_description, asset_type_id, parent_asset_id, tag_path)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await query(sql, [asset_name, asset_description, asset_type_id, parent_asset_id, tag_path]);
    return result.rows[0];
  },

  updateAssetDefinition: async (_: any, args: { asset_id: string; input: any }) => {
    const { asset_id, input } = args;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.asset_name !== undefined) {
      updates.push(`asset_name = $${paramIndex++}`);
      values.push(input.asset_name);
    }
    if (input.asset_description !== undefined) {
      updates.push(`asset_description = $${paramIndex++}`);
      values.push(input.asset_description);
    }
    if (input.asset_type_id !== undefined) {
      updates.push(`asset_type_id = $${paramIndex++}`);
      values.push(input.asset_type_id);
    }
    if (input.parent_asset_id !== undefined) {
      updates.push(`parent_asset_id = $${paramIndex++}`);
      values.push(input.parent_asset_id);
    }
    if (input.tag_path !== undefined) {
      updates.push(`tag_path = $${paramIndex++}`);
      values.push(input.tag_path);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(asset_id);
    const sql = `
      UPDATE asset_definition
      SET ${updates.join(', ')}
      WHERE asset_id = $${paramIndex} AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      throw new Error('Asset definition not found');
    }
    return result.rows[0];
  },

  deleteAssetDefinition: async (_: any, args: { asset_id: string }) => {
    const sql = `
      UPDATE asset_definition
      SET removed = TRUE
      WHERE asset_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.asset_id]);
    if (result.rows.length === 0) {
      throw new Error('Asset definition not found or already deleted');
    }
    return result.rows[0];
  },

  // Product Family Mutations
  createProductFamily: async (_: any, args: { input: any }) => {
    const { product_family_name, product_family_description } = args.input;
    const sql = `
      INSERT INTO product_family (product_family_name, product_family_description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await query(sql, [product_family_name, product_family_description]);
    return result.rows[0];
  },

  updateProductFamily: async (_: any, args: { product_family_id: string; input: any }) => {
    const { product_family_id, input } = args;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.product_family_name !== undefined) {
      updates.push(`product_family_name = $${paramIndex++}`);
      values.push(input.product_family_name);
    }
    if (input.product_family_description !== undefined) {
      updates.push(`product_family_description = $${paramIndex++}`);
      values.push(input.product_family_description);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(product_family_id);
    const sql = `
      UPDATE product_family
      SET ${updates.join(', ')}
      WHERE product_family_id = $${paramIndex} AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      throw new Error('Product family not found');
    }
    return result.rows[0];
  },

  deleteProductFamily: async (_: any, args: { product_family_id: string }) => {
    const sql = `
      UPDATE product_family
      SET removed = TRUE
      WHERE product_family_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.product_family_id]);
    if (result.rows.length === 0) {
      throw new Error('Product family not found or already deleted');
    }
    return result.rows[0];
  },

  // Product Definition Mutations
  createProductDefinition: async (_: any, args: { input: any }) => {
    const { product_name, product_description, product_family_id, unit_of_measure, tolerance, ideal_cycle_time } = args.input;
    const sql = `
      INSERT INTO product_definition (product_name, product_description, product_family_id, unit_of_measure, tolerance, ideal_cycle_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await query(sql, [product_name, product_description, product_family_id, unit_of_measure, tolerance, ideal_cycle_time]);
    return result.rows[0];
  },

  updateProductDefinition: async (_: any, args: { product_id: string; input: any }) => {
    const { product_id, input } = args;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.product_name !== undefined) {
      updates.push(`product_name = $${paramIndex++}`);
      values.push(input.product_name);
    }
    if (input.product_description !== undefined) {
      updates.push(`product_description = $${paramIndex++}`);
      values.push(input.product_description);
    }
    if (input.product_family_id !== undefined) {
      updates.push(`product_family_id = $${paramIndex++}`);
      values.push(input.product_family_id);
    }
    if (input.unit_of_measure !== undefined) {
      updates.push(`unit_of_measure = $${paramIndex++}`);
      values.push(input.unit_of_measure);
    }
    if (input.tolerance !== undefined) {
      updates.push(`tolerance = $${paramIndex++}`);
      values.push(input.tolerance);
    }
    if (input.ideal_cycle_time !== undefined) {
      updates.push(`ideal_cycle_time = $${paramIndex++}`);
      values.push(input.ideal_cycle_time);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(product_id);
    const sql = `
      UPDATE product_definition
      SET ${updates.join(', ')}
      WHERE product_id = $${paramIndex} AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      throw new Error('Product definition not found');
    }
    return result.rows[0];
  },

  deleteProductDefinition: async (_: any, args: { product_id: string }) => {
    const sql = `
      UPDATE product_definition
      SET removed = TRUE
      WHERE product_id = $1 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.product_id]);
    if (result.rows.length === 0) {
      throw new Error('Product definition not found or already deleted');
    }
    return result.rows[0];
  },

  // Performance Target Mutations
  createPerformanceTarget: async (_: any, args: { input: any }) => {
    const { product_id, asset_id, target_value, target_unit } = args.input;
    const sql = `
      INSERT INTO performance_target (product_id, asset_id, target_value, target_unit)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(sql, [product_id, asset_id, target_value, target_unit]);
    return result.rows[0];
  },

  updatePerformanceTarget: async (_: any, args: { asset_id: string; product_id: string; input: any }) => {
    const { asset_id, product_id, input } = args;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.target_value !== undefined) {
      updates.push(`target_value = $${paramIndex++}`);
      values.push(input.target_value);
    }
    if (input.target_unit !== undefined) {
      updates.push(`target_unit = $${paramIndex++}`);
      values.push(input.target_unit);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(asset_id, product_id);
    const sql = `
      UPDATE performance_target
      SET ${updates.join(', ')}
      WHERE asset_id = $${paramIndex++} AND product_id = $${paramIndex} AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      throw new Error('Performance target not found');
    }
    return result.rows[0];
  },

  deletePerformanceTarget: async (_: any, args: { asset_id: string; product_id: string }) => {
    const sql = `
      UPDATE performance_target
      SET removed = TRUE
      WHERE asset_id = $1 AND product_id = $2 AND removed = FALSE
      RETURNING *
    `;
    const result = await query(sql, [args.asset_id, args.product_id]);
    if (result.rows.length === 0) {
      throw new Error('Performance target not found or already deleted');
    }
    return result.rows[0];
  },
};
