#!/bin/bash

echo "🚀 Starting Linera GraphQL Service"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if service is already running
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Service already running on port 8080"
    echo ""
    echo "To stop existing service:"
    echo "  kill -9 \$(lsof -t -i:8080)"
    echo ""
    echo "To restart:"
    echo "  kill -9 \$(lsof -t -i:8080) && bash start-graphql-service.sh"
    exit 1
fi

echo "Starting service on port 8080..."
echo ""

# Start service in background
nohup linera service --port 8080 > graphql-service.log 2>&1 &
SERVICE_PID=$!

echo "✅ Service started with PID: $SERVICE_PID"
echo "📝 Logs: graphql-service.log"
echo "🌐 Endpoint: http://localhost:8080/graphql"
echo ""
echo "To stop service:"
echo "  kill -9 $SERVICE_PID"
echo "  # or"
echo "  kill -9 \$(lsof -t -i:8080)"
echo ""

# Wait a bit for service to start
sleep 3

# Check if service is running
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Service is running and ready!"
    echo ""
    echo "Test with:"
    echo "  bash test-ai-trading.sh"
else
    echo "❌ Service failed to start. Check graphql-service.log"
    exit 1
fi
