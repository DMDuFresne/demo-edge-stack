import { DateTimeScalar, JSONScalar } from '../utils/scalars';
import { lookupResolvers } from './lookupResolvers';
import { masterDataResolvers } from './masterDataResolvers';
import { logResolvers } from './logResolvers';
import { lookupMutations } from './lookupMutations';
import { masterDataMutations } from './masterDataMutations';
import { logMutations } from './logMutations';

// Merge all resolvers
export const resolvers = {
  DateTime: DateTimeScalar,
  JSON: JSONScalar,

  Query: {
    ...lookupResolvers.Query,
    ...masterDataResolvers.Query,
    ...logResolvers.Query,
  },

  Mutation: {
    ...lookupMutations,
    ...masterDataMutations,
    ...logMutations,
  },

  // Type resolvers
  StateDefinition: lookupResolvers.StateDefinition,
  AssetDefinition: masterDataResolvers.AssetDefinition,
  ProductDefinition: masterDataResolvers.ProductDefinition,
  PerformanceTarget: masterDataResolvers.PerformanceTarget,
  StateLog: logResolvers.StateLog,
  ProductionLog: logResolvers.ProductionLog,
  CountLog: logResolvers.CountLog,
  MeasurementLog: logResolvers.MeasurementLog,
  KpiLog: logResolvers.KpiLog,
};
