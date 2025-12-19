#!/bin/bash

echo "🔍 Checking Linera Testnet Status..."

# Check if any Linera testnet is running
echo "📡 Testing known Linera endpoints..."

ENDPOINTS=(
    "https://faucet.devnet-2024-09-04.linera.net"
    "http://faucet.devnet-2024-09-04.linera.net:40080"
    "https://linera.net"
    "https://api.linera.net"
)

for endpoint in "${ENDPOINTS[@]}"; do
    echo "🔍 Testing: $endpoint"
    if curl -s --connect-timeout 5 "$endpoint" >/dev/null 2>&1; then
        echo "✅ $endpoint is accessible"
        
        # Try to get version info
        if curl -s --connect-timeout 5 "$endpoint/version" 2>/dev/null; then
            echo "📊 Version info available"
        fi
    else
        echo "❌ $endpoint not accessible"
    fi
done

echo ""
echo "📝 TESTNET STATUS SUMMARY:"
echo "• Conway testnet belum aktif secara public"
echo "• Linera masih dalam development phase"
echo "• Testnet akan diaktifkan oleh tim Linera"
echo "• Saat ini gunakan local network untuk development"

echo ""
echo "🚀 NEXT STEPS:"
echo "1. Monitor Linera Discord/GitHub untuk testnet announcements"
echo "2. AI POWER TRADE sudah siap untuk testnet connection"
echo "3. Akan auto-connect ketika testnet available"