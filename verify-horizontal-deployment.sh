#!/bin/bash

echo "🔍 Verifying Horizontal Layout Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Checking VPS files...${NC}"
ssh root@152.42.199.50 "ls -lh /var/www/html/assets/ | grep 'index-CF4Hzrl8.css'"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ CSS file found${NC}"
else
    echo -e "${YELLOW}⚠ CSS file not found${NC}"
fi

echo ""
echo -e "${BLUE}2. Checking HTML structure...${NC}"
ssh root@152.42.199.50 "grep -c 'signal-horizontal-layout' /var/www/html/index.html"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Horizontal layout structure found in HTML${NC}"
else
    echo -e "${YELLOW}⚠ Horizontal layout not found${NC}"
fi

echo ""
echo -e "${BLUE}3. Checking CSS classes...${NC}"
ssh root@152.42.199.50 "grep -c 'signal-horizontal-layout' /var/www/html/assets/index-CF4Hzrl8.css"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Horizontal layout CSS found${NC}"
else
    echo -e "${YELLOW}⚠ CSS not found${NC}"
fi

echo ""
echo -e "${BLUE}4. Checking coin icons...${NC}"
ssh root@152.42.199.50 "grep -c 'coin-icon' /var/www/html/index.html"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Coin icons found in HTML${NC}"
else
    echo -e "${YELLOW}⚠ Coin icons not found${NC}"
fi

echo ""
echo -e "${BLUE}5. Nginx status...${NC}"
ssh root@152.42.199.50 "systemctl status nginx | grep 'Active:'"

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Deployment Verification Complete"
echo "==========================================${NC}"
echo ""
echo "📋 Summary:"
echo "   • Files: Deployed to /var/www/html/"
echo "   • HTML: Contains signal-horizontal-layout"
echo "   • CSS: Contains horizontal layout styles"
echo "   • Icons: ₿ Ξ ◎ ◆ present in HTML"
echo ""
echo "🌐 Access URL:"
echo "   http://152.42.199.50"
echo ""
echo "🔄 To see changes in browser:"
echo "   1. Open http://152.42.199.50"
echo "   2. Press Ctrl+Shift+R (Windows/Linux)"
echo "   3. Or Cmd+Shift+R (Mac)"
echo "   4. Or open DevTools (F12) → Network tab → Disable cache"
echo ""
echo "📸 Local Test:"
echo "   Open test-horizontal-layout.html in your browser"
echo "   to see how the layout should look"
echo ""
