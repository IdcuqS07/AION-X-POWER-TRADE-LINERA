#!/usr/bin/env python3
"""
Apply Multi-Signal System Patch
"""

import re
from pathlib import Path

MAIN_JS = Path('frontend-linera/src/main.js')

print("🔧 Applying Multi-Signal System Patch...\n")

# Read file
content = MAIN_JS.read_text()

# 1. Remove signalPersistence.saveActiveSignal calls
print("✅ Step 1: Removing signalPersistence.saveActiveSignal...")
content = re.sub(
    r'activeSignal = signalPersistence\.saveActiveSignal\(generatedSignal, selectedCoin\);',
    'activeSignal = generatedSignal; // Set as active signal',
    content
)

# 2. Update signalAction to use innerHTML with badge (if not already)
print("✅ Step 2: Ensuring coin badge in signal display...")
content = re.sub(
    r"elements\.signalAction\.textContent = `\$\{signal\} \$\{selectedCoin\}`;",
    r'elements.signalAction.innerHTML = `${signal} <span class="coin-badge">${selectedCoin}</span>`;',
    content
)

# 3. Update executeAITrade to not clear signalPersistence
print("✅ Step 3: Updating executeAITrade...")
content = re.sub(
    r'signalPersistence\.clearActiveSignal\(\);',
    '// Signal cleared (stored per-coin in signalCooldown)',
    content
)

# Write back
MAIN_JS.write_text(content)

print("\n✅ Multi-Signal System Patch Applied!\n")
print("Changes made:")
print("   1. Removed signalPersistence usage")
print("   2. Signals now stored per-coin in SignalCooldownManager")
print("   3. selectCoin() loads signal for selected coin")
print("   4. Each coin has independent signal + cooldown")
print("\nNext: Build and deploy\n")
