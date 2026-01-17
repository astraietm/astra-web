import os
import psycopg2
import sys

# Hardcoded for test matching the user request exactly
try:
    print("Connecting...")
    conn = psycopg2.connect(
        host="aws-1-ap-south-1.pooler.supabase.com",
        port="5432",
        dbname="postgres",
        user="postgres.sirdrrydmeakouxridzu",
        password="Astra@DB#2026!Supabase",
        sslmode="require"
    )
    print("✅ SUCCESS: Connected to database!")
    conn.close()
except Exception as e:
    print(f"❌ FAILURE: {e}")
