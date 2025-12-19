use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Eq, PartialEq, Serialize)]
pub struct MarketPrice {
    pub symbol: String,
    pub price: u64,
    pub volume: u64,
    pub timestamp: u64,
    pub change_24h: i32,
}

#[derive(Debug, Clone, Deserialize, Eq, PartialEq, Serialize)]
pub struct OrderBook {
    pub symbol: String,
    pub bids: Vec<OrderLevel>,
    pub asks: Vec<OrderLevel>,
    pub timestamp: u64,
}

#[derive(Debug, Clone, Deserialize, Eq, PartialEq, Serialize)]
pub struct OrderLevel {
    pub price: u64,
    pub quantity: u64,
}

impl MarketPrice {
    pub fn new(symbol: String, price: u64, timestamp: u64) -> Self {
        MarketPrice {
            symbol,
            price,
            volume: 0,
            timestamp,
            change_24h: 0,
        }
    }
}