#!/bin/bash

echo "🚀 Testing Real Linera Connection"

# Check if port 8080 is available
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 8080 is already in use"
    echo "Killing existing processes..."
    pkill -f linera
    sleep 3
fi

# Start Linera service
echo "Starting Linera service..."
linera service --port 8080 &
SERVICE_PID=$!

# Wait for service to start
sleep 5

# Test connection
echo "Testing connection to localhost:8080..."
curl -s http://localhost:8080/chains || echo "❌ Service not responding"

echo "✅ Linera service running on PID: $SERVICE_PID"
echo "🌐 Frontend can now connect to http://localhost:8080"
echo "Press Enter to stop service..."
read

kill $SERVICE_PID
echo "Service stopped."