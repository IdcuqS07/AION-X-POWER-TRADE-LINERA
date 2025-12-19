import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DatabaseService {
    constructor() {
        const dbPath = join(__dirname, '..', 'faucet.db');
        this.db = new Database(dbPath);
        this.init();
    }

    init() {
        // Create claims table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS claims (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                address TEXT NOT NULL,
                chain_id TEXT NOT NULL,
                amount REAL NOT NULL,
                tx_hash TEXT,
                ip_address TEXT,
                claimed_at INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create index for faster lookups
        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_address ON claims(address);
            CREATE INDEX IF NOT EXISTS idx_claimed_at ON claims(claimed_at);
        `);

        console.log('✅ Database initialized');
    }

    // Record a claim
    recordClaim(address, chainId, amount, txHash, ipAddress) {
        const stmt = this.db.prepare(`
            INSERT INTO claims (address, chain_id, amount, tx_hash, ip_address, claimed_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        return stmt.run(
            address,
            chainId,
            amount,
            txHash,
            ipAddress,
            Date.now()
        );
    }

    // Get last claim for address
    getLastClaim(address) {
        const stmt = this.db.prepare(`
            SELECT * FROM claims
            WHERE address = ?
            ORDER BY claimed_at DESC
            LIMIT 1
        `);

        return stmt.get(address);
    }

    // Get claim history for address
    getClaimHistory(address, limit = 10) {
        const stmt = this.db.prepare(`
            SELECT * FROM claims
            WHERE address = ?
            ORDER BY claimed_at DESC
            LIMIT ?
        `);

        return stmt.all(address, limit);
    }

    // Get total claims count
    getTotalClaims() {
        const stmt = this.db.prepare('SELECT COUNT(*) as count FROM claims');
        return stmt.get().count;
    }

    // Get total amount distributed
    getTotalDistributed() {
        const stmt = this.db.prepare('SELECT SUM(amount) as total FROM claims');
        return stmt.get().total || 0;
    }

    // Get unique claimers count
    getUniqueClaimers() {
        const stmt = this.db.prepare('SELECT COUNT(DISTINCT address) as count FROM claims');
        return stmt.get().count;
    }

    // Get claims in last 24 hours
    getRecentClaims(hours = 24) {
        const since = Date.now() - (hours * 60 * 60 * 1000);
        const stmt = this.db.prepare(`
            SELECT COUNT(*) as count FROM claims
            WHERE claimed_at > ?
        `);
        return stmt.get(since).count;
    }

    // Close database
    close() {
        this.db.close();
        console.log('📦 Database closed');
    }
}
