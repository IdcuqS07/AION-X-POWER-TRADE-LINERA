#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::TradingCounter;
use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use linera_sdk::{linera_base_types::WithServiceAbi, views::View, Service, ServiceRuntime};
use std::sync::Arc;
use trading_counter::TradingCounterAbi;

linera_sdk::service!(TradingCounterService);

pub struct TradingCounterService {
    state: TradingCounter,
    runtime: Arc<ServiceRuntime<Self>>,
}

impl WithServiceAbi for TradingCounterService {
    type Abi = TradingCounterAbi;
}

impl Service for TradingCounterService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = TradingCounter::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingCounterService {
            state,
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            QueryRoot {
                trade_count: *self.state.trade_count.get(),
                signal_count: *self.state.signal_count.get(),
            },
            EmptyMutation,
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}

struct EmptyMutation;

#[Object]
impl EmptyMutation {
    // Empty mutation for now
    async fn _dummy(&self) -> bool {
        true
    }
}

struct QueryRoot {
    trade_count: u64,
    signal_count: u64,
}

#[Object]
impl QueryRoot {
    async fn trade_count(&self) -> u64 {
        self.trade_count
    }

    async fn signal_count(&self) -> u64 {
        self.signal_count
    }
}
