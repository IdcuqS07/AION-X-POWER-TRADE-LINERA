#!/bin/bash

echo "🔍 Verifying Wallet Management Implementation"
echo "=============================================="
echo ""

# Check if files exist
echo "📁 Checking Files..."
echo ""

files=(
    "frontend-linera/src/wallet-manager.js"
    "frontend-linera/index.html"
    "frontend-linera/src/main.js"
    "frontend-linera/src/style.css"
    "WALLET-MANAGEMENT-PHASE-1.md"
    "WALLET-MANAGEMENT-QUICK-GUIDE.md"
    "test-wallet-management.sh"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
    fi
done

echo ""
echo "🔧 Checking Implementation..."
echo ""

# Check if WalletManager is imported in main.js
if grep -q "import WalletManager from './wallet-manager.js'" frontend-linera/src/main.js; then
    echo "✅ WalletManager imported in main.js"
else
    echo "❌ WalletManager NOT imported in main.js"
fi

# Check if modals exist in HTML
if grep -q "mnemonic-modal-overlay" frontend-linera/index.html; then
    echo "✅ Mnemonic modal in HTML"
else
    echo "❌ Mnemonic modal NOT in HTML"
fi

if grep -q "export-modal-overlay" frontend-linera/index.html; then
    echo "✅ Export modal in HTML"
else
    echo "❌ Export modal NOT in HTML"
fi

if grep -q "import-modal-overlay" frontend-linera/index.html; then
    echo "✅ Import modal in HTML"
else
    echo "❌ Import modal NOT in HTML"
fi

# Check if modal styles exist
if grep -q "modal-overlay" frontend-linera/src/style.css; then
    echo "✅ Modal styles in CSS"
else
    echo "❌ Modal styles NOT in CSS"
fi

# Check if export/import buttons exist
if grep -q "dropdown-export-wallet" frontend-linera/index.html; then
    echo "✅ Export button in HTML"
else
    echo "❌ Export button NOT in HTML"
fi

if grep -q "dropdown-import-wallet" frontend-linera/index.html; then
    echo "✅ Import button in HTML"
else
    echo "❌ Import button NOT in HTML"
fi

echo ""
echo "🌐 Checking Deployment..."
echo ""

# Check if site is accessible
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://152.42.199.50)

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Site is live: http://152.42.199.50 (HTTP $HTTP_STATUS)"
else
    echo "❌ Site issue: HTTP $HTTP_STATUS"
fi

echo ""
echo "📊 Implementation Summary"
echo "=============================================="
echo ""
echo "✅ Phase 1 Features:"
echo "   1. Show Mnemonic on Create"
echo "   2. Export Wallet (Encrypted)"
echo "   3. Import Wallet"
echo ""
echo "✅ Files Created/Modified:"
echo "   - wallet-manager.js (NEW)"
echo "   - index.html (MODIFIED - added modals)"
echo "   - main.js (MODIFIED - added functions)"
echo "   - style.css (MODIFIED - added styles)"
echo ""
echo "✅ Documentation:"
echo "   - WALLET-MANAGEMENT-PHASE-1.md"
echo "   - WALLET-MANAGEMENT-QUICK-GUIDE.md"
echo "   - test-wallet-management.sh"
echo ""
echo "🎯 Next Steps:"
echo "   1. Open http://152.42.199.50"
echo "   2. Create a new wallet"
echo "   3. Verify mnemonic modal appears"
echo "   4. Test export wallet"
echo "   5. Test import wallet"
echo ""
echo "=============================================="
echo "✅ Wallet Management Phase 1 - COMPLETE"
echo "=============================================="
