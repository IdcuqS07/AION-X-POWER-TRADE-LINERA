#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os

PORT = 3000

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.realpath(__file__)), **kwargs)

print(f"🚀 Starting AI POWER TRADE Frontend on http://localhost:{PORT}")
print("Press Ctrl+C to stop")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    webbrowser.open(f'http://localhost:{PORT}')
    httpd.serve_forever()