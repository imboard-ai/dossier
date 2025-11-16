---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Schema Capability Check",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "last_updated": "2025-11-16",
  "objective": "Explore the codebase to determine if a specific feature or capability is supported by the Dossier schema and implementation",
  "category": [
    "development",
    "meta"
  ],
  "tags": [
    "meta",
    "schema",
    "exploration",
    "analysis"
  ],
  "risk_level": "low",
  "risk_factors": [],
  "requires_approval": false,
  "destructive_operations": [],
  "estimated_duration": {
    "min_minutes": 1,
    "max_minutes": 2
  },
  "coupling": {
    "level": "Loose",
    "details": "Read-only analysis with no dependencies"
  },
  "inputs": {
    "required": [
      {
        "name": "capability",
        "description": "The feature or capability to check (e.g., 'composition/references', 'conditional execution', 'loops')",
        "type": "string",
        "example": "Does the schema support referencing other dossier files?"
      }
    ]
  },
  "outputs": {
    "format": "markdown",
    "sections": [
      "Answer Summary",
      "Evidence from Code",
      "Usage Examples (if supported)",
      "Recommendations"
    ]
  },
  "checksum": {
    "algorithm": "sha256",
    "hash": "ce7c49dc85f4033c52d8e81b5c1b9f73c26157cf90f81c77f6eb9bf8fccac952"
  },
  "signature": {
    "algorithm": "ECDSA-SHA-256",
    "signature": "MEYCIQDk7q4zhv4WExtG9lOFJRb+T3JyJBVl5flUhF35D8MQwQIhAOkHhe11PCoK226CatFiDRXcSxtZpaDwSRtBt8eiPVw2",
    "public_key": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqIbQGqW1Jdh97TxQ5ZvnSVvvOcN5NWhfWwXRAaDDuKK1pv8F+kz+uo1W8bNn+8ObgdOBecFTFizkRa/g+QJ8kA==",
    "key_id": "arn:aws:kms:us-east-1:942039714848:key/d9ccd3fc-b190-49fd-83f7-e94df6620c1d",
    "signed_at": "2025-11-16T11:23:38.973Z",
    "signed_by": "Dossier Team <team@dossier.ai>"
  }
}
---
# Schema Capability Check

You are analyzing the Dossier project to determine if it supports: **{{capability}}**

## Your Task

1. **Explore the Schema Definition**
   - Read the schema documentation (README.md, SCHEMA.md, schema.json, etc.)
   - Look for JSON Schema definitions or TypeScript types
   - Check for relevant field names or structures

2. **Explore the Implementation**
   - Find the validator/parser code
   - Look for runtime handling of the feature
   - Check test files for usage examples

3. **Search for Examples**
   - Look in examples/ directory
   - Search for usage in existing dossier files
   - Check test fixtures

4. **Provide Clear Answer**
   - ✅ YES - Feature is supported (with evidence)
   - ⚠️ PARTIAL - Some support exists (explain limitations)
   - ❌ NO - Not currently supported (suggest workarounds or alternatives)

## Output Format

### Answer Summary
[Clear yes/partial/no answer with one-line explanation]

### Evidence from Code
[Specific file paths and line numbers showing schema definitions, implementation code, or tests]

### Usage Examples (if supported)
[Show concrete examples of how to use this feature]

### Recommendations
[If not supported: suggest workarounds or whether it should be added]
[If supported: best practices for using it]

---

**Instructions:**
- Focus on factual evidence from code, not speculation
- Include file paths with line numbers (e.g., `schema.json:45-50`)
- If unsure, say so and explain what you found vs. what's unclear
- Be concise but thorough
