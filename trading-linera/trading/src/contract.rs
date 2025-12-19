#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::TradingState;
use abi::{Portfolio, Position, TradingMessage, TradingOperation, TradingParameters};
use linera_sdk::{
    linera_base_types::{Amount, WithContractAbi},
    Contract, ContractRuntime,
};
use trading::{TradingAbi, TradingEvent};

pub struct TradingContract {
    state: TradingState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(TradingContract);

impl WithContractAbi for TradingContract {
    type Abi = TradingAbi;
}

impl Contract for TradingContract {
    type Message = TradingMessage;
    type Parameters = TradingParameters;
    type InstantiationArgument = ();
    type EventValue = TradingEvent;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = TradingState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        let portfolio = Portfolio {
            balance: 10000.0,
            positions: vec![],
        };
        self.state.portfolio.set(portfolio);
        self.state.trade_count.set(0);
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            TradingOperation::ExecuteTrade { symbol, side, amount } => {
                let trade_id = format!("trade_{}_{}", symbol, amount);
                
                // Update portfolio
                let mut portfolio = self.state.portfolio.get();
                if side == "BUY" {
                    portfolio.balance -= amount * 100.0; // Simulate price
                    portfolio.positions.push(Position {
                        symbol: symbol.clone(),
                        amount,
                        entry_price: 100.0,
                    });
                }
                self.state.portfolio.set(portfolio.clone());

                // Send message
                self.runtime
                    .prepare_message(TradingMessage::TradeExecuted { trade_id, symbol, amount })
                    .send_to(self.runtime.chain_id());
            }
            TradingOperation::GetPortfolio => {
                let portfolio = self.state.portfolio.get();
                self.runtime
                    .prepare_message(TradingMessage::PortfolioUpdate { balance: portfolio.balance })
                    .send_to(self.runtime.chain_id());
            }
            TradingOperation::UpdateBalance { amount } => {
                let mut portfolio = self.state.portfolio.get();
                portfolio.balance = u128::from(amount) as f64;
                self.state.portfolio.set(portfolio);
            }
        }
    }

    async fn execute_message(&mut self, message: Self::Message) {
        match message {
            TradingMessage::TradeExecuted { trade_id: _, symbol, amount } => {
                // Emit event
                // Emit to stream
                // self.runtime.emit("trades".into(), &TradingEvent::TradeExecuted { symbol, amount });
            }
            TradingMessage::PortfolioUpdate { balance: _ } => {
                let portfolio = self.state.portfolio.get();
                // self.runtime.emit("portfolio".into(), &TradingEvent::PortfolioUpdated { portfolio });
            }
        }
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}