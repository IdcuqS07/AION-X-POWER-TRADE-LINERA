#!/bin/bash

echo "🔨 Building AI Trading Linera Backend..."

# Build WebAssembly
cargo build --release --target wasm32-unknown-unknown

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📦 Generated files:"
    ls -la target/wasm32-unknown-unknown/release/*.wasm 2>/dev/null || echo "No .wasm files found"
    echo ""
    echo "🚀 Next steps:"
    echo "1. linera publish-bytecode target/wasm32-unknown-unknown/release/ai_trading.wasm"
    echo "2. linera create-application <bytecode-id>"
    echo "3. linera service --port 8080"
else
    echo "❌ Build failed!"
    exit 1
fi