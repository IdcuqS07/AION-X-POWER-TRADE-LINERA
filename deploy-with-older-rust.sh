#!/bin/bash

# Attempt 6: Deploy with Older Rust Toolchain (1.82.0)
# Based on Substrate best practices for WASM compatibility

echo "🔧 Deployment Attempt #6: Older Rust Toolchain"
echo "================================================"
echo ""
echo "Strategy: Use Rust 1.82.0 (older stable) instead of 1.92.0"
echo "Reason: Newer Rust may generate opcodes not supported by testnet runtime"
echo ""

cd trade-counter

echo "📦 Step 1: Clean all build artifacts..."
cargo clean
rm -rf target/

echo ""
echo "🦀 Step 2: Install Rust 1.82.0..."
rustup install 1.82.0
rustup default 1.82.0
rustup target add wasm32-unknown-unknown

echo ""
echo "✅ Rust version:"
rustc --version

echo ""
echo "🔨 Step 3: Build with Rust 1.82.0..."
cargo build --target wasm32-unknown-unknown --release

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📤 Step 4: Publish and create application..."
linera project publish-and-create --json-argument "0"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Application deployed with Rust 1.82.0"
else
    echo ""
    echo "❌ Still failed with Rust 1.82.0"
    echo "Trying even older version (1.75.0)..."
    
    rustup install 1.75.0
    rustup default 1.75.0
    cargo clean
    cargo build --target wasm32-unknown-unknown --release
    linera project publish-and-create --json-argument "0"
fi

cd ..
