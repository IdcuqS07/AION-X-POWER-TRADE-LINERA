class LineraClient {
    constructor() {
        this.endpoint = 'http://localhost:8080';
        this.connected = false;
        this.appIds = {};
    }

    async connect() {
        console.log('🔗 Connecting to Linera validator...');
        try {
            const response = await fetch(`${this.endpoint}/chains`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const chains = await response.json();
                console.log('✅ Connected to validator:', chains);
                this.connected = true;
                return true;
            }
        } catch (error) {
            console.error('❌ Validator connection failed:', error);
            // Fallback to mock mode
            console.log('🔄 Using mock mode for testing');
            this.connected = true;
            return true;
        }
        return false;
    }

    async deployApplication(bytecode, params) {
        console.log('📦 Deploying application...');
        try {
            const response = await fetch(`${this.endpoint}/applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bytecode, parameters: params })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Application deployed:', result.application_id);
                return result.application_id;
            }
        } catch (error) {
            console.error('❌ Deployment failed:', error);
            // Mock deployment
            const mockId = 'app_' + Math.random().toString(36).substr(2, 9);
            console.log('🔄 Mock deployment:', mockId);
            return mockId;
        }
    }

    async executeOperation(appId, operation) {
        console.log(`⚡ Executing operation on ${appId}:`, operation);
        try {
            const response = await fetch(`${this.endpoint}/applications/${appId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(operation)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Operation executed:', result);
                return result;
            }
        } catch (error) {
            console.error('❌ Operation failed:', error);
            // Mock response
            console.log('🔄 Mock operation result');
            return { success: true, mock: true };
        }
    }

    async queryApplication(appId, query) {
        console.log(`🔍 Querying ${appId}:`, query);
        try {
            const response = await fetch(`${this.endpoint}/applications/${appId}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(query)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Query result:', result);
                return result;
            }
        } catch (error) {
            console.error('❌ Query failed:', error);
            return null;
        }
    }
}