use linera_sdk::views::{linera_views, RegisterView, RootView, ViewStorageContext};
use serde::{Deserialize, Serialize};
use trade_history::Trade;

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct TradeHistoryState {
    pub trades: RegisterView<Vec<Trade>>,
    pub next_id: RegisterView<u64>,
}

impl TradeHistoryState {
    pub fn add_trade(
        &mut self,
        user: String,
        coin: String,
        trade_type: String,
        entry_price: f64,
        exit_price: f64,
        amount: f64,
        timestamp: u64,
    ) -> u64 {
        let profit_loss = if trade_type == "BUY" {
            (exit_price - entry_price) * amount
        } else {
            (entry_price - exit_price) * amount
        };

        let trade_id = *self.next_id.get();
        
        let trade = Trade {
            id: trade_id,
            user,
            coin,
            trade_type,
            entry_price,
            exit_price,
            amount,
            profit_loss,
            timestamp,
        };

        let mut trades = self.trades.get().clone();
        trades.push(trade);
        self.trades.set(trades);
        
        *self.next_id.get_mut() += 1;
        
        trade_id
    }

    pub fn get_user_trades(&self, user: &str) -> Vec<Trade> {
        self.trades
            .get()
            .iter()
            .filter(|t| t.user == user)
            .cloned()
            .collect()
    }

    pub fn total_trades(&self) -> u64 {
        self.trades.get().len() as u64
    }

    pub fn user_total_pnl(&self, user: &str) -> f64 {
        self.trades
            .get()
            .iter()
            .filter(|t| t.user == user)
            .map(|t| t.profit_loss)
            .sum()
    }

    pub fn all_trades(&self) -> Vec<Trade> {
        self.trades.get().clone()
    }
}
