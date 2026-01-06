import os
import time
import psycopg2
import threading
import socket
from urllib.parse import urlparse
from http.server import HTTPServer, BaseHTTPRequestHandler

# Dummy server to keep Render happy
class HealthCheckHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Waiting for database...")

def start_dummy_server():
    port = int(os.environ.get("PORT", 10000))
    server = HTTPServer(("0.0.0.0", port), HealthCheckHandler)
    server.timeout = 1
    print(f"Dummy server listening on port {port}...")
    while getattr(threading.current_thread(), "do_run", True):
        server.handle_request()
    server.server_close()
    print("Dummy server stopped.")

def wait_for_db():
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("DATABASE_URL not found!")
        exit(1)

    result = urlparse(db_url)
    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname
    port = result.port or 5432
    
    print(f"Checking database at {hostname}:{port}...")

    # Start dummy server in background
    server_thread = threading.Thread(target=start_dummy_server)
    server_thread.do_run = True
    server_thread.start()

    max_retries = 300  # 300 * 2 = 600 seconds = 10 minutes
    try:
        for i in range(max_retries):
            try:
                conn = psycopg2.connect(
                    dbname=database,
                    user=username,
                    password=password,
                    host=hostname,
                    port=port
                )
                conn.close()
                print("Database available! Stopping dummy server...")
                break
            except psycopg2.OperationalError as e:
                print(f"Database unavailable, waiting 2s... ({i+1}/{max_retries}) Error: {e}")
                time.sleep(2)
        else:
            print("Could not connect to database after many retries!")
            # Don't exit, just let it crash when gunicorn starts so we see logs
    finally:
        server_thread.do_run = False
        server_thread.join()

if __name__ == "__main__":
    wait_for_db()
