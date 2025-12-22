#!/bin/bash

# Attempt 8: Post-process WASM with wasm-opt
# Strip all non-essential features

echo "🔧 Deployment Attempt #8: Post-process with wasm-opt"
echo "====================================================="
echo ""
echo "Strategy: Build normally, then optimize WASM for compatibility"
echo ""

# Check if wasm-opt is installed
if ! command -v wasm-opt &> /dev/null; then
    echo "📦 Installing binaryen (wasm-opt)..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install binaryen
    else
        sudo apt-get update && sudo apt-get install -y binaryen
    fi
fi

cd trade-counter

echo "📦 Step 1: Clean build..."
cargo clean

echo ""
echo "🔨 Step 2: Build WASM..."
cargo build --target wasm32-unknown-unknown --release

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🔧 Step 3: Optimize WASM for compatibility..."
WASM_FILE="target/wasm32-unknown-unknown/release/trade_counter.wasm"
OPTIMIZED_FILE="target/wasm32-unknown-unknown/release/trade_counter_optimized.wasm"

wasm-opt "$WASM_FILE" -o "$OPTIMIZED_FILE" \
    --mvp-features \
    --disable-simd \
    --disable-bulk-memory \
    --disable-sign-ext \
    --disable-reference-types \
    --disable-multivalue \
    -Oz

echo ""
echo "📊 File comparison:"
echo "Original:  $(ls -lh $WASM_FILE | awk '{print $5}')"
echo "Optimized: $(ls -lh $OPTIMIZED_FILE | awk '{print $5}')"

echo ""
echo "🔄 Step 4: Replace original with optimized..."
cp "$OPTIMIZED_FILE" "$WASM_FILE"

echo ""
echo "📤 Step 5: Publish and create..."
linera project publish-and-create --json-argument "0"

cd ..
