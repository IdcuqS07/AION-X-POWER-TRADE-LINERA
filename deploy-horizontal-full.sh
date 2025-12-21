#!/bin/bash

echo "🚀 Deploying Full Horizontal Layout"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Build
echo -e "${BLUE}Step 1: Building frontend...${NC}"
cd frontend-linera
npm run build
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}"
echo ""

# Step 2: Deploy
echo -e "${BLUE}Step 2: Deploying to VPS...${NC}"
scp -r dist/* root@152.42.199.50:/var/www/html/
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Deployment failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Files uploaded${NC}"
echo ""

# Step 3: Clean old files
echo -e "${BLUE}Step 3: Cleaning old files...${NC}"
ssh root@152.42.199.50 "cd /var/www/html/assets && ls -t | tail -n +10 | xargs -r rm && echo 'Old files cleaned'"
echo -e "${GREEN}✓ Old files removed${NC}"
echo ""

# Step 4: Restart nginx
echo -e "${BLUE}Step 4: Restarting nginx...${NC}"
ssh root@152.42.199.50 "systemctl restart nginx"
echo -e "${GREEN}✓ Nginx restarted${NC}"
echo ""

# Step 5: Verify
echo -e "${BLUE}Step 5: Verifying deployment...${NC}"
ssh root@152.42.199.50 "curl -s http://localhost/ | grep -o 'card-row' | head -1"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ New layout detected${NC}"
else
    echo -e "${YELLOW}⚠ Layout verification inconclusive${NC}"
fi
echo ""

echo -e "${GREEN}===================================="
echo "✅ Deployment Complete!"
echo "====================================${NC}"
echo ""
echo "🌐 URL: http://152.42.199.50"
echo ""
echo "📋 What's New:"
echo "   • All cards now horizontal layout"
echo "   • Portfolio + Wallet side by side"
echo "   • Market data in single row (4 coins)"
echo "   • AI Signal 3-column layout"
echo "   • Platform + Network side by side"
echo "   • Trading history in grid"
echo ""
echo "🔄 Clear Browser Cache:"
echo "   • Press Ctrl+Shift+R (Windows/Linux)"
echo "   • Press Cmd+Shift+R (Mac)"
echo "   • Or use: http://152.42.199.50/?v=$(date +%s)"
echo ""
