use ai_trading_abi::*;
use linera_sdk::{Contract, ContractRuntime, views::RootView};
use std::collections::BTreeMap;
use crate::{TradingOperation, TradingResponse};

#[derive(RootView)]
pub struct TradingState {
    pub portfolio: Portfolio,
    pub signals: BTreeMap<String, TradingSignal>,
    pub trades: Vec<TradeRecord>,
    pub trade_count: u64,
}

pub struct TradingContract {
    state: TradingState,
    runtime: ContractRuntime<Self>,
}

impl Contract for TradingContract {
    type Message = ();
    type InstantiationArgument = ();
    type Parameters = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = TradingState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: ()) {
        self.state.portfolio = Portfolio {
            balance: 1000000, // $10,000
            total_value: 1000000,
            positions: Vec::new(),
        };
        self.state.trade_count = 0;
    }

    async fn execute_operation(&mut self, operation: TradingOperation) -> TradingResponse {
        match operation {
            TradingOperation::UpdateSignal { signal } => {
                self.state.signals.insert(signal.symbol.clone(), signal);
                TradingResponse::SignalUpdated
            }
            
            TradingOperation::ExecuteTrade { symbol, side, amount } => {
                match self.execute_trade(symbol, side, amount).await {
                    Ok(trade) => TradingResponse::TradeExecuted(trade),
                    Err(e) => TradingResponse::Error(e),
                }
            }
            
            TradingOperation::GetPortfolio => {
                TradingResponse::Portfolio(self.state.portfolio.clone())
            }
        }
    }

    async fn execute_message(&mut self, _message: ()) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

impl TradingContract {
    async fn execute_trade(&mut self, symbol: String, side: TradeSide, amount: f64) -> Result<TradeRecord, String> {
        let signal = self.state.signals.get(&symbol)
            .ok_or("No signal available")?;
        
        if signal.confidence < 70.0 {
            return Err("Signal confidence too low".to_string());
        }
        
        let price = signal.price;
        let trade_value = (amount * price * 100.0) as u128;
        
        match side {
            TradeSide::Buy => {
                if trade_value > self.state.portfolio.balance {
                    return Err("Insufficient balance".to_string());
                }
                self.state.portfolio.balance -= trade_value;
            }
            TradeSide::Sell => {
                self.state.portfolio.balance += trade_value;
            }
        }
        
        let trade = TradeRecord {
            id: format!("trade_{}", self.state.trade_count),
            symbol,
            side,
            amount,
            price,
            timestamp: self.runtime.system_time(),
        };
        
        self.state.trades.push(trade.clone());
        self.state.trade_count += 1;
        
        Ok(trade)
    }
}