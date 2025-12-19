#!/bin/bash
# Check @linera/client package structure

echo "🔍 Checking @linera/client package on npm..."
echo ""

# Check package info
echo "📦 Package info:"
npm view @linera/client@0.15.6 dist.tarball
echo ""

# Download and extract to check structure
echo "📥 Downloading package..."
mkdir -p /tmp/linera-check
cd /tmp/linera-check

npm pack @linera/client@0.15.6
tar -xzf linera-client-*.tgz

echo ""
echo "📂 Package contents:"
ls -lR package/ | head -100

echo ""
echo "🔍 Looking for WASM files:"
find package/ -name "*.wasm"

echo ""
echo "🔍 Looking for dist files:"
ls -lh package/dist/ 2>/dev/null || echo "No dist folder"

echo ""
echo "📄 Package.json:"
cat package/package.json | grep -A 5 -B 5 "main\|module\|exports"

cd -
rm -rf /tmp/linera-check

echo ""
echo "✅ Check complete!"
