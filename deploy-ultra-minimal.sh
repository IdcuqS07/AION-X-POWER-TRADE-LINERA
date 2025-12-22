#!/bin/bash

# Attempt 7: Ultra Minimal WASM with Maximum Compatibility
# Combine ALL compatibility flags

echo "🔧 Deployment Attempt #7: Ultra Minimal WASM"
echo "=============================================="
echo ""
echo "Strategy: Maximum compatibility flags + older Rust"
echo ""

cd trade-counter

echo "📦 Step 1: Clean everything..."
cargo clean
rm -rf target/

echo ""
echo "🔨 Step 2: Build with MAXIMUM compatibility..."

# Ultra conservative RUSTFLAGS
export RUSTFLAGS="\
-C target-feature=-simd128,-bulk-memory,-sign-ext,-reference-types,-multi-value \
-C opt-level=z \
-C lto=fat \
-C codegen-units=1 \
-C panic=abort"

# Also set cargo config
export CARGO_PROFILE_RELEASE_OPT_LEVEL=z
export CARGO_PROFILE_RELEASE_LTO=fat
export CARGO_PROFILE_RELEASE_CODEGEN_UNITS=1
export CARGO_PROFILE_RELEASE_PANIC=abort

echo "RUSTFLAGS: $RUSTFLAGS"
echo ""

cargo build --target wasm32-unknown-unknown --release -v

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📊 WASM file info:"
ls -lh target/wasm32-unknown-unknown/release/*.wasm
wasm-objdump -h target/wasm32-unknown-unknown/release/trade_counter.wasm | head -20

echo ""
echo "📤 Step 3: Publish and create..."
linera project publish-and-create --json-argument "0"

cd ..
