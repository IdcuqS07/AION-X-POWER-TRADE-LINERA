#!/bin/bash

echo "🚀 Quick AI POWER TRADE Test"

# Test compilation only
echo "Testing compilation..."
cargo check --workspace

echo "Running example..."
cd examples && cargo run --release
cd ..

echo "✅ Quick test complete!"