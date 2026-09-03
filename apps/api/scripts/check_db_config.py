import os
from urllib.parse import urlparse

def check_db_config():
    """Diagnostic script to check database configuration"""
    db_url = os.environ.get('ASTRA_DB_URL') or os.environ.get('DATABASE_URL')
    
    if not db_url:
        print("❌ No DATABASE_URL or ASTRA_DB_URL found!")
        return
    
    # Parse the URL
    result = urlparse(db_url)
    
    # Mask password for security
    masked_password = result.password[:4] + "****" if result.password and len(result.password) > 4 else "****"
    
    print("=" * 60)
    print("DATABASE CONFIGURATION CHECK")
    print("=" * 60)
    print(f"✓ Database URL found")
    print(f"  Host: {result.hostname}")
    print(f"  Port: {result.port or 5432}")
    print(f"  Database: {result.path[1:]}")
    print(f"  Username: {result.username}")
    print(f"  Password: {masked_password}")
    print(f"  Using Database URL starting with: {db_url[:15]}...")
    print("=" * 60)
    
    # Check if it's using pooler
    if "pooler.supabase.com" in result.hostname:
        print("✓ Using Supabase Connection Pooler")
        if result.port == 6543:
            print("✓ Correct pooler port (6543)")
        else:
            print(f"⚠️  Warning: Pooler should use port 6543, but found {result.port}")
    elif "supabase.co" in result.hostname:
        print("⚠️  Using Direct Connection (not pooler)")
        if result.port == 5432:
            print("✓ Correct direct connection port (5432)")
    
    print("=" * 60)

if __name__ == "__main__":
    check_db_config()
