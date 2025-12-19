#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import threading
import time

PORT = 3001

def start_server():
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 Frontend server running at http://localhost:{PORT}")
        print(f"📊 Basic UI: http://localhost:{PORT}/index.html")
        print(f"🔗 Linera UI: http://localhost:{PORT}/trading.html")
        httpd.serve_forever()

def open_browser():
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}/trading.html')

if __name__ == "__main__":
    threading.Thread(target=open_browser, daemon=True).start()
    start_server()