---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Database Schema Migration",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "last_updated": "2025-11-05",
  "objective": "Execute database schema migrations with comprehensive safety checks, automatic backups, and rollback capability for production-grade reliability",
  "category": ["database", "migration", "maintenance"],
  "tags": ["database", "migration", "sql", "postgresql", "mysql", "schema", "rollback"],
  "checksum": {
    "algorithm": "sha256",
    "hash": "e45cd92ee1868a873cf39f94e9738cce47b766acbcc627f61247293eaa2bc740"
  },
  "risk_level": "critical",
  "risk_factors": [
    "database_operations",
    "requires_credentials",
    "modifies_files"
  ],
  "requires_approval": true,
  "destructive_operations": [
    "Modifies database schema (adds/removes/alters tables, columns, indexes, constraints)",
    "May transform or migrate existing data",
    "Acquires exclusive schema locks (blocks other operations)",
    "Can cause data loss if migration script has errors",
    "May impact application availability during migration"
  ],
  "estimated_duration": {
    "min_minutes": 5,
    "max_minutes": 120
  },
  "coupling": {
    "level": "Tight",
    "details": "Directly modifies database state. All applications depending on this database are tightly coupled to the schema."
  },
  "mcp_integration": {
    "required": false,
    "server_name": "@dossier/mcp-server",
    "min_version": "1.0.0",
    "features_used": ["verify_dossier", "dossier://security"],
    "fallback": "manual_execution",
    "benefits": [
      "Automatic security verification before critical operations",
      "Signature validation for trusted migrations",
      "Clear risk assessment for critical database changes"
    ]
  }
}
---

# Dossier: Database Schema Migration

**Protocol Version**: 1.0 ([PROTOCOL.md](../../PROTOCOL.md))

**Purpose**: Execute database schema migrations with comprehensive safety checks, automatic backups, and rollback capability for production-grade reliability.

**When to use**: When you need to modify database structure (tables, columns, indexes, constraints) in development, staging, or production environments with zero data loss tolerance.

---

*Before executing, optionally review [PROTOCOL.md](../../PROTOCOL.md) for self-improvement protocol and execution guidelines.*

---

## 📋 Metadata

### Version
- **Dossier**: v1.0.0
- **Protocol**: v1.0
- **Last Updated**: 2025-11-05

### Relationships

**Preceded by**:
- backup-database.md - For manual backup before migration (optional)
- test-database-connection.md - Verify connectivity (recommended)

**Followed by**:
- validate-migration.md - Run integration tests post-migration (suggested)
- rollback-migration.md - If migration needs to be reverted (conditional)

**Alternatives**:
- orm-migration.md - Use ORM tools (Alembic, TypeORM, Django migrations)
- zero-downtime-migration.md - For high-traffic production systems

**Conflicts with**:
- Any other database schema modification operations (must run exclusively)

**Can run in parallel with**:
- None (requires exclusive schema lock)

### Outputs

**Files created**:
- `backups/backup_{timestamp}.sql` - Database backup before migration (required)
- `migrations/migration_{timestamp}.sql` - Migration SQL script (required)
- `migrations/rollback_{timestamp}.sql` - Rollback script (required)
- `logs/migration_{timestamp}.log` - Execution log (required)
- `validation/migration_{timestamp}_report.txt` - Validation report (required)

**Configuration produced**:
- `schema_version` - Current schema version in database

**State changes**:
- Database schema modified - Affects: all applications using the database
- Data potentially transformed - Affects: data integrity and application logic
- Indexes rebuilt - Affects: query performance temporarily

### Inputs

**Required**:
- Database connection string (host, port, database, credentials)
- Migration script or description of changes
- Target environment (dev/staging/production)

**Optional**:
- Dry-run mode (default: true for production)
- Backup location (default: `./backups/`)
- Rollback strategy (default: automatic on failure)
- Downtime window (for production)

### Coupling

**Level**: Tight
**Details**: Directly modifies database state. All applications depending on this database are tightly coupled to the schema. Backward-incompatible changes require coordinated application deployments.

---

## Objective

Execute database schema migration with maximum safety:
- **Zero data loss**: Automatic backup before any changes
- **Validation**: Dry-run testing before actual execution
- **ACID compliance**: All changes in transactions where possible
- **Rollback ready**: Automatic rollback on failure
- **Audit trail**: Complete logging of all operations
- **Integrity verification**: Pre and post-migration validation

Success means: Schema successfully updated, all data preserved, application compatibility maintained, rollback script available if needed.

---

## Prerequisites

**Database Requirements**:
- Database server running and accessible
- Valid credentials with schema modification privileges (ALTER, CREATE, DROP)
- Sufficient disk space for backup (at least 2x current database size)
- Database supports transactions (for atomic migrations)

**Client Requirements**:
- Database client installed (psql, mysql, mongosh, sqlite3)
- Backup tools available (pg_dump, mysqldump, etc.)
- Network access to database server
- Write permissions for backup directory

**Safety Requirements**:
- Database backed up recently (last 24 hours recommended)
- Migration tested in non-production environment
- Rollback script prepared and tested
- Application downtime scheduled (if required)

**Validation**:

```bash
# Check PostgreSQL client
which psql && psql --version || echo "❌ PostgreSQL client not found"

# Check MySQL client
which mysql && mysql --version || echo "❌ MySQL client not found"

# Check MongoDB client
which mongosh && mongosh --version || echo "❌ MongoDB client not found"

# Check SQLite
which sqlite3 && sqlite3 --version || echo "❌ SQLite not found"

# Check disk space (need 2x database size)
df -h . | tail -1

# Test database connectivity (PostgreSQL example)
psql "postgresql://user:pass@localhost:5432/dbname" -c "SELECT version();" 2>&1 | head -5

# Test backup tool
which pg_dump && echo "✓ pg_dump available" || echo "❌ pg_dump not found"
```

---

## Context to Gather

### 1. Detect Database Type

```bash
# Check for database connection strings in environment
env | grep -i -E "(database|postgres|mysql|mongo)" | grep -v PASSWORD

# Check for database config files
find . -maxdepth 3 -name "*config*" -o -name ".env" | xargs grep -l -i database 2>/dev/null

# Check for running database processes
ps aux | grep -E "(postgres|mysql|mongod)" | grep -v grep
```

### 2. Identify Database Connection Details

```bash
# Look for connection strings in common files
grep -r "postgresql://" . --include="*.env" --include="*.conf" --include="*.yaml" 2>/dev/null
grep -r "mysql://" . --include="*.env" --include="*.conf" --include="*.yaml" 2>/dev/null

# Check for ORM configuration
test -f "alembic.ini" && echo "Alembic (Python) detected"
test -f "knexfile.js" && echo "Knex (Node.js) detected"
find . -name "ormconfig.json" -o -name "ormconfig.ts" 2>/dev/null
```

### 3. Check Current Schema Version

**PostgreSQL**:
```sql
-- Check if schema_version table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'schema_migrations'
);

-- Get current version
SELECT version, applied_at FROM schema_migrations ORDER BY applied_at DESC LIMIT 1;

-- Get table count and sizes
SELECT
    schemaname,
    COUNT(*) as table_count,
    pg_size_pretty(SUM(pg_total_relation_size(schemaname||'.'||tablename))::bigint) as total_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
GROUP BY schemaname;
```

**MySQL**:
```sql
-- Check migration tracking table
SHOW TABLES LIKE 'schema_migrations';

-- Get database size
SELECT
    table_schema AS 'Database',
    COUNT(*) AS 'Tables',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
GROUP BY table_schema;
```

### 4. Analyze Existing Schema

**PostgreSQL**:
```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- List all indexes
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename;

-- List all constraints
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace;
```

**MySQL**:
```sql
-- List all tables with row counts
SELECT
    TABLE_NAME,
    TABLE_ROWS,
    ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME;
```

**Output Format**:
```
Database Type: PostgreSQL 14.5
Database Name: production_db
Host: localhost:5432
Current Version: 2024110401
Tables: 45
Total Size: 2.3 GB
Backup Required: Yes
Estimated Backup Time: 3-5 minutes
```

---

## Decision Points

### Decision 1: Migration Strategy

**Based on**: Database type, change complexity, environment

**Options**:
- **Direct SQL Scripts**: Raw SQL statements
  - Use when: Simple schema changes, custom logic needed
  - Pros: Full control, works everywhere, easy to review
  - Cons: Manual rollback script creation, no version tracking built-in

- **ORM Migrations**: Framework-based (Alembic, TypeORM, Django)
  - Use when: Application uses ORM, need version tracking
  - Pros: Automatic rollback generation, version control, framework integration
  - Cons: Less control, framework-specific, learning curve

- **Migration Tools**: Flyway, Liquibase
  - Use when: Enterprise environment, multiple databases
  - Pros: Database-agnostic, robust versioning, team collaboration
  - Cons: Additional tooling, complexity overhead

**Recommendation**: Direct SQL scripts for transparency and universal compatibility

### Decision 2: Backup Strategy

**Based on**: Database size, environment criticality

**Options**:
- **Full Backup**: Complete database dump
  - Use when: Database < 10GB, or production environment
  - ALWAYS use for production
  - Time: ~2 min per GB

- **Schema-Only Backup**: Structure without data
  - Use when: Development, large database, data not critical
  - Fast but doesn't protect data

- **Incremental Backup**: Only changes since last backup
  - Use when: Very large databases, continuous backup system in place
  - Requires existing backup infrastructure

**Recommendation**: Always full backup for production, schema-only acceptable for dev

### Decision 3: Transaction Handling

**Based on**: Database support, change type

**Options**:
- **Single Transaction**: All changes in one transaction
  - Use when: Database supports DDL transactions (PostgreSQL)
  - Pros: Atomic, automatic rollback on error
  - Cons: Long lock time, not supported by all databases

- **Multiple Transactions**: Separate transaction per table
  - Use when: MySQL (doesn't support DDL transactions)
  - Pros: Smaller lock windows
  - Cons: Partial completion possible

- **No Transaction**: Auto-commit mode
  - Use when: Database doesn't support transactions (some NoSQL)
  - Pros: Simple
  - Cons: No automatic rollback

**Recommendation**: Single transaction if supported (PostgreSQL), multiple for MySQL

### Decision 4: Dry-Run Testing

**Based on**: Environment risk level

**Options**:
- **Always Dry-Run First**: Test in transaction, then rollback
  - Use when: Production or staging
  - MANDATORY for production

- **Direct Execution**: Run migration immediately
  - Use when: Local development only
  - Fast but risky

**Recommendation**: Always dry-run for production, optional for local dev

---

## Actions to Perform

### Step 1: Create Project Structure

**What to do**: Setup directories for safe migration management

**Commands**:
```bash
# Create directory structure
mkdir -p backups migrations logs validation

# Verify creation
ls -la | grep -E "(backups|migrations|logs|validation)"
```

**Expected outcome**: All directories created

**Validation**:
```bash
test -d backups && test -d migrations && test -d logs && test -d validation && echo "✓ Structure ready" || echo "❌ Missing directories"
```

### Step 2: Test Database Connectivity

**What to do**: Verify connection and permissions before proceeding

**PostgreSQL**:
```bash
# Set connection string (ADJUST THESE VALUES)
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_NAME="mydb"
export DB_USER="postgres"
export DB_PASSWORD="password"
export PGPASSWORD="$DB_PASSWORD"

# Test connection
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();"

# Test permissions
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
    SELECT
        has_database_privilege('$DB_NAME', 'CONNECT') as can_connect,
        has_schema_privilege('public', 'CREATE') as can_create,
        has_schema_privilege('public', 'USAGE') as can_use;
"
```

**MySQL**:
```bash
# Set connection details
export DB_HOST="localhost"
export DB_PORT="3306"
export DB_NAME="mydb"
export DB_USER="root"
export DB_PASSWORD="password"

# Test connection
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT version();"

# Test permissions
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
    SHOW GRANTS FOR CURRENT_USER;
"
```

**Expected outcome**: Successful connection with CREATE/ALTER privileges

**Validation**:
```bash
# PostgreSQL
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1 && echo "✓ Connected" || echo "❌ Connection failed"

# MySQL
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT 1;" > /dev/null 2>&1 && echo "✓ Connected" || echo "❌ Connection failed"
```

### Step 3: Create Pre-Migration Backup

**What to do**: Full backup before any changes (CRITICAL SAFETY STEP)

**PostgreSQL**:
```bash
# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/backup_${TIMESTAMP}.sql"

echo "Creating backup: $BACKUP_FILE"
echo "Database: $DB_NAME"
echo "Start time: $(date)"

# Create full backup
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME \
    --verbose \
    --format=plain \
    --file=$BACKUP_FILE

# Verify backup
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
    echo "✓ Backup created: $BACKUP_SIZE"
    echo "Location: $BACKUP_FILE"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Compress backup to save space
gzip $BACKUP_FILE
echo "✓ Backup compressed: ${BACKUP_FILE}.gz"
```

**MySQL**:
```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/backup_${TIMESTAMP}.sql"

echo "Creating backup: $BACKUP_FILE"

# Create full backup
mysqldump -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    $DB_NAME > $BACKUP_FILE

# Verify and compress
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
    echo "✓ Backup created: $BACKUP_SIZE"
    gzip $BACKUP_FILE
    echo "✓ Backup compressed: ${BACKUP_FILE}.gz"
else
    echo "❌ Backup failed!"
    exit 1
fi
```

**Expected outcome**: Compressed backup file exists

**Validation**:
```bash
# Check backup exists and is not empty
LATEST_BACKUP=$(ls -t backups/*.sql.gz | head -1)
if [ -f "$LATEST_BACKUP" ]; then
    BACKUP_SIZE=$(stat -f%z "$LATEST_BACKUP" 2>/dev/null || stat -c%s "$LATEST_BACKUP")
    if [ $BACKUP_SIZE -gt 1000 ]; then
        echo "✓ Backup valid: $(du -h $LATEST_BACKUP | cut -f1)"
    else
        echo "❌ Backup too small (possibly empty)"
        exit 1
    fi
else
    echo "❌ No backup found"
    exit 1
fi
```

### Step 4: Create Migration Script

**What to do**: Write SQL migration with proper structure

**Create file**: `migrations/migration_${TIMESTAMP}.sql`

**PostgreSQL Example**:
```sql
-- Migration: Add user preferences table and email index
-- Version: 20251105_143000
-- Author: Migration System
-- Description: Add preferences table for user settings and optimize email lookups

-- Start transaction for atomic migration
BEGIN;

-- ============================================================
-- SCHEMA CHANGES
-- ============================================================

-- Create new table
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, preference_key)
);

-- Add new column to existing table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

-- Create composite index
CREATE INDEX IF NOT EXISTS idx_user_preferences_lookup
ON user_preferences(user_id, preference_key);

-- ============================================================
-- DATA MIGRATIONS (if needed)
-- ============================================================

-- Set default values for existing records
UPDATE users
SET email_verified = FALSE
WHERE email_verified IS NULL;

-- Make column non-nullable after setting defaults
ALTER TABLE users
ALTER COLUMN email_verified SET NOT NULL;

-- ============================================================
-- CONSTRAINTS
-- ============================================================

-- Add check constraint
ALTER TABLE user_preferences
ADD CONSTRAINT chk_preference_key_length
CHECK (LENGTH(preference_key) <= 100);

-- ============================================================
-- VERSION TRACKING
-- ============================================================

-- Create migration tracking table if not exists
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Record this migration
INSERT INTO schema_migrations (version, description)
VALUES ('20251105_143000', 'Add user preferences and email optimization')
ON CONFLICT (version) DO NOTHING;

-- Commit transaction
COMMIT;
```

**MySQL Example**:
```sql
-- Migration: Add user preferences table
-- Version: 20251105_143000
-- Note: MySQL doesn't support transactional DDL, each statement commits

-- Create new table
CREATE TABLE IF NOT EXISTS user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_preference (user_id, preference_key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add new column
ALTER TABLE users
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER email;

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_preferences_lookup ON user_preferences(user_id, preference_key);

-- Update existing records
UPDATE users SET email_verified = FALSE WHERE email_verified IS NULL;

-- Make non-nullable
ALTER TABLE users MODIFY email_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Track migration
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_migrations (version, description)
VALUES ('20251105_143000', 'Add user preferences and email optimization')
ON DUPLICATE KEY UPDATE version=version;
```

**Expected outcome**: Migration script ready for execution

### Step 5: Create Rollback Script

**What to do**: Write rollback SQL to undo migration (CRITICAL)

**Create file**: `migrations/rollback_${TIMESTAMP}.sql`

**PostgreSQL Example**:
```sql
-- Rollback: Remove user preferences table and email index
-- Version: 20251105_143000
-- WARNING: This will delete data in user_preferences table!

BEGIN;

-- Remove version tracking
DELETE FROM schema_migrations WHERE version = '20251105_143000';

-- Drop indexes
DROP INDEX IF EXISTS idx_user_preferences_lookup;
DROP INDEX IF EXISTS idx_users_email;

-- Remove constraints
ALTER TABLE user_preferences DROP CONSTRAINT IF EXISTS chk_preference_key_length;

-- Remove column (WARNING: data loss)
ALTER TABLE users DROP COLUMN IF EXISTS email_verified;

-- Drop table (WARNING: data loss)
DROP TABLE IF EXISTS user_preferences;

COMMIT;
```

**MySQL Example**:
```sql
-- Rollback for MySQL
DELETE FROM schema_migrations WHERE version = '20251105_143000';

DROP INDEX idx_user_preferences_lookup ON user_preferences;
DROP INDEX idx_users_email ON users;

ALTER TABLE users DROP COLUMN email_verified;

DROP TABLE user_preferences;
```

**Expected outcome**: Rollback script ready if needed

### Step 6: Dry-Run Migration (Test Mode)

**What to do**: Test migration in transaction, then rollback to verify

**PostgreSQL**:
```bash
MIGRATION_FILE="migrations/migration_${TIMESTAMP}.sql"
LOG_FILE="logs/migration_${TIMESTAMP}_dryrun.log"

echo "=== DRY RUN MODE ===" | tee $LOG_FILE
echo "Migration: $MIGRATION_FILE" | tee -a $LOG_FILE
echo "Start: $(date)" | tee -a $LOG_FILE

# Execute in transaction but rollback at end
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF | tee -a $LOG_FILE
BEGIN;

-- Run migration
\i $MIGRATION_FILE

-- Verify changes
SELECT 'Tables created:' as check_type;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'user_%';

SELECT 'Columns added:' as check_type;
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'email_verified';

SELECT 'Indexes created:' as check_type;
SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%';

-- ROLLBACK instead of COMMIT (dry-run)
ROLLBACK;

SELECT 'DRY RUN COMPLETE - All changes rolled back' as status;
EOF

echo "End: $(date)" | tee -a $LOG_FILE
echo "✓ Dry run completed - review log: $LOG_FILE"
```

**Expected outcome**: Migration executes successfully, then rolls back

**Validation**:
```bash
# Check dry-run log for errors
if grep -i "error" $LOG_FILE; then
    echo "❌ Dry run found errors! Review log before proceeding."
    exit 1
else
    echo "✓ Dry run successful - no errors detected"
fi
```

### Step 7: Execute Migration (Production)

**What to do**: Run actual migration with full logging

**PostgreSQL**:
```bash
MIGRATION_FILE="migrations/migration_${TIMESTAMP}.sql"
LOG_FILE="logs/migration_${TIMESTAMP}_production.log"

echo "=== PRODUCTION MIGRATION ===" | tee $LOG_FILE
echo "⚠️  WARNING: This will modify the database schema!" | tee -a $LOG_FILE
echo "Backup location: backups/backup_${TIMESTAMP}.sql.gz" | tee -a $LOG_FILE
echo "Migration: $MIGRATION_FILE" | tee -a $LOG_FILE
echo "Start: $(date)" | tee -a $LOG_FILE
echo "" | tee -a $LOG_FILE

# Pause for confirmation (remove for automation)
read -p "Proceed with migration? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Migration cancelled" | tee -a $LOG_FILE
    exit 0
fi

# Execute migration
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME \
    --echo-all \
    --file=$MIGRATION_FILE \
    2>&1 | tee -a $LOG_FILE

# Check exit code
if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo "" | tee -a $LOG_FILE
    echo "✓ Migration completed successfully" | tee -a $LOG_FILE
    echo "End: $(date)" | tee -a $LOG_FILE
else
    echo "" | tee -a $LOG_FILE
    echo "❌ Migration failed!" | tee -a $LOG_FILE
    echo "Check log: $LOG_FILE" | tee -a $LOG_FILE
    echo "Restore from backup: gunzip -c backups/backup_${TIMESTAMP}.sql.gz | psql ..." | tee -a $LOG_FILE
    exit 1
fi
```

**MySQL**:
```bash
MIGRATION_FILE="migrations/migration_${TIMESTAMP}.sql"
LOG_FILE="logs/migration_${TIMESTAMP}_production.log"

echo "=== PRODUCTION MIGRATION ===" | tee $LOG_FILE
echo "Start: $(date)" | tee -a $LOG_FILE

# Execute migration
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME \
    --verbose \
    < $MIGRATION_FILE \
    2>&1 | tee -a $LOG_FILE

# Check exit code
if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo "✓ Migration completed successfully" | tee -a $LOG_FILE
else
    echo "❌ Migration failed!" | tee -a $LOG_FILE
    exit 1
fi
```

**Expected outcome**: Schema migrated successfully

**Validation**: See Step 8

### Step 8: Post-Migration Validation

**What to do**: Verify migration completed correctly

**Create validation script**: `validate_migration.sh`

```bash
#!/bin/bash

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
VALIDATION_FILE="validation/migration_${TIMESTAMP}_report.txt"

echo "=== POST-MIGRATION VALIDATION ===" | tee $VALIDATION_FILE
echo "Time: $(date)" | tee -a $VALIDATION_FILE
echo "" | tee -a $VALIDATION_FILE

# Test 1: Check schema version
echo "[TEST 1] Schema Version" | tee -a $VALIDATION_FILE
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
    SELECT version, applied_at FROM schema_migrations ORDER BY applied_at DESC LIMIT 1;
" | tee -a $VALIDATION_FILE

# Test 2: Verify tables exist
echo "" | tee -a $VALIDATION_FILE
echo "[TEST 2] Tables Existence" | tee -a $VALIDATION_FILE
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename IN ('users', 'user_preferences')
    ORDER BY tablename;
" | tee -a $VALIDATION_FILE

# Test 3: Verify columns
echo "" | tee -a $VALIDATION_FILE
echo "[TEST 3] Column Verification" | tee -a $VALIDATION_FILE
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
    SELECT table_name, column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name IN ('users', 'user_preferences')
    ORDER BY table_name, ordinal_position;
" | tee -a $VALIDATION_FILE

# Test 4: Verify indexes
echo "" | tee -a $VALIDATION_FILE
echo "[TEST 4] Index Verification" | tee -a $VALIDATION_FILE
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
    SELECT tablename, indexname FROM pg_indexes
    WHERE schemaname = 'public' AND indexname LIKE 'idx_%'
    ORDER BY tablename, indexname;
" | tee -a $VALIDATION_FILE

# Test 5: Row counts
echo "" | tee -a $VALIDATION_FILE
echo "[TEST 5] Row Counts" | tee -a $VALIDATION_FILE
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
    SELECT 'users' as table_name, COUNT(*) as row_count FROM users
    UNION ALL
    SELECT 'user_preferences', COUNT(*) FROM user_preferences;
" | tee -a $VALIDATION_FILE

# Test 6: Constraint check
echo "" | tee -a $VALIDATION_FILE
echo "[TEST 6] Constraints" | tee -a $VALIDATION_FILE
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
    SELECT conname, contype, pg_get_constraintdef(oid)
    FROM pg_constraint
    WHERE connamespace = 'public'::regnamespace
    AND conrelid::regclass::text IN ('users', 'user_preferences');
" | tee -a $VALIDATION_FILE

# Test 7: Sample data integrity
echo "" | tee -a $VALIDATION_FILE
echo "[TEST 7] Data Integrity Sample" | tee -a $VALIDATION_FILE
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
    SELECT id, email, email_verified FROM users LIMIT 5;
" | tee -a $VALIDATION_FILE

echo "" | tee -a $VALIDATION_FILE
echo "=== VALIDATION COMPLETE ===" | tee -a $VALIDATION_FILE
echo "Report saved: $VALIDATION_FILE" | tee -a $VALIDATION_FILE
```

**Execute validation**:
```bash
chmod +x validate_migration.sh
./validate_migration.sh
```

**Expected outcome**: All checks pass

**Validation**:
```bash
# Review validation report
cat validation/migration_*_report.txt

# Check for errors
if grep -i "error\|failed\|missing" validation/migration_*_report.txt; then
    echo "❌ Validation found issues!"
else
    echo "✓ All validation checks passed"
fi
```

---

## File Operations

### Create: Migration Script Template

**Location**: `migrations/migration_template.sql`

**Content**:
```sql
-- Migration: [Description]
-- Version: [YYYYMMDD_HHMMSS]
-- Author: [Name]
-- Description: [Detailed description]

BEGIN;

-- ============================================================
-- SCHEMA CHANGES
-- ============================================================

-- Add your DDL statements here

-- ============================================================
-- DATA MIGRATIONS
-- ============================================================

-- Add your DML statements here

-- ============================================================
-- VERSION TRACKING
-- ============================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_migrations (version, description)
VALUES ('[VERSION]', '[DESCRIPTION]');

COMMIT;
```

### Create: Backup Restore Script

**Location**: `restore_backup.sh`

**Content**:
```bash
#!/bin/bash

# Restore database from backup
# Usage: ./restore_backup.sh backups/backup_20251105_143000.sql.gz

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -lh backups/*.sql.gz
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will OVERWRITE the current database!"
echo "Backup file: $BACKUP_FILE"
echo "Database: $DB_NAME"
read -p "Are you sure? (type 'RESTORE' to confirm): " CONFIRM

if [ "$CONFIRM" != "RESTORE" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo "Restoring database..."

# Decompress and restore (PostgreSQL)
gunzip -c $BACKUP_FILE | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME

# OR for MySQL:
# gunzip -c $BACKUP_FILE | mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME

if [ $? -eq 0 ]; then
    echo "✓ Database restored successfully"
else
    echo "❌ Restore failed!"
    exit 1
fi
```

---

## Validation

### Success Criteria

1. ✅ Database backup created before migration
2. ✅ Backup file is valid and non-empty (>1KB)
3. ✅ Migration executed without errors
4. ✅ Schema version updated in database
5. ✅ All expected tables/columns exist
6. ✅ All indexes created successfully
7. ✅ Constraints properly applied
8. ✅ No data loss (row counts match expectations)
9. ✅ Application can connect and query database
10. ✅ Rollback script available and tested (in dry-run)

### Validation Checklist

```bash
# 1. Backup exists
ls -lh backups/*.sql.gz | tail -1

# 2. Migration logged
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT * FROM schema_migrations ORDER BY applied_at DESC LIMIT 1;"

# 3. Tables exist
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"

# 4. Columns exist
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d users"

# 5. Indexes exist
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\di"

# 6. Sample query works
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM users;"
```

### If Validation Fails

**Problem**: Migration failed midway

**Solution**: Restore from backup
```bash
# For PostgreSQL
gunzip -c backups/backup_TIMESTAMP.sql.gz | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME

# Verify restoration
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM users;"
```

---

## Troubleshooting

### Issue 1: Permission Denied

**Symptoms**:
- `ERROR: permission denied for table`
- `ERROR: must be owner of table`

**Causes**:
- Insufficient database privileges
- Wrong user account

**Solutions**:

1. Check current user permissions:
```sql
-- PostgreSQL
SELECT grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'users';

-- MySQL
SHOW GRANTS FOR CURRENT_USER;
```

2. Grant necessary permissions:
```sql
-- PostgreSQL (run as superuser)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO myuser;

-- MySQL
GRANT ALL PRIVILEGES ON mydb.* TO 'myuser'@'localhost';
FLUSH PRIVILEGES;
```

3. Use superuser for migration:
```bash
# PostgreSQL
export DB_USER="postgres"

# MySQL
export DB_USER="root"
```

### Issue 2: Table Already Exists

**Symptoms**:
- `ERROR: relation "table_name" already exists`

**Causes**:
- Migration run twice
- Partial previous migration

**Solutions**:

1. Use `IF NOT EXISTS`:
```sql
CREATE TABLE IF NOT EXISTS user_preferences (...);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN;
```

2. Check what exists before creating:
```sql
-- Check if table exists
SELECT EXISTS (
    SELECT FROM pg_tables
    WHERE tablename = 'user_preferences'
);

-- Drop and recreate (DANGEROUS - data loss!)
DROP TABLE IF EXISTS user_preferences CASCADE;
CREATE TABLE user_preferences (...);
```

3. Manual cleanup:
```sql
-- Remove partial migration
DELETE FROM schema_migrations WHERE version = '20251105_143000';
DROP TABLE IF EXISTS user_preferences;
ALTER TABLE users DROP COLUMN IF EXISTS email_verified;
```

### Issue 3: Foreign Key Constraint Violation

**Symptoms**:
- `ERROR: insert or update on table violates foreign key constraint`
- `ERROR: cannot add foreign key constraint`

**Causes**:
- Orphaned records
- Wrong reference column
- Missing referenced rows

**Solutions**:

1. Find orphaned records:
```sql
-- Find users without matching parent records
SELECT * FROM user_preferences up
LEFT JOIN users u ON up.user_id = u.id
WHERE u.id IS NULL;
```

2. Clean orphaned data:
```sql
-- Delete orphaned records
DELETE FROM user_preferences
WHERE user_id NOT IN (SELECT id FROM users);
```

3. Defer constraint checking:
```sql
-- PostgreSQL: disable temporarily
SET CONSTRAINTS ALL DEFERRED;

-- Add constraint
ALTER TABLE user_preferences
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);

-- Re-enable
SET CONSTRAINTS ALL IMMEDIATE;
```

### Issue 4: Migration Timeout

**Symptoms**:
- Migration hangs indefinitely
- Lock wait timeout exceeded

**Causes**:
- Large table ALTER operations
- Locks from other connections
- Long-running queries blocking migration

**Solutions**:

1. Check for blocking queries:
```sql
-- PostgreSQL
SELECT pid, query, state, wait_event_type
FROM pg_stat_activity
WHERE state != 'idle' AND query NOT LIKE '%pg_stat_activity%';

-- Kill blocking query
SELECT pg_terminate_backend(12345);  -- Replace with actual PID
```

2. Increase timeout:
```sql
-- PostgreSQL
SET statement_timeout = '30min';

-- MySQL
SET SESSION max_execution_time = 1800000;  -- 30 minutes in milliseconds
```

3. Use online schema change tools:
```bash
# For MySQL (large tables)
# Use pt-online-schema-change from Percona Toolkit
pt-online-schema-change \
    --alter "ADD COLUMN email_verified BOOLEAN DEFAULT FALSE" \
    D=mydb,t=users \
    --execute
```

### Issue 5: Backup Restoration Fails

**Symptoms**:
- `ERROR: role "username" does not exist`
- `ERROR: database "dbname" does not exist`

**Causes**:
- Backup contains role/database creation
- Mismatched database names
- Corrupted backup file

**Solutions**:

1. Test backup integrity:
```bash
# For gzipped backups
gunzip -t backups/backup_TIMESTAMP.sql.gz && echo "✓ Backup file OK" || echo "❌ Backup corrupted"

# View first 50 lines
gunzip -c backups/backup_TIMESTAMP.sql.gz | head -50
```

2. Restore with role creation skipped:
```bash
# PostgreSQL
gunzip -c backups/backup_TIMESTAMP.sql.gz | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME --set ON_ERROR_STOP=off

# MySQL (ignore errors)
gunzip -c backups/backup_TIMESTAMP.sql.gz | mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME --force
```

3. Manual database recreation:
```sql
-- PostgreSQL
DROP DATABASE IF EXISTS mydb;
CREATE DATABASE mydb;

-- Restore
gunzip -c backups/backup_TIMESTAMP.sql.gz | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d mydb
```

---

## Notes for LLM Execution

### Critical Safety Rules

- **NEVER skip backups**: Always create backup before any schema change
- **Always dry-run first**: Test migrations in transaction before production execution
- **Verify permissions**: Check database privileges before starting
- **Log everything**: Maintain detailed logs for audit trail
- **Prepare rollback**: Have rollback script ready before migrating
- **Validate after**: Always run post-migration validation

### Environment Awareness

- **Production**: Require manual confirmation, mandatory dry-run, full backup
- **Staging**: Recommended dry-run, full backup
- **Development**: Optional dry-run, schema-only backup acceptable

### Adaptation Points

- **Database type**: Adjust syntax for PostgreSQL/MySQL/MongoDB/SQLite
- **Transaction support**: Use transactions for PostgreSQL, not for MySQL DDL
- **Lock management**: Consider table sizes and traffic for lock timing
- **Downtime windows**: Schedule migrations during low-traffic periods for production

### Communication

- **Progress updates**: Report each major step completion
- **Risk warnings**: Alert user about data loss potential in rollback
- **Confirmation prompts**: Require explicit "yes" for production migrations
- **Error reporting**: Immediately report failures with backup restoration instructions

---

## Related Dossiers

- **backup-database.md** - Standalone backup procedures
- **rollback-migration.md** - Emergency rollback procedures
- **zero-downtime-migration.md** - Advanced blue-green schema changes
- **validate-database-integrity.md** - Comprehensive data validation

---

## Version History

- **v1.0.0** (2025-11-05) - Initial version with PostgreSQL and MySQL support

---

## Self-Improvement Notes

*This section follows the Dossier Protocol for self-improvement. LLMs executing this dossier should note any issues, improvements, or adaptations here.*

**Template for improvements**:
```markdown
### Improvement: [Title]
- **Date**: YYYY-MM-DD
- **Issue**: [What didn't work or could be better]
- **Solution**: [How it was improved]
- **Impact**: [What this enables or fixes]
```

---

**End of Dossier**

*Remember: Database migrations are HIGH-RISK operations. Always prioritize data safety over speed. When in doubt, backup again.*
