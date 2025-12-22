#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::TradingCounter;
use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};
use trading_counter::{Operation, TradingCounterAbi};

linera_sdk::contract!(TradingCounterContract);

pub struct TradingCounterContract {
    state: TradingCounter,
    runtime: ContractRuntime<Self>,
}

impl WithContractAbi for TradingCounterContract {
    type Abi = TradingCounterAbi;
}

impl Contract for TradingCounterContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = TradingCounter::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingCounterContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: ()) {
        self.runtime.application_parameters();
        self.state.trade_count.set(0);
        self.state.signal_count.set(0);
    }

    async fn execute_operation(&mut self, operation: Operation) -> u64 {
        match operation {
            Operation::IncrementTrades => {
                let value = self.state.trade_count.get_mut();
                *value += 1;
                *value
            }
            Operation::IncrementSignals => {
                let value = self.state.signal_count.get_mut();
                *value += 1;
                *value
            }
        }
    }

    async fn execute_message(&mut self, _message: ()) {
        panic!("Trading counter does not support messages");
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
