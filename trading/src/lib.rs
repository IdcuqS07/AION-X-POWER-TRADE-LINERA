#![cfg_attr(target_arch = "wasm32", no_main)]

mod contract;
mod service;
mod state;

pub use contract::TradingContract;
pub use service::TradingService;