#!/bin/bash
# Upload both versions to VPS

echo "📤 Uploading files to VPS..."
echo ""

# Upload both files
scp AI-POWER-TRADE-LINERA.html root@152.42.199.50:/opt/ai-power-trade/
scp AI-POWER-TRADE-SIMPLE.html root@152.42.199.50:/opt/ai-power-trade/

echo ""
echo "✅ Files uploaded!"
echo ""
echo "🧪 Test URLs:"
echo ""
echo "1. Linera WASM version (with jsdelivr CDN):"
echo "   http://152.42.199.50/AI-POWER-TRADE-LINERA.html"
echo ""
echo "2. Simple version (no external CDN, pure JS):"
echo "   http://152.42.199.50/AI-POWER-TRADE-SIMPLE.html"
echo ""
echo "💡 Recommendation: Try SIMPLE version first (no CDN dependency)"
echo ""
