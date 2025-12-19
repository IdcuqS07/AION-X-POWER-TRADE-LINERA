#!/bin/bash

echo "🔨 Squashing all commits into one..."
echo ""

# Reset to first commit but keep all changes
git reset --soft 86bc532

# Create single commit
git commit --amend -m "feat: AI Power Trade - Decentralized Trading Platform on Linera

Complete implementation:
- Smart contract integration with Linera blockchain  
- AI-powered trading signals and market analysis
- Real-time portfolio tracking and management
- GraphQL API for blockchain interaction
- Modern web interface built with Vite
- Deployed to Testnet Conway
- Comprehensive documentation

Author: AION-X <idchuq@gmail.com>"

# Force push
git push origin main --force

echo ""
echo "✅ History squashed to single commit!"
echo "🔗 https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA"
