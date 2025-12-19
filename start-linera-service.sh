#!/bin/bash

echo "🚀 Starting Linera Service for AI POWER TRADE"

# Kill any existing linera processes
pkill -f linera 2>/dev/null || true
sleep 2

# Start linera service on port 8080
echo "Starting Linera service on port 8080..."
linera service --port 8080 &

# Wait and test
sleep 5
echo "Testing connection..."
curl -s http://localhost:8080/chains && echo "✅ Service ready!" || echo "❌ Service not ready"

echo "🌐 Linera service running at http://localhost:8080"
echo "Now refresh your browser and click 'Connect'"