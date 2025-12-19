#![cfg_attr(target_arch = "wasm32", no_main)]

use abi::{Portfolio, TradingParameters};
use async_graphql::{Request, Response, Schema};
use linera_sdk::{
    linera_base_types::WithServiceAbi,
    views::{RootView, View},
    Service, ServiceRuntime,
};
use trading::TradingAbi;

#[derive(RootView)]
#[view(context = "ViewStorageContext")]
struct TradingState {
    portfolio: View<Portfolio>,
}

pub struct TradingService {
    state: TradingState,
}

linera_sdk::service!(TradingService);

impl WithServiceAbi for TradingService {
    type Abi = TradingAbi;
}

impl Service for TradingService {
    type Parameters = TradingParameters;

    async fn load(runtime: ServiceRuntime<Self>) -> Self {
        let state = TradingState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingService { state }
    }

    async fn handle_query(&self, _query: Self::Query) -> Self::QueryResponse {
        let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription).finish();
        schema.execute(_query).await
    }
}

struct QueryRoot;
struct MutationRoot;
struct EmptySubscription;

#[async_graphql::Object]
impl QueryRoot {
    async fn portfolio(&self) -> Portfolio {
        Portfolio {
            balance: 10000.0,
            positions: vec![],
        }
    }
}

#[async_graphql::Object]
impl MutationRoot {
    async fn execute_trade(&self, symbol: String, side: String, amount: f64) -> String {
        format!("trade_{}_{}", symbol, amount)
    }
}

#[async_graphql::Subscription]
impl EmptySubscription {}