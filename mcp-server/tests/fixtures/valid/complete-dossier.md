# Dossier: Complete Test Dossier

**Version**: 2.1.3
**Protocol Version**: 1.0
**Status**: Stable

## Objective

Demonstrate a complete dossier with all possible sections for comprehensive testing.

## Prerequisites

- All dependencies installed
- Environment configured
- Permissions granted

## Context to Gather

Before executing, analyze:
- Project structure
- Existing configuration files
- Available tools and versions

## Decision Points

### Decision 1: Deployment Target

**Options**:
- Option A: Development environment
- Option B: Staging environment
- Option C: Production environment

**Recommendation**: Start with development environment for testing.

## Actions to Perform

1. Validate prerequisites
2. Gather required context
3. Make decisions based on analysis
4. Execute main workflow
5. Verify results

## Validation

**Success Criteria**:
1. All prerequisites met
2. Context gathered successfully
3. Decisions made appropriately
4. Actions executed without errors
5. Validation checks pass

**Verification Commands**:
```bash
npm test
npm run verify
```

## Example

**Scenario**: Basic project setup

**Expected Output**:
```
✓ Project initialized
✓ Dependencies installed
✓ Configuration created
```

## Troubleshooting

### Issue: Permission Denied

**Symptoms**: Cannot write to directory
**Cause**: Insufficient permissions
**Solution**: Run with appropriate permissions or adjust directory ownership

### Issue: Missing Dependencies

**Symptoms**: Module not found errors
**Cause**: Dependencies not installed
**Solution**: Run `npm install` to install dependencies

## Background

This dossier was created to test the complete dossier specification with all
recommended and optional sections included.

## Related Dossiers

- simple-dossier - Basic version
- advanced-dossier - Extended version

## Rollback

If something goes wrong:

1. Stop all running processes
2. Restore from backup
3. Run cleanup script
4. Verify system state
