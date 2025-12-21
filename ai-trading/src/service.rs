#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use ai_trading::{SimpleQuery, SimpleResponse, TradingAbi};
use linera_sdk::{
    linera_base_types::WithServiceAbi,
    views::View,
    Service, ServiceRuntime,
};

use self::state::TradingState;

linera_sdk::service!(TradingService);

pub struct TradingService {
    state: TradingState,
}

impl WithServiceAbi for TradingService {
    type Abi = TradingAbi;
}

impl Service for TradingService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = TradingState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingService { state }
    }

    async fn handle_query(&self, query: SimpleQuery) -> SimpleResponse {
        let result = *self.state.trade_count.get() + query.value;
        SimpleResponse { result }
    }
}
