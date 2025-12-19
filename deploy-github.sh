#!/bin/bash

echo "📤 Deploying AI POWER TRADE to GitHub Pages..."
echo "============================================="

# Create index.html for GitHub Pages
echo "📝 Creating GitHub Pages files..."
cp AI-POWER-TRADE-FINAL.html index.html

# Create simple landing page
cat > landing.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>🏆 AI POWER TRADE - Hackathon Demo</title>
    <style>
        body { font-family: Arial; background: #0a0a0a; color: #fff; text-align: center; padding: 50px; }
        .btn { background: #00ff88; color: #000; padding: 15px 30px; margin: 10px; 
               text-decoration: none; border-radius: 8px; font-weight: bold; }
        .btn:hover { background: #00cc66; }
    </style>
</head>
<body>
    <h1>🤖 AI POWER TRADE</h1>
    <h2>Decentralized AI Trading on Linera Blockchain</h2>
    <p>Hackathon Submission - Real Blockchain Integration</p>
    
    <div style="margin: 40px 0;">
        <a href="index.html" class="btn">🚀 Launch Trading Platform</a>
        <a href="JUDGE-VERIFICATION.html" class="btn">🔍 Judge Verification</a>
        <a href="real-linera-wallet.html" class="btn">🔑 Wallet Demo</a>
    </div>
    
    <div style="margin: 40px 0; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
        <h3>🏆 For Hackathon Judges</h3>
        <p><strong>Real Linera Integration:</strong> Ed25519 cryptography, GraphQL blockchain, Smart contracts</p>
        <p><strong>Local Setup:</strong> <code>git clone → ./start-demo.sh</code></p>
        <p><strong>Live Demo:</strong> Click "Launch Trading Platform" above</p>
    </div>
    
    <p style="margin-top: 40px;">
        <a href="https://github.com/[username]/AI-POWER-TRADE-LINERA" style="color: #00ff88;">
            📋 View Source Code on GitHub
        </a>
    </p>
</body>
</html>
EOF

# Create README for GitHub
cat > README.md << 'EOF'
# 🤖 AI POWER TRADE on Linera

**Hackathon Submission**: Decentralized AI-powered trading platform built on Linera blockchain.

## 🚀 Live Demo
**[Launch AI POWER TRADE](https://[username].github.io/AI-POWER-TRADE-LINERA/)**

## 🏆 For Judges

### Quick Start
```bash
git clone https://github.com/[username]/AI-POWER-TRADE-LINERA
cd AI-POWER-TRADE-LINERA
./start-demo.sh
```

### Verification Points
- ✅ **Real Ed25519 Cryptography** - Not random strings
- ✅ **Smart Contracts** - Rust code in `/trading/src/lib.rs`
- ✅ **GraphQL Integration** - Real blockchain queries
- ✅ **Multi-Chain Architecture** - Admin, User, AI, Market chains

### Features
- 🧠 AI-powered trading signals
- 🔗 Multi-platform support (13+ exchanges)
- 💰 Real-time portfolio management
- 🔐 Secure wallet generation
- 📊 Live market data integration

## Architecture
- **Frontend**: HTML5 + JavaScript (real crypto APIs)
- **Backend**: Linera smart contracts (Rust)
- **Blockchain**: Linera multi-chain network
- **AI**: Real-time signal generation

Built with ❤️ on [Linera](https://linera.io)
EOF

echo "✅ Files prepared for GitHub Pages"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m 'Hackathon submission'"
echo "3. git push origin main"
echo "4. Enable GitHub Pages in repository settings"
echo ""
echo "🌐 Will be live at: https://[username].github.io/AI-POWER-TRADE-LINERA/"