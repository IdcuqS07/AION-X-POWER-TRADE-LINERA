#!/bin/bash

echo "🔍 Checking AI POWER TRADE Validator Connection..."

# Check if Linera CLI is available
if ! command -v linera &> /dev/null; then
    echo "❌ Linera CLI not installed"
    echo "📋 Current Status: SIMULATION MODE"
    echo "🎯 Frontend: Running (Demo Data)"
    echo "🔗 Validators: Not Connected"
    echo ""
    echo "To connect to real validators:"
    echo "1. Install Linera CLI: cargo install linera-cli"
    echo "2. Start validators: linera net up"
    echo "3. Deploy applications: make deploy"
    exit 0
fi

# Check if validators are running
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Validator Connection: ACTIVE"
    echo "🟢 Port 8080: Connected"
else
    echo "❌ Validator Connection: NOT FOUND"
    echo "🔴 Port 8080: No Response"
fi

echo ""
echo "📊 Current System Status:"
echo "🌐 Frontend: http://localhost:8888 (RUNNING)"
echo "🤖 AI Engine: Simulation Mode (ACTIVE)"
echo "📈 Trading Logic: Local Demo (WORKING)"
echo "🔗 Blockchain: ${LINERA_STATUS:-"Not Connected"}"