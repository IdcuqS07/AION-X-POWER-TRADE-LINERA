use crate::trading::Trade;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Eq, PartialEq, Serialize)]
pub struct PortfolioStats {
    pub total_trades: u64,
    pub winning_trades: u64,
    pub losing_trades: u64,
    pub win_rate: u8,
    pub max_drawdown: u64,
    pub sharpe_ratio: u32,
}

#[derive(Debug, Clone, Deserialize, Eq, PartialEq, Serialize)]
pub struct RiskMetrics {
    pub var_95: u64,
    pub max_position_size: u64,
    pub leverage_ratio: u32,
    pub exposure: u64,
}

impl PortfolioStats {
    pub fn new() -> Self {
        PortfolioStats {
            total_trades: 0,
            winning_trades: 0,
            losing_trades: 0,
            win_rate: 0,
            max_drawdown: 0,
            sharpe_ratio: 0,
        }
    }

    pub fn update_with_trade(&mut self, _trade: &Trade, pnl: i64) {
        self.total_trades += 1;
        if pnl > 0 {
            self.winning_trades += 1;
        } else if pnl < 0 {
            self.losing_trades += 1;
        }
        self.calculate_win_rate();
    }

    fn calculate_win_rate(&mut self) {
        if self.total_trades > 0 {
            self.win_rate = ((self.winning_trades * 100) / self.total_trades) as u8;
        }
    }
}