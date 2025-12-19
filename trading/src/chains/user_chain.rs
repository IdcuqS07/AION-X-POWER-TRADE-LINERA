use crate::state::TradingState;
use abi::trading::{Trade, Portfolio};
use abi::ai_signals::AISignal;

pub struct UserChain {
    pub state: TradingState,
}

impl UserChain {
    pub fn new(master_chain: String, initial_balance: u64) -> Self {
        Self {
            state: TradingState::new(master_chain, initial_balance),
        }
    }

    pub fn create_trade(&mut self, symbol: String, amount: u64, price: u64, trade_type: String) -> Trade {
        let trade = Trade {
            id: self.state.trades.len() as u64 + 1,
            symbol,
            trade_type: if trade_type == "buy" { 
                abi::trading::TradeType::Buy 
            } else { 
                abi::trading::TradeType::Sell 
            },
            amount,
            price,
            status: abi::trading::TradeStatus::Pending,
            timestamp: 0,
            ai_signal_id: None,
        };

        self.state.add_trade(trade.clone());
        trade
    }

    pub fn execute_trade(&mut self, trade_id: u64) -> bool {
        if let Some(trade) = self.state.trades.iter_mut().find(|t| t.id == trade_id) {
            self.state.portfolio.execute_trade(trade)
        } else {
            false
        }
    }

    pub fn get_portfolio(&self) -> &Portfolio {
        &self.state.portfolio
    }

    pub fn subscribe_to_signals(&mut self, chain_id: String) {
        self.state.subscribe_to_chain(chain_id);
    }

    pub fn receive_signal(&mut self, signal: AISignal) {
        self.state.add_signal(signal);
    }
}