#!/usr/bin/env python3
"""
Apply Signal Persistence Patch to main.js
"""

import re
from pathlib import Path

MAIN_JS = Path('frontend-linera/src/main.js')

print("🔧 Applying Signal Persistence Patch...\n")

# Read file
content = MAIN_JS.read_text()

# 1. Add import (only if not exists)
if 'SignalPersistenceManager' not in content:
    print("✅ Step 1: Adding SignalPersistenceManager import...")
    content = content.replace(
        "import WalletManager from './wallet-manager.js';",
        "import WalletManager from './wallet-manager.js';\nimport SignalPersistenceManager from './signal-persistence.js';"
    )
else:
    print("⏭️  Step 1: Import already exists, skipping...")

# 2. Initialize manager (only if not exists)
if 'signalPersistence = new SignalPersistenceManager' not in content:
    print("✅ Step 2: Initializing SignalPersistenceManager...")
    content = content.replace(
        'const walletManager = new WalletManager();',
        'const walletManager = new WalletManager();\nconst signalPersistence = new SignalPersistenceManager();'
    )
else:
    print("⏭️  Step 2: Manager already initialized, skipping...")

# 3. Update generateRealSignal calls
if 'signalPersistence.saveActiveSignal' not in content:
    print("✅ Step 3: Updating generateRealSignal calls...")
    content = re.sub(
        r'currentSignal = generateRealSignal\(selectedCoin, currentPrice, aiExplainer, info\);',
        '''const generatedSignal = generateRealSignal(selectedCoin, currentPrice, aiExplainer, info);
    currentSignal = generatedSignal;
    activeSignal = signalPersistence.saveActiveSignal(generatedSignal, selectedCoin);''',
        content
    )
else:
    print("⏭️  Step 3: Signal persistence already added, skipping...")

# 4. Add coin badge
if 'coin-badge' not in content:
    print("✅ Step 4: Adding coin badge...")
    content = re.sub(
        r'elements\.signalAction\.textContent = `\$\{signal\} \$\{selectedCoin\}`;',
        r'elements.signalAction.innerHTML = `${signal} <span class="coin-badge">${selectedCoin}</span>`;',
        content
    )
else:
    print("⏭️  Step 4: Coin badge already added, skipping...")

# Write back
MAIN_JS.write_text(content)

print("\n✅ Patch Applied Successfully!\n")
print("📝 Changes made:")
print("   1. Added SignalPersistenceManager import")
print("   2. Initialized signalPersistence manager")
print("   3. Updated generateRealSignal to save to persistence")
print("   4. Added coin badge to signal display")
print("\nNext steps:")
print("1. cd frontend-linera")
print("2. npm run dev")
print("3. Test signal persistence\n")
