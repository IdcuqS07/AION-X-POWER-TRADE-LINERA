/**
 * Main Application Entry Point
 */

import LineraManager from './linera-wasm.js';
import TradingManager from './trading.js';

// Initialize managers
const lineraManager = new LineraManager();
const tradingManager = new TradingManager();

// DOM Elements
const elements = {
    globalStatus: document.getElementById('global-status'),
    walletStatus: document.getElementById('wallet-status'),
    walletInfo: document.getElementById('wallet-info'),
    chainId: document.getElementById('chain-id'),
    owner: document.getElementById('owner'),
    walletState: document.getElementById('wallet-state'),
    walletBalance: document.getElementById('wallet-balance'),
    btnCreate: document.getElementById('btn-create'),
    btnInfo: document.getElementById('btn-info'),
    btnReset: document.getElementById('btn-reset'),
    btnSignal: document.getElementById('btn-signal'),
    btnExecute: document.getElementById('btn-execute'),
    signalsContainer: document.getElementById('signals-container'),
    historyContainer: document.getElementById('history-container'),
    // Header wallet button
    btnConnectHeader: document.getElementById('btn-connect-header'),
    walletButtonText: document.getElementById('wallet-button-text'),
    // Dropdown elements
    walletDropdown: document.getElementById('wallet-dropdown'),
    dropdownNotConnected: document.getElementById('dropdown-not-connected'),
    dropdownConnected: document.getElementById('dropdown-connected'),
    dropdownLoading: document.getElementById('dropdown-loading'),
    dropdownCreateWallet: document.getElementById('dropdown-create-wallet'),
    dropdownDisconnect: document.getElementById('dropdown-disconnect'),
    dropdownChainId: document.getElementById('dropdown-chain-id'),
    dropdownOwner: document.getElementById('dropdown-owner'),
    dropdownStatus: document.getElementById('dropdown-status'),
    loadingStep1: document.getElementById('loading-step-1'),
    loadingStep2: document.getElementById('loading-step-2'),
    loadingStep3: document.getElementById('loading-step-3'),
    copyChainIdBtn: document.getElementById('copy-chain-id'),
    copyOwnerBtn: document.getElementById('copy-owner'),
    // Market data
    btcPrice: document.getElementById('btc-price'),
    btcChange: document.getElementById('btc-change'),
    ethPrice: document.getElementById('eth-price'),
    ethChange: document.getElementById('eth-change'),
    solPrice: document.getElementById('sol-price'),
    solChange: document.getElementById('sol-change'),
    bnbPrice: document.getElementById('bnb-price'),
    bnbChange: document.getElementById('bnb-change'),
    btnUpdateMarket: document.getElementById('btn-update-market'),
    // Portfolio
    totalValue: document.getElementById('total-value'),
    pnl: document.getElementById('pnl'),
    winRate: document.getElementById('win-rate'),
    totalTrades: document.getElementById('total-trades'),
    btnRefreshPortfolio: document.getElementById('btn-refresh-portfolio'),
    // Platform
    defiPlatform: document.getElementById('defi-platform'),
    platformName: document.getElementById('platform-name'),
    platformNetwork: document.getElementById('platform-network'),
    platformFees: document.getElementById('platform-fees'),
    platformStatus: document.getElementById('platform-status'),
    btnConnectPlatform: document.getElementById('btn-connect-platform'),
    // Signal details
    currentSignal: document.getElementById('current-signal'),
    signalAction: document.getElementById('signal-action'),
    signalConfidence: document.getElementById('signal-confidence'),
    confidenceText: document.getElementById('confidence-text'),
    confidenceBar: document.getElementById('confidence-bar'),
    riskText: document.getElementById('risk-text'),
    riskBar: document.getElementById('risk-bar'),
    targetPrice: document.getElementById('target-price'),
    // Network
    networkStatus: document.getElementById('network-status'),
    activeChains: document.getElementById('active-chains'),
    blockHeight: document.getElementById('block-height'),
    deployedApps: document.getElementById('deployed-apps'),
    btnCheckNetwork: document.getElementById('btn-check-network'),
    btnClearHistory: document.getElementById('btn-clear-history')
};

// Store full values for copying
let fullChainId = '';
let fullOwner = '';

// App state
let selectedCoin = 'BNB';
let selectedPlatform = 'linera';
let currentSignal = null;
let portfolio = {
    totalValue: 10000,
    pnl: 0,
    winRate: 0,
    totalTrades: 0
};
let marketData = {
    BTC: { price: 0, change: 0 },
    ETH: { price: 0, change: 0 },
    SOL: { price: 0, change: 0 },
    BNB: { price: 0, change: 0 }
};

const defiPlatforms = {
    linera: {
        name: 'Linera Blockchain',
        network: 'Linera Testnet Conway',
        fees: '~0.01%',
        liquidity: 'High'
    },
    binance: {
        name: 'Binance',
        network: 'CEX',
        fees: '0.1%',
        liquidity: 'Very High'
    },
    coinbase: {
        name: 'Coinbase Pro',
        network: 'CEX',
        fees: '0.5%',
        liquidity: 'High'
    },
    kraken: {
        name: 'Kraken',
        network: 'CEX',
        fees: '0.26%',
        liquidity: 'High'
    },
    uniswap: {
        name: 'Uniswap V3',
        network: 'Ethereum',
        fees: '0.05-1%',
        liquidity: 'Very High'
    },
    pancakeswap: {
        name: 'PancakeSwap',
        network: 'BSC',
        fees: '0.25%',
        liquidity: 'High'
    },
    sushiswap: {
        name: 'SushiSwap',
        network: 'Multi-chain',
        fees: '0.3%',
        liquidity: 'Medium'
    }
};

/**
 * Update status message
 */
function updateStatus(element, message, type = 'info') {
    element.textContent = message;
    element.className = `status ${type}`;
}

/**
 * Copy to clipboard
 */
async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        const originalIcon = button.querySelector('.copy-icon').textContent;
        button.classList.add('copied');
        button.querySelector('.copy-icon').textContent = '✓';
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.querySelector('.copy-icon').textContent = originalIcon;
        }, 2000);
        
        console.log('✅ Copied to clipboard:', text.substring(0, 20) + '...');
    } catch (err) {
        console.error('❌ Failed to copy:', err);
        alert('Failed to copy to clipboard');
    }
}

/**
 * Toggle wallet dropdown
 */
function toggleDropdown() {
    elements.walletDropdown.classList.toggle('hidden');
}

/**
 * Hide dropdown
 */
function hideDropdown() {
    elements.walletDropdown.classList.add('hidden');
}

/**
 * Show dropdown section
 */
function showDropdownSection(section) {
    elements.dropdownNotConnected.classList.add('hidden');
    elements.dropdownConnected.classList.add('hidden');
    elements.dropdownLoading.classList.add('hidden');
    
    if (section === 'not-connected') {
        elements.dropdownNotConnected.classList.remove('hidden');
    } else if (section === 'connected') {
        elements.dropdownConnected.classList.remove('hidden');
    } else if (section === 'loading') {
        elements.dropdownLoading.classList.remove('hidden');
    }
}



/**
 * Display wallet information
 */
function displayWalletInfo() {
    const info = lineraManager.getWalletInfo();
    
    if (info.chainId) {
        elements.chainId.textContent = info.chainId;
        elements.owner.textContent = info.owner ? info.owner.substring(0, 16) + '...' : '-';
        elements.walletState.textContent = info.hasClient ? 'Connected' : 'Created';
        elements.walletInfo.style.display = 'block';
    }
}

/**
 * Create new wallet (from dropdown)
 */
async function createWalletFromDropdown() {
    // Show loading state
    showDropdownSection('loading');
    elements.loadingStep1.classList.add('active');
    
    try {
        // Initialize Linera
        await lineraManager.init();
        
        // Create wallet
        elements.loadingStep2.classList.add('active');
        const walletInfo = await lineraManager.createWallet();
        
        // Display info
        displayWalletInfo();
        updateStatus(elements.walletStatus, '✅ Wallet connected!', 'success');
        updateStatus(elements.globalStatus, '✅ Ready to trade!', 'success');
        
        // Enable trading
        elements.btnSignal.disabled = false;
        
        // Update header button
        elements.btnConnectHeader.classList.add('connected');
        elements.walletButtonText.textContent = walletInfo.chainId.substring(0, 8) + '...';
        
        // Store full values for copying
        fullChainId = walletInfo.chainId;
        fullOwner = walletInfo.owner;
        
        // Update dropdown with wallet info
        elements.dropdownChainId.textContent = walletInfo.chainId.substring(0, 16) + '...';
        elements.dropdownOwner.textContent = walletInfo.owner.substring(0, 16) + '...';
        elements.dropdownStatus.textContent = 'Connected';
        
        console.log('✅ Wallet setup complete:', {
            chainId: walletInfo.chainId,
            owner: walletInfo.owner
        });
        
        // Try to create client in background
        elements.loadingStep3.classList.add('active');
        lineraManager.createClient().then(() => {
            console.log('✅ Client connected');
            updateStatus(elements.walletStatus, '✅ Fully connected!', 'success');
            elements.dropdownStatus.textContent = 'Fully Connected';
            
            // Show connected state
            setTimeout(() => {
                showDropdownSection('connected');
                // Auto-hide dropdown after 2 seconds
                setTimeout(() => {
                    hideDropdown();
                }, 2000);
            }, 500);
        }).catch((err) => {
            console.warn('⚠️ Client connection failed (UI still works):', err.message);
            updateStatus(elements.walletStatus, '✅ Wallet ready', 'success');
            
            // Show connected state anyway
            setTimeout(() => {
                showDropdownSection('connected');
                setTimeout(() => {
                    hideDropdown();
                }, 2000);
            }, 500);
        });
        
    } catch (error) {
        console.error('❌ Wallet creation failed:', error);
        showDropdownSection('not-connected');
        updateStatus(elements.walletStatus, `❌ Error: ${error.message}`, 'error');
        updateStatus(elements.globalStatus, '❌ Failed to initialize', 'error');
        alert('Failed to create wallet: ' + error.message);
    }
}

/**
 * Disconnect wallet
 */
function disconnectWallet() {
    lineraManager.reset();
    tradingManager.clearHistory();
    
    elements.walletInfo.style.display = 'none';
    elements.btnSignal.disabled = true;
    
    // Update header button
    elements.btnConnectHeader.classList.remove('connected');
    elements.walletButtonText.textContent = 'Connect Wallet';
    
    elements.signalsContainer.innerHTML = '<div class="status info">Connect wallet to see AI signals</div>';
    elements.historyContainer.innerHTML = '<div class="status info">No trades yet</div>';
    
    updateStatus(elements.walletStatus, 'Not connected', 'info');
    updateStatus(elements.globalStatus, '💡 Click "Connect Wallet" to start', 'info');
    
    // Show not connected state in dropdown
    showDropdownSection('not-connected');
    
    console.log('🔌 Wallet disconnected');
}

/**
 * Show wallet info
 */
function showWalletInfo() {
    const info = lineraManager.getWalletInfo();
    
    if (!info.chainId) {
        alert('No wallet found. Please create a wallet first.');
        return;
    }
    
    const infoText = `
Wallet Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Chain ID: ${info.chainId}

Owner: ${info.owner}

Status: ${info.hasClient ? 'Connected' : 'Created'}

Initialized: ${info.initialized ? 'Yes' : 'No'}
Has Wallet: ${info.hasWallet ? 'Yes' : 'No'}
Has Client: ${info.hasClient ? 'Yes' : 'No'}
    `.trim();
    
    alert(infoText);
    console.log('Wallet Info:', info);
}

/**
 * Reset wallet
 */
function resetWallet() {
    if (confirm('Are you sure you want to reset your wallet? This will delete all data.')) {
        lineraManager.reset();
        tradingManager.clearHistory();
        
        elements.walletInfo.style.display = 'none';
        elements.btnSignal.disabled = true;
        elements.btnCreate.textContent = 'Connect Wallet';
        
        elements.signalsContainer.innerHTML = '<div class="status info">Connect wallet to see AI signals</div>';
        elements.historyContainer.innerHTML = '<div class="status info">No trades yet</div>';
        
        updateStatus(elements.walletStatus, 'Not connected', 'info');
        updateStatus(elements.globalStatus, '💡 Click "Connect Wallet" to start', 'info');
        
        console.log('🔄 Wallet reset complete');
    }
}



/**
 * Generate AI trading signal
 */
function generateSignal() {
    const info = lineraManager.getWalletInfo();
    
    if (!info.chainId) {
        alert('Please create a wallet first');
        return;
    }
    
    // Generate signal
    const signal = tradingManager.generateSignal(info.chainId);
    
    // Display signal
    elements.signalsContainer.innerHTML = `
        <div class="signal signal-${signal.type.toLowerCase()}">
            <strong>${signal.type} ${signal.pair}</strong><br>
            Price: $${signal.price.toLocaleString()}<br>
            Confidence: ${(signal.confidence * 100).toFixed(0)}%<br>
            <small>${signal.reason}</small><br>
            <small style="opacity: 0.7;">Chain: ${signal.chainId}</small>
        </div>
    `;
    
    // Update history
    updateHistory();
    
    console.log('📊 Signal generated:', signal);
}

/**
 * Update trading history display
 */
function updateHistory() {
    const history = tradingManager.getHistory();
    
    if (history.length === 0) {
        elements.historyContainer.innerHTML = '<div class="status info">No trades yet</div>';
        return;
    }
    
    elements.historyContainer.innerHTML = history.map(item => `
        <div class="signal signal-${item.type.toLowerCase()}">
            <small>${item.executedAt}</small><br>
            <strong>${item.type} ${item.pair}</strong> @ $${item.price.toLocaleString()}
        </div>
    `).join('');
}

/**
 * Initialize app
 */
async function initApp() {
    console.log('🚀 AI POWER TRADE - Initializing...');
    
    // Hide dropdown on init
    hideDropdown();
    
    // Check for existing wallet
    const savedMnemonic = localStorage.getItem('linera_mnemonic');
    const savedChainId = localStorage.getItem('linera_chain_id');
    const savedOwner = localStorage.getItem('linera_owner');
    
    if (savedMnemonic && savedChainId && savedOwner) {
        // Wallet exists - restore it
        updateStatus(elements.globalStatus, '🔄 Restoring wallet...', 'info');
        updateStatus(elements.walletStatus, '🔄 Loading saved wallet...', 'info');
        
        try {
            console.log('📦 Found saved wallet data:');
            console.log('   Chain ID:', savedChainId);
            console.log('   Owner:', savedOwner);
            
            // Try to restore wallet
            const restored = await lineraManager.restoreWallet();
            
            if (restored) {
                // Display restored wallet info
                displayWalletInfo();
                updateStatus(elements.walletStatus, '✅ Wallet connected!', 'success');
                updateStatus(elements.globalStatus, '✅ Ready to trade!', 'success');
                elements.btnSignal.disabled = false;
                
                // Update header button
                elements.btnConnectHeader.classList.add('connected');
                elements.walletButtonText.textContent = savedChainId.substring(0, 8) + '...';
                
                // Store full values for copying
                fullChainId = savedChainId;
                fullOwner = savedOwner;
                
                // Update dropdown
                elements.dropdownChainId.textContent = savedChainId.substring(0, 16) + '...';
                elements.dropdownOwner.textContent = savedOwner.substring(0, 16) + '...';
                elements.dropdownStatus.textContent = 'Connected';
                showDropdownSection('connected');
                
                console.log('✅ Wallet restored successfully');
                
                // Try to create client in background
                lineraManager.createClient().then(() => {
                    console.log('✅ Client connected - WASM logs should appear now');
                    updateStatus(elements.walletStatus, '✅ Fully connected!', 'success');
                    elements.dropdownStatus.textContent = 'Fully Connected';
                }).catch((err) => {
                    console.warn('⚠️ Client connection failed:', err.message);
                });
            }
        } catch (error) {
            console.error('Failed to restore:', error);
            updateStatus(elements.globalStatus, '💡 Click "Connect Wallet" to start', 'info');
            updateStatus(elements.walletStatus, 'Not connected', 'info');
            showDropdownSection('not-connected');
        }
    } else {
        // No wallet
        updateStatus(elements.globalStatus, '💡 Click "Connect Wallet" to start', 'info');
        updateStatus(elements.walletStatus, 'Not connected', 'info');
        showDropdownSection('not-connected');
    }
    
    console.log('✅ App initialized');
}

// Event Listeners
elements.btnConnectHeader.addEventListener('click', toggleDropdown);
elements.dropdownCreateWallet.addEventListener('click', createWalletFromDropdown);
elements.dropdownDisconnect.addEventListener('click', () => {
    disconnectWallet();
    hideDropdown();
});
elements.btnCreate.addEventListener('click', toggleDropdown);
elements.btnInfo.addEventListener('click', showWalletInfo);
elements.btnReset.addEventListener('click', resetWallet);
elements.btnSignal.addEventListener('click', generateSignal);

// Copy buttons
elements.copyChainIdBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    copyToClipboard(fullChainId, elements.copyChainIdBtn);
});

elements.copyOwnerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    copyToClipboard(fullOwner, elements.copyOwnerBtn);
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!elements.walletDropdown.contains(e.target) && 
        !elements.btnConnectHeader.contains(e.target) &&
        !elements.btnCreate.contains(e.target)) {
        hideDropdown();
    }
});

// Initialize on load
initApp();

// Import additional modules
import MarketManager from './market.js';
import PlatformManager from './platform.js';
import { aiTradingContract } from './ai-trading-contract.js';

// Initialize additional managers
const marketManager = new MarketManager();
const platformManager = new PlatformManager();

// Contract integration flag
let contractAvailable = false;

// Check if GraphQL service is available
async function checkContractAvailability() {
    try {
        await aiTradingContract.getTradeCount();
        contractAvailable = true;
        console.log('✅ AI Trading Contract connected');
        updateStatus(elements.globalStatus, '✅ Contract connected - Using real blockchain data', 'success');
        return true;
    } catch (error) {
        contractAvailable = false;
        console.warn('⚠️ Contract not available, using mock data:', error.message);
        updateStatus(elements.globalStatus, '⚠️ Using mock data - Start GraphQL service for real contract', 'info');
        return false;
    }
}

/**
 * Update market data UI
 */
async function updateMarketData() {
    updateStatus(elements.globalStatus, '📊 Fetching live market data...', 'info');
    
    try {
        const data = await marketManager.updateMarketData();
        
        // Update UI
        elements.btcPrice.textContent = `$${data.BTC.price.toFixed(0)}`;
        elements.btcChange.textContent = `${data.BTC.change >= 0 ? '+' : ''}${data.BTC.change.toFixed(2)}%`;
        elements.btcChange.style.color = data.BTC.change >= 0 ? '#00ff88' : '#ff4444';
        
        elements.ethPrice.textContent = `$${data.ETH.price.toFixed(0)}`;
        elements.ethChange.textContent = `${data.ETH.change >= 0 ? '+' : ''}${data.ETH.change.toFixed(2)}%`;
        elements.ethChange.style.color = data.ETH.change >= 0 ? '#00ff88' : '#ff4444';
        
        elements.solPrice.textContent = `$${data.SOL.price.toFixed(2)}`;
        elements.solChange.textContent = `${data.SOL.change >= 0 ? '+' : ''}${data.SOL.change.toFixed(2)}%`;
        elements.solChange.style.color = data.SOL.change >= 0 ? '#00ff88' : '#ff4444';
        
        elements.bnbPrice.textContent = `$${data.BNB.price.toFixed(2)}`;
        elements.bnbChange.textContent = `${data.BNB.change >= 0 ? '+' : ''}${data.BNB.change.toFixed(2)}%`;
        elements.bnbChange.style.color = data.BNB.change >= 0 ? '#00ff88' : '#ff4444';
        
        updateStatus(elements.globalStatus, '✅ Market data updated from Binance', 'success');
    } catch (error) {
        updateStatus(elements.globalStatus, '❌ Failed to fetch market data', 'error');
    }
}

/**
 * Select trading platform
 */
function selectPlatform() {
    const platformId = elements.defiPlatform.value;
    const platform = platformManager.selectPlatform(platformId);
    
    elements.platformName.textContent = platform.name;
    elements.platformNetwork.textContent = platform.network;
    elements.platformFees.textContent = platform.fees;
    elements.platformStatus.textContent = 'Not Connected';
    elements.platformStatus.style.color = '#ffaa00';
    
    updateStatus(elements.globalStatus, `📋 Selected ${platform.name}`, 'info');
}

/**
 * Connect to trading platform
 */
async function connectPlatform() {
    const platform = platformManager.getCurrentPlatform();
    updateStatus(elements.globalStatus, `🔗 Connecting to ${platform.name}...`, 'info');
    
    try {
        await platformManager.connect();
        
        elements.platformStatus.textContent = 'Connected';
        elements.platformStatus.style.color = '#00ff88';
        updateStatus(elements.globalStatus, `✅ Connected to ${platform.name}`, 'success');
    } catch (error) {
        elements.platformStatus.textContent = 'Connection Failed';
        elements.platformStatus.style.color = '#ff4444';
        updateStatus(elements.globalStatus, `❌ Failed to connect to ${platform.name}`, 'error');
    }
}

/**
 * Select coin for trading
 */
function selectCoin(event) {
    const coin = event.target.dataset.coin;
    if (!coin) return;
    
    selectedCoin = coin;
    
    // Update UI
    document.querySelectorAll('.coin-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    console.log('💰 Selected coin:', coin);
    
    // Auto-generate signal for new coin
    if (lineraManager.getWalletInfo().chainId) {
        generateSignalEnhanced();
    }
}

/**
 * Generate enhanced AI trading signal
 */
function generateSignalEnhanced() {
    const info = lineraManager.getWalletInfo();
    
    if (!info.chainId) {
        alert('Please create a wallet first');
        return;
    }
    
    updateStatus(elements.globalStatus, `🧠 AI analyzing ${selectedCoin}...`, 'info');
    
    // Get current price
    const currentPrice = marketManager.getPrice(selectedCoin);
    if (!currentPrice) {
        alert('Market data not available. Please update prices first.');
        return;
    }
    
    // Generate AI signal
    const signals = ['BUY', 'SELL', 'HOLD'];
    const signal = signals[Math.floor(Math.random() * signals.length)];
    const confidence = Math.random() * 0.4 + 0.6; // 60-100%
    const riskScore = Math.floor(Math.random() * 60) + 20; // 20-80
    const targetPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.1);
    
    currentSignal = {
        coin: selectedCoin,
        signal: signal,
        confidence: confidence,
        riskScore: riskScore,
        targetPrice: targetPrice,
        currentPrice: currentPrice,
        timestamp: new Date(),
        chainId: info.chainId
    };
    
    // Update UI
    elements.currentSignal.className = `signal signal-${signal.toLowerCase()}`;
    elements.signalAction.textContent = `${signal} ${selectedCoin}`;
    elements.signalConfidence.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceText.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceBar.style.width = `${confidence * 100}%`;
    elements.riskText.textContent = `${riskScore}/100`;
    elements.riskBar.style.width = `${riskScore}%`;
    elements.targetPrice.textContent = `$${targetPrice.toFixed(2)}`;
    
    // Enable execute button
    elements.btnExecute.disabled = false;
    elements.btnExecute.textContent = `Execute ${signal} ${selectedCoin}`;
    
    updateStatus(elements.globalStatus, `✅ AI Signal: ${signal} ${selectedCoin}`, 'success');
    console.log('🧠 Signal generated:', currentSignal);
}

/**
 * Execute AI trade
 */
function executeAITrade() {
    if (!currentSignal) {
        alert('Please generate a signal first');
        return;
    }
    
    updateStatus(elements.globalStatus, '⚡ Executing trade...', 'info');
    
    // Create trade record
    const trade = {
        id: Date.now(),
        coin: currentSignal.coin,
        type: currentSignal.signal,
        amount: 100,
        price: currentSignal.targetPrice,
        confidence: currentSignal.confidence,
        timestamp: new Date(),
        chainId: currentSignal.chainId
    };
    
    // Add to trading manager
    tradingManager.addToHistory({
        ...trade,
        pair: `${trade.coin}/USD`,
        executedAt: trade.timestamp.toLocaleTimeString()
    });
    
    // Update displays
    updateHistoryEnhanced();
    updatePortfolioStats();
    
    updateStatus(elements.globalStatus, `✅ Trade executed: ${trade.type} ${trade.coin}`, 'success');
    console.log('⚡ Trade executed:', trade);
    
    // Disable execute button until new signal
    elements.btnExecute.disabled = true;
}

/**
 * Update portfolio statistics
 */
function updatePortfolioStats() {
    const history = tradingManager.getHistory();
    portfolio.totalTrades = history.length;
    
    // Simulate P&L calculation
    const totalProfit = history.reduce((sum) => {
        const profit = (Math.random() - 0.4) * 100 * 0.1; // Slight positive bias
        return sum + profit;
    }, 0);
    
    portfolio.pnl = totalProfit;
    portfolio.totalValue = 10000 + totalProfit;
    
    const winningTrades = history.filter(() => Math.random() > 0.3).length;
    portfolio.winRate = portfolio.totalTrades > 0 ? 
        Math.round((winningTrades / portfolio.totalTrades) * 100) : 0;
    
    // Update UI
    elements.totalValue.textContent = `$${portfolio.totalValue.toFixed(0)}`;
    elements.pnl.textContent = `${portfolio.pnl >= 0 ? '+' : ''}$${portfolio.pnl.toFixed(0)}`;
    elements.pnl.style.color = portfolio.pnl >= 0 ? '#00ff88' : '#ff4444';
    elements.winRate.textContent = `${portfolio.winRate}%`;
    elements.totalTrades.textContent = portfolio.totalTrades;
    
    console.log('💰 Portfolio updated:', portfolio);
}

/**
 * Update trading history display (enhanced)
 */
function updateHistoryEnhanced() {
    const history = tradingManager.getHistory();
    
    if (history.length === 0) {
        elements.historyContainer.innerHTML = '<div class="status info">No trades yet. Execute your first trade!</div>';
        return;
    }
    
    elements.historyContainer.innerHTML = history.map(item => `
        <div class="trade-item ${item.type}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${item.type} ${item.pair}</strong>
                    <div style="font-size: 0.8em; color: #aaa; margin-top: 4px;">${item.executedAt}</div>
                </div>
                <div style="text-align: right;">
                    <div>$${item.price.toFixed(2)}</div>
                    <div style="font-size: 0.8em; color: #aaa;">${(item.confidence * 100).toFixed(0)}%</div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Check network status
 */
function checkNetworkStatus() {
    updateStatus(elements.globalStatus, '🔍 Checking network status...', 'info');
    
    setTimeout(() => {
        elements.blockHeight.textContent = (Math.floor(Math.random() * 1000) + 12000).toLocaleString();
        updateStatus(elements.globalStatus, '✅ Network status updated', 'success');
    }, 1000);
}

/**
 * Clear trade history
 */
function clearTradeHistory() {
    if (confirm('Clear all trade history?')) {
        tradingManager.clearHistory();
        updateHistoryEnhanced();
        updatePortfolioStats();
        updateStatus(elements.globalStatus, '🗑️ Trade history cleared', 'info');
    }
}

// Additional event listeners
elements.btnUpdateMarket.addEventListener('click', updateMarketData);
elements.defiPlatform.addEventListener('change', selectPlatform);
elements.btnConnectPlatform.addEventListener('click', connectPlatform);
elements.btnExecute.addEventListener('click', executeAITrade);
elements.btnRefreshPortfolio.addEventListener('click', updatePortfolioStats);
elements.btnCheckNetwork.addEventListener('click', checkNetworkStatus);
elements.btnClearHistory.addEventListener('click', clearTradeHistory);

// Coin selector buttons
document.querySelectorAll('.coin-btn').forEach(btn => {
    btn.addEventListener('click', selectCoin);
});

// Override original generateSignal to use enhanced version
elements.btnSignal.removeEventListener('click', generateSignal);
elements.btnSignal.addEventListener('click', generateSignalEnhanced);

// Auto-load market data on init
setTimeout(() => {
    updateMarketData();
    updatePortfolioStats();
}, 2000);

// Auto-update market data every 30 seconds
setInterval(updateMarketData, 30000);
