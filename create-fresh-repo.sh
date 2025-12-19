#!/bin/bash

echo "🧹 Creating completely fresh repository..."
echo ""
echo "This will:"
echo "  1. Create a new initial commit with current files"
echo "  2. Force push to GitHub (clean history)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Backup current branch
git branch backup-$(date +%Y%m%d-%H%M%S)

# Create orphan branch (no history)
git checkout --orphan fresh-main

# Add all files
git add -A

# Create single initial commit
git commit -m "feat: AI Power Trade - Decentralized Trading Platform on Linera

- Smart contract integration with Linera blockchain
- AI-powered trading signals and analysis
- Real-time market data and portfolio tracking
- GraphQL API for contract interaction
- Responsive web interface with Vite
- Deployed to Testnet Conway

Author: AION-X <idchuq@gmail.com>"

# Delete old main branch
git branch -D main

# Rename fresh-main to main
git branch -m main

# Force push
git push origin main --force

echo ""
echo "✅ Fresh repository created!"
echo "🔗 Check: https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA"
echo ""
echo "History is now completely clean with single commit"
