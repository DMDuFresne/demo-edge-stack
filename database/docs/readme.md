# 📚 Database Documentation

This section provides comprehensive documentation for the Abelara MES database structure, including tables, views, and functions across all schemas.

## 🗂️ Schema Organization

```
mes (database)
├── mes_core    → Production data (assets, state, production, counts, measurements, KPIs)
├── mes_audit   → Automatic change tracking (audit trail)
└── mes_custom  → Project-specific customizations
```

---

## 📋 Table of Contents

### 🏭 MES Core (`mes_core`)

Production data and operational intelligence.

#### 📊 Tables
- [Production Logs](core/tables/production-logs.md) - Real-time production data tables
- [Master Data](core/tables/master-data.md) - Core reference data tables
- [Notes Tables](core/tables/notes-tables.md) - Documentation and annotation tables
- [Audit Tables](core/tables/audit-tables.md) - System audit and tracking tables
- [Lookup Tables](core/tables/lookup-tables.md) - Reference and enumeration tables

#### 👁 Views
- [State Views](core/views/state-views.md) - Asset state monitoring views
- [Unified Views](core/views/unified-views.md) - Combined data access views
- [KPI Views](core/views/kpi-views.md) - Performance metric views
- [Production Views](core/views/production-views.md) - Production monitoring views
- [Measurement Views](core/views/measurement-views.md) - Measurement monitoring views
- [Count Views](core/views/count-views.md) - Production counting views

#### ⚙️ Functions
- [Asset Functions](core/functions/asset-functions.md) - Asset management functions
- [Trigger Functions](core/functions/trigger-functions.md) - Database trigger functions
- [Validation Functions](core/functions/validation-functions.md) - Data validation functions

---

## 🔄 Navigation

Each documentation file includes:
- A "Back to Database Overview" link at the top
- Clear section headers with emojis
- Detailed table descriptions and schemas
- Related links to connected components

## 📝 Notes

- All tables include standard audit columns
- TimescaleDB features are used for time-series data
- Foreign key relationships are maintained via triggers or constraints
- Soft deletes (`removed` column) preserve audit trails
- Documentation is kept up-to-date with schema changes 