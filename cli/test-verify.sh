#!/bin/bash
# Dossier CLI Test Script
# Tests signature verification for both Ed25519 and AWS KMS

set -e

echo "🧪 Dossier CLI Verification Tests"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_SKIPPED=0

# Test 1: Ed25519 Signed Dossier
echo "Test 1: Ed25519 Signature Verification"
echo "---------------------------------------"
TESTS_RUN=$((TESTS_RUN + 1))

# Add test key to trusted keys temporarily
TRUSTED_KEYS_DIR="$HOME/.dossier"
TRUSTED_KEYS_FILE="$TRUSTED_KEYS_DIR/trusted-keys.txt"
BACKUP_KEYS_FILE="$TRUSTED_KEYS_DIR/trusted-keys.txt.backup"

# Backup existing trusted keys if they exist
if [ -f "$TRUSTED_KEYS_FILE" ]; then
  cp "$TRUSTED_KEYS_FILE" "$BACKUP_KEYS_FILE"
fi

# Create trusted keys directory if it doesn't exist
mkdir -p "$TRUSTED_KEYS_DIR"

# Add test key_id to trusted keys
# Using key_id is simpler than full PEM public key
TEST_KEY_ID="test-key-2025"

# Write test key to trusted keys (preserving existing keys)
if [ -f "$TRUSTED_KEYS_FILE" ]; then
  # Append test key if not already present
  if ! grep -q "$TEST_KEY_ID" "$TRUSTED_KEYS_FILE" 2>/dev/null; then
    echo "$TEST_KEY_ID test-suite" >> "$TRUSTED_KEYS_FILE"
  fi
else
  echo "$TEST_KEY_ID test-suite" > "$TRUSTED_KEYS_FILE"
fi

# Run Ed25519 test
if node bin/dossier-verify ../examples/test/hello-world.ds.md > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASSED${NC} - Ed25519 signature verified successfully"
  TESTS_PASSED=$((TESTS_PASSED + 1))
else
  echo -e "${RED}✗ FAILED${NC} - Ed25519 signature verification failed"
  TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# Restore original trusted keys
if [ -f "$BACKUP_KEYS_FILE" ]; then
  mv "$BACKUP_KEYS_FILE" "$TRUSTED_KEYS_FILE"
else
  rm -f "$TRUSTED_KEYS_FILE"
fi

echo ""

# Test 2: AWS KMS Signed Dossier (conditional on credentials)
echo "Test 2: AWS KMS Signature Verification"
echo "---------------------------------------"
TESTS_RUN=$((TESTS_RUN + 1))

# Check if AWS credentials are available
if command -v aws >/dev/null 2>&1 && aws sts get-caller-identity >/dev/null 2>&1; then
  echo "AWS credentials detected - running KMS test"

  # Add KMS key_id to trusted keys
  # Using key_id (ARN) is simpler than public key
  KMS_KEY_ID="arn:aws:kms:us-east-1:942039714848:key/d9ccd3fc-b190-49fd-83f7-e94df6620c1d"

  # Backup trusted keys again
  if [ -f "$TRUSTED_KEYS_FILE" ]; then
    cp "$TRUSTED_KEYS_FILE" "$BACKUP_KEYS_FILE"
  fi

  mkdir -p "$TRUSTED_KEYS_DIR"

  # Add KMS key to trusted keys
  if [ -f "$TRUSTED_KEYS_FILE" ]; then
    if ! grep -q "$KMS_KEY_ID" "$TRUSTED_KEYS_FILE" 2>/dev/null; then
      echo "$KMS_KEY_ID dossier-team" >> "$TRUSTED_KEYS_FILE"
    fi
  else
    echo "$KMS_KEY_ID dossier-team" > "$TRUSTED_KEYS_FILE"
  fi

  # Run KMS test
  if node bin/dossier-verify ../examples/devops/deploy-to-aws.ds.md > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC} - AWS KMS signature verified successfully"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "${RED}✗ FAILED${NC} - AWS KMS signature verification failed"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi

  # Restore original trusted keys
  if [ -f "$BACKUP_KEYS_FILE" ]; then
    mv "$BACKUP_KEYS_FILE" "$TRUSTED_KEYS_FILE"
  else
    rm -f "$TRUSTED_KEYS_FILE"
  fi
else
  echo -e "${YELLOW}⊘ SKIPPED${NC} - AWS credentials not available (this is OK)"
  echo "  To enable this test, configure AWS credentials:"
  echo "    aws configure"
  echo "  or set environment variables:"
  echo "    export AWS_ACCESS_KEY_ID=..."
  echo "    export AWS_SECRET_ACCESS_KEY=..."
  TESTS_SKIPPED=$((TESTS_SKIPPED + 1))
fi

echo ""
echo "=================================="
echo "Test Results Summary"
echo "=================================="
echo "Total tests run: $TESTS_RUN"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo -e "${YELLOW}Skipped: $TESTS_SKIPPED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  exit 1
fi
