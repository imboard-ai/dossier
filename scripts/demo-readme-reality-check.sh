#!/usr/bin/env bash
set -euo pipefail

# Dossier Demo: README Reality Check
# Demonstrates end-to-end dossier verification and execution

echo "=================================================="
echo "Dossier Demo: README Reality Check"
echo "=================================================="
echo ""
echo "This script demonstrates:"
echo "  ✓ Fetching a dossier from a remote URL"
echo "  ✓ Verifying checksums and signatures"
echo "  ✓ Executing validation checks"
echo ""
echo "Running in 3 seconds..."
sleep 3

echo ""
echo "→ Running Dossier CLI verification tool..."
echo ""

# Get the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Run the CLI verification on the readme reality check dossier
"$PROJECT_ROOT/cli/bin/dossier-verify" \
  "$PROJECT_ROOT/examples/git-project-review/atomic/readme-reality-check.ds.md"

echo ""
echo "=================================================="
echo "Demo complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "  - Try running this dossier on your own project"
echo "  - Create custom dossiers using templates/dossier-template.md"
echo "  - Explore more examples in the examples/ directory"
echo ""
