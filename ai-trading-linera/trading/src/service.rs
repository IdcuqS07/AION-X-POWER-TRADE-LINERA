use ai_trading_abi::*;
use async_graphql::{EmptySubscription, Object, Schema};
use linera_sdk::{graphql::GraphQLMutationRoot, Service, ServiceRuntime};
use std::sync::Arc;
use crate::{TradingOperation, TradingState};

pub struct TradingService {
    state: Arc<TradingState>,
    runtime: Arc<ServiceRuntime<Self>>,
}

impl Service for TradingService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = TradingState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingService {
            state: Arc::new(state),
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, query: Self::Query) -> Self::QueryResponse {
        Schema::build(
            QueryRoot {
                state: self.state.clone(),
            },
            TradingOperation::mutation_root(self.runtime.clone()),
            EmptySubscription,
        )
        .finish()
        .execute(query)
        .await
    }
}

struct QueryRoot {
    state: Arc<TradingState>,
}

#[Object]
impl QueryRoot {
    async fn portfolio(&self) -> Portfolio {
        self.state.portfolio.clone()
    }
    
    async fn signal(&self, symbol: String) -> Option<TradingSignal> {
        self.state.signals.get(&symbol).cloned()
    }
    
    async fn trades(&self, limit: Option<i32>) -> Vec<TradeRecord> {
        let limit = limit.unwrap_or(10) as usize;
        self.state.trades.iter().rev().take(limit).cloned().collect()
    }
}