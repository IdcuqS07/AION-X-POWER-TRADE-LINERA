#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use ai_trading::TradingAbi;
use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

use self::state::TradingState;

linera_sdk::contract!(TradingContract);

pub struct TradingContract {
    state: TradingState,
    runtime: ContractRuntime<Self>,
}

impl WithContractAbi for TradingContract {
    type Abi = TradingAbi;
}

impl Contract for TradingContract {
    type Message = ();
    type InstantiationArgument = u64;
    type Parameters = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = TradingState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingContract { state, runtime }
    }

    async fn instantiate(&mut self, value: u64) {
        self.runtime.application_parameters();
        self.state.trade_count.set(value);
    }

    async fn execute_operation(&mut self, operation: u64) -> u64 {
        let new_value = self.state.trade_count.get() + operation;
        self.state.trade_count.set(new_value);
        new_value
    }

    async fn execute_message(&mut self, _: ()) {
        panic!("Trading application doesn't support cross-chain messages");
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
