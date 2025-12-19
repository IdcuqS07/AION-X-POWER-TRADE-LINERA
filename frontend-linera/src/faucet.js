/**
 * Faucet Manager
 * Handles testnet token claims with rate limiting
 */

export class FaucetManager {
    constructor() {
        this.FAUCET_AMOUNT = 100; // 100 LINERA tokens
        this.COOLDOWN_HOURS = 24;
        this.API_ENDPOINT = '/api/faucet/claim'; // Will be implemented
    }

    /**
     * Check if user can claim
     */
    canClaim(walletAddress) {
        const lastClaim = localStorage.getItem(`faucet_claim_${walletAddress}`);
        
        if (!lastClaim) {
            return { canClaim: true, remainingTime: 0 };
        }

        const lastClaimTime = parseInt(lastClaim);
        const now = Date.now();
        const cooldownMs = this.COOLDOWN_HOURS * 60 * 60 * 1000;
        const elapsed = now - lastClaimTime;

        if (elapsed >= cooldownMs) {
            return { canClaim: true, remainingTime: 0 };
        }

        return {
            canClaim: false,
            remainingTime: cooldownMs - elapsed
        };
    }

    /**
     * Format remaining time
     */
    formatRemainingTime(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Claim tokens (simulated for now)
     */
    async claimTokens(walletAddress, chainId) {
        // Check if can claim
        const { canClaim, remainingTime } = this.canClaim(walletAddress);
        
        if (!canClaim) {
            throw new Error(`Please wait ${this.formatRemainingTime(remainingTime)} before claiming again`);
        }

        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // For now, simulate successful claim
                // In production, this would call real backend API
                
                const success = Math.random() > 0.1; // 90% success rate
                
                if (success) {
                    // Record claim time
                    localStorage.setItem(`faucet_claim_${walletAddress}`, Date.now().toString());
                    
                    resolve({
                        success: true,
                        amount: this.FAUCET_AMOUNT,
                        txHash: '0x' + Math.random().toString(16).substring(2, 66),
                        message: `Successfully claimed ${this.FAUCET_AMOUNT} LINERA tokens!`
                    });
                } else {
                    reject(new Error('Faucet temporarily unavailable. Please try again later.'));
                }
            }, 2000); // Simulate network delay
        });
    }

    /**
     * Get claim history
     */
    getClaimHistory(walletAddress) {
        const lastClaim = localStorage.getItem(`faucet_claim_${walletAddress}`);
        
        if (!lastClaim) {
            return null;
        }

        return {
            timestamp: parseInt(lastClaim),
            date: new Date(parseInt(lastClaim)).toLocaleString()
        };
    }

    /**
     * Reset claim (for testing)
     */
    resetClaim(walletAddress) {
        localStorage.removeItem(`faucet_claim_${walletAddress}`);
    }
}

export default FaucetManager;
