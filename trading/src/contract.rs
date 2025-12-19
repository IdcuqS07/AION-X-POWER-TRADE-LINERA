use crate::state::ApplicationState;
use ai_power_trade_abi::*;
use linera_sdk::{
    base::{WithContractAbi, Timestamp},
    views::{RootView, View},
    Contract, ContractRuntime,
};

pub struct TradingContract {
    state: ApplicationState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(TradingContract);

impl WithContractAbi for TradingContract {
    type Abi = ApplicationAbi;
}

impl Contract for TradingContract {
    type Message = ();
    type Parameters = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = ApplicationState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingContract { state, runtime }
    }

    async fn initialize(&mut self, _argument: ()) {
        self.state.trade_counter.set(0);
    }

    async fn execute_operation(&mut self, operation: Operation) -> u64 {
        match operation {
            Operation::GenerateSignal { coin } => {
                let timestamp = Timestamp::now().micros();
                let signal = AISignal {
                    coin: coin.clone(),
                    signal: "BUY".to_string(),
                    confidence: 75,
                    risk_score: 30,
                    target_price: 50000,
                    timestamp,
                };
                
                self.state.signals.insert(&coin, signal)
                    .expect("Failed to insert signal");
                
                timestamp
            }
            Operation::ExecuteTrade { coin, amount } => {
                let trade_id = Timestamp::now().micros();
                let trade = Trade {
                    id: trade_id,
                    coin,
                    amount,
                    price: 50000,
                    confidence: 75,
                    timestamp: trade_id,
                };
                
                self.state.trades.insert(&trade_id, trade)
                    .expect("Failed to insert trade");
                
                let counter = self.state.trade_counter.get_mut();
                *counter += 1;
                
                trade_id
            }
        }
    }

    async fn execute_message(&mut self, _message: ()) {
        panic!("Trading application doesn't support cross-chain messages");
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
