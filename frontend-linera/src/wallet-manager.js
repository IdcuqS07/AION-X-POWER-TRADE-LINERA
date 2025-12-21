/**
 * Wallet Manager Module
 * Handles wallet backup, export, import, and mnemonic management
 */

export class WalletManager {
    constructor() {
        this.STORAGE_KEY_MNEMONIC = 'linera_mnemonic';
        this.STORAGE_KEY_CHAIN_ID = 'linera_chain_id';
        this.STORAGE_KEY_OWNER = 'linera_owner';
    }

    /**
     * Get mnemonic from localStorage
     */
    getMnemonic() {
        return localStorage.getItem(this.STORAGE_KEY_MNEMONIC);
    }

    /**
     * Simple encryption using base64 and XOR (for demo purposes)
     * In production, use proper encryption library like crypto-js
     */
    encrypt(text, password) {
        const textBytes = new TextEncoder().encode(text);
        const passwordBytes = new TextEncoder().encode(password);
        
        const encrypted = new Uint8Array(textBytes.length);
        for (let i = 0; i < textBytes.length; i++) {
            encrypted[i] = textBytes[i] ^ passwordBytes[i % passwordBytes.length];
        }
        
        return btoa(String.fromCharCode(...encrypted));
    }

    /**
     * Simple decryption
     */
    decrypt(encryptedText, password) {
        try {
            const encrypted = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
            const passwordBytes = new TextEncoder().encode(password);
            
            const decrypted = new Uint8Array(encrypted.length);
            for (let i = 0; i < encrypted.length; i++) {
                decrypted[i] = encrypted[i] ^ passwordBytes[i % passwordBytes.length];
            }
            
            return new TextDecoder().decode(decrypted);
        } catch (error) {
            throw new Error('Invalid password or corrupted file');
        }
    }

    /**
     * Export wallet to encrypted JSON file
     */
    async exportWallet(password) {
        const mnemonic = this.getMnemonic();
        const chainId = localStorage.getItem(this.STORAGE_KEY_CHAIN_ID);
        const owner = localStorage.getItem(this.STORAGE_KEY_OWNER);
        
        if (!mnemonic || !chainId || !owner) {
            throw new Error('No wallet found to export');
        }

        // Get balance
        const balanceKey = `lineraBalance_${owner}`;
        const balance = localStorage.getItem(balanceKey) || '0';

        const walletData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            mnemonic,
            chainId,
            owner,
            balance
        };

        const jsonString = JSON.stringify(walletData);
        const encrypted = this.encrypt(jsonString, password);

        const exportData = {
            version: '1.0',
            app: 'AI Power Trade',
            encrypted: encrypted,
            timestamp: new Date().toISOString()
        };

        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Import wallet from encrypted JSON file
     */
    async importWallet(fileContent, password) {
        try {
            const importData = JSON.parse(fileContent);
            
            if (!importData.encrypted) {
                throw new Error('Invalid backup file format');
            }

            const decrypted = this.decrypt(importData.encrypted, password);
            const walletData = JSON.parse(decrypted);

            if (!walletData.mnemonic || !walletData.chainId || !walletData.owner) {
                throw new Error('Invalid wallet data in backup file');
            }

            // Restore to localStorage
            localStorage.setItem(this.STORAGE_KEY_MNEMONIC, walletData.mnemonic);
            localStorage.setItem(this.STORAGE_KEY_CHAIN_ID, walletData.chainId);
            localStorage.setItem(this.STORAGE_KEY_OWNER, walletData.owner);

            // Restore balance
            const balanceKey = `lineraBalance_${walletData.owner}`;
            localStorage.setItem(balanceKey, walletData.balance || '0');

            return {
                chainId: walletData.chainId,
                owner: walletData.owner,
                balance: walletData.balance
            };
        } catch (error) {
            if (error.message.includes('password')) {
                throw error;
            }
            throw new Error('Failed to import wallet: ' + error.message);
        }
    }

    /**
     * Download file helper
     */
    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Generate filename for backup
     */
    generateBackupFilename() {
        const date = new Date().toISOString().split('T')[0];
        const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
        return `ai-power-trade-backup-${date}-${time}.json`;
    }
}

export default WalletManager;
