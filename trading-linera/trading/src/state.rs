use abi::Portfolio;
use linera_sdk::views::{RegisterView, RootView, ViewStorageContext};

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct TradingState {
    pub portfolio: RegisterView<Portfolio>,
    pub trade_count: RegisterView<u64>,
}