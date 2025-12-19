#!/bin/bash

# Update Linera CLI to latest version

set -e

echo "🔄 Updating Linera CLI..."
echo ""

# Update via cargo
cargo install linera-service --locked --force

echo ""
echo "✅ Linera CLI updated!"
echo ""
echo "Checking version:"
linera --version
