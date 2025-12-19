/**
 * Faucet Manager
 * Handles testnet token claims with rate limiting
 */

export class FaucetManager {
    constructor() {
        this.FAUCET_AMOUNT = 100; // 100 LINERA tokens
        this.COOLDOWN_HOURS = 24;
        this.API_BASE = window.location.origin; // Same origin
        this.USE_REAL_API = true; // Set to true to use real backend
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
     * Claim tokens from backend API
     */
    async claimTokens(walletAddress, chainId) {
        if (this.USE_REAL_API) {
            return this.claimFromAPI(walletAddress, chainId);
        } else {
            return this.claimSimulated(walletAddress, chainId);
        }
    }

    /**
     * Claim from real backend API
     */
    async claimFromAPI(walletAddress, chainId) {
        try {
            const response = await fetch(`${this.API_BASE}/api/faucet/claim`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: walletAddress,
                    chainId: chainId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to claim tokens');
            }

            // Record claim time locally
            localStorage.setItem(`faucet_claim_${walletAddress}`, Date.now().toString());

            return {
                success: true,
                amount: data.amount,
                txHash: data.txHash,
                message: data.message
            };

        } catch (error) {
            throw new Error(error.message || 'Failed to connect to faucet service');
        }
    }

    /**
     * Simulated claim (fallback)
     */
    async claimSimulated(walletAddress, chainId) {
        // Check if can claim
        const { canClaim, remainingTime } = this.canClaim(walletAddress);
        
        if (!canClaim) {
            throw new Error(`Please wait ${this.formatRemainingTime(remainingTime)} before claiming again`);
        }

        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate
                
                if (success) {
                    // Record claim time
                    localStorage.setItem(`faucet_claim_${walletAddress}`, Date.now().toString());
                    
                    resolve({
                        success: true,
                        amount: this.FAUCET_AMOUNT,
                        txHash: '0x' + Math.random().toString(16).substring(2, 66),
                        message: `Successfully claimed ${this.FAUCET_AMOUNT} LINERA tokens! (Demo Mode)`
                    });
                } else {
                    reject(new Error('Faucet temporarily unavailable. Please try again later.'));
                }
            }, 2000);
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
