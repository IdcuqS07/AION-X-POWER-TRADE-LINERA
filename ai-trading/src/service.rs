#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use ai_trading::TradingAbi;
use async_graphql::{EmptyMutation, EmptySubscription, Object, Request, Response, Schema};
use linera_sdk::{
    linera_base_types::WithServiceAbi,
    views::View,
    Service, ServiceRuntime,
};
use std::sync::Arc;

use self::state::TradingState;

linera_sdk::service!(TradingService);

pub struct TradingService {
    state: Arc<TradingState>,
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
        TradingService {
            state: Arc::new(state),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            QueryRoot {
                state: self.state.clone(),
            },
            EmptyMutation,
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}

struct QueryRoot {
    state: Arc<TradingState>,
}

#[Object]
impl QueryRoot {
    async fn trade_count(&self) -> u64 {
        *self.state.trade_count.get()
    }
}
