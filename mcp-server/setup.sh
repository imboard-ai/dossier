#!/bin/bash

# Dossier MCP Server - Quick Setup Script
# Installs and configures the MCP server for Claude Desktop

set -e

echo "🚀 Dossier MCP Server v1.0.0 - Quick Setup"
echo "==========================================="
echo ""

# Get absolute path to this directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER_PATH="$SCRIPT_DIR/dist/index.js"

echo "📁 Installing from: $SCRIPT_DIR"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "  Found: $NODE_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Build
echo "🔨 Building server..."
npm run build
echo ""

# Test
echo "🧪 Running tests..."
npm test
echo ""

# Verify build
if [ ! -f "$SERVER_PATH" ]; then
    echo "❌ Build failed - $SERVER_PATH not found"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Claude Desktop config
echo "⚙️  Configuration"
echo "=================="
echo ""
echo "Add this to your Claude Desktop config:"
echo ""

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_PATH="~/Library/Application Support/Claude/claude_desktop_config.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    CONFIG_PATH="%APPDATA%\\Claude\\claude_desktop_config.json"
else
    CONFIG_PATH="~/.config/Claude/claude_desktop_config.json"
fi

echo "File: $CONFIG_PATH"
echo ""
echo '{'
echo '  "mcpServers": {'
echo '    "dossier": {'
echo '      "command": "node",'
echo "      \"args\": [\"$SERVER_PATH\"]"
echo '    }'
echo '  }'
echo '}'
echo ""

echo "📝 Quick test:"
echo "node test-manual.js"
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add the config above to Claude Desktop"
echo "2. Restart Claude Desktop completely"
echo "3. Try: 'List available dossiers'"
echo ""
echo "🎉 Happy automating!"
