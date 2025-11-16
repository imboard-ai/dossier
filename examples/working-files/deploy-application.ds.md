---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Deploy Application to Staging",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Example",
  "objective": "Deploy application to staging environment with health checks",
  "checksum": {
    "algorithm": "sha256",
    "hash": "b01cc4b7b2209d98e986302d69663ce4bee6806fdde05167373c686339b5ed7f"
  },
  "risk_level": "medium",
  "risk_factors": [
    "modifies_cloud_resources",
    "network_access",
    "modifies_files"
  ],
  "requires_approval": true,
  "destructive_operations": [
    "Creates working file: deploy-application.dsw.md",
    "Updates deployment configuration",
    "Restarts application services"
  ],
  "category": [
    "devops",
    "deployment"
  ],
  "tags": [
    "deployment",
    "staging",
    "working-files-example"
  ],
  "signature": {
    "algorithm": "ECDSA-SHA-256",
    "signature": "MEUCIC6/EuCCE0bN0DOgM+zl5xFiYadQN42EtoyplQOL3wupAiEAlorca8VTzXf+BB2Gewpji/w6vln7s1G2tBqQXNaja5I=",
    "public_key": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqIbQGqW1Jdh97TxQ5ZvnSVvvOcN5NWhfWwXRAaDDuKK1pv8F+kz+uo1W8bNn+8ObgdOBecFTFizkRa/g+QJ8kA==",
    "key_id": "arn:aws:kms:us-east-1:942039714848:key/d9ccd3fc-b190-49fd-83f7-e94df6620c1d",
    "signed_at": "2025-11-16T11:23:35.344Z",
    "signed_by": "Dossier Team <team@dossier.ai>"
  }
}
---
# Dossier: Deploy Application to Staging

**Example dossier demonstrating working file pattern**

## Objective

Deploy an application to a staging environment, demonstrating how working files (`.dsw.md`) track state and progress across a multi-step deployment process.

## Prerequisites

- [ ] Staging environment configured
- [ ] Application built and ready to deploy
- [ ] Deployment credentials available
- [ ] Health check endpoints defined

## Context to Gather

Before starting deployment, gather:
1. **Current deployment status**: What version is currently running?
2. **Application configuration**: Environment variables, secrets, etc.
3. **Health check endpoints**: URLs to verify deployment success
4. **Rollback procedures**: How to revert if deployment fails

## Working File Pattern

This dossier uses a **working file** to track execution state:

**File**: `deploy-application.dsw.md`

The working file will contain:
- Progress checklist
- Context gathered about the environment
- Decisions made during deployment
- Actions taken with timestamps
- Any issues encountered
- Next steps for resuming if interrupted

## Actions to Perform

### 1. Create Working File

```markdown
Create `deploy-application.dsw.md` with standard structure:
- Header with dossier reference
- Progress checklist
- Context gathered section
- Decisions made section
- Actions taken log
- Issues/blockers section
- Next steps
```

### 2. Gather Current State

Examine:
- Current deployment version
- Running services
- Configuration files
- Environment variables

Update working file with findings.

### 3. Prepare Deployment

- Build application (if needed)
- Validate configuration
- Create backup of current state
- Document rollback procedure

Update working file after each step.

### 4. Execute Deployment

- Deploy new version
- Monitor startup
- Verify services are running
- Check health endpoints

Update working file with deployment details.

### 5. Verify Deployment

- Run smoke tests
- Check application logs
- Verify all endpoints respond
- Compare with success criteria

Document results in working file.

### 6. Finalize

- Update documentation
- Notify team
- Archive or clean up working file

## Validation

### Success Criteria

- [ ] Application deployed successfully
- [ ] All health checks passing
- [ ] Smoke tests pass
- [ ] No errors in logs
- [ ] Working file documents complete process

### Verification Commands

```bash
# Check deployment status
kubectl get pods -n staging

# Verify health
curl https://staging.example.com/health

# Check logs
kubectl logs -n staging -l app=myapp --tail=50
```

## Error Handling

If deployment fails:
1. Document error in working file
2. Execute rollback procedure
3. Update working file with rollback status
4. Investigate root cause
5. Update working file with findings

## Resume Capability

If interrupted:
1. Read `deploy-application.dsw.md`
2. Review "Progress" section to see completed steps
3. Check "Next Steps" for what remains
4. Continue from last completed step

## Example Working File Structure

See `deploy-application.dsw.md` for example of:
- How to reference parent dossier
- How to structure progress tracking
- How to log decisions and actions
- How to handle interruption/resume

## Notes

- **Working files are mutable**: Unlike this dossier, the working file will change during execution
- **Not security-verified**: Working files bypass checksum/signature verification
- **Team decision**: Decide whether to commit working files or add to .gitignore
- **Documentation value**: Working files serve as execution logs and decision records
