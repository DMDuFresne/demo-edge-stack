# MES Edge Stack

A complete Manufacturing Execution System (MES) for your edge deployments—collect sensor data, manage production workflows, and visualize real-time operations in minutes.

**Perfect for manufacturing facilities** looking to deploy modern IIoT infrastructure without cloud dependencies. This open-source stack combines TimescaleDB time-series storage, a modern GraphQL API, SCADA integration, and industrial protocols—all containerized and ready to run.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)](PRODUCTION_VALIDATION.md)
[![Docker](https://img.shields.io/badge/Docker-24.0%2B-blue.svg)](https://www.docker.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo%20Server%20v4-e10098.svg)](http://localhost:4000/graphql)

---

## Overview

You get a production-ready MES edge stack with a complete database schema, modern GraphQL API, time-series data storage, MQTT infrastructure, SCADA integration, and comprehensive monitoring. Everything is containerized with Docker for turnkey deployment.

### ✨ Key Features

- 🚀 **GraphQL API** - Modern Apollo Server v4 with 90+ operations and full CRUD across entire MES schema
- 📊 **TimescaleDB** - PostgreSQL 17-based time-series database optimized for industrial IoT data volumes
- 🐳 **Docker Stack** - Complete containerized deployment with 12 production-ready services
- 🗄️ **MES Schema** - 39 tables covering production logs, state tracking, KPIs, measurements, and audit trails
- 💬 **Message Broker** - Solace PubSub+ with MQTT, AMQP, REST, and SMF protocol support
- ⚙️ **SCADA Integration** - Ignition Gateway for industrial automation and OPC-UA connectivity
- 📈 **Historian** - TimeBase data collection, storage, and visualization
- 🔍 **Monitoring** - Homepage dashboard, Glances resource monitor, automated backups, and health checks

---

Ready to get started? Let's get your stack running.

## 🚀 Quick Start

### 🎓 New to Docker?

**Start here:** Install Docker Desktop from [docker.com/get-started](https://www.docker.com/get-started). It includes Docker Engine and Docker Compose—everything you need.

### 🐳 Already Have Docker?

Get up and running in 3 steps:

## What You'll Need

Before you begin, make sure you have:

- **Docker** 24.0+ and **Docker Compose** 2.20+
- **RAM:** 8GB minimum (16GB recommended for production)
- **Disk:** 50GB available storage
- **OS:** Linux, macOS, or Windows with WSL2

**Time Required:** About 10 minutes

---

### Installation

**1. Clone and Configure**

```bash
# Clone the repository
git clone <repository-url>
cd demo-edge-stack

# Copy environment template
cp example.env .env

# ⚠️ IMPORTANT: Edit .env and change all passwords!
nano .env
```

**What this does:** Sets up your project directory and creates your configuration file with environment-specific settings. The `.env` file keeps sensitive passwords out of version control.

**2. Deploy Stack**

```bash
# Start all services
docker-compose up -d

# Verify deployment
docker-compose ps
```

**Expected output:**
```
NAME                  IMAGE                              STATUS
mes-database          timescale/timescaledb:latest-pg17  Up (healthy)
mes-graphql-api       demo-edge-stack-graphql-api        Up (healthy)
mes-homepage          ghcr.io/gethomepage/homepage       Up
mes-ignition-gateway  inductiveautomation/ignition       Up
mes-solace-broker     solace/solace-pubsub-standard      Up (healthy)
...
```

All services should show "Up" or "Up (healthy)" status.

```bash
# Optional: View logs to watch services start
docker-compose logs -f
```

✅ **Your stack is running!** Let's access the dashboard.

**3. Access Dashboard**

Open **http://localhost:3000** in your browser.

You'll see your central Homepage dashboard with links to all 12 services.

🎉 **You're all set!** Your MES edge stack is operational and ready to collect data.

### 🌐 Primary Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| 📊 **GraphQL API** | http://localhost:4000/graphql | Apollo Studio - Interactive API playground |
| 🏠 **Homepage** | http://localhost:3000 | Central dashboard and service hub |
| ⚙️ **Ignition** | http://localhost:8088 | SCADA gateway and designer |
| 🗄️ **pgAdmin** | http://localhost:5050 | Database administration interface |

---

## 📦 Services

The deployment includes 12 containerized services, all production-ready:

| Service | Port(s) | Description | Status |
|---------|---------|-------------|--------|
| **GraphQL API** | 4000 | Apollo Server v4 with 90+ operations | ✅ Production Ready |
| **Homepage** | 3000 | Central dashboard for all services | ✅ Healthy |
| **TimescaleDB** | 5432 | Time-series PostgreSQL 17 database | ✅ Healthy |
| **pgAdmin** | 5050 | Database administration interface | ✅ Running |
| **Solace PubSub+** | 8080, 1883, 55555 | Enterprise message broker | ✅ Healthy |
| **Ignition Gateway** | 8088, 8043, 8060 | Industrial SCADA platform | ✅ Healthy |
| **TimeBase Historian** | 4511 | Time-series data historian | ✅ Running |
| **TimeBase Collector** | 4521 | MQTT data collector service | ✅ Running |
| **TimeBase Explorer** | 4531 | Data visualization and trending | ✅ Running |
| **Glances** | 61208 | System resource monitoring | ✅ Running |
| **Watchtower** | 8070 | Container update monitoring | ✅ Healthy |
| **Database Backup** | 8888 | Automated encrypted backups | ✅ Healthy |

**All 12 services operational** ✅

---

Now that you understand the API layer, let's explore what you can do with it.

## 🔌 GraphQL API

### Overview

You can access a modern GraphQL API built with **Apollo Server v4** that provides complete CRUD operations across the entire MES database schema with interactive documentation.

**🔗 Endpoints:**
- **Apollo Studio**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health
- **GraphQL Endpoint**: http://localhost:4000/graphql

### What Can You Do With This API?

**For application developers:**
- Build custom dashboards and HMIs that query production data in real-time
- Create mobile apps that monitor equipment status and KPIs
- Integrate with ERP systems to sync production schedules and targets

**For data analysts:**
- Query historical production data without writing SQL
- Extract measurement logs and KPIs for analysis in Excel or Python
- Build custom reports with any programming language that supports HTTP

**For automation engineers:**
- Write scripts to update asset definitions and production targets
- Automate data entry from spreadsheets or other systems
- Create custom integrations between MES and other plant systems

**Example use case:** Query the last 24 hours of downtime for a specific asset, grouped by downtime reason.

### Features

✨ **90+ GraphQL Operations**
- 20+ Query operations (lookups, master data, logs)
- 50+ Mutation operations (full CRUD capabilities)
- Field relationships with automatic resolution
- Pagination and filtering support

📋 **Complete Schema Coverage**
- 7 Lookup table types (asset types, states, KPIs, etc.)
- 4 Master data types (assets, products, families, targets)
- 5 Log types (state, production, count, measurement, KPI)
- 6 Note types (full CRUD on annotations)

🛡️ **Production Features**
- **Soft delete isolation** - Our system completely hides deleted records from queries
- **Type safety** - Custom scalars (DateTime, JSON) with validation
- **Input validation** - All mutations validated before execution
- **Relationship resolution** - Nested queries with automatic joins
- **Health monitoring** - Real-time service health endpoint

### 📖 API Documentation

Explore the complete schema interactively:

1. Open **http://localhost:4000/graphql** in your browser
2. Use Apollo Studio's built-in documentation browser
3. Run queries and mutations directly in the GUI
4. View schema, types, and field documentation

### Example Queries

```graphql
# Get all active assets with their types
query GetAssets {
  assetDefinitions {
    asset_id
    asset_name
    asset_type {
      asset_type_name
    }
  }
}

# Create a new count type
mutation CreateCountType {
  createCountType(input: {
    count_type_name: "Production Count"
    count_type_unit: "units"
    count_type_description: "Good production units"
  }) {
    count_type_id
    count_type_name
  }
}

# Get recent state logs with filtering
query GetStateLogs {
  stateLogs(limit: 10) {
    state_log_id
    asset_name
    state_name
    logged_at
  }
}
```

---

## 🗄️ Database Schema

The database is organized into three schemas with **39 total tables**:

### `mes_core` - Production Data (21 tables)

**Lookup Tables (7)**
- Asset types, state types, state definitions
- Downtime reasons, count types, measurement types
- KPI definitions

**Master Data (4)**
- Asset definitions (equipment hierarchy)
- Product families and definitions
- Performance targets

**Log Tables (10)**
- State logs (equipment state changes) - **Hypertable** ⚡
- Production logs (production runs) - **Hypertable** ⚡
- Count logs (production/waste counts) - **Hypertable** ⚡
- Measurement logs (quality measurements) - **Hypertable** ⚡
- KPI logs (calculated KPIs) - **Hypertable** ⚡
- Note tables for all log types (6 tables)

**⚡ Time-Series Optimization:**
- 6 hypertables configured for high-performance time-series queries
- Automatic data partitioning by time
- Optimized for industrial IoT data volumes (millions of rows)

### `mes_audit` - Change Tracking

- Automatic audit trail for all master data changes
- Tracks who, what, when, and previous values
- 3-year retention policy with automatic cleanup

### `mes_custom` - Project Extensions

- Reserved for project-specific customizations
- Keeps core schema clean and upgradeable
- Isolated from core schema updates

📖 See [database/README.md](database/README.md) for detailed schema documentation.

---

## 📁 Project Structure

```
demo-edge-stack/
├── graphql-api/           # GraphQL API service
│   ├── src/
│   │   ├── types/        # GraphQL schema definitions
│   │   ├── resolvers/    # Query and mutation resolvers
│   │   ├── db/           # Database connection pool
│   │   └── utils/        # Helper functions and scalars
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── database/              # Database schema and documentation
│   ├── creation/         # SQL creation scripts (numbered order)
│   ├── seed/             # Seed data scripts
│   ├── docs/             # Table and view documentation
│   ├── README.md         # Database-specific guide
│   ├── schema.dbml       # Database diagram (DBML format)
│   └── style-guide.md    # SQL naming conventions
│
├── config/               # Service configurations
│   ├── glances/         # System monitoring config
│   └── homepage/        # Dashboard config (services.yaml)
│
├── backups/              # Automated backup storage (gitignored)
│   ├── database/        # Database backups
│   └── ignition/        # Ignition backups
│
├── docs/                 # Project documentation
│   └── DEPLOYMENT.md    # Detailed deployment guide
│
├── docker-compose.yml    # Service definitions
├── .env                  # Environment configuration
├── example.env           # Environment template
├── LICENSE               # MIT License
├── PRODUCTION_VALIDATION.md  # Validation report
└── README.md             # This file
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[PRODUCTION_VALIDATION.md](PRODUCTION_VALIDATION.md)** | Complete validation report and production readiness checklist |
| **[database/README.md](database/README.md)** | Database schema, tables, views, and functions |
| **[database/style-guide.md](database/style-guide.md)** | SQL coding standards and conventions |
| **[database/docs/](database/docs/)** | Detailed table and view documentation |
| **[graphql-api/README.md](graphql-api/README.md)** | GraphQL API development guide |
| **[GraphQL API](http://localhost:4000/graphql)** | Interactive API documentation (Apollo Studio) |

---

## 🔧 Common Tasks

### GraphQL API Management

```bash
# View API logs
docker-compose logs -f graphql-api

# Restart API
docker-compose restart graphql-api

# Rebuild API after code changes
cd graphql-api && npm run build
docker-compose build graphql-api
docker-compose up -d graphql-api

# Test API health
curl http://localhost:4000/health
```

### Service Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart timescaledb

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f graphql-api
```

### Database Operations

```bash
# Connect to database via psql
docker exec -it mes-database psql -U admin -d mes
```

**Expected output:**
```
psql (17.0)
Type "help" for help.

mes=#
```

**What this does:** Opens an interactive PostgreSQL shell connected to your MES database. You can now run SQL queries directly.

```bash
# View tables in the mes_core schema
docker exec mes-database psql -U admin -d mes -c "\dt mes_core.*"
```

**Expected output:**
```
                    List of relations
  Schema   |           Name            | Type  | Owner
-----------+---------------------------+-------+-------
 mes_core  | asset_definition          | table | admin
 mes_core  | asset_type                | table | admin
 mes_core  | state_definition          | table | admin
...
```

```bash
# Run a query to see your assets
docker exec mes-database psql -U admin -d mes -c "SELECT * FROM mes_core.asset_definition LIMIT 5;"

# Check which tables are time-series optimized (hypertables)
docker exec mes-database psql -U admin -d mes -c "SELECT * FROM timescaledb_information.hypertables;"
```

**What this does:** Shows you which log tables (state_log, production_log, etc.) are configured as TimescaleDB hypertables for high-performance time-series queries.

### Backup Management

```bash
# Backups run automatically daily at midnight
# Location: ./backups/database/

# Manual backup
docker exec mes-database-backup /backup.sh

# List backups
ls -lh backups/database/

# View backup service logs
docker-compose logs db-backup
```

### Monitoring & Health Checks

Access monitoring interfaces:

- 🏠 **Homepage Dashboard**: http://localhost:3000
- 📊 **GraphQL API**: http://localhost:4000/graphql
- 🗄️ **Database Admin**: http://localhost:5050
- 📈 **System Monitor**: http://localhost:61208
- 💬 **Message Broker**: http://localhost:8080
- ⚙️ **Ignition Gateway**: http://localhost:8088

```bash
# Check all service health
docker-compose ps

# View resource usage
docker stats

# Check specific service health
docker inspect mes-graphql-api --format='{{.State.Health.Status}}'
```

---

## ⚙️ Configuration

The stack works out of the box with sensible defaults, but you can customize everything via environment variables in the `.env` file.

**Common customizations:**

```bash
# Set your local timezone for accurate log timestamps
TZ=America/Chicago

# Use specific versions for production stability
TIMESCALEDB_TAG=latest-pg17
IGNITION_TAG=8.3.0

# Change ports if defaults conflict with existing services
GRAPHQL_PORT=4000
PGADMIN_PORT=5050
HOMEPAGE_PORT=3000

# Database credentials
DB_NAME=mes
DB_USER=admin
DB_PASSWORD=changeme  # ⚠️ Change in production!

# Backup settings
BACKUP_RETENTION_DAYS=30
BACKUP_ENCRYPTION_KEY=changeme  # ⚠️ Use 32-character key!
```

**Why use environment variables instead of editing docker-compose.yml?**
- Cleaner git history (`.env` is in `.gitignore`)
- Easier to manage multiple environments (dev/staging/prod)
- No risk of merge conflicts in docker-compose.yml
- Sensitive passwords never get committed to version control

See `example.env` for all available options with detailed comments.

### ⚠️ Security: Change Default Passwords

**IMPORTANT:** Several services use default passwords that must be changed before production deployment.

**What's at risk:**
- **Database access:** Anyone with network access could read/modify production data
- **Admin interfaces:** Unauthorized users could reconfigure your entire stack
- **Backup encryption:** Weak keys could allow backup data to be decrypted

**Required actions before production:**

1. **Generate strong passwords:**
   ```bash
   # Generate a strong password (32 characters)
   openssl rand -base64 32
   ```

2. **Update these values in `.env`:**
   ```bash
   DB_PASSWORD=<generated-password>
   PGADMIN_DEFAULT_PASSWORD=<generated-password>
   SOLACE_ADMIN_PASSWORD=<generated-password>
   BACKUP_ENCRYPTION_KEY=<generated-password>
   ```

3. **Secure the .env file:**
   ```bash
   chmod 600 .env

   # Verify it's in .gitignore
   cat .gitignore | grep .env
   ```

✅ **Passwords changed!** Your stack is now secure for production use.

---

## 💻 Development

### GraphQL API Development

```bash
# Navigate to API directory
cd graphql-api

# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Run tests (when implemented)
npm test
```

### Database Schema Changes

**Workflow for schema modifications:**

1. ❌ **Never** modify creation scripts directly
2. ✅ Create new migration scripts for changes
3. 📊 Update DBML schema diagram
4. 🔌 Update GraphQL schema in `graphql-api/src/types/schema.ts`
5. 🔧 Update resolvers as needed
6. 📝 Document changes in `database/docs/`
7. ✅ Test thoroughly with sample data

### Custom Tables

Create custom tables in the `mes_custom` schema to keep them isolated:

```sql
CREATE TABLE mes_custom.my_custom_table (
    id BIGSERIAL PRIMARY KEY,
    -- your columns here
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT DEFAULT CURRENT_USER,
    removed BOOLEAN DEFAULT FALSE  -- Soft delete support
);
```

Then add corresponding GraphQL types and resolvers for your custom tables.

---

## ✅ Production Validation

### Stack Status: **FULLY OPERATIONAL** ✅

**Validation Summary:**
- ✅ 12/12 Services Running
- ✅ 7/7 Health Checks Passing
- ✅ 8/8 Endpoints Accessible
- ✅ 6/6 Functional Tests Passed
- ✅ 39 Database Tables Deployed
- ✅ 90+ GraphQL Operations Available
- ✅ Resource Usage: Optimal (~27% CPU, ~3.3GB RAM)

📋 See [PRODUCTION_VALIDATION.md](PRODUCTION_VALIDATION.md) for complete validation report.

### Production Readiness Checklist

✅ **Infrastructure**
- All services running and healthy
- Health checks configured and passing
- Network connectivity verified
- Resource limits defined and optimal

✅ **Database**
- TimescaleDB installed with 6 hypertables
- 39 tables deployed and validated
- Sample data loaded
- Automated backups configured

✅ **API Layer**
- GraphQL server operational
- Apollo Studio enabled
- 90+ operations functional
- Soft delete properly isolated
- Type safety enforced

✅ **Integration**
- MQTT broker active
- SCADA integration ready
- Historian services running
- Message protocols enabled

✅ **Monitoring**
- Resource monitoring active
- Dashboard configured
- Backup automation working
- Auto-update service enabled

### 🚨 Production Recommendations

**Before external/internet-facing deployment:**

- [ ] Add HTTPS/TLS termination (Traefik, Nginx, Caddy)
- [ ] Implement API rate limiting (Redis + GraphQL middleware)
- [ ] Configure external secrets management (HashiCorp Vault, AWS Secrets Manager)
- [ ] Set up centralized logging (ELK Stack, Grafana Loki)
- [ ] Configure monitoring alerts (Prometheus + Grafana)

---

## 🔍 Troubleshooting

### Problem: Service Won't Start

**Symptoms:**
- Container exits immediately after starting
- `docker-compose ps` shows status as "Exited (1)"
- Service restarts in a loop

**Root Cause:** Usually a configuration error, port conflict, or missing dependency.

**Solutions:**

1. **Check the logs for specific errors:**
   ```bash
   docker-compose logs graphql-api
   ```

   Look for error messages in the last 20 lines. Common issues:
   - "Address already in use" → Port conflict (see solution 2)
   - "Connection refused" → Database not ready (see solution 3)
   - "Permission denied" → Volume permission issue (see solution 4)

2. **If you see "Address already in use":**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :4000  # Windows
   lsof -i :4000                 # Linux/macOS
   ```

   Either stop the conflicting service or change your service's port in `.env`:
   ```bash
   GRAPHQL_PORT=4001
   ```

   Then restart:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

3. **If you see "Connection refused to database":**
   ```bash
   # Verify database is running and healthy
   docker-compose ps timescaledb
   ```

   **Expected output:** Status should show "Up (healthy)"

   If not healthy, check database logs:
   ```bash
   docker-compose logs timescaledb
   ```

4. **If you see "Permission denied":**

   Fix volume permissions:
   ```bash
   sudo chown -R 1000:1000 ./backups
   docker-compose restart <service-name>
   ```

5. **Verify configuration syntax:**
   ```bash
   docker-compose config
   ```

   **What this does:** Validates your docker-compose.yml and .env files for syntax errors.

**Still stuck?** Open an issue with your error logs and system info.

### Problem: GraphQL API Not Responding

**Symptoms:**
- Apollo Studio won't load at http://localhost:4000/graphql
- Health check endpoint times out
- API returns 500 errors

**Root Cause:** Usually database connection issues or API startup errors.

**Solutions:**

1. **Check API logs for errors:**
   ```bash
   docker-compose logs graphql-api
   ```

   Common errors:
   - "ECONNREFUSED" → Can't connect to database (see solution 2)
   - "Syntax error" → GraphQL schema or resolver issue (see solution 3)
   - "Out of memory" → Increase container memory limits

2. **Test database connection:**
   ```bash
   # Verify database is accessible from API container
   docker-compose exec graphql-api ping mes-database
   ```

   **Expected output:** Reply from mes-database

3. **Test the health endpoint:**
   ```bash
   curl http://localhost:4000/health
   ```

   **Expected output:**
   ```json
   {"status":"ok","database":"connected"}
   ```

4. **Test GraphQL endpoint:**
   ```bash
   curl -X POST http://localhost:4000/graphql \
     -H "Content-Type: application/json" \
     -d '{"query":"{ __typename }"}'
   ```

   **Expected output:**
   ```json
   {"data":{"__typename":"Query"}}
   ```

5. **Rebuild and restart API (if you made code changes):**
   ```bash
   cd graphql-api && npm run build
   docker-compose build graphql-api
   docker-compose up -d graphql-api
   ```

   **What this does:** Rebuilds the TypeScript code to JavaScript, creates a new Docker image, and restarts the container with the new code.

### Problem: Database Connection Issues

**Symptoms:**
- Services show "Can't connect to database" errors
- GraphQL API won't start
- pgAdmin shows "Unable to connect to server"

**Root Cause:** Database not running, incorrect credentials, or network issues.

**Solutions:**

1. **Verify database is running:**
   ```bash
   docker-compose ps timescaledb
   ```

   **Expected output:** Status should be "Up (healthy)"

2. **Test database connection:**
   ```bash
   docker exec mes-database psql -U admin -d mes -c "SELECT version();"
   ```

   **Expected output:**
   ```
   PostgreSQL 17.0 on x86_64-pc-linux-gnu, compiled by gcc
   ```

3. **Check database logs for errors:**
   ```bash
   docker-compose logs timescaledb
   ```

   Look for:
   - "FATAL: password authentication failed" → Wrong credentials in .env
   - "FATAL: database 'mes' does not exist" → Database not initialized
   - "port already in use" → Port 5432 conflict

4. **Verify credentials in .env:**
   ```bash
   cat .env | grep POSTGRES_
   ```

   Ensure `POSTGRES_USER` and `POSTGRES_PASSWORD` match what services are using.

5. **Check Docker network connectivity:**
   ```bash
   docker network inspect abelara-mes-network
   ```

   **What this does:** Shows all containers on the network. Verify `mes-database` and other services are listed.

---

## 📖 Resources

### Service Documentation

- **[GraphQL](https://graphql.org/)** - GraphQL specification and guides
- **[Apollo Server](https://www.apollographql.com/docs/apollo-server/)** - Apollo Server v4 documentation
- **[TimescaleDB](https://docs.timescale.com/)** - Time-series database documentation
- **[PostgreSQL](https://www.postgresql.org/docs/)** - PostgreSQL 17 documentation
- **[pgAdmin](https://www.pgadmin.org/docs/)** - Database administration tool
- **[Solace PubSub+](https://docs.solace.com/)** - Message broker documentation
- **[Ignition](https://docs.inductiveautomation.com/)** - SCADA platform documentation
- **[TimeBase Historian](https://timebase.com/docs/)** - Industrial data historian
- **[Homepage Dashboard](https://gethomepage.dev/)** - Dashboard configuration
- **[Glances](https://nicolargo.github.io/glances/)** - System monitoring
- **[Watchtower](https://containrrr.dev/watchtower/)** - Container updates
- **[Docker Compose](https://docs.docker.com/compose/)** - Docker Compose reference

### Learning Resources

- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [TimescaleDB Getting Started](https://docs.timescale.com/getting-started/latest/)
- [DBML Diagram Viewer](https://dbdiagram.io/) - Paste schema.dbml here
- [MQTT Essentials](https://www.hivemq.com/mqtt-essentials/)

---

## 🔒 Security

### Production Security Checklist

✅ **Implemented**
- Docker network isolation
- Database authentication
- Service-level authentication
- Soft delete data protection
- Automated backups with encryption

⚠️ **Required for Production**
- **Change all default passwords** in `.env`
- **Use strong encryption keys** (32+ characters)
- **Add HTTPS/TLS termination** (reverse proxy)
- **Implement API rate limiting** (prevent abuse)
- **Configure secrets management** (external vault)
- **Review firewall rules** (restrict access)
- **Enable MQTT authentication** (secure broker)

### Securing Your Deployment

```bash
# Secure .env file permissions
chmod 600 .env

# Generate strong encryption key
openssl rand -base64 32

# Generate strong passwords
openssl rand -base64 24

# NEVER commit .env to version control
echo ".env" >> .gitignore
```


---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  Web Browsers  │  Mobile Apps  │  Desktop Clients           │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Homepage (3000)  │  Ignition (8088)  │  Glances (61208)   │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                              │
├─────────────────────────────────────────────────────────────┤
│         GraphQL API (4000) - Apollo Server v4               │
│  ┌─────────────┬──────────────┬─────────────────────┐      │
│  │  Queries    │  Mutations   │  Health Checks      │      │
│  │  (20+ ops)  │  (50+ ops)   │  (monitoring)       │      │
│  └─────────────┴──────────────┴─────────────────────┘      │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                   INTEGRATION LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Solace Broker  │  Timebase  │  Ignition Gateway            │
│  MQTT/AMQP      │  Historian │  OPC-UA                      │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                              │
├─────────────────────────────────────────────────────────────┤
│              TimescaleDB (PostgreSQL 17)                    │
│  ┌─────────────────────────────────────────────────┐        │
│  │  MES Core Schema (21 tables)                    │        │
│  │  MES Audit Schema (change tracking)             │        │
│  │  MES Custom Schema (extensions)                 │        │
│  │  - 6 Hypertables for time-series               │        │
│  │  - Full CRUD via GraphQL                        │        │
│  │  - Soft delete support                          │        │
│  └─────────────────────────────────────────────────┘        │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                  OPERATIONS LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  DB Backup  │  Watchtower  │  pgAdmin  │  Resource Monitor  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Abelara

---

## 💬 Support

For issues or questions:

1. 📋 Check [PRODUCTION_VALIDATION.md](PRODUCTION_VALIDATION.md) for validation results
2. 📖 Review [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment guides
3. 🔌 Use Apollo Studio at http://localhost:4000/graphql for API testing
4. 📊 Check service logs: `docker-compose logs -f`
5. 📚 Consult database documentation in [database/](database/)

---

<div align="center">

**Built with ❤️ for Manufacturing Excellence**

**Stack Version:** 1.0.0-production
**Status:** ✅ Production Ready
**Last Validated:** 2025-10-11

---

### Ready to Take Your Industrial Architecture to the Next Level?

<br>

<a href="https://abelara.com" target="_blank">
  <img src="images/Abelara_Logo_Primary_FullColor_W_RGB.png" alt="Abelara - Industrial Automation & Controls" width="300">
</a>

<br>

**[Visit Abelara.com →](https://abelara.com)**

</div>
