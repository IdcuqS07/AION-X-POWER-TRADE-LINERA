import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class FaucetService {
    constructor(database) {
        this.db = database;
        this.FAUCET_AMOUNT = parseFloat(process.env.FAUCET_AMOUNT) || 100;
        this.COOLDOWN_MS = (parseInt(process.env.COOLDOWN_HOURS) || 24) * 60 * 60 * 1000;
        this.MAX_CLAIMS_PER_DAY = parseInt(process.env.MAX_CLAIMS_PER_DAY) || 100;
    }

    /**
     * Get faucet info
     */
    async getInfo() {
        const totalClaims = this.db.getTotalClaims();
        const totalDistributed = this.db.getTotalDistributed();
        const uniqueClaimers = this.db.getUniqueClaimers();
        const recentClaims = this.db.getRecentClaims(24);

        return {
            amount: this.FAUCET_AMOUNT,
            cooldownHours: this.COOLDOWN_MS / (60 * 60 * 1000),
            stats: {
                totalClaims,
                totalDistributed,
                uniqueClaimers,
                recentClaims
            }
        };
    }

    /**
     * Check if address can claim
     */
    async checkEligibility(address) {
        const lastClaim = this.db.getLastClaim(address);

        if (!lastClaim) {
            return {
                canClaim: true,
                remainingTime: 0,
                nextClaimAt: null
            };
        }

        const elapsed = Date.now() - lastClaim.claimed_at;
        const remaining = this.COOLDOWN_MS - elapsed;

        if (remaining <= 0) {
            return {
                canClaim: true,
                remainingTime: 0,
                nextClaimAt: null
            };
        }

        return {
            canClaim: false,
            remainingTime: remaining,
            nextClaimAt: new Date(lastClaim.claimed_at + this.COOLDOWN_MS).toISOString(),
            lastClaimAt: new Date(lastClaim.claimed_at).toISOString()
        };
    }

    /**
     * Process token claim
     */
    async processClaim(address, chainId, ipAddress) {
        // Check daily limit
        const recentClaims = this.db.getRecentClaims(24);
        if (recentClaims >= this.MAX_CLAIMS_PER_DAY) {
            throw new Error('Daily claim limit reached. Please try again tomorrow.');
        }

        // Transfer tokens using Linera CLI
        const txHash = await this.transferTokens(address, chainId, this.FAUCET_AMOUNT);

        // Record claim
        this.db.recordClaim(address, chainId, this.FAUCET_AMOUNT, txHash, ipAddress);

        return {
            amount: this.FAUCET_AMOUNT,
            txHash,
            nextClaimAt: new Date(Date.now() + this.COOLDOWN_MS).toISOString()
        };
    }

    /**
     * Transfer tokens via Linera CLI
     */
    async transferTokens(toAddress, toChainId, amount) {
        try {
            // For now, simulate the transfer
            // In production, this would call actual Linera CLI commands
            
            // Example Linera CLI command (commented for now):
            /*
            const command = `linera transfer \\
                --from ${process.env.FAUCET_CHAIN_ID} \\
                --to ${toChainId} \\
                --amount ${amount}`;
            
            const { stdout, stderr } = await execAsync(command);
            
            if (stderr) {
                throw new Error(`Transfer failed: ${stderr}`);
            }
            
            // Parse transaction hash from output
            const txHash = this.parseTxHash(stdout);
            return txHash;
            */

            // Simulated for demo
            console.log(`💸 Transferring ${amount} LINERA to ${toAddress} on chain ${toChainId}`);
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Generate mock transaction hash
            const txHash = '0x' + Array.from({ length: 64 }, () => 
                Math.floor(Math.random() * 16).toString(16)
            ).join('');

            console.log(`✅ Transfer successful: ${txHash}`);
            return txHash;

        } catch (error) {
            console.error('Transfer error:', error);
            throw new Error('Failed to transfer tokens: ' + error.message);
        }
    }

    /**
     * Parse transaction hash from Linera CLI output
     */
    parseTxHash(output) {
        // Parse the transaction hash from CLI output
        // This depends on Linera CLI output format
        const match = output.match(/transaction[:\s]+([0-9a-fx]+)/i);
        return match ? match[1] : 'unknown';
    }

    /**
     * Get claim history for address
     */
    async getClaimHistory(address) {
        return this.db.getClaimHistory(address);
    }

    /**
     * Get faucet statistics
     */
    async getStats() {
        return {
            totalClaims: this.db.getTotalClaims(),
            totalDistributed: this.db.getTotalDistributed(),
            uniqueClaimers: this.db.getUniqueClaimers(),
            recentClaims24h: this.db.getRecentClaims(24),
            recentClaims7d: this.db.getRecentClaims(24 * 7),
            faucetAmount: this.FAUCET_AMOUNT,
            cooldownHours: this.COOLDOWN_MS / (60 * 60 * 1000)
        };
    }
}
