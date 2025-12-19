#!/bin/bash

set -e

echo "Testing AI POWER TRADE system..."

# Run example
echo "Running basic trading example..."
cd examples && cargo run
cd ..

# Test individual components
echo "Testing ABI types..."
cd abi && cargo test
cd ..

echo "Testing wallet functionality..."
cd wallet && cargo test
cd ..

echo "Testing trading logic..."
cd trading && cargo test
cd ..

echo "Testing AI signals..."
cd ai-signals && cargo test
cd ..

echo "Testing market data..."
cd market-data && cargo test
cd ..

echo "All tests passed! ✅"