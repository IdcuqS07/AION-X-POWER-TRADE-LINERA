#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::TradeHistoryState;
use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};
use trade_history::{Operation, TradeHistoryAbi};

linera_sdk::contract!(TradeHistoryContract);

pub struct TradeHistoryContract {
    state: TradeHistoryState,
    runtime: ContractRuntime<Self>,
}

impl WithContractAbi for TradeHistoryContract {
    type Abi = TradeHistoryAbi;
}

impl Contract for TradeHistoryContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = TradeHistoryState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradeHistoryContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: ()) {
        self.runtime.application_parameters();
        self.state.trades.set(Vec::new());
        self.state.next_id.set(0);
    }

    async fn execute_operation(&mut self, operation: Operation) -> u64 {
        match operation {
            Operation::ExecuteTrade {
                coin,
                trade_type,
                entry_price,
                exit_price,
                amount,
            } => {
                let user = match self.runtime.authenticated_signer() {
                    Some(signer) => signer.to_string(),
                    None => "anonymous".to_string(),
                };
                
                let timestamp = self.runtime.system_time().micros();
                
                self.state.add_trade(
                    user,
                    coin,
                    trade_type,
                    entry_price,
                    exit_price,
                    amount,
                    timestamp,
                )
            }
        }
    }

    async fn execute_message(&mut self, _message: ()) {
        panic!("Trade history does not support messages");
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
