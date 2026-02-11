import os
import time
import psycopg2
import socket
from urllib.parse import urlparse

def wait_for_db():
    db_url = os.environ.get('ASTRA_DB_URL') or os.environ.get('DATABASE_URL')
    if not db_url:
        print("DATABASE_URL not found!")
        return # Let Django handle the error gracefully

    result = urlparse(db_url)
    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname
    port = result.port or 5432
    
    print(f"Waiting for database at {hostname}...", flush=True)
    
    # DNS pre-check
    for i in range(10):
        try:
            socket.gethostbyname(hostname)
            print(f"DNS Resolved {hostname}", flush=True)
            break
        except Exception as e:
            print(f"DNS waiting... {i+1}/10 - {e}", flush=True)
            time.sleep(2)

    # Connection check
    max_retries = 20
    for i in range(max_retries):
        try:
            conn = psycopg2.connect(
                dbname=database,
                user=username,
                password=password,
                host=hostname,
                port=port,
                connect_timeout=5
            )
            conn.close()
            print("Database is UP!", flush=True)
            return
        except Exception as e:
            print(f"Database sync... {i+1}/{max_retries} - {e}", flush=True)
            time.sleep(2)
    
    print("Proceeding anyway, let's hope for the best...", flush=True)

if __name__ == "__main__":
    wait_for_db()
