#!/bin/bash
# Check VPS status for Linera deployment

echo "=== CHECKING VPS STATUS ==="
echo ""

# Check Linera processes
echo "📊 Linera Processes:"
ssh root@152.42.199.50 "ps aux | grep linera | grep -v grep"
echo ""

# Check GraphQL mock
echo "🔌 GraphQL Mock:"
ssh root@152.42.199.50 "ps aux | grep graphql-mock | grep -v grep"
echo ""

# Check ports
echo "🌐 Open Ports:"
ssh root@152.42.199.50 "netstat -tlnp | grep -E '19100|8080|80'"
echo ""

# Test GraphQL endpoint
echo "🧪 Testing GraphQL (localhost):"
ssh root@152.42.199.50 "curl -s -X POST http://localhost:8080 -H 'Content-Type: application/json' -d '{\"query\":\"query { chains { list } }\"}'"
echo ""

# Test GraphQL via Nginx
echo "🧪 Testing GraphQL (via Nginx):"
curl -s -X POST http://152.42.199.50/graphql -H 'Content-Type: application/json' -d '{"query":"query { chains { list } }"}'
echo ""

# Check Nginx config
echo "⚙️ Nginx GraphQL Config:"
ssh root@152.42.199.50 "nginx -T 2>&1 | grep -A 5 'location /graphql'"
echo ""

echo "=== STATUS CHECK COMPLETE ==="
