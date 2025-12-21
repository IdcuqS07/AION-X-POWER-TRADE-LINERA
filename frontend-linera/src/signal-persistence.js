/**
 * Signal Persistence Manager
 * Manages persistent signal display across coin changes
 */

export class SignalPersistenceManager {
    constructor() {
        this.activeSignal = null;
        this.SIGNAL_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
    }

    /**
     * Save active signal (persists across coin changes)
     */
    saveActiveSignal(signalData, coin) {
        this.activeSignal = {
            ...signalData,
            coin: coin,
            timestamp: Date.now()
        };
        console.log(`✅ Active signal saved for ${coin}`);
        return this.activeSignal;
    }

    /**
     * Get active signal if still valid
     */
    getActiveSignal() {
        if (!this.activeSignal) {
            return null;
        }

        // Check if signal expired
        const age = Date.now() - this.activeSignal.timestamp;
        if (age > this.SIGNAL_EXPIRY_MS) {
            console.log('⏱️ Active signal expired');
            this.activeSignal = null;
            return null;
        }

        return this.activeSignal;
    }

    /**
     * Check if there's a valid active signal
     */
    hasActiveSignal() {
        return this.getActiveSignal() !== null;
    }

    /**
     * Get signal age in minutes
     */
    getSignalAge() {
        if (!this.activeSignal) {
            return null;
        }

        const age = Date.now() - this.activeSignal.timestamp;
        return Math.floor(age / 60000);
    }

    /**
     * Get signal age formatted
     */
    getSignalAgeFormatted() {
        const minutes = this.getSignalAge();
        if (minutes === null) return null;
        if (minutes === 0) return 'Just now';
        if (minutes === 1) return '1 minute ago';
        return `${minutes} minutes ago`;
    }

    /**
     * Clear active signal
     */
    clearActiveSignal() {
        this.activeSignal = null;
        console.log('🗑️ Active signal cleared');
    }

    /**
     * Get remaining time until expiry
     */
    getRemainingTime() {
        if (!this.activeSignal) {
            return 0;
        }

        const age = Date.now() - this.activeSignal.timestamp;
        const remaining = this.SIGNAL_EXPIRY_MS - age;
        return Math.max(0, remaining);
    }

    /**
     * Get remaining time formatted
     */
    getRemainingTimeFormatted() {
        const remaining = this.getRemainingTime();
        if (remaining === 0) return null;

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }
}

export default SignalPersistenceManager;
