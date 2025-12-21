#!/usr/bin/env node

/**
 * Script to apply signal persistence patch to main.js
 * Run: node apply-signal-persistence.js
 */

const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, 'frontend-linera/src/main.js');

console.log('📝 Applying Signal Persistence Patch...\n');

// Read main.js
let content = fs.readFileSync(mainJsPath, 'utf8');

// 1. Add import
if (!content.includes('SignalPersistenceManager')) {
    console.log('✅ Adding SignalPersistenceManager import...');
    content = content.replace(
        "import WalletManager from './wallet-manager.js';",
        "import WalletManager from './wallet-manager.js';\nimport SignalPersistenceManager from './signal-persistence.js';"
    );
}

// 2. Initialize manager
if (!content.includes('signalPersistence = new SignalPersistenceManager')) {
    console.log('✅ Initializing SignalPersistenceManager...');
    content = content.replace(
        'const walletManager = new WalletManager();',
        'const walletManager = new WalletManager();\nconst signalPersistence = new SignalPersistenceManager();'
    );
}

// 3. Update generateSignalEnhanced - save to persistence
console.log('✅ Updating generateSignalEnhanced to use persistence...');
content = content.replace(
    /currentSignal = generateRealSignal\(selectedCoin, currentPrice, aiExplainer, info\);/g,
    `const generatedSignal = generateRealSignal(selectedCoin, currentPrice, aiExplainer, info);
    currentSignal = generatedSignal;
    activeSignal = signalPersistence.saveActiveSignal(generatedSignal, selectedCoin);`
);

// 4. Update UI to use coin badge
console.log('✅ Adding coin badge to signal display...');
content = content.replace(
    /elements\.signalAction\.textContent = `\$\{signal\} \$\{selectedCoin\}`;/g,
    "elements.signalAction.innerHTML = `${signal} <span class=\"coin-badge\">${selectedCoin}</span>`;"
);

// 5. Update selectCoin to check for active signal
if (!content.includes('Check if there\'s an active signal')) {
    console.log('✅ Updating selectCoin to maintain signal...');
    const selectCoinPattern = /console\.log\('💰 Selected coin:', coin\);/;
    content = content.replace(
        selectCoinPattern,
        `console.log('💰 Selected coin:', coin);
    
    // Check if there's an active signal (persistent across coin changes)
    const persistedSignal = signalPersistence.getActiveSignal();
    if (persistedSignal) {
        console.log('📊 Active signal exists for:', persistedSignal.coin);
        // Keep showing the active signal even if different coin selected
        displayActiveSignal();
    }`
    );
}

// 6. Update displayActiveSignal to use signalPersistence
console.log('✅ Updating displayActiveSignal to use persistence manager...');
content = content.replace(
    /if \(!activeSignal\) \{[\s\S]*?return;[\s\S]*?\}/,
    `const persistedSignal = signalPersistence.getActiveSignal();
    if (!persistedSignal) {
        console.log('⚠️ No active signal to display');
        elements.riskManagement.style.display = 'none';
        elements.btnExecute.disabled = true;
        return;
    }
    
    activeSignal = persistedSignal;`
);

// Write back
fs.writeFileSync(mainJsPath, content, 'utf8');

console.log('\n✅ Signal Persistence Patch Applied Successfully!\n');
console.log('Next steps:');
console.log('1. cd frontend-linera');
console.log('2. npm run dev');
console.log('3. Test signal persistence by:');
console.log('   - Generate signal for ETH');
console.log('   - Switch to BTC');
console.log('   - Verify signal still shows with ETH badge\n');
