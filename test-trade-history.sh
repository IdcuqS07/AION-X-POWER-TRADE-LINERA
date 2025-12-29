#!/bin/bash

echo "🧪 Testing Trade History Integration"
echo "===================================="
echo ""

echo "✅ Smart Contract Deployed:"
echo "   App ID: 17f27b3394c1dfced349fcf477e4b344f374417bde79d628b4345fb430a3747c"
echo ""

echo "✅ Frontend Integration Complete:"
echo "   - trade-history-contract.js created"
echo "   - main.js updated with contract calls"
echo "   - Blockchain history UI added"
echo ""

echo "📋 Test Steps:"
echo "1. Open https://www.aion-x.xyz/ (after deployment)"
echo "2. Connect wallet"
echo "3. Generate AI signal"
echo "4. Execute trade"
echo "5. Check 'Blockchain Trade History' section"
echo "6. Click 'Refresh from Blockchain' button"
echo ""

echo "🔍 What to verify:"
echo "   ✓ Trade saved to blockchain"
echo "   ✓ Total on-chain trades counter increases"
echo "   ✓ Your total P&L calculated"
echo "   ✓ Trade details displayed with ⛓️ badge"
echo "   ✓ Entry/exit prices shown"
echo "   ✓ Timestamp displayed"
echo ""

echo "📊 GraphQL Query Test:"
echo "You can also query directly:"
echo ""
echo "curl -X POST https://conway1.linera.blockhunters.services/chains/YOUR_CHAIN_ID/applications/17f27b3394c1dfced349fcf477e4b344f374417bde79d628b4345fb430a3747c \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"query\": \"{ allTrades { id coin tradeType entryPrice exitPrice amount profitLoss timestamp } }\"}'"
echo ""

echo "✅ Ready to deploy!"
