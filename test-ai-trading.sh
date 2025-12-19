#!/bin/bash

APP_ID="5ac79e62627dd2fb380176f93e701d91fe6fc01e5a25b56801ace1de13399c0d"
GRAPHQL_URL="http://localhost:8080"

echo "🧪 Testing AI Power Trade Contract"
echo "Application ID: $APP_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Query trade count
echo ""
echo "Test 1: Query trade_count"
curl -s -X POST "$GRAPHQL_URL/graphql" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"query { applications(chainId: \\\"$APP_ID\\\") { entry { tradeCount } } }\"
  }" | jq .

# Test 2: Generate Signal
echo ""
echo "Test 2: Generate Signal for BTC"
curl -s -X POST "$GRAPHQL_URL/graphql" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation { executeOperation(chainId: \\\"$APP_ID\\\", operation: { GenerateSignal: { coin: \\\"BTC\\\" } }) }\"
  }" | jq .

# Test 3: Query signals
echo ""
echo "Test 3: Query signals"
curl -s -X POST "$GRAPHQL_URL/graphql" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"query { applications(chainId: \\\"$APP_ID\\\") { entry { signals { coin action confidence } } } }\"
  }" | jq .

# Test 4: Execute Trade
echo ""
echo "Test 4: Execute Trade"
curl -s -X POST "$GRAPHQL_URL/graphql" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation { executeOperation(chainId: \\\"$APP_ID\\\", operation: { ExecuteTrade: { coin: \\\"BTC\\\", amount: 1000 } }) }\"
  }" | jq .

# Test 5: Query trades
echo ""
echo "Test 5: Query trades"
curl -s -X POST "$GRAPHQL_URL/graphql" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"query { applications(chainId: \\\"$APP_ID\\\") { entry { trades { id coin amount } } } }\"
  }" | jq .

echo ""
echo "✅ Tests complete"
