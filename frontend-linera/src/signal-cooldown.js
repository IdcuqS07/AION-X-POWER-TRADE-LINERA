/**
 * Signal Cooldown Manager
 * Manages signal generation cooldown (15 minutes per coin)
 */

export class SignalCooldownManager {
    constructor() {
        this.COOLDOWN_MINUTES = 15;
        this.COOLDOWN_MS = this.COOLDOWN_MINUTES * 60 * 1000;
        this.storageKey = 'signalCooldowns';
    }

    /**
     * Check if signal can be generated for a coin
     */
    canGenerate(coin) {
        const lastSignal = this.getLastSignal(coin);
        if (!lastSignal) return true;

        const now = Date.now();
        const elapsed = now - lastSignal.timestamp;
        return elapsed >= this.COOLDOWN_MS;
    }

    /**
     * Get remaining cooldown time in milliseconds
     */
    getRemainingTime(coin) {
        const lastSignal = this.getLastSignal(coin);
        if (!lastSignal) return 0;

        const now = Date.now();
        const elapsed = now - lastSignal.timestamp;
        const remaining = this.COOLDOWN_MS - elapsed;
        return Math.max(0, remaining);
    }

    /**
     * Get remaining time formatted as "14m 32s"
     */
    getRemainingTimeFormatted(coin) {
        const remaining = this.getRemainingTime(coin);
        if (remaining === 0) return null;

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }

    /**
     * Get signal age formatted as "3 minutes ago"
     */
    getSignalAge(coin) {
        const lastSignal = this.getLastSignal(coin);
        if (!lastSignal) return null;

        const now = Date.now();
        const elapsed = now - lastSignal.timestamp;
        const minutes = Math.floor(elapsed / 60000);
        
        if (minutes === 0) return 'Just now';
        if (minutes === 1) return '1 minute ago';
        return `${minutes} minutes ago`;
    }

    /**
     * Save signal with timestamp
     */
    saveSignal(coin, signalData) {
        const cooldowns = this.getAllCooldowns();
        cooldowns[coin] = {
            timestamp: Date.now(),
            signal: signalData
        };
        localStorage.setItem(this.storageKey, JSON.stringify(cooldowns));
        console.log(`✅ Signal saved for ${coin} with 15-min cooldown`);
    }

    /**
     * Get last signal for a coin
     */
    getLastSignal(coin) {
        const cooldowns = this.getAllCooldowns();
        return cooldowns[coin] || null;
    }

    /**
     * Get all cooldowns
     */
    getAllCooldowns() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error reading cooldowns:', error);
            return {};
        }
    }

    /**
     * Clear cooldown for a coin (for testing)
     */
    clearCooldown(coin) {
        const cooldowns = this.getAllCooldowns();
        delete cooldowns[coin];
        localStorage.setItem(this.storageKey, JSON.stringify(cooldowns));
        console.log(`🗑️ Cooldown cleared for ${coin}`);
    }

    /**
     * Clear all cooldowns (for testing)
     */
    clearAllCooldowns() {
        localStorage.removeItem(this.storageKey);
        console.log('🗑️ All cooldowns cleared');
    }
}

export default SignalCooldownManager;
