// AI Trading Contract Integration
const APP_ID = import.meta.env.VITE_AI_TRADING_APP_ID;
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8080/graphql';

export class AITradingContract {
  constructor(graphqlEndpoint = GRAPHQL_ENDPOINT) {
    this.endpoint = graphqlEndpoint;
    this.appId = APP_ID;
  }

  async query(queryString) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: queryString }),
      });
      
      const data = await response.json();
      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        throw new Error(data.errors[0].message);
      }
      
      return data.data;
    } catch (error) {
      console.error('Query failed:', error);
      throw error;
    }
  }

  async getTradeCount() {
    const query = `
      query {
        applications(chainId: "${this.appId}") {
          entry {
            tradeCount
          }
        }
      }
    `;
    
    const data = await this.query(query);
    return data.applications?.entry?.tradeCount || 0;
  }

  async getSignals() {
    const query = `
      query {
        applications(chainId: "${this.appId}") {
          entry {
            signals {
              coin
              action
              confidence
            }
          }
        }
      }
    `;
    
    const data = await this.query(query);
    return data.applications?.entry?.signals || [];
  }

  async getTrades() {
    const query = `
      query {
        applications(chainId: "${this.appId}") {
          entry {
            trades {
              id
              coin
              amount
            }
          }
        }
      }
    `;
    
    const data = await this.query(query);
    return data.applications?.entry?.trades || [];
  }

  async generateSignal(coin) {
    const mutation = `
      mutation {
        executeOperation(
          chainId: "${this.appId}",
          operation: {
            GenerateSignal: {
              coin: "${coin}"
            }
          }
        )
      }
    `;
    
    return await this.query(mutation);
  }

  async executeTrade(coin, amount) {
    const mutation = `
      mutation {
        executeOperation(
          chainId: "${this.appId}",
          operation: {
            ExecuteTrade: {
              coin: "${coin}",
              amount: ${amount}
            }
          }
        )
      }
    `;
    
    return await this.query(mutation);
  }

  async incrementTrades(amount) {
    const mutation = `
      mutation {
        executeOperation(
          chainId: "${this.appId}",
          operation: {
            IncrementTrades: {
              amount: ${amount}
            }
          }
        )
      }
    `;
    
    return await this.query(mutation);
  }
}

// Export singleton instance
export const aiTradingContract = new AITradingContract();
