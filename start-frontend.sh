#!/bin/bash

echo "🚀 Starting AI POWER TRADE Frontend..."

cd frontend

# Start Python server in background
python3 server.py &
SERVER_PID=$!

echo "Frontend running on http://localhost:3000"
echo "Opening in Brave browser..."

# Open in Brave browser
open -a "Brave Browser" http://localhost:3000

echo "Press Enter to stop server..."
read

# Kill server
kill $SERVER_PID
echo "Server stopped."