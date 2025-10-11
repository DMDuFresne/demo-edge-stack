# Backups Directory

This directory stores automated encrypted backups for your MES system—your safety net for disaster recovery.

**Why backups matter:** Database corruption, accidental deletions, or hardware failures can happen. Regular backups ensure you can restore your production data and get back online quickly.

## Structure

```
backups/
├── database/          # TimescaleDB automated backups (daily)
└── ignition/          # Ignition Gateway backups (manual for now)
```

## Database Backups

### Automated Backups

The `db-backup` service runs automatically to protect your data:

- **Schedule**: Daily at midnight (change via `SCHEDULE` in `.env`)
- **Location**: `./backups/database/` on your host machine
- **Format**: Compressed SQL dumps (`.sql.gz`) — full database export
- **Encryption**: AES-256 encryption using your `BACKUP_ENCRYPTION_KEY`
- **Retention**: Automatically deletes backups older than `BACKUP_RETENTION_DAYS` (default: 30 days)

**What's backed up:** All database schemas (mes_core, mes_audit, mes_custom), tables, data, views, and functions.

### Backup Files

Backup files are named with timestamps:

```
mes_YYYY-MM-DD_HHmmss.sql.gz
```

Example: `mes_2024-10-11_000001.sql.gz`

### Manual Backup

**When to run manually:** Before major upgrades, schema changes, or when you want an extra backup before risky operations.

```bash
docker-compose exec db-backup /backup.sh
```

**Expected output:**
```
Backup started...
Creating backup: mes_2025-10-11_143022.sql.gz
Backup completed successfully
```

✅ **Backup created!** Check `./backups/database/` for the new file.

### Restore from Backup

**⚠️ WARNING:** Restoring will **overwrite all current data** in the database. Make sure you have a recent backup of the current state before proceeding.

**1. Stop the database:**
```bash
docker-compose stop timescaledb
```

**What this does:** Ensures no services are writing to the database during restoration.

**2. List available backups:**
```bash
ls -lh backups/database/
```

**Expected output:**
```
-rw-r--r-- 1 user user  15M Oct 10 00:00 mes_2025-10-10_000001.sql.gz
-rw-r--r-- 1 user user  16M Oct 11 00:00 mes_2025-10-11_000001.sql.gz
-rw-r--r-- 1 user user  14M Oct 12 00:00 mes_2025-10-12_000001.sql.gz
```

Pick the backup you want to restore (usually the most recent).

**3. Restore specific backup:**
```bash
docker run --rm \
  -e POSTGRES_HOST=mes-database \
  -e POSTGRES_DB=mes \
  -e POSTGRES_USER=${POSTGRES_USER} \
  -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
  -e BACKUP_ENCRYPTION_KEY=${BACKUP_ENCRYPTION_KEY} \
  -v $(pwd)/backups/database:/backups \
  --network abelara-mes-network \
  prodrigestivill/postgres-backup-local:17 \
  /restore.sh /backups/mes_2025-10-11_000001.sql.gz
```

**What this does:** Decrypts and restores the backup file to your database. This will replace all existing data.

**Expected output:**
```
Restore started...
Decrypting backup...
Restoring database...
Restore completed successfully
```

**4. Restart the database:**
```bash
docker-compose start timescaledb
```

✅ **Database restored!** Your data is now back to the state it was in when the backup was created.

**5. Verify the restoration:**
```bash
# Check database connection
docker exec mes-database psql -U admin -d mes -c "SELECT COUNT(*) FROM mes_core.asset_definition;"
```

You should see your expected number of assets.

### Verify Backup Integrity

**Check backup service health:**
```bash
docker-compose exec db-backup curl -s http://localhost:8888
```

**Expected output:**
```json
{"status":"healthy","last_backup":"2025-10-11T00:00:01Z"}
```

**View backup logs:**
```bash
docker-compose logs db-backup
```

**What to look for:** Successful backup messages and no error logs. Each backup should show "Backup completed successfully".

## Ignition Backups

The `ignition/` directory is reserved for Ignition Gateway backups (not yet automated).

**Current backup location:** `ignition-data` Docker volume

**To manually backup Ignition data:**

```bash
# Create a backup of the Ignition volume
docker run --rm -v ignition-data:/data -v $(pwd)/backups/ignition:/backup \
  alpine tar czf /backup/ignition-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
```

**What this backs up:** Ignition gateway configuration, projects, tag history, and all gateway data.

**When to back up Ignition:**
- Before major Ignition upgrades
- After completing significant project development
- Before installing new modules
- When migrating to new hardware

## Important Notes

### ⚠️ Security

**Critical backup security practices:**

1. **Encryption Key Protection:**
   - Store your `BACKUP_ENCRYPTION_KEY` in a password manager
   - Back up the key separately from backups (if you lose the key, backups are useless)
   - Never commit the key to version control

2. **Access Control:**
   ```bash
   # Restrict backup directory permissions
   chmod 700 backups/
   ```

   **Why:** Backups contain sensitive production data including credentials and business information.

3. **Off-Site Storage:**
   - Copy backups to cloud storage (S3, Azure Blob, etc.) or network storage
   - Test that off-site backups can be restored
   - Automate off-site copying for disaster recovery

### Storage Management

Monitor your disk space to avoid backup failures:

```bash
# Check available disk space
df -h

# Check backup directory size
du -sh backups/
```

**What to watch for:**
- Backups growing over time (normal as data grows)
- Sudden size changes (may indicate issues)
- Low disk space warnings (ensure at least 10GB free)

**Automatic cleanup:** Old backups are deleted automatically after `BACKUP_RETENTION_DAYS` to save space.

### 🧪 Testing Your Backups

**Critical:** A backup you haven't tested is not a backup. Test your restore procedure quarterly.

**Test restore in a separate database:**

```bash
# 1. Start a test database container
docker run --rm --name test-restore \
  -e POSTGRES_PASSWORD=testpass \
  -p 5433:5432 \
  -d timescale/timescaledb:latest-pg17

# 2. Wait for database to start
sleep 10

# 3. Restore a backup to the test container
docker run --rm \
  -e POSTGRES_HOST=test-restore \
  -e POSTGRES_DB=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=testpass \
  -e BACKUP_ENCRYPTION_KEY=${BACKUP_ENCRYPTION_KEY} \
  -v $(pwd)/backups/database:/backups \
  --link test-restore:test-restore \
  prodrigestivill/postgres-backup-local:17 \
  /restore.sh /backups/mes_2025-10-11_000001.sql.gz

# 4. Verify the data
docker exec test-restore psql -U postgres -d postgres -c \
  "SELECT COUNT(*) FROM mes_core.asset_definition;"

# 5. Clean up test container
docker stop test-restore
```

✅ **If the data looks correct, your backups are working!**

## Git Ignore

This directory structure is tracked in Git, but backup files are excluded via `.gitignore`:

- `.gitkeep` files preserve directory structure
- `README.md` provides documentation
- All other files (actual backups) are ignored

## Troubleshooting

### Problem: Backups Not Running

**Symptoms:**
- No new backup files in `./backups/database/`
- Backup service shows errors in logs

**Solutions:**

1. **Check service status:**
   ```bash
   docker-compose ps db-backup
   ```

   **Expected:** Status should be "Up"

2. **View error logs:**
   ```bash
   docker-compose logs db-backup --tail=50
   ```

3. **Common issues:**
   - Missing `BACKUP_ENCRYPTION_KEY` in `.env`
   - Insufficient disk space
   - Database connection issues
   - Permission errors on backup directory

### Problem: Restore Fails

**Symptoms:**
- Restore command exits with errors
- Database shows no data after restore

**Solutions:**

1. **Verify encryption key matches:**
   - The key must match the one used to create the backup
   - Check `.env` for correct `BACKUP_ENCRYPTION_KEY`

2. **Check backup file integrity:**
   ```bash
   # Verify file exists and isn't corrupted
   ls -lh backups/database/mes_*.sql.gz
   ```

3. **Ensure database is stopped:**
   ```bash
   docker-compose stop timescaledb
   ```

---

**Never commit actual backup files to version control!**
