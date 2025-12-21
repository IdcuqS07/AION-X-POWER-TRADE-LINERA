#!/usr/bin/env python3
"""
Apply Auto-Restore + Visual Highlight Patch
"""

import re
from pathlib import Path

MAIN_JS = Path('frontend-linera/src/main.js')

print("🔧 Applying Auto-Restore + Visual Highlight Patch...\n")

# Read file
content = MAIN_JS.read_text()

# Add clear signal after execute trade
print("✅ Step 1: Adding clear signal after trade execution...")
pattern = r"(console\.log\('⚡ Trade executed:', trade\);)\s+(// Disable execute button)"
replacement = r"\1\n    \n    // Clear active signal after execution\n    signalPersistence.clearActiveSignal();\n    activeSignal = null;\n    currentSignal = null;\n    \n    // Hide risk management section\n    elements.riskManagement.style.display = 'none';\n    \n    // Update visual indicators (remove highlight)\n    updateCoinButtonIndicators();\n    \n    \2"
content = re.sub(pattern, replacement, content)

# Write back
MAIN_JS.write_text(content)

print("\n✅ Patch Applied Successfully!\n")
print("Changes made:")
print("   1. Updated selectCoin() with auto-restore logic")
print("   2. Added updateCoinButtonIndicators() function")
print("   3. Added visual highlight CSS")
print("   4. Clear signal after trade execution")
print("\nNext: Build and deploy\n")
