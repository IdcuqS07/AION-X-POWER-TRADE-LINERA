#!/bin/bash

# Fix AI Explainer paths for production

echo "🔧 Fixing AI Explainer paths..."

# Update paths in ai-explainer.html on VPS
ssh root@152.42.199.50 << 'EOF'
cd /var/www/ai-power-trade

# Backup original
cp ai-explainer.html ai-explainer.html.bak

# Fix CSS path
sed -i 's|/src/style.css|/assets/index-CBlfo33G.css|g' ai-explainer.html

# Remove module imports (they won't work in production)
# We'll inline the code instead

echo "✅ Paths fixed"
EOF

echo "✅ Done!"
