use abi::{market_data::*, SystemMessage};
use linera_sdk::{
    base::{ChainId, WithContractAbi},
    Contract, ContractRuntime, Service, ServiceRuntime,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub struct MarketDataContract;
pub struct MarketDataService;

#[derive(Debug, Deserialize, Serialize)]
pub enum Operation {
    UpdatePrice { symbol: String, price: u64 },
    UpdateOrderBook { symbol: String, order_book: OrderBook },
    BroadcastPriceUpdate { symbol: String, target_chains: Vec<ChainId> },
}

#[derive(Debug, Deserialize, Serialize)]
pub enum Message {
    PriceUpdated { price: MarketPrice },
    OrderBookUpdated { order_book: OrderBook },
}

#[derive(Debug, Default, Deserialize, Serialize)]
pub struct MarketDataState {
    pub prices: HashMap<String, MarketPrice>,
    pub order_books: HashMap<String, OrderBook>,
    pub subscribers: Vec<ChainId>,
}

impl Contract for MarketDataContract {
    type Message = Message;
    type Parameters = ();
    type State = MarketDataState;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        MarketDataContract
    }

    async fn instantiate(&mut self, _state: &mut Self::State, _argument: Self::Parameters) {}

    async fn execute_operation(
        &mut self,
        runtime: &mut ContractRuntime<Self>,
        operation: Self::Operation,
    ) -> Self::Response {
        match operation {
            Operation::UpdatePrice { symbol, price } => {
                let market_price = MarketPrice::new(
                    symbol.clone(),
                    price,
                    chrono::Utc::now().timestamp() as u64,
                );
                
                runtime.state_mut().prices.insert(symbol, market_price.clone());
                runtime.prepare_message(Message::PriceUpdated { price: market_price.clone() });
                
                // Broadcast to subscribers
                for &subscriber in &runtime.state().subscribers {
                    let message = SystemMessage::MarketUpdate(market_price.clone());
                    runtime.send_message(subscriber, &message);
                }
                
                market_price
            }
            Operation::UpdateOrderBook { symbol, order_book } => {
                runtime.state_mut().order_books.insert(symbol, order_book.clone());
                runtime.prepare_message(Message::OrderBookUpdated { order_book: order_book.clone() });
                order_book.into()
            }
            Operation::BroadcastPriceUpdate { symbol, target_chains } => {
                if let Some(price) = runtime.state().prices.get(&symbol) {
                    for chain_id in target_chains {
                        let message = SystemMessage::MarketUpdate(price.clone());
                        runtime.send_message(chain_id, &message);
                    }
                    price.clone()
                } else {
                    MarketPrice::new(symbol, 0, 0)
                }
            }
        }
    }

    async fn execute_message(
        &mut self,
        runtime: &mut ContractRuntime<Self>,
        message: Self::Message,
    ) {
        match message {
            Message::PriceUpdated { price } => {
                runtime.state_mut().prices.insert(price.symbol.clone(), price);
            }
            Message::OrderBookUpdated { order_book } => {
                runtime.state_mut().order_books.insert(order_book.symbol.clone(), order_book);
            }
        }
    }
}

impl Service for MarketDataService {
    type Parameters = ();
    type State = MarketDataState;

    async fn load(runtime: ServiceRuntime<Self>) -> Self {
        MarketDataService
    }

    async fn handle_query(&mut self, runtime: &mut ServiceRuntime<Self>, query: Self::Query) -> Self::QueryResponse {
        match query {
            Query::GetPrice { symbol } => {
                QueryResponse::Price(runtime.state().prices.get(&symbol).cloned())
            }
            Query::GetOrderBook { symbol } => {
                QueryResponse::OrderBook(runtime.state().order_books.get(&symbol).cloned())
            }
            Query::GetAllPrices => {
                QueryResponse::AllPrices(runtime.state().prices.clone())
            }
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub enum Query {
    GetPrice { symbol: String },
    GetOrderBook { symbol: String },
    GetAllPrices,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum QueryResponse {
    Price(Option<MarketPrice>),
    OrderBook(Option<OrderBook>),
    AllPrices(HashMap<String, MarketPrice>),
}

impl WithContractAbi for MarketDataContract {
    type Abi = abi::MarketDataAbi;
}

impl From<OrderBook> for MarketPrice {
    fn from(order_book: OrderBook) -> Self {
        let mid_price = if !order_book.bids.is_empty() && !order_book.asks.is_empty() {
            (order_book.bids[0].price + order_book.asks[0].price) / 2
        } else {
            0
        };
        
        MarketPrice::new(order_book.symbol, mid_price, order_book.timestamp)
    }
}

pub type MarketPrice = abi::market_data::MarketPrice;
pub type Operation = self::Operation;
pub type Response = MarketPrice;