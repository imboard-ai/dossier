# Security Incident Response Plan

**Version**: 1.0.0
**Date**: 2025-11-06
**Status**: Active

---

## Executive Summary

This document defines procedures for responding to security incidents affecting the Dossier project. The goal is to minimize damage, restore normal operations quickly, and learn from incidents to prevent recurrence.

**Key Contacts**:
- **Security Team**: security@imboard.ai
- **Emergency Escalation**: (PagerDuty integration pending - see Phase 2 roadmap)

---

## Table of Contents

- [Incident Classification](#incident-classification)
  - [Severity Levels](#severity-levels)
  - [Incident Types](#incident-types)
- [Incident Response Team](#incident-response-team)
  - [Roles and Responsibilities](#roles-and-responsibilities)
- [Response Procedures](#response-procedures)
  - [P0 - Critical Incidents](#p0---critical-incidents)
  - [P1 - High Severity](#p1---high-severity)
  - [P2 - Medium Severity](#p2---medium-severity)
  - [P3 - Low Severity](#p3---low-severity)
- [Communication Templates](#communication-templates)
  - [Internal Status Update](#internal-status-update)
  - [Security Advisory (Public)](#security-advisory-public)
- [Post-Incident Activities](#post-incident-activities)
  - [Incident Report Template](#incident-report-template)
  - [Lessons Learned Meeting](#lessons-learned-meeting)
- [Testing and Training](#testing-and-training)
  - [Incident Response Drills](#incident-response-drills)
  - [Training](#training)
- [Metrics and Monitoring](#metrics-and-monitoring)
  - [Incident Metrics](#incident-metrics)
  - [Continuous Improvement](#continuous-improvement)
- [Tools and Resources](#tools-and-resources)
  - [Incident Management Tools](#incident-management-tools)
  - [Technical Tools](#technical-tools)
  - [Reference Links](#reference-links)
- [Contact Information](#contact-information)
  - [Primary Contacts](#primary-contacts)
  - [Escalation](#escalation)
  - [External Contacts](#external-contacts)

---

## Incident Classification

### Severity Levels

| Severity | Definition | Example | Response Time |
|----------|------------|---------|---------------|
| **P0 - Critical** | Active exploitation, widespread impact | AWS KMS key compromised | 15 minutes |
| **P1 - High** | High risk of exploitation, significant impact | Malicious official dossier published | 1 hour |
| **P2 - Medium** | Limited exploitation or impact | Community key compromised | 4 hours |
| **P3 - Low** | No immediate threat | Vulnerability reported, not exploited | 1 business day |

### Incident Types

1. **Key Compromise** - Signing keys (AWS KMS or minisign) compromised
2. **Malicious Dossier** - Harmful dossier published or distributed
3. **Supply Chain Attack** - Repository, CI/CD, or dependencies compromised
4. **Vulnerability Discovery** - Security flaw in verification or execution
5. **Account Takeover** - GitHub, AWS, or maintainer accounts compromised
6. **Data Breach** - Sensitive user data exposed
7. **Denial of Service** - System availability impacted

---

## Incident Response Team

### Roles and Responsibilities

#### Incident Commander (IC)
**Responsibility**: Overall incident coordination
- Declares incident severity
- Coordinates response activities
- Makes executive decisions
- Communicates with stakeholders

**Primary**: Security Team Lead
**Backup**: Engineering Manager

#### Technical Lead (TL)
**Responsibility**: Technical investigation and remediation
- Root cause analysis
- Implements fixes
- Coordinates with engineering team

**Primary**: Senior Security Engineer
**Backup**: Principal Engineer

#### Communications Lead (CL)
**Responsibility**: Internal and external communications
- Status updates
- User notifications
- Security advisories
- Media relations (if needed)

**Primary**: Product Manager
**Backup**: Technical Writer

#### Documentation Lead (DL)
**Responsibility**: Incident tracking and lessons learned
- Timeline documentation
- Decision logging
- Post-incident report
- Runbook updates

**Primary**: Technical Writer
**Backup**: Any team member

---

## Response Procedures

### P0 - Critical Incidents

#### Example: AWS KMS Key Compromised

**Detection**:
- CloudWatch alarm triggered
- Unusual signing activity detected
- AWS Security Hub alert
- Manual report

**Immediate Response (0-15 minutes)**:

```bash
# 1. DISABLE KEY IMMEDIATELY
aws kms disable-key --key-id alias/dossier-official-prod

# 2. REVOKE ALL ACTIVE SESSIONS
aws sts get-session-token --duration-seconds 900  # Force re-auth

# 3. AUDIT RECENT ACTIVITY
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=ResourceName,AttributeValue=<key-arn> \
  --start-time $(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S) \
  --max-results 1000 > /tmp/kms-audit.json

# 4. NOTIFY TEAM
# Send alert to security@imboard.ai and incident Slack channel
```

**Short-term Response (15 minutes - 4 hours)**:

##### Assess Damage (15-60 min)

- Identify all signatures created during compromise window
- Determine if malicious dossiers were signed
- List affected users/systems

##### Containment (60-120 min)

```bash
# Generate new key
aws kms create-key \
  --description "Dossier Emergency Replacement Key" \
  --key-usage SIGN_VERIFY \
  --key-spec ECC_NIST_P256

# Update alias
aws kms create-alias \
  --alias-name alias/dossier-official-prod-emergency \
  --target-key-id <new-key-id>

# Update GitHub workflows
# Edit .github/workflows/sign.yml to use new alias
```

##### Public Communication (120-180 min)

- Publish GitHub Security Advisory
- Update KEYS.txt with REVOKED status
- Email notification to known users
- Post to status page / social media

##### User Protection (180-240 min)

```bash
# Add compromised key to revocation list
cat >> KEYS.txt << EOF

## REVOKED KEYS - DO NOT TRUST

### imboard-ai-2024-kms
**Status**: REVOKED
**Date**: 2024-11-06
**Reason**: Key compromise (Incident INC-2024-001)
**Action**: Remove from trusted-keys.txt immediately
**Compromised Window**: 2024-11-06 08:00 - 12:00 UTC
EOF

git add KEYS.txt
git commit -m "SECURITY: Revoke compromised key (INC-2024-001)"
git push
```

**Long-term Response (4-24 hours)**:

##### Root Cause Analysis

- How was key accessed?
- What vulnerability was exploited?
- Timeline reconstruction

##### Re-sign Clean Dossiers

```bash
# Re-sign all official dossiers with new key
for dossier in examples/**/*.md; do
  node tools/sign-dossier.js "$dossier" \
    --method kms \
    --key-id alias/dossier-official-prod-emergency
done
```

##### Monitoring Enhancement

- Review and strengthen CloudWatch alarms
- Add additional detection rules
- Implement new security controls

**Post-Incident (1-7 days)**:

##### Incident Report (Day 1-2)

- Document timeline
- Root cause
- Actions taken
- Lessons learned

##### User Follow-up (Day 2-3)

- Email to affected users
- FAQ for common questions
- Support for migration to new key

##### Process Improvement (Day 3-7)

- Update runbooks
- Enhance monitoring
- Security training

### P1 - High Severity

#### Example: Malicious Official Dossier Published

**Detection**:

- User report
- Automated scanning (future)
- Code review catch

**Response Procedure**:

##### Verification (0-30 min)

```bash
# Verify the dossier is malicious
node tools/verify-dossier.js examples/suspicious/dossier.md

# Review dossier content
cat examples/suspicious/dossier.md

# Check signature and timeline
git log --follow examples/suspicious/dossier.md
```

##### Containment (30-60 min)

```bash
# Remove from repository immediately
git rm examples/suspicious/dossier.md
git commit -m "SECURITY: Remove malicious dossier (INC-2024-002)"
git push --force  # If on main branch and recent

# If older commit, revert instead
git revert <commit-hash>
git push
```

##### User Notification (60-90 min)

```text
# SECURITY ADVISORY: Malicious Dossier Removed

**Date**: 2024-11-06
**Severity**: HIGH
**Dossier**: examples/suspicious/dossier.md
**Risk**: Data exfiltration, system compromise

## Summary
A malicious dossier was identified and removed from the repository.

## Affected Versions
- Commit range: abc123...def456
- Dates: 2024-11-01 to 2024-11-06

## Action Required
If you executed this dossier:
1. Review system logs for suspicious activity
2. Rotate any credentials that may have been exposed
3. Run anti-malware scan
4. Report any suspicious activity to security@imboard.ai

## Mitigation
The dossier has been removed. Update your local copy:

    git pull origin main

## Timeline
- 2024-11-06 09:00 UTC: Malicious dossier published
- 2024-11-06 12:00 UTC: Issue reported by user
- 2024-11-06 12:30 UTC: Verified and removed
- 2024-11-06 13:00 UTC: Advisory published
```

##### Investigation (2-24 hours)

- How was malicious dossier introduced?
- Who committed it?
- Was account compromised?
- Are there other malicious dossiers?

##### Prevention (1-7 days)

- Enhanced code review for dossiers
- Automated malware scanning (implement)
- Additional approval requirements
- Team security training

### P2 - Medium Severity

#### Example: Community Key Compromised

**Response**:

##### Assist Community Author (0-1 hour)

```text
# Template Email to Compromised Author

Subject: Assistance with Key Compromise

Hi [Author],

We've received your report that your minisign key may be compromised.
Here's how to respond:

1. Generate new key immediately:
   minisign -G -p [your-name]-2024-emergency.pub -s [your-name]-2024-emergency.key

2. Publish revocation notice in your KEYS.txt:
   [Include template from KEY_MANAGEMENT.md]

3. Notify users who may have your key in trusted-keys.txt:
   [Provide communication template]

4. Re-sign your dossiers with new key:
   [Provide signing instructions]

We're here to help. Reply to this email or reach us at security@imboard.ai.

Best regards,
Dossier Security Team
```

##### Update Central Documentation (1-4 hours)

```bash
# Add to community key revocations
cat >> KEYS.txt << EOF

## Community Key Revocations

### author-name-2024
**Reported**: 2024-11-06
**Reason**: Key compromise (self-reported)
**Replacement**: author-name-2024-emergency
**Action**: Remove from trusted-keys.txt if present
EOF
```

##### Monitor (1-7 days)

- Watch for malicious dossiers signed with compromised key
- Support author's transition to new key
- Document lessons learned

### P3 - Low Severity

#### Example: Vulnerability Reported (Not Exploited)

**Response**:

##### Acknowledgment (0-24 hours)

```text
# Email Template

Subject: Re: [SECURITY] Vulnerability Report

Thank you for reporting this security issue. We've received your report
and assigned it tracking number INC-2024-XXX.

We'll investigate and respond within 7 days with our assessment.

Please do not publicly disclose this issue until we've had a chance
to investigate and coordinate a fix.

Thank you for helping improve Dossier security!
```

##### Triage (1-2 days)

- Reproduce vulnerability
- Assess severity and impact
- Determine priority for fix

##### Coordinated Disclosure (7-90 days)

- Develop fix
- Test thoroughly
- Coordinate disclosure date with reporter
- Prepare security advisory

##### Release (Disclosure day)

- Publish fix
- Release security advisory
- Credit reporter (if desired)
- Update documentation

---

## Communication Templates

### Internal Status Update
**Incident**: INC-2024-XXX
**Status**: [INVESTIGATING / CONTAINED / RESOLVED]
**Severity**: [P0 / P1 / P2 / P3]
**IC**: [Name]

**Summary**: [Brief description]

**Impact**: [Systems/users affected]

**Actions Taken**:
- [Timestamp] [Action]
- [Timestamp] [Action]

**Next Steps**:
- [ ] [Action - Owner - ETA]

**Open Questions**:
- [Question needing answer]

**Last Updated**: [Timestamp]

### Security Advisory (Public)

```markdown
# Dossier Security Advisory DOSSIER-SA-2024-XXX

**Published**: 2024-11-06
**Severity**: [CRITICAL / HIGH / MEDIUM / LOW]
**CVE**: CVE-2024-XXXXX (if assigned)

## Summary

[Brief description of the issue]

## Impact

[Who/what is affected]

## Affected Versions

- Version X.X.X and earlier

## Fixed Versions

- Version X.X.X

## Workarounds

[If any are available]

## Mitigation

[How to protect yourself]

## Timeline

- YYYY-MM-DD: Issue discovered
- YYYY-MM-DD: Fix developed
- YYYY-MM-DD: Fix released
- YYYY-MM-DD: Public disclosure

## Credit

This vulnerability was discovered by [Name/Handle] (with permission).

## References

- GitHub Advisory: [URL]
- CVE: [URL]
- Fix PR: [URL]

## Contact

security@imboard.ai
```

---

## Post-Incident Activities

### Incident Report Template

```markdown
# Incident Report: INC-2024-XXX

**Incident Type**: [Key Compromise / Malicious Dossier / etc.]
**Severity**: [P0 / P1 / P2 / P3]
**Incident Commander**: [Name]
**Date**: [YYYY-MM-DD]

## Executive Summary

[2-3 paragraphs summarizing the incident, impact, and resolution]

## Timeline

| Time (UTC) | Event |
|------------|-------|
| 08:00 | Incident detected |
| 08:15 | IC notified, incident declared |
| 08:30 | Initial containment actions |
| ... | ... |

## Impact Analysis

**Users Affected**: [Number/percentage]
**Systems Affected**: [List]
**Data Exposure**: [Yes/No - details]
**Financial Impact**: [If applicable]

## Root Cause

[Detailed analysis of what caused the incident]

## Response Effectiveness

**What Went Well**:
- [Item]

**What Didn't Go Well**:
- [Item]

**Where We Got Lucky**:
- [Item]

## Action Items

| Action | Owner | Priority | Due Date | Status |
|--------|-------|----------|----------|--------|
| [Action] | [Name] | [P0-P3] | [Date] | [Open/Done] |

## Lessons Learned

[Key takeaways to prevent recurrence]

## Appendices

### A. Technical Details
[Logs, evidence, commands run]

### B. Communications Log
[All communications during incident]

### C. Decisions Made
[Key decisions and rationale]
```

### Lessons Learned Meeting

**Schedule**: Within 7 days of incident resolution
**Attendees**: Incident response team + stakeholders
**Duration**: 1-2 hours

**Agenda**:

1. Timeline review (10 min)
2. What went well (15 min)
3. What didn't go well (20 min)
4. Root cause deep dive (20 min)
5. Action items (20 min)
6. Process improvements (15 min)

**Output**: Updated runbooks, improved processes, training needs identified

---

## Testing and Training

### Incident Response Drills

**Frequency**: Quarterly

**Types**:

- **Tabletop Exercise**: Team discusses hypothetical scenario
- **Simulation**: Simulate incident in staging environment
- **Red Team**: Authorized security test

**Sample Scenarios**:

- AWS KMS key compromise (tabletop)
- Malicious dossier in repository (simulation)
- GitHub account takeover (tabletop)
- Community key compromise (simulation)

### Training

**New Team Members**:

- Incident response overview (onboarding)
- Role-specific training (first week)
- Shadow real incident (if occurs)

**Annual Refresher**:

- All team members review procedures
- Practice using runbooks
- Update contact information

---

## Metrics and Monitoring

### Incident Metrics

Track and review monthly:

| Metric | Target | Actual |
|--------|--------|--------|
| MTTD (Mean Time To Detect) | < 30 min | ... |
| MTTA (Mean Time To Acknowledge) | < 15 min (P0/P1) | ... |
| MTTC (Mean Time To Contain) | < 4 hours | ... |
| MTTR (Mean Time To Resolve) | < 24 hours (P0/P1) | ... |
| Incident Count | Trend down | ... |
| False Positive Rate | < 10% | ... |

### Continuous Improvement

**Quarterly Review**:

- Review all incidents
- Identify patterns
- Update procedures
- Test improvements

**Annual Review**:

- Comprehensive plan review
- Update based on lessons learned
- Benchmark against industry
- Executive presentation

---

## Tools and Resources

### Incident Management Tools

- **Tracking**: GitHub Issues (private repository)
- **Communication**: Slack #security-incidents (private)
- **Alerting**: Email + Slack (PagerDuty integration planned for Phase 2)
- **Documentation**: Confluence / Google Docs

### Technical Tools

```bash
# Audit AWS KMS activity
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=ResourceName,AttributeValue=<key-arn>

# Scan dossiers for malicious patterns
grep -r "rm -rf" examples/
grep -r "curl.*password" examples/

# Verify all dossiers in repository
find examples/ -name "*.md" -exec node tools/verify-dossier.js {} \;

# Check git history for anomalies
git log --all --full-history --source --pretty=format:"%H %an %ae %cd" -- "*.md"
```

### Reference Links

- [KEY_MANAGEMENT.md](KEY_MANAGEMENT.md) - Key revocation procedures
- [THREAT_MODEL.md](THREAT_MODEL.md) - Attack scenarios
- [ARCHITECTURE.md](ARCHITECTURE.md) - Security architecture
- [../SECURITY.md](../SECURITY.md) - Vulnerability reporting

---

## Contact Information

### Primary Contacts

- **Security Team**: security@imboard.ai
- **On-Call**: Email security team (PagerDuty rotation planned for Phase 2)

### Escalation

1. Security Team Lead
2. Engineering Manager
3. CTO
4. CEO (for P0 incidents with legal/PR implications)

### External Contacts

- **AWS Support**: (Enterprise support)
- **GitHub Support**: support@github.com
- **Legal**: (if needed)
- **PR/Communications**: (if needed)

---

**Last Updated**: 2025-11-06
**Version**: 1.0.0
**Next Review**: 2026-02-06

**Document Owner**: Security Team Lead
**Approver**: CTO