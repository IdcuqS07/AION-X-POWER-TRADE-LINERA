#!/bin/bash

# ============================================================================
# AI POWER TRADE - LINERA INTEGRATION
# Quick Deployment Script
# ============================================================================

set -e  # Exit on error

echo "🚀 AI Power Trade - Linera Integration Setup"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================================================
# STEP 1: Check Prerequisites
# ============================================================================

echo -e "${BLUE}[1/6] Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 16+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"

# Check Rust
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ Rust not found. Installing...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi
echo -e "${GREEN}✓ Rust found: $(rustc --version)${NC}"

# Check wasm32 target
if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo "Installing wasm32 target..."
    rustup target add wasm32-unknown-unknown
fi
echo -e "${GREEN}✓ wasm32 target installed${NC}"

echo ""

# ============================================================================
# STEP 2: Install Linera
# ============================================================================

echo -e "${BLUE}[2/6] Installing Linera...${NC}"

if [ ! -d "linera-protocol" ]; then
    git clone https://github.com/linera-io/linera-protocol.git
fi

cd linera-protocol
cargo build --release -p linera-service -p linera-storage-service --bins
cd ..

export PATH="$PWD/linera-protocol/target/release:$PATH"
echo -e "${GREEN}✓ Linera installed${NC}"
echo ""

# ============================================================================
# STEP 3: Setup Linera Wallet
# ============================================================================

echo -e "${BLUE}[3/6] Setting up Linera wallet...${NC}"

# Create config directory
mkdir -p ~/.config/linera

# Initialize wallet with testnet
echo "Initializing wallet with Linera testnet..."
linera wallet init --with-new-chain \
  --faucet https://faucet.testnet-babbage.linera.net

export LINERA_WALLET="$HOME/.config/linera/wallet.json"
export LINERA_STORAGE="rocksdb:$HOME/.config/linera/linera.db"

# Get chain ID
CHAIN_ID=$(linera wallet show | grep "Chain ID" | head -1 | awk '{print $3}')
echo -e "${GREEN}✓ Wallet initialized${NC}"
echo -e "${GREEN}✓ Chain ID: $CHAIN_ID${NC}"
echo ""

# ============================================================================
# STEP 4: Build & Deploy Linera Apps
# ============================================================================

echo -e "${BLUE}[4/6] Building Linera trading application...${NC}"

# Create project structure if not exists
if [ ! -d "ai-trading-linera" ]; then
    mkdir -p ai-trading-linera
    cd ai-trading-linera
    
    # Initialize Cargo workspace
    cat > Cargo.toml << 'EOF'
[workspace]
members = ["abi", "trading"]

[workspace.dependencies]
linera-sdk = "0.12"
serde = { version = "1.0", features = ["derive"] }
async-graphql = "7.0"
EOF

    # Create ABI crate
    cargo new --lib abi
    cargo new --lib trading
    
    echo "⚠️  Please add the Rust code from the artifacts to:"
    echo "   - abi/src/lib.rs"
    echo "   - trading/src/contract.rs"
    echo "   - trading/src/service.rs"
    echo "   - trading/Cargo.toml (add dependencies)"
    echo ""
    echo "Press Enter when ready to continue..."
    read
fi

cd ai-trading-linera

# Build
echo "Building WebAssembly modules..."
cargo build --release --target wasm32-unknown-unknown

# Publish bytecode
echo "Publishing to Linera..."
BYTECODE_ID=$(linera publish-bytecode \
  target/wasm32-unknown-unknown/release/trading.wasm \
  target/wasm32-unknown-unknown/release/trading_contract.wasm \
  | grep "Bytecode ID:" | awk '{print $3}')

echo -e "${GREEN}✓ Bytecode published: $BYTECODE_ID${NC}"

# Create application
APP_ID=$(linera create-application $BYTECODE_ID \
  | grep "Application ID:" | awk '{print $3}')

echo -e "${GREEN}✓ Application created: $APP_ID${NC}"
echo ""

cd ..

# ============================================================================
# STEP 5: Setup Frontend
# ============================================================================

echo -e "${BLUE}[5/6] Setting up frontend...${NC}"

# Clone or use existing frontend
if [ ! -d "frontend" ]; then
    echo "Cloning AI Power Trade frontend..."
    git clone https://github.com/0xCryptotech/ai-power-trade-polygon.git frontend
    cd frontend/comprehensive_frontend
else
    cd frontend
fi

# Install dependencies
echo "Installing npm dependencies..."
npm install
npm install graphql graphql-request

# Create .env.local
cat > .env.local << EOF
# Linera Configuration
NEXT_PUBLIC_LINERA_ENDPOINT=http://localhost:8080
NEXT_PUBLIC_CHAIN_ID=$CHAIN_ID
NEXT_PUBLIC_APP_ID=$APP_ID
EOF

echo -e "${GREEN}✓ Frontend configured${NC}"
echo ""

cd ../..

# ============================================================================
# STEP 6: Start Services
# ============================================================================

echo -e "${BLUE}[6/6] Starting services...${NC}"

# Start Linera service in background
echo "Starting Linera service on port 8080..."
linera service --port 8080 > linera.log 2>&1 &
LINERA_PID=$!
echo -e "${GREEN}✓ Linera service started (PID: $LINERA_PID)${NC}"

# Wait for service to be ready
echo "Waiting for Linera service..."
sleep 5

# Test connection
if curl -s http://localhost:8080/health > /dev/null; then
    echo -e "${GREEN}✓ Linera service is ready${NC}"
else
    echo -e "${RED}❌ Linera service failed to start${NC}"
    echo "Check linera.log for details"
    exit 1
fi

# Start frontend
echo "Starting frontend on port 3000..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

cd ..

echo ""
echo "=============================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "=============================================="
echo ""
echo "📊 Services:"
echo "   • Linera GraphQL: http://localhost:8080"
echo "   • Frontend:       http://localhost:3000"
echo ""
echo "📝 Configuration:"
echo "   • Chain ID:  $CHAIN_ID"
echo "   • App ID:    $APP_ID"
echo ""
echo "🔗 GraphQL Endpoint:"
echo "   http://localhost:8080/chains/$CHAIN_ID/applications/$APP_ID"
echo ""
echo "📖 Logs:"
echo "   • Linera:    tail -f linera.log"
echo "   • Frontend:  tail -f frontend.log"
echo ""
echo "🛑 To stop services:"
echo "   kill $LINERA_PID $FRONTEND_PID"
echo ""
echo "🎯 Next Steps:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Test the portfolio view"
echo "   3. Execute a test trade"
echo "   4. Check GraphQL at http://localhost:8080"
echo ""
echo "🚀 To deploy to production:"
echo "   1. Setup Linera on your VPS/Cloud server"
echo "   2. Update NEXT_PUBLIC_LINERA_ENDPOINT in .env.local"
echo "   3. Deploy frontend to Vercel: vercel --prod"
echo ""
echo "Happy trading! 🎉"

# ============================================================================
# Create convenience scripts
# ============================================================================

# Stop script
cat > stop.sh << 'EOF'
#!/bin/bash
echo "Stopping services..."
pkill -f "linera service"
pkill -f "npm run dev"
echo "Services stopped"
EOF
chmod +x stop.sh

# Restart script
cat > restart.sh << 'EOF'
#!/bin/bash
./stop.sh
sleep 2
./deploy.sh
EOF
chmod +x restart.sh

# Status script
cat > status.sh << 'EOF'
#!/bin/bash
echo "Service Status:"
echo "==============="
echo ""
echo "Linera Service:"
if curl -s http://localhost:8080/health > /dev/null; then
    echo "  ✓ Running (http://localhost:8080)"
else
    echo "  ✗ Not running"
fi
echo ""
echo "Frontend:"
if curl -s http://localhost:3000 > /dev/null; then
    echo "  ✓ Running (http://localhost:3000)"
else
    echo "  ✗ Not running"
fi
echo ""
echo "Processes:"
ps aux | grep -E "linera service|npm run dev" | grep -v grep
EOF
chmod +x status.sh

echo ""
echo "📝 Convenience scripts created:"
echo "   • ./stop.sh    - Stop all services"
echo "   • ./restart.sh - Restart all services"
echo "   • ./status.sh  - Check service status"
