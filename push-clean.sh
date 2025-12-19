#!/bin/bash

echo "🧹 Pushing cleaned Git history to GitHub..."
echo ""
echo "Repository: IdcuqS07/AION-X-POWER-TRADE-LINERA"
echo "Author: AION-X <idchuq@gmail.com>"
echo ""

# Check if gh CLI is available
if command -v gh &> /dev/null; then
    echo "✅ Using GitHub CLI..."
    gh auth status
    git push origin main --force
else
    echo "📝 GitHub CLI not found. Using token method..."
    echo ""
    echo "Please enter your GitHub Personal Access Token:"
    echo "(Get it from: https://github.com/settings/tokens)"
    read -s TOKEN
    
    if [ -z "$TOKEN" ]; then
        echo "❌ No token provided"
        exit 1
    fi
    
    git push https://$TOKEN@github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA.git main --force
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed!"
    echo "🔗 Check: https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA"
    echo ""
    echo "History cleaned:"
    echo "  ❌ 0xCryptotech / huntermeme78@gmail.com"
    echo "  ✅ AION-X / idchuq@gmail.com"
else
    echo ""
    echo "❌ Push failed"
    echo ""
    echo "Try manually:"
    echo "  git push https://YOUR_TOKEN@github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA.git main --force"
fi
