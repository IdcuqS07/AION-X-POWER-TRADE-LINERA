#!/bin/bash
# Upload fixed version with jsdelivr CDN

echo "📤 Uploading fixed AI-POWER-TRADE-LINERA.html..."
scp AI-POWER-TRADE-LINERA.html root@152.42.199.50:/opt/ai-power-trade/

echo ""
echo "✅ Uploaded!"
echo ""
echo "🌐 Test di browser:"
echo "   http://152.42.199.50/AI-POWER-TRADE-LINERA.html"
echo ""
echo "🔍 Cek console (F12), harus lihat:"
echo "   ✅ Linera modules loaded from jsdelivr"
echo ""
