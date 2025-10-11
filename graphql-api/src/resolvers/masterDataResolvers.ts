import { query } from '../db/pool';
import { buildWhereClause } from '../utils/queryBuilder';

export const masterDataResolvers = {
  Query: {
    // Asset Definitions
    assetDefinitions: async (_: any, args: { asset_type_id?: string; parent_asset_id?: string }) => {
      const filter: any = { removed: false };
      if (args.asset_type_id) filter.asset_type_id = args.asset_type_id;
      if (args.parent_asset_id) filter.parent_asset_id = args.parent_asset_id;

      const { whereClause, values } = buildWhereClause(filter);
      const sql = `SELECT * FROM asset_definition ${whereClause} ORDER BY asset_name`;
      const result = await query(sql, values);
      return result.rows;
    },

    assetDefinition: async (_: any, args: { asset_id: string }) => {
      const result = await query(
        'SELECT * FROM asset_definition WHERE asset_id = $1 AND removed = false',
        [args.asset_id]
      );
      return result.rows[0];
    },

    // Product Families
    productFamilies: async () => {
      const { whereClause, values } = buildWhereClause({ removed: false });
      const sql = `SELECT * FROM product_family ${whereClause} ORDER BY product_family_name`;
      const result = await query(sql, values);
      return result.rows;
    },

    productFamily: async (_: any, args: { product_family_id: string }) => {
      const result = await query(
        'SELECT * FROM product_family WHERE product_family_id = $1 AND removed = false',
        [args.product_family_id]
      );
      return result.rows[0];
    },

    // Product Definitions
    productDefinitions: async (_: any, args: { product_family_id?: string }) => {
      const filter: any = { removed: false };
      if (args.product_family_id) filter.product_family_id = args.product_family_id;

      const { whereClause, values } = buildWhereClause(filter);
      const sql = `SELECT * FROM product_definition ${whereClause} ORDER BY product_name`;
      const result = await query(sql, values);
      return result.rows;
    },

    productDefinition: async (_: any, args: { product_id: string }) => {
      const result = await query(
        'SELECT * FROM product_definition WHERE product_id = $1 AND removed = false',
        [args.product_id]
      );
      return result.rows[0];
    },

    // Performance Targets
    performanceTargets: async (_: any, args: { asset_id?: string; product_id?: string }) => {
      const filter: any = { removed: false };
      if (args.asset_id) filter.asset_id = args.asset_id;
      if (args.product_id) filter.product_id = args.product_id;

      const { whereClause, values } = buildWhereClause(filter);
      const sql = `SELECT * FROM performance_target ${whereClause}`;
      const result = await query(sql, values);
      return result.rows;
    },

    performanceTarget: async (_: any, args: { asset_id: string; product_id: string }) => {
      const result = await query(
        'SELECT * FROM performance_target WHERE asset_id = $1 AND product_id = $2 AND removed = false',
        [args.asset_id, args.product_id]
      );
      return result.rows[0];
    },
  },

  // Field resolvers
  AssetDefinition: {
    asset_type: async (parent: any) => {
      const result = await query(
        'SELECT * FROM asset_type WHERE asset_type_id = $1',
        [parent.asset_type_id]
      );
      return result.rows[0];
    },
    parent_asset: async (parent: any) => {
      if (!parent.parent_asset_id) return null;
      const result = await query(
        'SELECT * FROM asset_definition WHERE asset_id = $1',
        [parent.parent_asset_id]
      );
      return result.rows[0];
    },
  },

  ProductDefinition: {
    product_family: async (parent: any) => {
      if (!parent.product_family_id) return null;
      const result = await query(
        'SELECT * FROM product_family WHERE product_family_id = $1',
        [parent.product_family_id]
      );
      return result.rows[0];
    },
  },

  PerformanceTarget: {
    product: async (parent: any) => {
      const result = await query(
        'SELECT * FROM product_definition WHERE product_id = $1',
        [parent.product_id]
      );
      return result.rows[0];
    },
    asset: async (parent: any) => {
      const result = await query(
        'SELECT * FROM asset_definition WHERE asset_id = $1',
        [parent.asset_id]
      );
      return result.rows[0];
    },
  },
};
