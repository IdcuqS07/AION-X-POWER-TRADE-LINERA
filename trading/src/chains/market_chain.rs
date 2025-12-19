use abi::market_data::{MarketPrice, OrderBook, OrderLevel};
use std::collections::HashMap;

pub struct MarketChain {
    pub prices: HashMap<String, MarketPrice>,
    pub order_books: HashMap<String, OrderBook>,
    pub subscribers: Vec<String>,
}

impl MarketChain {
    pub fn new() -> Self {
        Self {
            prices: HashMap::new(),
            order_books: HashMap::new(),
            subscribers: Vec::new(),
        }
    }

    pub fn update_price(&mut self, symbol: String, price: u64, volume: u64, timestamp: u64) {
        let market_price = MarketPrice {
            symbol: symbol.clone(),
            price,
            volume,
            timestamp,
            change_24h: 0, // Calculate based on previous price
        };

        self.prices.insert(symbol, market_price);
    }

    pub fn get_price(&self, symbol: &str) -> Option<&MarketPrice> {
        self.prices.get(symbol)
    }

    pub fn update_order_book(&mut self, symbol: String, bids: Vec<OrderLevel>, asks: Vec<OrderLevel>) {
        let order_book = OrderBook {
            symbol: symbol.clone(),
            bids,
            asks,
            timestamp: 0, // Current timestamp
        };

        self.order_books.insert(symbol, order_book);
    }

    pub fn get_order_book(&self, symbol: &str) -> Option<&OrderBook> {
        self.order_books.get(symbol)
    }

    pub fn subscribe(&mut self, chain_id: String) {
        if !self.subscribers.contains(&chain_id) {
            self.subscribers.push(chain_id);
        }
    }

    pub fn unsubscribe(&mut self, chain_id: &str) {
        self.subscribers.retain(|id| id != chain_id);
    }

    pub fn get_all_prices(&self) -> Vec<&MarketPrice> {
        self.prices.values().collect()
    }

    pub fn calculate_spread(&self, symbol: &str) -> Option<u64> {
        if let Some(order_book) = self.order_books.get(symbol) {
            if let (Some(best_ask), Some(best_bid)) = (
                order_book.asks.first(),
                order_book.bids.first()
            ) {
                Some(best_ask.price - best_bid.price)
            } else {
                None
            }
        } else {
            None
        }
    }
}