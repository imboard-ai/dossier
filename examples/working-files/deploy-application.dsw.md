# Working File: Deploy Application to Staging

**Dossier**: deploy-application.ds.md
**Created**: 2025-11-12 14:00:00
**Last Updated**: 2025-11-12 16:30:00
**Status**: In Progress

---

## Progress

- [x] Created working file
- [x] Gathered current deployment state
- [x] Prepared deployment package
- [x] Created backup
- [x] Deployed to staging
- [x] Verified health checks
- [ ] Run full smoke test suite
- [ ] Update team documentation
- [ ] Archive working file

## Context Gathered

### Current Environment

- **Environment**: Staging (staging.example.com)
- **Current Version**: v2.3.1 (deployed 2025-11-10)
- **Platform**: Kubernetes cluster (GKE, us-central1)
- **Namespace**: staging
- **Replicas**: 3 pods
- **Resources**: 512Mi memory, 0.5 CPU per pod

### Application Details

- **Application**: Node.js API server
- **Port**: 3000
- **Health Endpoint**: /health
- **Readiness Endpoint**: /ready
- **Database**: PostgreSQL (staging-db.internal)
- **Cache**: Redis (staging-redis.internal)

### Configuration

- **Environment Variables**: 12 total
  - DATABASE_URL: ✅ Set
  - REDIS_URL: ✅ Set
  - API_KEY: ✅ Set (from secret)
  - LOG_LEVEL: info
- **Secrets**: 3 mounted from k8s secrets
- **ConfigMaps**: 2 mounted

## Decisions Made

1. **Deployment Strategy**: Rolling update (chosen over blue-green)
   - **Reasoning**: Lower complexity, staging environment accepts brief downtime
   - **Impact**: ~30s potential downtime during pod replacement

2. **Rollback Threshold**: Automatic rollback if health checks fail for >2 minutes
   - **Reasoning**: Allows time for startup, but prevents prolonged outage
   - **Implementation**: Kubernetes readiness probe (initialDelaySeconds: 30, failureThreshold: 4)

3. **Pod Count**: Maintained at 3 replicas
   - **Reasoning**: Same as current deployment, adequate for staging load
   - **Alternative considered**: Increase to 4 during deployment for zero downtime
   - **Decision**: Not needed for staging environment

4. **Database Migrations**: Run before deployment
   - **Reasoning**: Safer to validate migrations before code update
   - **Risk**: Database schema changes are backward compatible with v2.3.1

## Actions Taken

### 2025-11-12 14:00 - Initial Setup

- Created working file: deploy-application.dsw.md
- Read dossier: deploy-application.ds.md
- Verified prerequisites met

### 2025-11-12 14:15 - Context Gathering

- Ran `kubectl get deployment -n staging` → Found myapp deployment
- Ran `kubectl describe deployment myapp -n staging` → Current: v2.3.1, 3/3 pods
- Checked current logs: No errors in last 1 hour
- Verified database connectivity: ✅ Successful

### 2025-11-12 14:30 - Preparation

- Built Docker image: `myapp:v2.4.0`
- Pushed to registry: `gcr.io/myproject/myapp:v2.4.0`
- Image size: 245MB (compressed)
- Created backup tag: `myapp:v2.3.1-backup-20251112`

### 2025-11-12 14:45 - Database Migration

- Applied migrations: `npm run migrate:up`
- Migration files: 3 new migrations
  - `20251110_add_user_preferences_table.sql` ✅
  - `20251111_add_index_on_user_email.sql` ✅
  - `20251112_add_api_version_column.sql` ✅
- No errors, completed in 2.3s

### 2025-11-12 15:00 - Deployment

- Updated deployment manifest: `kubectl set image deployment/myapp myapp=gcr.io/myproject/myapp:v2.4.0 -n staging`
- Rollout started: 3 pods to update
- Rollout strategy: 1 pod at a time (maxUnavailable: 1)

### 2025-11-12 15:05 - Monitoring Rollout

- Pod 1/3: Terminating old → Starting new → Running ✅
- Pod 2/3: Terminating old → Starting new → Running ✅
- Pod 3/3: Terminating old → Starting new → Running ✅
- Rollout completed in 4m32s

### 2025-11-12 15:10 - Health Verification

- Health check: `curl https://staging.example.com/health`
  - Response: `{"status":"ok","version":"2.4.0"}` ✅
- Readiness check: All 3 pods reporting ready ✅
- Database connectivity: ✅ Successful
- Redis connectivity: ✅ Successful

### 2025-11-12 16:15 - Smoke Tests (Partial)

- ✅ GET /api/users → 200 OK
- ✅ GET /api/health → 200 OK
- ✅ POST /api/auth/login → 200 OK (test credentials)
- ✅ GET /api/dashboard → 200 OK
- ⏸️  Full test suite pending (next step)

## Blockers / Issues

### Issue 1: Slow Image Pull (Resolved)

- **Description**: First pod took 90s to start (image pull)
- **Status**: Resolved
- **Root Cause**: Image not cached on all nodes
- **Solution**: Subsequent pods started faster (<30s) as image was cached
- **Prevention**: Pre-pull images to nodes before deployment (future improvement)

### Issue 2: Health Check Warning (Investigating)

- **Description**: One pod showed "unhealthy" for 15s during startup
- **Status**: Resolved naturally
- **Root Cause**: Application startup time (database connection pool initialization)
- **Action**: Monitored, resolved within grace period
- **Follow-up**: Consider increasing initialDelaySeconds if pattern continues

## Next Steps

1. **Complete smoke tests** - Run full automated test suite
2. **Monitor for 30 minutes** - Watch logs and metrics for anomalies
3. **Update documentation** - Record deployment in team wiki
4. **Notify team** - Send deployment notification to #eng-deployments
5. **Clean up working file** - Archive or delete after completion

## Notes

### Rollback Procedure (If Needed)

```bash
# Revert to previous version
kubectl set image deployment/myapp myapp=gcr.io/myproject/myapp:v2.3.1 -n staging

# Verify rollback
kubectl rollout status deployment/myapp -n staging

# Check health
curl https://staging.example.com/health

# Rollback database if needed
npm run migrate:down -- --to 20251109
```

### Improvements for Next Deployment

1. Add image pre-pulling to deployment process
2. Increase health check initialDelaySeconds from 30s to 45s
3. Consider blue-green deployment for zero downtime
4. Automate smoke test suite execution
5. Add deployment metrics dashboard

### Useful Commands

```bash
# View deployment status
kubectl get deployment myapp -n staging

# Check pod status
kubectl get pods -n staging -l app=myapp

# View logs
kubectl logs -n staging -l app=myapp --tail=100 -f

# Describe deployment
kubectl describe deployment myapp -n staging

# Rollout history
kubectl rollout history deployment/myapp -n staging
```

---

_This working file tracks mutable execution state for deploy-application.ds.md. It is not signed or verified. See parent dossier for immutable instructions._
