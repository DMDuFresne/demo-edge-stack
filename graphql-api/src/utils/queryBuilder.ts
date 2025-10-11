export interface QueryFilter {
  [key: string]: any;
}

export function buildWhereClause(
  filter: QueryFilter | undefined,
  startIndex: number = 1
): { whereClause: string; values: any[]; nextIndex: number } {
  if (!filter || Object.keys(filter).length === 0) {
    return { whereClause: '', values: [], nextIndex: startIndex };
  }

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = startIndex;

  for (const [key, value] of Object.entries(filter)) {
    if (value === undefined || value === null) continue;

    // Handle date range filters
    if (typeof value === 'object' && (value.from || value.to)) {
      if (value.from) {
        conditions.push(`${key} >= $${paramIndex}`);
        values.push(value.from);
        paramIndex++;
      }
      if (value.to) {
        conditions.push(`${key} <= $${paramIndex}`);
        values.push(value.to);
        paramIndex++;
      }
    } else {
      conditions.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { whereClause, values, nextIndex: paramIndex };
}

export function buildPagination(limit?: number, offset?: number): string {
  const parts: string[] = [];

  if (limit) {
    parts.push(`LIMIT ${limit}`);
  }

  if (offset) {
    parts.push(`OFFSET ${offset}`);
  }

  return parts.join(' ');
}
