# 🚀 FINAL DEPLOYMENT - AION-X POWER TRADE

## Step 1: GitHub Repository Setup

```bash
# Initialize git (if not done)
cd "AI POWER TRADE LINERA"
git init
git add .
git commit -m "AION-X POWER TRADE - Hackathon Submission"
git branch -M main

# Add remote and push
git remote add origin https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA.git
git push -u origin main
```

## Step 2: VPS Deployment

```bash
# SSH to VPS
ssh root@152.42.199.50

# Clean VPS (recommended)
systemctl stop nginx 2>/dev/null || true
rm -rf /opt/ai-power-trade
pkill -f "linera" 2>/dev/null || true

# Clone and deploy
git clone https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA.git /opt/ai-power-trade
cd /opt/ai-power-trade
chmod +x *.sh
./deploy-production.sh
```

## Step 3: Verification

```bash
# Check status
./check-status.sh

# Test URLs
curl -I http://152.42.199.50/AI-POWER-TRADE-FINAL.html
curl -I http://152.42.199.50/JUDGE-VERIFICATION.html
```

## 🎯 Final URLs

- **Live Demo**: http://152.42.199.50/AI-POWER-TRADE-FINAL.html
- **Judge Verification**: http://152.42.199.50/JUDGE-VERIFICATION.html
- **GitHub Repository**: https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA
- **GitHub Pages**: https://IdcuqS07.github.io/AION-X-POWER-TRADE-LINERA/

## 🏆 Hackathon Ready!

✅ Real Linera blockchain integration
✅ Public GitHub repository  
✅ Live VPS deployment
✅ Professional documentation
✅ Judge verification tools

**AION-X POWER TRADE is ready for submission!**