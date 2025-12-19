#!/bin/bash

# Setup Linera Wallet for Testnet Conway
# This script initializes a wallet and requests a chain from the faucet

echo "🔐 Setting up Linera Wallet for Testnet Conway..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Faucet URL
FAUCET_URL="https://faucet.testnet-conway.linera.net"

# Wallet directory (macOS)
WALLET_DIR="$HOME/Library/Application Support/linera"
KEYSTORE="$WALLET_DIR/keystore.json"

# Check if wallet already exists
if [ -f "$KEYSTORE" ]; then
    echo -e "${YELLOW}⚠️  Wallet already exists at: $KEYSTORE${NC}"
    echo ""
    echo "Options:"
    echo "  1) Use existing wallet and request new chain"
    echo "  2) Backup and create new wallet"
    echo "  3) Cancel"
    echo ""
    read -p "Choose option (1-3): " choice
    
    case $choice in
        1)
            echo -e "${BLUE}Using existing wallet...${NC}"
            ;;
        2)
            echo -e "${BLUE}Backing up existing wallet...${NC}"
            BACKUP_DIR="$WALLET_DIR.backup.$(date +%Y%m%d_%H%M%S)"
            mv "$WALLET_DIR" "$BACKUP_DIR"
            echo -e "${GREEN}✅ Backup created at: $BACKUP_DIR${NC}"
            echo ""
            echo -e "${BLUE}Creating new wallet...${NC}"
            linera wallet init --faucet $FAUCET_URL
            if [ $? -ne 0 ]; then
                echo -e "${RED}❌ Failed to create wallet${NC}"
                exit 1
            fi
            echo -e "${GREEN}✅ Wallet initialized successfully!${NC}"
            ;;
        3)
            echo "Cancelled."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            exit 1
            ;;
    esac
else
    echo -e "${BLUE}Step 1: Initializing wallet...${NC}"
    linera wallet init --faucet $FAUCET_URL
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Wallet initialized successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to initialize wallet${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}Step 2: Requesting chain from faucet...${NC}"
linera wallet request-chain --faucet $FAUCET_URL

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Chain requested successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Failed to request chain (may need to wait or try again)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Wallet setup complete!${NC}"
echo ""
echo "To view your wallet info:"
echo "  linera wallet show"
echo ""
echo "To check your chains:"
echo "  linera wallet list"
echo ""
