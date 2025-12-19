#!/bin/bash

echo "🔍 Testing Linera Validator Connection..."

echo "1. Checking if validator is running..."
curl -s http://localhost:8080/chains || echo "❌ Validator not responding"

echo -e "\n2. Checking GraphQL endpoint..."
curl -s http://localhost:8080/graphql -H "Content-Type: application/json" -d '{"query": "{ chains { id } }"}' || echo "❌ GraphQL not responding"

echo -e "\n3. Starting frontend with connection test..."
cd frontend && python3 -c "
import http.server
import socketserver
import webbrowser
import threading
import time

def start_server():
    with socketserver.TCPServer(('', 3000), http.server.SimpleHTTPRequestHandler) as httpd:
        httpd.serve_forever()

print('🚀 Frontend starting on http://localhost:3000')
print('Open browser console to see verbose connection logs')
threading.Thread(target=start_server, daemon=True).start()
webbrowser.open('http://localhost:3000')
time.sleep(60)  # Run for 1 minute
"