#!/bin/bash

echo "🔧 Applying Signal Persistence Patch to main.js..."
echo ""

MAIN_JS="frontend-linera/src/main.js"
BACKUP="frontend-linera/src/main.js.backup-$(date +%Y%m%d-%H%M%S)"

# Backup original file
echo "📦 Creating backup: $BACKUP"
cp "$MAIN_JS" "$BACKUP"

# 1. Add import
echo "✅ Step 1: Adding SignalPersistenceManager import..."
sed -i.tmp "s|import WalletManager from './wallet-manager.js';|import WalletManager from './wallet-manager.js';\nimport SignalPersistenceManager from './signal-persistence.js';|" "$MAIN_JS"

# 2. Initialize manager
echo "✅ Step 2: Initializing SignalPersistenceManager..."
sed -i.tmp "s|const walletManager = new WalletManager();|const walletManager = new WalletManager();\nconst signalPersistence = new SignalPersistenceManager();|" "$MAIN_JS"

# 3. Update generateSignalEnhanced - line 1018
echo "✅ Step 3: Updating generateSignalEnhanced (line 1018)..."
sed -i.tmp '1018s|currentSignal = generateRealSignal(selectedCoin, currentPrice, aiExplainer, info);|const generatedSignal = generateRealSignal(selectedCoin, currentPrice, aiExplainer, info);\n    currentSignal = generatedSignal;\n    activeSignal = signalPersistence.saveActiveSignal(generatedSignal, selectedCoin);|' "$MAIN_JS"

# 4. Add coin badge - line 1030
echo "✅ Step 4: Adding coin badge (line 1030)..."
sed -i.tmp "1030s|elements.signalAction.textContent = \`\${signal} \${selectedCoin}\`;|elements.signalAction.innerHTML = \`\${signal} <span class=\\\"coin-badge\\\">\${selectedCoin}</span>\`;|" "$MAIN_JS"

# Clean up temp files
rm -f "$MAIN_JS.tmp"

echo ""
echo "✅ Patch Applied Successfully!"
echo ""
echo "📝 Changes made:"
echo "   1. Added SignalPersistenceManager import"
echo "   2. Initialized signalPersistence manager"
echo "   3. Updated generateSignalEnhanced to save to persistence"
echo "   4. Added coin badge to signal display"
echo ""
echo "🔄 Backup saved to: $BACKUP"
echo ""
echo "Next steps:"
echo "1. cd frontend-linera"
echo "2. npm run dev"
echo "3. Test signal persistence"
echo ""
echo "To rollback: cp $BACKUP $MAIN_JS"
