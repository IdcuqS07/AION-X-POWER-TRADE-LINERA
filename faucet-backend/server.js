import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { FaucetService } from './services/faucet.js';
import { DatabaseService } from './services/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize services
const db = new DatabaseService();
const faucet = new FaucetService(db);

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
app.use(express.json());

// Rate limiting - 5 requests per minute per IP
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: 'Too many requests, please try again later' }
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Linera Faucet API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Get faucet info
app.get('/api/faucet/info', async (req, res) => {
    try {
        const info = await faucet.getInfo();
        res.json(info);
    } catch (error) {
        console.error('Error getting faucet info:', error);
        res.status(500).json({ error: 'Failed to get faucet info' });
    }
});

// Check claim eligibility
app.post('/api/faucet/check', async (req, res) => {
    try {
        const { address } = req.body;
        
        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        const result = await faucet.checkEligibility(address);
        res.json(result);
    } catch (error) {
        console.error('Error checking eligibility:', error);
        res.status(500).json({ error: 'Failed to check eligibility' });
    }
});

// Claim tokens
app.post('/api/faucet/claim', async (req, res) => {
    try {
        const { address, chainId } = req.body;
        
        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        if (!chainId) {
            return res.status(400).json({ error: 'Chain ID is required' });
        }

        // Check eligibility
        const eligibility = await faucet.checkEligibility(address);
        
        if (!eligibility.canClaim) {
            return res.status(429).json({
                error: 'Cooldown active',
                remainingTime: eligibility.remainingTime,
                nextClaimAt: eligibility.nextClaimAt
            });
        }

        // Process claim
        const result = await faucet.processClaim(address, chainId, req.ip);
        
        res.json({
            success: true,
            amount: result.amount,
            txHash: result.txHash,
            message: `Successfully claimed ${result.amount} LINERA tokens!`,
            nextClaimAt: result.nextClaimAt
        });

    } catch (error) {
        console.error('Error processing claim:', error);
        res.status(500).json({
            error: error.message || 'Failed to process claim'
        });
    }
});

// Get claim history for address
app.get('/api/faucet/history/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const history = await faucet.getClaimHistory(address);
        res.json({ history });
    } catch (error) {
        console.error('Error getting history:', error);
        res.status(500).json({ error: 'Failed to get claim history' });
    }
});

// Admin: Get stats (protected - add auth in production)
app.get('/api/admin/stats', async (req, res) => {
    try {
        const stats = await faucet.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Faucet API running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`💧 Faucet amount: ${process.env.FAUCET_AMOUNT} LINERA`);
    console.log(`⏰ Cooldown: ${process.env.COOLDOWN_HOURS} hours`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    db.close();
    process.exit(0);
});
