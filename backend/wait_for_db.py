import os
import time
import psycopg2
from urllib.parse import urlparse

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
    port = result.port
    
    print(f"Waiting for database at {hostname}:{port}...")

    max_retries = 60
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
            print("Database available!")
            return
        except psycopg2.OperationalError as e:
            print(f"Database unavailable, waiting 5 seconds... ({i+1}/{max_retries})")
            print(f"Error: {e}")
            time.sleep(5)
    
    print("Could not connect to database!")
    exit(1)

if __name__ == "__main__":
    wait_for_db()
