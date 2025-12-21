/**
 * Main Application Entry Point
 */

import LineraManager from './linera-wasm.js';
import TradingManager from './trading.js';
import FaucetManager from './faucet.js';
import RiskManager from './risk-management.js';
import AIExplainer from './ai-explainer.js';
import { generateRealSignal } from './signal-real.js';
import SignalCooldownManager from './signal-cooldown.js';
import WalletManager from './wallet-manager.js';
import SignalPersistenceManager from './signal-persistence.js';

// Initialize managers
const lineraManager = new LineraManager();
const riskManager = new RiskManager();
const tradingManager = new TradingManager();
const faucetManager = new FaucetManager();
const signalCooldown = new SignalCooldownManager();
const walletManager = new WalletManager();
const signalPersistence = new SignalPersistenceManager();

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
    // Wallet management
    dropdownExportWallet: document.getElementById('dropdown-export-wallet'),
    dropdownImportWallet: document.getElementById('dropdown-import-wallet'),
    dropdownImportWalletNotConnected: document.getElementById('dropdown-import-wallet-notconnected'),
    // Mnemonic modal
    mnemonicModalOverlay: document.getElementById('mnemonic-modal-overlay'),
    mnemonicModalClose: document.getElementById('mnemonic-modal-close'),
    mnemonicWords: document.getElementById('mnemonic-words'),
    mnemonicConfirmed: document.getElementById('mnemonic-confirmed'),
    mnemonicCopyBtn: document.getElementById('mnemonic-copy-btn'),
    mnemonicContinueBtn: document.getElementById('mnemonic-continue-btn'),
    // Export modal
    exportModalOverlay: document.getElementById('export-modal-overlay'),
    exportModalClose: document.getElementById('export-modal-close'),
    exportPassword: document.getElementById('export-password'),
    exportPasswordConfirm: document.getElementById('export-password-confirm'),
    exportMessage: document.getElementById('export-message'),
    exportCancelBtn: document.getElementById('export-cancel-btn'),
    exportConfirmBtn: document.getElementById('export-confirm-btn'),
    // Import modal
    importModalOverlay: document.getElementById('import-modal-overlay'),
    importModalClose: document.getElementById('import-modal-close'),
    importFile: document.getElementById('import-file'),
    importPassword: document.getElementById('import-password'),
    importMessage: document.getElementById('import-message'),
    importCancelBtn: document.getElementById('import-cancel-btn'),
    importConfirmBtn: document.getElementById('import-confirm-btn'),
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
    btnClearHistory: document.getElementById('btn-clear-history'),
    // Trade percentage
    tradePercentageSlider: document.getElementById('trade-percentage-slider'),
    tradePercentage: document.getElementById('trade-percentage'),
    tradeAmountUsd: document.getElementById('trade-amount-usd'),
    // Faucet
    btnClaimFaucet: document.getElementById('btn-claim-faucet'),
    faucetStatus: document.getElementById('faucet-status'),
    faucetStatusText: document.getElementById('faucet-status-text'),
    faucetCooldown: document.getElementById('faucet-cooldown'),
    faucetCooldownContainer: document.getElementById('faucet-cooldown-container'),
    faucetMessage: document.getElementById('faucet-message'),
    // Risk Management
    riskManagement: document.getElementById('risk-management'),
    riskRatio: document.getElementById('risk-ratio'),
    takeProfitPrice: document.getElementById('take-profit-price'),
    takeProfitPercent: document.getElementById('take-profit-percent'),
    tpProfit: document.getElementById('tp-profit'),
    stopLossPrice: document.getElementById('stop-loss-price'),
    stopLossPercent: document.getElementById('stop-loss-percent'),
    slLoss: document.getElementById('sl-loss'),
    btnAiTp: document.getElementById('btn-ai-tp'),
    btnAiSl: document.getElementById('btn-ai-sl')
};

// Store full values for copying
let fullChainId = '';
let fullOwner = '';

// App state
let selectedCoin = 'BTC';
let selectedPlatform = 'linera';
let currentSignal = null;
let activeSignal = null; // Global persistent signal (not tied to selected coin)
let tradePercentage = 25; // Default 25%
let portfolio = {
    totalValue: 0, // Will be fetched from blockchain
    pnl: 0,
    winRate: 0,
    totalTrades: 0
};

// Active trades with stop loss / take profit
let activeTrades = [];

// Price monitoring interval
let priceMonitorInterval = null;

// LINERA to USD conversion rate (mock for now, should be from API)
const LINERA_TO_USD = 1.5;

/**
 * Query real balance from blockchain
 */
async function queryBlockchainBalance() {
    try {
        // Get wallet info first
        const info = lineraManager.getWalletInfo();
        
        if (!info.chainId || !info.owner) {
            console.log('Wallet not connected, using default balance');
            return 0;
        }

        // Get balance from Linera blockchain (per wallet)
        // TODO: Query actual balance from blockchain via GraphQL
        // For now, simulate with localStorage tracking per owner address
        const balanceKey = `lineraBalance_${info.owner}`;
        const storedBalance = localStorage.getItem(balanceKey);
        const lineraBalance = storedBalance ? parseFloat(storedBalance) : 0;
        
        // Convert LINERA to USD
        const usdBalance = lineraBalance * LINERA_TO_USD;
        
        console.log(`💰 Balance query for ${info.owner.substring(0, 10)}...:`);
        console.log(`   Key: ${balanceKey}`);
        console.log(`   Stored: ${storedBalance}`);
        console.log(`   LINERA: ${lineraBalance}`);
        console.log(`   USD: $${usdBalance.toFixed(2)}`);
        
        return usdBalance;
    } catch (error) {
        console.error('Error querying balance:', error);
        return 0;
    }
}

/**
 * Update balance in localStorage (simulating blockchain state)
 */
function updateBlockchainBalance(amount) {
    const info = lineraManager.getWalletInfo();
    
    if (!info.owner) {
        console.error('Cannot update balance: no wallet connected');
        return 0;
    }
    
    const balanceKey = `lineraBalance_${info.owner}`;
    const currentBalance = parseFloat(localStorage.getItem(balanceKey) || '0');
    const newBalance = currentBalance + amount;
    localStorage.setItem(balanceKey, newBalance.toString());
    console.log(`💰 Balance updated for ${info.owner.substring(0, 10)}...: ${currentBalance} → ${newBalance} LINERA`);
    return newBalance;
}
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
    console.log('📋 Attempting to copy:', text ? text.substring(0, 20) + '...' : 'EMPTY TEXT');
    
    if (!text) {
        console.error('❌ Cannot copy: text is empty');
        alert('Nothing to copy');
        return;
    }
    
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            showCopySuccess(button);
            console.log('✅ Copied using Clipboard API');
            return;
        } catch (err) {
            console.warn('⚠️ Clipboard API failed, trying fallback:', err);
        }
    }
    
    // Fallback method for HTTP sites
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.width = '2em';
        textarea.style.height = '2em';
        textarea.style.padding = '0';
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';
        textarea.style.background = 'transparent';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
            showCopySuccess(button);
            console.log('✅ Copied using execCommand fallback');
        } else {
            throw new Error('execCommand returned false');
        }
    } catch (fallbackErr) {
        console.error('❌ All copy methods failed:', fallbackErr);
        alert('Failed to copy. Please copy manually:\n\n' + text);
    }
}

/**
 * Show copy success feedback
 */
function showCopySuccess(button) {
    const copyIcon = button.querySelector('.copy-icon');
    if (copyIcon) {
        const originalIcon = copyIcon.textContent;
        button.classList.add('copied');
        copyIcon.textContent = '✓';
        
        setTimeout(() => {
            button.classList.remove('copied');
            copyIcon.textContent = originalIcon;
        }, 2000);
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
        
        // Update faucet status
        updateFaucetStatus();
        
        // Update portfolio with initial balance
        await updatePortfolioStats();
        
        // Update header button
        elements.btnConnectHeader.classList.add('connected');
        elements.walletButtonText.textContent = walletInfo.chainId.substring(0, 8) + '...';
        
        // Store full values for copying
        fullChainId = walletInfo.chainId;
        fullOwner = walletInfo.owner;
        
        console.log('💾 Stored for copying:', {
            fullChainId: fullChainId,
            fullOwner: fullOwner
        });
        
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
                // Auto-hide dropdown after 1 second, then show mnemonic
                setTimeout(() => {
                    hideDropdown();
                    // Show mnemonic backup modal
                    showMnemonicModal();
                }, 1000);
            }, 500);
        }).catch((err) => {
            console.warn('⚠️ Client connection failed (UI still works):', err.message);
            updateStatus(elements.walletStatus, '✅ Wallet ready', 'success');
            
            // Show connected state anyway
            setTimeout(() => {
                showDropdownSection('connected');
                setTimeout(() => {
                    hideDropdown();
                    // Show mnemonic backup modal
                    showMnemonicModal();
                }, 1000);
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
                
                // Update faucet status
                updateFaucetStatus();
                
                // Update portfolio with balance
                await updatePortfolioStats();
                
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
                
                // Update signal container to show wallet is connected
                elements.signalsContainer.innerHTML = `
                    <div class="signal signal-hold" id="current-signal">
                        <div class="signal-header">
                            <strong id="signal-action">Ready</strong>
                            <span id="signal-confidence">-</span>
                        </div>
                        <div class="signal-metric">
                            <div class="metric-label">
                                <span>Confidence</span>
                                <span id="confidence-text">-</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="confidence-bar" style="width: 0%"></div>
                            </div>
                        </div>
                        <div class="signal-metric">
                            <div class="metric-label">
                                <span>Risk Score</span>
                                <span id="risk-text">-</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill risk" id="risk-bar" style="width: 0%"></div>
                            </div>
                        </div>
                        <div class="signal-detail">
                            <span>Target Price</span>
                            <span id="target-price">-</span>
                        </div>
                    </div>
                `;
                
                // Re-bind element references after innerHTML update
                elements.currentSignal = document.getElementById('current-signal');
                elements.signalAction = document.getElementById('signal-action');
                elements.signalConfidence = document.getElementById('signal-confidence');
                elements.confidenceText = document.getElementById('confidence-text');
                elements.confidenceBar = document.getElementById('confidence-bar');
                elements.riskText = document.getElementById('risk-text');
                elements.riskBar = document.getElementById('risk-bar');
                elements.targetPrice = document.getElementById('target-price');
                
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
    console.log('🔍 Copy Owner clicked, fullOwner:', fullOwner);
    if (!fullOwner) {
        alert('Owner address not available');
        return;
    }
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
const aiExplainer = new AIExplainer(marketManager);
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
    
    // Update UI - active state
    document.querySelectorAll('.coin-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    console.log('💰 Selected coin:', coin);
    
    // Check if this coin has a saved signal (per-coin storage)
    const coinSignal = signalCooldown.getLastSignal(coin);
    
    if (coinSignal && coinSignal.signal) {
        // This coin has a signal - display it
        console.log(`📊 Loading saved signal for ${coin}:`, coinSignal.signal);
        currentSignal = coinSignal.signal;
        activeSignal = coinSignal.signal;
        
        // Display the signal
        displayCoinSignal(coinSignal.signal);
        
        // Show risk management
        elements.riskManagement.style.display = 'block';
        
        // Enable execute button
        elements.btnExecute.disabled = false;
        const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
        elements.btnExecute.textContent = `Execute ${coinSignal.signal.signal} ${coin} (${tradePercentage}% - $${tradeAmount.toFixed(0)})`;
    } else {
        // No signal for this coin - show ready state
        console.log(`⚪ No signal for ${coin} - showing ready state`);
        currentSignal = null;
        activeSignal = null;
        
        // Show ready state
        showReadyState();
        
        // Hide risk management
        elements.riskManagement.style.display = 'none';
        
        // Disable execute button
        elements.btnExecute.disabled = true;
        elements.btnExecute.textContent = 'Execute AI Trade';
    }
    
    // Update AI Explainer link
    updateAIExplainerLink();
    
    // Update visual indicators (highlight coins with signals)
    updateCoinButtonIndicators();
}

/**
 * Update AI Explainer link with current coin
 */
function updateAIExplainerLink() {
    const explainerBtn = document.getElementById('btn-ai-explainer');
    if (explainerBtn) {
        explainerBtn.href = `/ai-explainer.html?coin=${selectedCoin}`;
    }
}

/**
 * Display signal for a specific coin
 */
function displayCoinSignal(signal) {
    if (!signal) return;
    
    const signalType = signal.signal;
    const confidence = signal.confidence;
    const riskScore = signal.riskScore;
    const targetPrice = signal.targetPrice;
    const coin = signal.coin;
    
    // Update UI
    elements.currentSignal.className = `signal signal-${signalType.toLowerCase()}`;
    elements.signalAction.innerHTML = `${signalType} <span class="coin-badge">${coin}</span>`;
    elements.signalConfidence.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceText.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceBar.style.width = `${confidence * 100}%`;
    elements.riskText.textContent = `${riskScore}/100`;
    elements.riskBar.style.width = `${riskScore}%`;
    elements.targetPrice.textContent = `$${targetPrice.toFixed(2)}`;
    
    console.log(`✅ Displayed signal for ${coin}:`, signalType);
}

/**
 * Show ready state (no signal)
 */
function showReadyState() {
    elements.currentSignal.className = 'signal signal-hold';
    elements.signalAction.innerHTML = `Ready`;
    elements.signalConfidence.textContent = '-';
    elements.confidenceText.textContent = '-';
    elements.confidenceBar.style.width = '0%';
    elements.riskText.textContent = '-';
    elements.riskBar.style.width = '0%';
    elements.targetPrice.textContent = '-';
    
    console.log('⚪ Showing ready state');
}

/**
 * Update coin button visual indicators
 * Highlights the coin that has an active signal
 */
function updateCoinButtonIndicators() {
    // Remove all signal indicators
    document.querySelectorAll('.coin-btn').forEach(btn => {
        btn.classList.remove('has-active-signal');
    });
    
    // Add indicator to all coins with signals
    const allCoins = ['BTC', 'ETH', 'SOL', 'BNB'];
    allCoins.forEach(coin => {
        const coinSignal = signalCooldown.getLastSignal(coin);
        if (coinSignal && coinSignal.signal) {
            const coinBtn = document.querySelector(`.coin-btn[data-coin="${coin}"]`);
            if (coinBtn) {
                coinBtn.classList.add('has-active-signal');
                console.log(`✨ Highlighted ${coin} button (has signal)`);
            }
        }
    });
}

/**
 * Display active signal (persistent across coin changes)
 */
function displayActiveSignal() {
    if (!activeSignal) {
        console.log('⚠️ No active signal to display');
        return;
    }
    
    // Check if signal is still valid (within 15 minutes)
    const signalAge = Date.now() - activeSignal.timestamp;
    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    
    if (signalAge > FIFTEEN_MINUTES) {
        console.log('⏱️ Active signal expired, clearing...');
        activeSignal = null;
        currentSignal = null;
        elements.riskManagement.style.display = 'none';
        elements.btnExecute.disabled = true;
        return;
    }
    
    const signal = activeSignal.signal;
    const confidence = activeSignal.confidence;
    const riskScore = activeSignal.riskScore;
    const targetPrice = activeSignal.targetPrice;
    const signalCoin = activeSignal.coin;
    
    // Update UI with coin badge
    elements.currentSignal.className = `signal signal-${signal.toLowerCase()}`;
    elements.signalAction.innerHTML = `${signal} <span class="coin-badge">${signalCoin}</span>`;
    elements.signalConfidence.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceText.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceBar.style.width = `${confidence * 100}%`;
    elements.riskText.textContent = `${riskScore}/100`;
    elements.riskBar.style.width = `${riskScore}%`;
    elements.targetPrice.textContent = `${targetPrice.toFixed(2)}`;
    
    // Show risk management section
    elements.riskManagement.style.display = 'block';
    
    // Enable execute button
    elements.btnExecute.disabled = false;
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    elements.btnExecute.textContent = `Execute ${signal} ${signalCoin} (${tradePercentage}% - ${tradeAmount.toFixed(0)})`;
    
    // Set currentSignal for risk management calculations
    currentSignal = activeSignal;
    
    console.log('✅ Active signal displayed:', {
        coin: signalCoin,
        signal: signal,
        age: `${Math.floor(signalAge / 60000)} minutes ago`
    });
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
    
    // Check cooldown (15 minutes)
    if (!signalCooldown.canGenerate(selectedCoin)) {
        const remaining = signalCooldown.getRemainingTimeFormatted(selectedCoin);
        alert(`⏱️ Please wait ${remaining} before generating a new signal for ${selectedCoin}\n\nSignals update every 15 minutes for accuracy.`);
        return;
    }
    
    updateStatus(elements.globalStatus, `🧠 AI analyzing ${selectedCoin}...`, 'info');
    
    // Get current price
    const currentPrice = marketManager.getPrice(selectedCoin);
    if (!currentPrice) {
        alert('Market data not available. Please update prices first.');
        return;
    }
    
    // Generate REAL AI signal using technical analysis
    const generatedSignal = generateRealSignal(selectedCoin, currentPrice, aiExplainer, info);
    currentSignal = generatedSignal;
    activeSignal = generatedSignal; // Set as active signal
    const signal = currentSignal.signal;
    const confidence = currentSignal.confidence;
    const riskScore = currentSignal.riskScore;
    const targetPrice = currentSignal.targetPrice;
    
    // Save signal with cooldown
    signalCooldown.saveSignal(selectedCoin, currentSignal);
    
    // Update UI
    elements.currentSignal.className = `signal signal-${signal.toLowerCase()}`;
    elements.signalAction.innerHTML = `${signal} <span class="coin-badge">${selectedCoin}</span>`;
    elements.signalConfidence.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceText.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceBar.style.width = `${confidence * 100}%`;
    elements.riskText.textContent = `${riskScore}/100`;
    elements.riskBar.style.width = `${riskScore}%`;
    elements.targetPrice.textContent = `$${targetPrice.toFixed(2)}`;
    
    // Enable execute button with percentage
    elements.btnExecute.disabled = false;
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    elements.btnExecute.textContent = `Execute ${signal} ${selectedCoin} (${tradePercentage}% - $${tradeAmount.toFixed(0)})`;
    
    // Show risk management section
    console.log('🎯 Showing Risk Management section');
    elements.riskManagement.style.display = 'block';
    console.log('🎯 Risk Management display:', elements.riskManagement.style.display);
    
    // Calculate and populate AI suggestions for stop loss and take profit
    const aiSuggestion = riskManager.calculateAISuggestion(
        currentPrice,
        confidence,
        signal
    );
    
    // Populate fields with AI suggestions
    elements.takeProfitPrice.value = aiSuggestion.takeProfit;
    elements.takeProfitPercent.value = aiSuggestion.takeProfitPercent;
    elements.stopLossPrice.value = aiSuggestion.stopLoss;
    elements.stopLossPercent.value = aiSuggestion.stopLossPercent;
    elements.riskRatio.textContent = `R:R ${aiSuggestion.riskRewardRatio}:1`;
    
    // Update profit/loss display
    updateProfitLossDisplay();
    
    // Update visual indicators for signal coin
    updateCoinButtonIndicators();
    
    updateStatus(elements.globalStatus, `✅ AI Signal: ${signal} ${selectedCoin} | TP: +${aiSuggestion.takeProfitPercent}% | SL: -${aiSuggestion.stopLossPercent}%`, 'success');
    console.log('🧠 Signal generated with REAL ANALYSIS:', currentSignal);
    console.log('🎯 Risk Management:', aiSuggestion);
    if (currentSignal.analysis) {
        console.log('📊 RSI:', currentSignal.analysis.rsi);
        console.log('📈 MACD:', currentSignal.analysis.macd);
        console.log('📉 MA:', currentSignal.analysis.ma);
        console.log('📊 BB:', currentSignal.analysis.bb);
        console.log('💡 Reasoning:', currentSignal.analysis.reasoning);
    }
}

/**
 * Execute AI trade
 */
function executeAITrade() {
    if (!currentSignal) {
        alert('Please generate a signal first');
        return;
    }
    
    // Calculate trade amount based on percentage
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    
    updateStatus(elements.globalStatus, `⚡ Executing ${tradePercentage}% trade ($${tradeAmount.toFixed(0)})...`, 'info');
    
    // Create trade record
    const trade = {
        id: Date.now(),
        coin: currentSignal.coin,
        type: currentSignal.signal,
        amount: tradeAmount,
        percentage: tradePercentage,
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
    
    updateStatus(elements.globalStatus, `✅ Trade executed: ${trade.type} ${trade.coin} (${tradePercentage}% - $${tradeAmount.toFixed(0)})`, 'success');
    console.log('⚡ Trade executed:', trade);
    
    // Clear active signal after execution
    // Signal cleared (stored per-coin in signalCooldown)
    activeSignal = null;
    currentSignal = null;
    
    // Hide risk management section
    elements.riskManagement.style.display = 'none';
    
    // Update visual indicators (remove highlight)
    updateCoinButtonIndicators();
    
    // Disable execute button until new signal
    elements.btnExecute.disabled = true;
}

/**
 * Update portfolio statistics
 */
async function updatePortfolioStats() {
    // Query real balance from blockchain
    const realBalance = await queryBlockchainBalance();
    portfolio.totalValue = realBalance;
    
    const history = tradingManager.getHistory();
    portfolio.totalTrades = history.length;
    
    // Simulate P&L calculation
    const totalProfit = history.reduce((sum) => {
        const profit = (Math.random() - 0.4) * 100 * 0.1; // Slight positive bias
        return sum + profit;
    }, 0);
    
    portfolio.pnl = totalProfit;
    portfolio.totalValue = realBalance; // Use real balance
    
    const winningTrades = history.filter(() => Math.random() > 0.3).length;
    portfolio.winRate = portfolio.totalTrades > 0 ? 
        Math.round((winningTrades / portfolio.totalTrades) * 100) : 0;
    
    elements.totalValue.textContent = `$${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    elements.pnl.textContent = `${portfolio.pnl >= 0 ? '+' : ''}$${Math.abs(portfolio.pnl).toFixed(0)}`;
    elements.pnl.style.color = portfolio.pnl >= 0 ? '#00ff88' : '#ff4444';
    elements.winRate.textContent = `${portfolio.winRate}%`;
    elements.totalTrades.textContent = portfolio.totalTrades;
    
    // Update wallet balance display in User Wallet card
    if (elements.walletBalance) {
        const lineraBalance = realBalance / LINERA_TO_USD;
        elements.walletBalance.textContent = `${lineraBalance.toFixed(2)} LINERA (~$${realBalance.toFixed(2)})`;
    }
    
    console.log('💰 Portfolio updated:', {
        totalValue: `$${portfolio.totalValue.toFixed(2)}`,
        pnl: `$${portfolio.pnl.toFixed(2)}`,
        winRate: `${portfolio.winRate}%`,
        totalTrades: portfolio.totalTrades
    });
    
    // Update trade amount display after portfolio is updated
    updateTradeAmount();
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

// Trade percentage slider - OPTIMIZED for smooth performance
let sliderTimeout;
elements.tradePercentageSlider.addEventListener('input', (e) => {
    tradePercentage = parseInt(e.target.value);
    updateTradeAmount(); // Update display immediately (lightweight)
    
    // Debounce heavy calculation
    clearTimeout(sliderTimeout);
    sliderTimeout = setTimeout(() => {
        updateProfitLossDisplay(); // Update risk management (heavy, debounced)
    }, 100);
});

// Risk Management Event Listeners

// AI Suggest Take Profit
elements.btnAiTp.addEventListener('click', () => {
    if (!currentSignal) {
        console.warn('⚠️ No current signal for AI TP suggestion');
        return;
    }
    
    // Use correct property names (price or currentPrice, type or signal)
    const entryPrice = currentSignal.price || currentSignal.currentPrice;
    const signalType = currentSignal.type || currentSignal.signal;
    
    console.log('🎯 AI TP Suggestion - Signal data:', {
        price: entryPrice,
        confidence: currentSignal.confidence,
        type: signalType
    });
    
    const aiSuggestion = riskManager.calculateAISuggestion(
        entryPrice,
        currentSignal.confidence,
        signalType
    );
    
    console.log('✅ AI TP Suggestion:', aiSuggestion);
    
    elements.takeProfitPrice.value = aiSuggestion.takeProfit;
    elements.takeProfitPercent.value = aiSuggestion.takeProfitPercent;
    elements.riskRatio.textContent = `R:R ${aiSuggestion.riskRewardRatio}:1`;
    updateProfitLossDisplay();
});

// AI Suggest Stop Loss
elements.btnAiSl.addEventListener('click', () => {
    if (!currentSignal) {
        console.warn('⚠️ No current signal for AI SL suggestion');
        return;
    }
    
    // Use correct property names (price or currentPrice, type or signal)
    const entryPrice = currentSignal.price || currentSignal.currentPrice;
    const signalType = currentSignal.type || currentSignal.signal;
    
    console.log('🎯 AI SL Suggestion - Signal data:', {
        price: entryPrice,
        confidence: currentSignal.confidence,
        type: signalType
    });
    
    const aiSuggestion = riskManager.calculateAISuggestion(
        entryPrice,
        currentSignal.confidence,
        signalType
    );
    
    console.log('✅ AI SL Suggestion:', aiSuggestion);
    
    elements.stopLossPrice.value = aiSuggestion.stopLoss;
    elements.stopLossPercent.value = aiSuggestion.stopLossPercent;
    elements.riskRatio.textContent = `R:R ${aiSuggestion.riskRewardRatio}:1`;
    updateProfitLossDisplay();
});

// Take Profit Price input - update percentage
elements.takeProfitPrice.addEventListener('input', (e) => {
    if (!currentSignal) return;
    
    const price = parseFloat(e.target.value);
    if (isNaN(price)) return;
    
    const entryPrice = currentSignal.price || currentSignal.currentPrice;
    const signalType = currentSignal.type || currentSignal.signal;
    
    const percent = riskManager.calculatePercentFromPrice(
        entryPrice,
        price,
        signalType
    );
    
    elements.takeProfitPercent.value = Math.abs(percent).toFixed(2);
    updateProfitLossDisplay();
});

// Take Profit Percentage input - update price
elements.takeProfitPercent.addEventListener('input', (e) => {
    if (!currentSignal) return;
    
    const percent = parseFloat(e.target.value);
    if (isNaN(percent)) return;
    
    const entryPrice = currentSignal.price || currentSignal.currentPrice;
    const signalType = currentSignal.type || currentSignal.signal;
    
    const price = riskManager.calculatePriceFromPercent(
        entryPrice,
        percent,
        signalType
    );
    
    elements.takeProfitPrice.value = price.toFixed(2);
    updateProfitLossDisplay();
});

// Stop Loss Price input - update percentage
elements.stopLossPrice.addEventListener('input', (e) => {
    if (!currentSignal) return;
    
    const price = parseFloat(e.target.value);
    if (isNaN(price)) return;
    
    const entryPrice = currentSignal.price || currentSignal.currentPrice;
    const signalType = currentSignal.type || currentSignal.signal;
    
    const percent = riskManager.calculatePercentFromPrice(
        entryPrice,
        price,
        signalType
    );
    
    elements.stopLossPercent.value = Math.abs(percent).toFixed(2);
    updateProfitLossDisplay();
});

// Stop Loss Percentage input - update price
elements.stopLossPercent.addEventListener('input', (e) => {
    if (!currentSignal) return;
    
    const percent = parseFloat(e.target.value);
    if (isNaN(percent)) return;
    
    const entryPrice = currentSignal.price || currentSignal.currentPrice;
    const signalType = currentSignal.type || currentSignal.signal;
    
    const price = riskManager.calculatePriceFromPercent(
        entryPrice,
        -percent, // Negative for stop loss
        signalType
    );
    
    elements.stopLossPrice.value = price.toFixed(2);
    updateProfitLossDisplay();
});

/**
 * Update faucet status
 */
function updateFaucetStatus() {
    const info = lineraManager.getWalletInfo();
    
    if (!info.chainId) {
        elements.btnClaimFaucet.disabled = true;
        elements.faucetStatusText.textContent = 'Connect wallet first';
        return;
    }

    const { canClaim, remainingTime } = faucetManager.canClaim(info.owner);
    
    if (canClaim) {
        elements.btnClaimFaucet.disabled = false;
        elements.faucetStatusText.textContent = 'Ready to claim';
        elements.faucetStatus.querySelector('.status-dot').className = 'status-dot ready';
        elements.faucetCooldownContainer.style.display = 'none';
    } else {
        elements.btnClaimFaucet.disabled = true;
        elements.faucetStatusText.textContent = 'Cooldown active';
        elements.faucetStatus.querySelector('.status-dot').className = 'status-dot cooldown';
        elements.faucetCooldownContainer.style.display = 'flex';
        elements.faucetCooldown.textContent = faucetManager.formatRemainingTime(remainingTime);
        
        // Update countdown every second
        if (window.faucetCountdownInterval) {
            clearInterval(window.faucetCountdownInterval);
        }
        
        window.faucetCountdownInterval = setInterval(() => {
            const { canClaim: nowCanClaim, remainingTime: nowRemaining } = faucetManager.canClaim(info.owner);
            
            if (nowCanClaim) {
                updateFaucetStatus();
                clearInterval(window.faucetCountdownInterval);
            } else {
                elements.faucetCooldown.textContent = faucetManager.formatRemainingTime(nowRemaining);
            }
        }, 1000);
    }
}

/**
 * Claim faucet tokens
 */
async function claimFaucetTokens() {
    const info = lineraManager.getWalletInfo();
    
    if (!info.chainId) {
        alert('Please connect wallet first');
        return;
    }

    // Update UI to claiming state
    elements.btnClaimFaucet.disabled = true;
    elements.btnClaimFaucet.querySelector('.btn-text').textContent = 'Claiming...';
    elements.faucetStatusText.textContent = 'Processing...';
    elements.faucetStatus.querySelector('.status-dot').className = 'status-dot claiming';
    elements.faucetMessage.style.display = 'none';

    try {
        const result = await faucetManager.claimTokens(info.owner, info.chainId);
        
        // Success!
        elements.faucetMessage.textContent = result.message;
        elements.faucetMessage.className = 'faucet-message success';
        elements.faucetMessage.style.display = 'block';
        
        // Update status
        updateFaucetStatus();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            elements.faucetMessage.style.display = 'none';
        }, 5000);
        
        console.log('✅ Faucet claim successful:', result);
        
        // Update blockchain balance
        updateBlockchainBalance(result.amount);
        
        // Refresh portfolio to show new balance
        await updatePortfolioStats();
        
    } catch (error) {
        // Error
        elements.faucetMessage.textContent = error.message;
        elements.faucetMessage.className = 'faucet-message error';
        elements.faucetMessage.style.display = 'block';
        
        elements.btnClaimFaucet.disabled = false;
        elements.btnClaimFaucet.querySelector('.btn-text').textContent = 'Claim Test Tokens';
        
        console.error('❌ Faucet claim failed:', error);
        
        // Hide message after 5 seconds
        setTimeout(() => {
            elements.faucetMessage.style.display = 'none';
        }, 5000);
    }
}

// Faucet event listener
elements.btnClaimFaucet.addEventListener('click', claimFaucetTokens);

/**
 * Update trade amount display
 */
function updateTradeAmount() {
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    elements.tradePercentage.textContent = tradePercentage;
    elements.tradeAmountUsd.textContent = `$${tradeAmount.toFixed(0)}`;
    
    // Update button text if signal exists
    if (currentSignal) {
        elements.btnExecute.textContent = `Execute ${currentSignal.signal} ${currentSignal.coin} (${tradePercentage}%)`;
    }
}

// Override original generateSignal to use enhanced version
elements.btnSignal.removeEventListener('click', generateSignal);
elements.btnSignal.addEventListener('click', generateSignalEnhanced);

// Initialize portfolio display immediately with 0 values
updateTradeAmount(); // Show $0 trade amount initially

// Update signal button state based on cooldown
function updateSignalButtonState() {
    if (!signalCooldown.canGenerate(selectedCoin)) {
        const remaining = signalCooldown.getRemainingTimeFormatted(selectedCoin);
        elements.btnSignal.disabled = true;
        elements.btnSignal.textContent = `Next signal in: ${remaining}`;
    } else {
        elements.btnSignal.disabled = false;
        elements.btnSignal.textContent = 'Generate Signal';
    }
}

// Update button state every second
setInterval(updateSignalButtonState, 1000);
updateSignalButtonState(); // Initial update

// Auto-load market data on init
setTimeout(() => {
    updateMarketData();
    updatePortfolioStats();
    updateAIExplainerLink(); // Set initial AI Explainer link
}, 2000);

// Auto-update market data every 30 seconds
setInterval(updateMarketData, 30000);


/**
 * Update profit/loss display for risk management
 */
function updateProfitLossDisplay() {
    console.log('💰 updateProfitLossDisplay called');
    
    if (!currentSignal) {
        console.log('⚠️ updateProfitLossDisplay: No current signal');
        return;
    }
    
    // Ensure portfolio has valid value
    const portfolioValue = portfolio.totalValue || 0;
    console.log('💰 Portfolio Value:', portfolioValue);
    
    if (portfolioValue === 0) {
        console.warn('⚠️ updateProfitLossDisplay: Portfolio value is 0');
        elements.tpProfit.textContent = '$0.00';
        elements.slLoss.textContent = '$0.00';
        return;
    }
    
    const tradeAmount = (portfolioValue * tradePercentage) / 100;
    const entryPrice = currentSignal.price || currentSignal.currentPrice;
    const signalType = currentSignal.type || currentSignal.signal;
    const tpPrice = parseFloat(elements.takeProfitPrice.value);
    const slPrice = parseFloat(elements.stopLossPrice.value);
    
    console.log('💰 Risk Display Update:', {
        portfolioValue,
        tradePercentage,
        tradeAmount,
        entryPrice,
        signalType,
        tpPrice,
        slPrice
    });
    
    // Calculate coin amount from USD
    const coinAmount = tradeAmount / entryPrice;
    
    // Update Take Profit display
    if (!isNaN(tpPrice) && tpPrice > 0) {
        const tpProfit = riskManager.calculateProfitLoss(
            entryPrice,
            tpPrice,
            coinAmount,
            signalType
        );
        elements.tpProfit.textContent = `+$${Math.abs(tpProfit).toFixed(2)}`;
    }
    
    // Update Stop Loss display
    if (!isNaN(slPrice) && slPrice > 0) {
        const slLoss = riskManager.calculateProfitLoss(
            entryPrice,
            slPrice,
            coinAmount,
            signalType
        );
        elements.slLoss.textContent = `-$${Math.abs(slLoss).toFixed(2)}`;
    }
    
    // Update risk/reward ratio
    if (!isNaN(tpPrice) && !isNaN(slPrice) && tpPrice > 0 && slPrice > 0) {
        const reward = Math.abs(tpPrice - entryPrice);
        const risk = Math.abs(entryPrice - slPrice);
        if (risk > 0) {
            const ratio = (reward / risk).toFixed(2);
            elements.riskRatio.textContent = `R:R ${ratio}:1`;
        }
    }
}


// ============================================
// Risk Management Integration


// ============================================
// Risk Management Integration - Override Functions
// ============================================

// Override generateSignalEnhanced with risk management
const _originalGenerateSignal = generateSignalEnhanced;
generateSignalEnhanced = function() {
    const info = lineraManager.getWalletInfo();
    
    if (!info.chainId) {
        alert('Please create a wallet first');
        return;
    }
    
    // Check cooldown (15 minutes)
    if (!signalCooldown.canGenerate(selectedCoin)) {
        const remaining = signalCooldown.getRemainingTimeFormatted(selectedCoin);
        alert(`⏱️ Please wait ${remaining} before generating a new signal for ${selectedCoin}\n\nSignals update every 15 minutes for accuracy.`);
        return;
    }
    
    updateStatus(elements.globalStatus, `🧠 AI analyzing ${selectedCoin}...`, 'info');
    
    // Get current price
    const currentPrice = marketManager.getPrice(selectedCoin);
    if (!currentPrice) {
        alert('Market data not available. Please update prices first.');
        return;
    }
    
    // Generate REAL AI signal using technical analysis
    const generatedSignal = generateRealSignal(selectedCoin, currentPrice, aiExplainer, info);
    currentSignal = generatedSignal;
    activeSignal = generatedSignal; // Set as active signal
    const signal = currentSignal.signal;
    const confidence = currentSignal.confidence;
    const riskScore = currentSignal.riskScore;
    const targetPrice = currentSignal.targetPrice;
    
    // Save signal with cooldown
    signalCooldown.saveSignal(selectedCoin, currentSignal);
    
    // Update UI
    elements.currentSignal.className = `signal signal-${signal.toLowerCase()}`;
    elements.signalAction.innerHTML = `${signal} <span class="coin-badge">${selectedCoin}</span>`;
    elements.signalConfidence.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceText.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceBar.style.width = `${confidence * 100}%`;
    elements.riskText.textContent = `${riskScore}/100`;
    elements.riskBar.style.width = `${riskScore}%`;
    elements.targetPrice.textContent = `$${targetPrice.toFixed(2)}`;
    
    // Enable execute button with percentage
    elements.btnExecute.disabled = false;
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    elements.btnExecute.textContent = `Execute ${signal} ${selectedCoin} (${tradePercentage}% - $${tradeAmount.toFixed(0)})`;
    
    // Show risk management section
    console.log('🎯 Showing Risk Management section');
    elements.riskManagement.style.display = 'block';
    console.log('🎯 Risk Management display:', elements.riskManagement.style.display);
    
    // Calculate and populate AI suggestions for stop loss and take profit
    const aiSuggestion = riskManager.calculateAISuggestion(
        currentPrice,
        confidence,
        signal
    );
    
    // Populate fields with AI suggestions
    elements.takeProfitPrice.value = aiSuggestion.takeProfit;
    elements.takeProfitPercent.value = aiSuggestion.takeProfitPercent;
    elements.stopLossPrice.value = aiSuggestion.stopLoss;
    elements.stopLossPercent.value = aiSuggestion.stopLossPercent;
    elements.riskRatio.textContent = `R:R ${aiSuggestion.riskRewardRatio}:1`;
    
    // Update profit/loss display
    updateProfitLossDisplay();
    
    updateStatus(elements.globalStatus, `✅ AI Signal: ${signal} ${selectedCoin} | TP: +${aiSuggestion.takeProfitPercent}% | SL: -${aiSuggestion.stopLossPercent}%`, 'success');
    console.log('🧠 Signal generated with REAL ANALYSIS:', currentSignal);
    if (currentSignal.analysis) {
        console.log('📊 RSI:', currentSignal.analysis.rsi);
        console.log('📈 MACD:', currentSignal.analysis.macd);
        console.log('📉 MA:', currentSignal.analysis.ma);
        console.log('📊 BB:', currentSignal.analysis.bb);
        console.log('💡 Reasoning:', currentSignal.analysis.reasoning);
    }
    console.log('🎯 Risk Management:', aiSuggestion);
};

// Override executeAITrade with risk management
const _originalExecuteTrade = executeAITrade;
executeAITrade = function() {
    if (!currentSignal) {
        alert('Please generate a signal first');
        return;
    }
    
    // Get stop loss and take profit values
    const takeProfit = parseFloat(elements.takeProfitPrice.value);
    const stopLoss = parseFloat(elements.stopLossPrice.value);
    
    // Validate risk management
    const validation = riskManager.validate(
        currentSignal.price,
        stopLoss,
        takeProfit,
        currentSignal.type
    );
    
    if (!validation.valid) {
        updateStatus(elements.globalStatus, `❌ ${validation.errors.join(', ')}`, 'error');
        return;
    }
    
    // Calculate trade amount based on percentage
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    
    updateStatus(elements.globalStatus, `⚡ Executing ${tradePercentage}% trade ($${tradeAmount.toFixed(0)})...`, 'info');
    
    // Create trade record
    const trade = {
        id: Date.now(),
        coin: currentSignal.coin,
        type: currentSignal.signal,
        amount: tradeAmount,
        percentage: tradePercentage,
        price: currentSignal.price,
        takeProfit: takeProfit,
        stopLoss: stopLoss,
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
    
    // Add trade to risk manager for monitoring
    const monitoredTrade = riskManager.addTrade({
        pair: `${trade.coin}/USD`,
        signalType: currentSignal.type,
        entryPrice: currentSignal.price,
        takeProfit,
        stopLoss,
        amount: tradeAmount / currentSignal.price, // Convert USD to coin amount
        amountUSD: tradeAmount,
        percentage: tradePercentage,
        onClose: async (closedTrade) => {
            // Handle trade closure
            console.log('📊 Trade auto-closed:', closedTrade);
            
            // Update balance based on P&L
            const lineraAmount = closedTrade.pnl / LINERA_TO_USD;
            updateBlockchainBalance(lineraAmount);
            
            // Refresh portfolio
            await updatePortfolioStats();
            
            // Show notification
            const message = closedTrade.closeReason === 'take_profit'
                ? `🎯 Take Profit Hit! Profit: +$${closedTrade.pnl.toFixed(2)}`
                : closedTrade.closeReason === 'stop_loss'
                ? `🛡️ Stop Loss Hit! Loss: -$${Math.abs(closedTrade.pnl).toFixed(2)}`
                : `✋ Trade Closed Manually! P&L: ${closedTrade.pnl >= 0 ? '+' : ''}$${closedTrade.pnl.toFixed(2)}`;
            
            updateStatus(elements.globalStatus, message, 
                closedTrade.pnl > 0 ? 'success' : 'error');
            
            // Update history
            updateHistoryEnhanced();
        }
    });
    
    console.log('📊 Trade added to monitoring:', monitoredTrade);
    
    // Update displays
    updateHistoryEnhanced();
    updatePortfolioStats();
    
    updateStatus(elements.globalStatus, `✅ Trade executed: ${trade.type} ${trade.coin} (${tradePercentage}% - $${tradeAmount.toFixed(0)}) | Monitoring active`, 'success');
    console.log('⚡ Trade executed:', trade);
    
    // Clear active signal after execution
    // Signal cleared (stored per-coin in signalCooldown)
    activeSignal = null;
    currentSignal = null;
    
    // Hide risk management section
    elements.riskManagement.style.display = 'none';
    
    // Update visual indicators (remove highlight)
    updateCoinButtonIndicators();
    
    // Disable execute button until new signal
    elements.btnExecute.disabled = true;
    
    // Hide risk management section
    elements.riskManagement.style.display = 'none';
};

console.log('✅ Risk Management Integration loaded');


// ============================================
// Wallet Management - Mnemonic, Export, Import
// ============================================

/**
 * Show mnemonic backup modal
 */
function showMnemonicModal() {
    const mnemonic = walletManager.getMnemonic();
    
    if (!mnemonic) {
        alert('No mnemonic found');
        return;
    }
    
    // Split mnemonic into words
    const words = mnemonic.split(' ');
    
    // Create mnemonic grid
    const mnemonicGrid = document.createElement('div');
    mnemonicGrid.className = 'mnemonic-grid';
    
    words.forEach((word, index) => {
        const wordElement = document.createElement('div');
        wordElement.className = 'mnemonic-word';
        wordElement.innerHTML = `
            <span class="mnemonic-word-number">${index + 1}.</span>
            <span class="mnemonic-word-text">${word}</span>
        `;
        mnemonicGrid.appendChild(wordElement);
    });
    
    elements.mnemonicWords.innerHTML = '';
    elements.mnemonicWords.appendChild(mnemonicGrid);
    
    // Reset checkbox
    elements.mnemonicConfirmed.checked = false;
    elements.mnemonicContinueBtn.disabled = true;
    
    // Show modal
    elements.mnemonicModalOverlay.classList.remove('hidden');
}

/**
 * Hide mnemonic modal
 */
function hideMnemonicModal() {
    elements.mnemonicModalOverlay.classList.add('hidden');
}

/**
 * Copy mnemonic to clipboard
 */
async function copyMnemonic() {
    const mnemonic = walletManager.getMnemonic();
    
    if (!mnemonic) {
        alert('No mnemonic found');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(mnemonic);
        elements.mnemonicCopyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            elements.mnemonicCopyBtn.textContent = '📋 Copy to Clipboard';
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        alert('Failed to copy to clipboard');
    }
}

/**
 * Show export wallet modal
 */
function showExportModal() {
    elements.exportPassword.value = '';
    elements.exportPasswordConfirm.value = '';
    elements.exportMessage.style.display = 'none';
    elements.exportModalOverlay.classList.remove('hidden');
}

/**
 * Hide export modal
 */
function hideExportModal() {
    elements.exportModalOverlay.classList.add('hidden');
}

/**
 * Export wallet
 */
async function exportWallet() {
    const password = elements.exportPassword.value;
    const confirmPassword = elements.exportPasswordConfirm.value;
    
    // Validate
    if (!password) {
        elements.exportMessage.textContent = 'Please enter a password';
        elements.exportMessage.className = 'export-message error';
        elements.exportMessage.style.display = 'block';
        return;
    }
    
    if (password.length < 8) {
        elements.exportMessage.textContent = 'Password must be at least 8 characters';
        elements.exportMessage.className = 'export-message error';
        elements.exportMessage.style.display = 'block';
        return;
    }
    
    if (password !== confirmPassword) {
        elements.exportMessage.textContent = 'Passwords do not match';
        elements.exportMessage.className = 'export-message error';
        elements.exportMessage.style.display = 'block';
        return;
    }
    
    try {
        // Export wallet
        const exportData = await walletManager.exportWallet(password);
        
        // Download file
        const filename = walletManager.generateBackupFilename();
        walletManager.downloadFile(exportData, filename);
        
        // Show success
        elements.exportMessage.textContent = `✅ Wallet exported successfully as ${filename}`;
        elements.exportMessage.className = 'export-message success';
        elements.exportMessage.style.display = 'block';
        
        console.log('✅ Wallet exported:', filename);
        
        // Close modal after 2 seconds
        setTimeout(() => {
            hideExportModal();
        }, 2000);
        
    } catch (error) {
        console.error('Export failed:', error);
        elements.exportMessage.textContent = `❌ Export failed: ${error.message}`;
        elements.exportMessage.className = 'export-message error';
        elements.exportMessage.style.display = 'block';
    }
}

/**
 * Show import wallet modal
 */
function showImportModal() {
    elements.importFile.value = '';
    elements.importPassword.value = '';
    elements.importMessage.style.display = 'none';
    elements.importModalOverlay.classList.remove('hidden');
}

/**
 * Hide import modal
 */
function hideImportModal() {
    elements.importModalOverlay.classList.add('hidden');
}

/**
 * Import wallet
 */
async function importWallet() {
    const file = elements.importFile.files[0];
    const password = elements.importPassword.value;
    
    // Validate
    if (!file) {
        elements.importMessage.textContent = 'Please select a backup file';
        elements.importMessage.className = 'import-message error';
        elements.importMessage.style.display = 'block';
        return;
    }
    
    if (!password) {
        elements.importMessage.textContent = 'Please enter the backup password';
        elements.importMessage.className = 'import-message error';
        elements.importMessage.style.display = 'block';
        return;
    }
    
    try {
        // Read file
        const fileContent = await file.text();
        
        // Import wallet
        const walletData = await walletManager.importWallet(fileContent, password);
        
        // Show success
        elements.importMessage.textContent = '✅ Wallet imported successfully! Reloading...';
        elements.importMessage.className = 'import-message success';
        elements.importMessage.style.display = 'block';
        
        console.log('✅ Wallet imported:', walletData);
        
        // Verify data is saved to localStorage
        const savedMnemonic = localStorage.getItem('linera_mnemonic');
        const savedChainId = localStorage.getItem('linera_chain_id');
        const savedOwner = localStorage.getItem('linera_owner');
        
        console.log('🔍 Verifying saved data:');
        console.log('   Mnemonic:', savedMnemonic ? 'Found' : 'Missing');
        console.log('   Chain ID:', savedChainId);
        console.log('   Owner:', savedOwner);
        
        if (!savedMnemonic || !savedChainId || !savedOwner) {
            throw new Error('Failed to save wallet data to localStorage');
        }
        
        // Wait a bit longer to ensure localStorage is fully written
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Reload page to initialize with new wallet
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
    } catch (error) {
        console.error('Import failed:', error);
        elements.importMessage.textContent = `❌ Import failed: ${error.message}`;
        elements.importMessage.className = 'import-message error';
        elements.importMessage.style.display = 'block';
    }
}

// Mnemonic modal event listeners
elements.mnemonicModalClose.addEventListener('click', hideMnemonicModal);
elements.mnemonicModalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.mnemonicModalOverlay) {
        hideMnemonicModal();
    }
});
elements.mnemonicConfirmed.addEventListener('change', (e) => {
    elements.mnemonicContinueBtn.disabled = !e.target.checked;
});
elements.mnemonicCopyBtn.addEventListener('click', copyMnemonic);
elements.mnemonicContinueBtn.addEventListener('click', hideMnemonicModal);

// Export modal event listeners
elements.dropdownExportWallet.addEventListener('click', () => {
    hideDropdown();
    showExportModal();
});
elements.exportModalClose.addEventListener('click', hideExportModal);
elements.exportModalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.exportModalOverlay) {
        hideExportModal();
    }
});
elements.exportCancelBtn.addEventListener('click', hideExportModal);
elements.exportConfirmBtn.addEventListener('click', exportWallet);

// Import modal event listeners
elements.dropdownImportWallet.addEventListener('click', () => {
    hideDropdown();
    showImportModal();
});
elements.dropdownImportWalletNotConnected.addEventListener('click', () => {
    hideDropdown();
    showImportModal();
});
elements.importModalClose.addEventListener('click', hideImportModal);
elements.importModalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.importModalOverlay) {
        hideImportModal();
    }
});
elements.importCancelBtn.addEventListener('click', hideImportModal);
elements.importConfirmBtn.addEventListener('click', importWallet);
