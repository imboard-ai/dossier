---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Deploy to AWS",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "last_updated": "2025-11-05",
  "objective": "Deploy application to AWS environment using Infrastructure as Code (Terraform or CloudFormation) with validation and rollback capability",
  "category": ["devops", "deployment", "infrastructure"],
  "tags": ["aws", "terraform", "cloudformation", "ecs", "lambda", "deployment", "infrastructure-as-code"],
  "tools_required": [
    {
      "name": "aws-cli",
      "version": ">=2.0.0",
      "check_command": "aws --version",
      "install_url": "https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    },
    {
      "name": "terraform",
      "check_command": "terraform --version",
      "install_url": "https://www.terraform.io/downloads"
    },
    {
      "name": "git",
      "check_command": "git --version"
    }
  ],
  "checksum": {
    "algorithm": "sha256",
    "hash": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  "risk_level": "high",
  "risk_factors": [
    "modifies_cloud_resources",
    "requires_credentials",
    "network_access",
    "executes_external_code"
  ],
  "requires_approval": true,
  "destructive_operations": [
    "Creates or updates AWS infrastructure (ECS services, Lambda functions, VPC, subnets)",
    "Modifies IAM roles and security groups",
    "May replace existing resources during blue-green deployments",
    "Executes Infrastructure as Code (Terraform/CloudFormation) which can modify or delete resources"
  ],
  "estimated_duration": {
    "min_minutes": 15,
    "max_minutes": 60
  },
  "relationships": {
    "preceded_by": [
      {
        "dossier": "setup-aws-infrastructure",
        "condition": "optional",
        "reason": "Initial infrastructure setup should be done before deployment"
      }
    ],
    "followed_by": [
      {
        "dossier": "configure-monitoring",
        "condition": "suggested",
        "purpose": "Set up monitoring and alerting for deployed services"
      },
      {
        "dossier": "database-migration",
        "condition": "suggested",
        "purpose": "Run database migrations if schema changes are needed"
      }
    ],
    "alternatives": [
      {
        "dossier": "deploy-to-kubernetes",
        "when_to_use": "When deploying to Kubernetes clusters instead of AWS-native services"
      }
    ]
  },
  "inputs": {
    "required": [
      {
        "name": "environment",
        "description": "Target deployment environment",
        "type": "string",
        "validation": "^(dev|development|staging|production)$",
        "example": "staging"
      },
      {
        "name": "aws_region",
        "description": "AWS region for deployment",
        "type": "string",
        "validation": "^[a-z]{2}-[a-z]+-\\d$",
        "example": "us-west-2"
      }
    ],
    "optional": [
      {
        "name": "deployment_strategy",
        "description": "Deployment strategy to use",
        "type": "string",
        "default": "rolling",
        "example": "blue-green"
      },
      {
        "name": "auto_approve",
        "description": "Skip manual approval prompts",
        "type": "boolean",
        "default": false
      }
    ]
  },
  "outputs": {
    "files": [
      {
        "path": "terraform.tfstate",
        "description": "Terraform state file (if using Terraform)",
        "required": false,
        "format": "json"
      },
      {
        "path": "deployment-${TIMESTAMP}.log",
        "description": "Deployment execution log",
        "required": true,
        "format": "text"
      }
    ],
    "configuration": [
      {
        "key": "service_endpoint",
        "description": "HTTPS endpoint of deployed service",
        "consumed_by": ["configure-monitoring", "run-integration-tests"],
        "export_as": "env_var"
      },
      {
        "key": "stack_name",
        "description": "CloudFormation stack name or Terraform workspace",
        "consumed_by": ["rollback-deployment"],
        "export_as": "terraform_output"
      }
    ],
    "state_changes": [
      {
        "description": "AWS resources created or updated (ECS services, Lambda functions, etc.)",
        "affects": "Target AWS environment",
        "reversible": true
      }
    ],
    "artifacts": [
      {
        "path": "rollback-${TIMESTAMP}.sh",
        "purpose": "Automated rollback script for this deployment",
        "type": "script"
      }
    ]
  },
  "coupling": {
    "level": "Medium",
    "details": "Requires AWS infrastructure (VPC, networking, IAM roles) but adapts to different IaC tools (Terraform or CloudFormation)"
  },
  "prerequisites": [
    {
      "description": "AWS CLI installed and configured",
      "validation_command": "aws sts get-caller-identity",
      "type": "tool"
    },
    {
      "description": "Valid AWS credentials with deployment permissions",
      "validation_command": "aws iam get-user",
      "type": "permission"
    },
    {
      "description": "Infrastructure as Code files present",
      "validation_command": "test -d terraform/ || test -f cloudformation.yaml",
      "type": "file"
    },
    {
      "description": "Git repository is clean",
      "validation_command": "git status --short",
      "type": "environment"
    }
  ],
  "validation": {
    "success_criteria": [
      "Infrastructure deployment completed successfully",
      "Application is running and passing health checks",
      "Service endpoint is accessible and returns expected response",
      "No errors in application logs"
    ],
    "verification_commands": [
      {
        "command": "terraform show",
        "expected": "Resources created without errors",
        "description": "Verify Terraform state shows successful deployment"
      },
      {
        "command": "aws ecs describe-services --cluster ${CLUSTER} --services ${SERVICE}",
        "expected": "status: ACTIVE, runningCount equals desiredCount",
        "description": "Verify ECS service is running correctly"
      },
      {
        "command": "curl -I https://${SERVICE_ENDPOINT}/health",
        "expected": "HTTP/1.1 200 OK",
        "description": "Verify service health endpoint responds"
      }
    ]
  },
  "rollback": {
    "supported": true,
    "procedure": "Execute generated rollback script or use IaC tool to revert to previous state (terraform apply with previous config, or CloudFormation auto-rollback)",
    "automated": true,
    "backup_required": true
  }
}
---

# Dossier: Deploy to AWS

**Version**: 1.0.0
**Protocol Version**: 1.0
**Status**: Stable
**Last Updated**: 2025-11-05

---

## Objective

Deploy application to AWS environment using Infrastructure as Code (Terraform/CloudFormation), with validation and rollback capability.

---

## Prerequisites

**Required**:
- [ ] AWS CLI installed and configured
- [ ] Valid AWS credentials with deployment permissions
- [ ] Infrastructure as Code files present (Terraform or CloudFormation)
- [ ] Target environment exists (staging, production, etc.)
- [ ] Git repository is clean (or changes committed)

**Validation Commands**:
```bash
# Check AWS CLI
which aws || echo "❌ AWS CLI not found"

# Check AWS credentials
aws sts get-caller-identity || echo "❌ AWS credentials not configured"

# Check IaC files
test -d terraform/ || test -f cloudformation.yaml || echo "❌ No IaC files found"

# Check git status
git status --short
```

---

## Context to Gather

Before deploying, analyze the project:

### 1. Infrastructure as Code Detection

```bash
# Detect IaC tool
if [ -d "terraform/" ]; then
  echo "✓ Terraform detected"
  IaC_TOOL="terraform"
elif [ -f "cloudformation.yaml" ] || [ -f "cloudformation.yml" ]; then
  echo "✓ CloudFormation detected"
  IaC_TOOL="cloudformation"
else
  echo "❌ No IaC tool detected"
  exit 1
fi
```

### 2. Environment Detection

```bash
# Check what environments exist
if [ "$IaC_TOOL" = "terraform" ]; then
  terraform workspace list
elif [ "$IaC_TOOL" = "cloudformation" ]; then
  aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE
fi
```

### 3. Application Type

Detect:
- [ ] Application runtime (Node.js, Python, Go, etc.)
- [ ] Deployment target (ECS, Lambda, EC2, etc.)
- [ ] Build requirements (Docker, npm build, etc.)
- [ ] Environment variables needed

### 4. Current Deployment State

```bash
# For Terraform
terraform show

# For CloudFormation
aws cloudformation describe-stacks --stack-name <stack-name>
```

---

## Decision Points

### Decision 1: Which Environment to Deploy?

**Options**:
- **Staging**: Safe environment for testing (recommended for changes)
- **Production**: Live environment (requires extra confirmation)
- **Development**: Local/dev environment

**Context Clues**:
- Check git branch name (feature/* → staging, main → production)
- Look for environment in command/prompt
- Default to staging if uncertain

**Safety Rule**: ALWAYS confirm before production deployment

### Decision 2: Deployment Strategy

**Options**:
- **Blue-Green**: Zero-downtime, instant rollback
- **Rolling**: Gradual update, some downtime
- **Recreate**: Simple, brief downtime

**Recommendation**: Blue-green for production, rolling for staging

### Decision 3: Pre-deployment Actions

**Check if needed**:
- Database migrations (run before or after?)
- Cache invalidation
- Feature flags
- Notification to monitoring systems

---

## Actions to Perform

### Phase 1: Pre-deployment Validation

1. **Confirm environment and credentials**
   ```bash
   echo "Deploying to: $ENVIRONMENT"
   echo "AWS Account: $(aws sts get-caller-identity --query Account --output text)"
   echo "Region: $(aws configure get region)"
   ```

2. **Run infrastructure plan/preview**
   ```bash
   # Terraform
   cd terraform/
   terraform plan -out=deployment.plan

   # CloudFormation
   aws cloudformation validate-template --template-body file://cloudformation.yaml
   ```

3. **Review changes with user**
   - Show what resources will be created/modified/destroyed
   - Highlight any breaking changes
   - Confirm destructive operations

4. **Create backup/snapshot if needed**
   ```bash
   # For databases
   aws rds create-db-snapshot \
     --db-instance-identifier <instance> \
     --db-snapshot-identifier backup-$(date +%Y%m%d-%H%M%S)

   # For S3
   aws s3 sync s3://bucket/ s3://bucket-backup-$(date +%Y%m%d)/
   ```

### Phase 2: Application Build (if needed)

5. **Build application artifacts**
   ```bash
   # For Docker
   docker build -t app:latest .
   docker tag app:latest <ecr-repo>:$(git rev-parse --short HEAD)

   # For Node.js
   npm run build

   # For Python
   pip install -r requirements.txt -t ./package
   ```

6. **Run tests**
   ```bash
   npm test  # or appropriate test command
   # Only proceed if tests pass
   ```

7. **Push artifacts to registry/storage**
   ```bash
   # Docker to ECR
   aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-url>
   docker push <ecr-repo>:$(git rev-parse --short HEAD)

   # Or upload to S3
   aws s3 cp ./build s3://deployment-artifacts/ --recursive
   ```

### Phase 3: Infrastructure Deployment

8. **Apply infrastructure changes**
   ```bash
   # Terraform
   terraform apply deployment.plan

   # CloudFormation
   aws cloudformation deploy \
     --template-file cloudformation.yaml \
     --stack-name <stack-name> \
     --capabilities CAPABILITY_IAM
   ```

9. **Monitor deployment progress**
   - Watch for errors in output
   - Check resource creation status
   - Track deployment metrics

10. **Wait for deployment completion**
    ```bash
    # Terraform waits automatically

    # CloudFormation
    aws cloudformation wait stack-update-complete --stack-name <stack-name>
    ```

### Phase 4: Post-deployment Validation

11. **Verify infrastructure health**
    ```bash
    # Check service status
    aws ecs describe-services --cluster <cluster> --services <service>

    # Or Lambda
    aws lambda get-function --function-name <function>

    # Or EC2
    aws ec2 describe-instance-status --instance-ids <id>
    ```

12. **Run health checks**
    ```bash
    # HTTP endpoint
    curl -f https://<endpoint>/health || echo "❌ Health check failed"

    # Or custom validation
    ./scripts/validate-deployment.sh
    ```

13. **Verify application functionality**
    - Test critical user flows
    - Check monitoring dashboards
    - Verify logs are flowing

14. **Update DNS/routing if needed**
    ```bash
    # Update Route53
    aws route53 change-resource-record-sets \
      --hosted-zone-id <zone-id> \
      --change-batch file://dns-update.json
    ```

### Phase 5: Finalization

15. **Tag deployment in git**
    ```bash
    git tag -a "deploy-$(date +%Y%m%d-%H%M%S)" -m "Deployed to $ENVIRONMENT"
    git push origin --tags
    ```

16. **Send deployment notification**
    ```bash
    # Slack webhook
    curl -X POST <webhook-url> -d "{\"text\":\"✅ Deployed to $ENVIRONMENT\"}"

    # Or SNS
    aws sns publish --topic-arn <arn> --message "Deployment complete"
    ```

17. **Update deployment log/documentation**
    - Record deployment time
    - Note any issues encountered
    - Document any manual steps taken

---

## Validation

### Success Criteria

1. ✅ Infrastructure deployment completed without errors
2. ✅ Application health checks passing
3. ✅ Service responding to requests
4. ✅ Monitoring shows normal metrics
5. ✅ No increase in error rates
6. ✅ DNS/routing updated (if applicable)
7. ✅ Deployment tagged in git

### Verification Commands

```bash
# Check deployment status
if [ "$IaC_TOOL" = "terraform" ]; then
  terraform show | grep "Apply complete"
elif [ "$IaC_TOOL" = "cloudformation" ]; then
  aws cloudformation describe-stacks \
    --stack-name <stack-name> \
    --query 'Stacks[0].StackStatus' \
    --output text | grep "COMPLETE"
fi

# Verify service health
curl -f https://<endpoint>/health

# Check monitoring
echo "📊 Check monitoring dashboard: <dashboard-url>"
```

### Success Message

```
=========================
✅ Deployment Complete!

📊 Summary:
  Environment: <environment>
  Version: <git-sha>
  Duration: <time>
  Status: Healthy

🔗 URLs:
  Application: https://<endpoint>
  Monitoring: <dashboard-url>

📝 Next Steps:
  1. Monitor application for next 15 minutes
  2. Check error rates and performance metrics
  3. Verify critical user flows
  4. Notify stakeholders of successful deployment

💡 Tip: Keep this terminal open to monitor logs
```

---

## Troubleshooting

### Issue 1: AWS Credentials Invalid

**Symptoms**:
```
Unable to locate credentials. You can configure credentials by running "aws configure"
```

**Cause**: AWS CLI not configured or credentials expired

**Solution**:
```bash
# Configure AWS CLI
aws configure

# Or use environment variables
export AWS_ACCESS_KEY_ID="<key>"
export AWS_SECRET_ACCESS_KEY="<secret>"
export AWS_DEFAULT_REGION="us-east-1"

# Or use SSO
aws sso login --profile <profile>
```

---

### Issue 2: Terraform State Locked

**Symptoms**:
```
Error: Error locking state: Error acquiring the state lock
```

**Cause**: Previous deployment failed or is still running

**Solution**:
```bash
# Check lock status
terraform force-unlock <lock-id>

# Or wait for lock to expire (usually 15 minutes)
```

---

### Issue 3: CloudFormation Stack in UPDATE_ROLLBACK_COMPLETE

**Symptoms**:
```
Stack cannot be updated when in UPDATE_ROLLBACK_COMPLETE state
```

**Cause**: Previous deployment failed and was rolled back

**Solution**:
```bash
# Delete and recreate stack (if safe)
aws cloudformation delete-stack --stack-name <stack-name>
aws cloudformation wait stack-delete-complete --stack-name <stack-name>

# Then redeploy
```

---

### Issue 4: Health Check Failing After Deployment

**Symptoms**:
- Infrastructure deployed successfully
- But application not responding

**Possible Causes**:
1. Application failed to start (check logs)
2. Security group blocking traffic
3. Environment variables missing
4. Database migration needed

**Solution**:
```bash
# Check application logs
aws logs tail /aws/ecs/<cluster>/<service> --follow

# Check security groups
aws ec2 describe-security-groups --group-ids <sg-id>

# Verify environment variables
aws ecs describe-task-definition --task-definition <task>

# Run database migrations manually if needed
./scripts/migrate-database.sh
```

---

### Issue 5: Insufficient Permissions

**Symptoms**:
```
AccessDenied: User: arn:aws:iam::xxx is not authorized to perform: xxx
```

**Cause**: AWS IAM permissions insufficient

**Solution**:
1. Review required permissions in IaC files
2. Update IAM policy or role
3. Contact AWS administrator
4. Use a role with sufficient permissions

---

## Rollback Procedures

### If Deployment Fails During Infrastructure Phase

```bash
# Terraform
terraform destroy -target=<failed-resource>
# Or full rollback
terraform apply -auto-approve  # reverts to previous state

# CloudFormation auto-rolls back on failure
# To manually rollback:
aws cloudformation cancel-update-stack --stack-name <stack-name>
```

### If Deployment Succeeds but Application is Broken

**Option 1: Rollback to previous version**
```bash
# Revert git
git revert HEAD
git push

# Redeploy
terraform apply  # with reverted config
```

**Option 2: Use backup**
```bash
# Restore database snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier <instance> \
  --db-snapshot-identifier <backup-snapshot>
```

**Option 3: Blue-Green switch back**
```bash
# Update load balancer to point to old version
aws elbv2 modify-listener --listener-arn <arn> --default-actions TargetGroupArn=<old-target-group>
```

---

## Related Dossiers

- **database-migration.md** - Run database migrations
- **rollback-deployment.md** - Comprehensive rollback procedures
- **aws-monitoring-setup.md** - Configure CloudWatch monitoring
- **backup-aws-resources.md** - Create backups before deployment

---

## Example Execution

### Scenario: Deploy Node.js API to ECS Staging

```
User: "Deploy to AWS staging using the deploy-to-aws dossier"

AI: 📊 Context Gathered:
      IaC Tool: Terraform
      Runtime: Node.js
      Target: ECS on Fargate
      Environment: staging
      Branch: feature/new-api
      AWS Account: 123456789012
      Region: us-east-1

    Decision: Deploying to staging (safe for feature branch)

    Phase 1: Pre-deployment Validation
      ✓ AWS credentials valid
      ✓ Running terraform plan...
      ✓ Changes: 3 to add, 2 to change, 0 to destroy

    🔍 Review Changes:
      + ECS Task Definition (new image version)
      ~ Service desired_count: 2 → 3
      ~ Load balancer health check timeout: 5s → 10s

    Proceed with deployment? (y/N)

[User: "yes"]

AI: Phase 2: Application Build
      ✓ Running npm run build
      ✓ Tests passed (47 passed, 0 failed)
      ✓ Building Docker image
      ✓ Tagging: api:a1b2c3d
      ✓ Pushing to ECR

    Phase 3: Infrastructure Deployment
      ✓ Applying terraform changes...
      ✓ Task definition updated
      ✓ Service updated
      ✓ Waiting for deployment to stabilize...
      ✓ New tasks running (3/3)

    Phase 4: Post-deployment Validation
      ✓ Health check: https://api-staging.example.com/health
      ✓ Status: 200 OK
      ✓ Response time: 124ms
      ✓ Monitoring: All metrics normal

    Phase 5: Finalization
      ✓ Tagged: deploy-20251105-143022
      ✓ Notification sent to Slack
      ✓ Deployment logged

    =========================
    ✅ Deployment Complete!

    📊 Summary:
      Environment: staging
      Version: a1b2c3d
      Duration: 4m 32s
      Status: Healthy

    🔗 URLs:
      Application: https://api-staging.example.com
      Monitoring: https://console.aws.amazon.com/cloudwatch/...

    📝 Next Steps:
      1. Monitor application for next 15 minutes
      2. Run integration tests
      3. Notify QA team for testing

    💡 Tip: Monitor logs with: aws logs tail /aws/ecs/staging/api --follow
```

---

## Notes

- This dossier is implementation-agnostic and adapts to your specific AWS setup
- Modify paths and resource names based on your infrastructure
- Consider creating environment-specific variants for complex deployments
- Always test deployments in non-production environments first

---

**🎯 Deploy to AWS Dossier v1.0.0**

*Safe, validated, and rollback-ready AWS deployments*
