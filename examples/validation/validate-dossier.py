#!/usr/bin/env python3

"""
Dossier Schema Validator (Python)

Validates Dossier frontmatter against the JSON Schema.

Usage:
    pip install jsonschema
    python validate-dossier.py /path/to/dossier.md
"""

import sys
import json
import re
from pathlib import Path
from jsonschema import validate, ValidationError, Draft7Validator


def extract_frontmatter(file_path):
    """Extract JSON frontmatter from a Dossier markdown file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match ---dossier\n{...}\n---
    pattern = r'^---dossier\s*\n([\s\S]*?)\n---'
    match = re.search(pattern, content, re.MULTILINE)

    if not match:
        raise ValueError(
            'No dossier frontmatter found. Expected:\n---dossier\n{...}\n---'
        )

    json_string = match.group(1)

    try:
        return json.loads(json_string)
    except json.JSONDecodeError as e:
        raise ValueError(f'Failed to parse frontmatter JSON: {e}')


def load_schema():
    """Load the Dossier JSON Schema."""
    script_dir = Path(__file__).parent
    schema_path = script_dir / '../../dossier-schema.json'

    with open(schema_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def validate_dossier(file_path):
    """Validate a Dossier file."""
    print(f'\n🔍 Validating: {file_path}\n')

    try:
        # Extract frontmatter
        frontmatter = extract_frontmatter(file_path)
        print('✓ Frontmatter extracted successfully')
        print(f"  Title: {frontmatter.get('title', 'N/A')}")
        print(f"  Version: {frontmatter.get('version', 'N/A')}")
        print(f"  Status: {frontmatter.get('status', 'N/A')}")
        print()

        # Load schema
        schema = load_schema()

        # Validate against schema
        validator = Draft7Validator(schema)
        errors = list(validator.iter_errors(frontmatter))

        if not errors:
            print('✅ VALID - Dossier schema is compliant\n')
            return True
        else:
            print('❌ INVALID - Schema validation failed:\n')
            for i, err in enumerate(errors, 1):
                path = '.'.join(str(p) for p in err.path) or '(root)'
                print(f'  Error {i}:')
                print(f'    Path: {path}')
                print(f'    Message: {err.message}')
                if err.validator_value:
                    print(f'    Constraint: {err.validator} = {err.validator_value}')
                print()
            return False

    except Exception as e:
        print(f'❌ ERROR: {e}\n')
        return False


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print('Usage: python validate-dossier.py <dossier-file.md>')
        print('Example: python validate-dossier.py ../../examples/devops/deploy-to-aws.md')
        sys.exit(1)

    file_path = Path(sys.argv[1])

    if not file_path.exists():
        print(f'Error: File not found: {file_path}')
        sys.exit(1)

    valid = validate_dossier(file_path)
    sys.exit(0 if valid else 1)


if __name__ == '__main__':
    main()
