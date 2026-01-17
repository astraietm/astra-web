import psycopg2
import sys

# Configuration
SOURCE_DB_URL = "postgresql://astra_user:xeHeMrs1p2YklLRbqmthiGnMeBCN8Rfo@dpg-d5ekohje5dus73bv63og-a.singapore-postgres.render.com/astra_kv6z"
# Using Port 6543 for Session Mode (Required for SET commands)
TARGET_DB_URL = "postgresql://postgres.mfgjfpxqirljyycciowe:pInKnHdn6Fbmrsla@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"

def migrate():
    print("--- Starting Migration ---")
    
    # 1. Connect to Source
    try:
        print("Connecting to Source (Render)...")
        conn_src = psycopg2.connect(SOURCE_DB_URL)
        cur_src = conn_src.cursor()
        print("Connected to Source.")
    except Exception as e:
        print(f"Failed to connect to Source: {e}")
        return

    # 2. Connect to Target
    try:
        print("Connecting to Target (Supabase)...")
        conn_tgt = psycopg2.connect(TARGET_DB_URL)
        cur_tgt = conn_tgt.cursor()
        print("Connected to Target.")
    except Exception as e:
        print(f"Failed to connect to Target: {e}")
        return

    try:
        # 3. Disable Foreign Key Constraints on Target
        print("Disabling Foreign Key checks on Target...")
        cur_tgt.execute("SET session_replication_role = 'replica';")
        
        # 4. Get List of Tables from Source
        cur_src.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE';
        """)
        tables = [r[0] for r in cur_src.fetchall()]
        
        # Filter out django_migrations or other system tables if needed? 
        # For a full clone, we keep them.
        print(f"Found {len(tables)} tables to migrate.")

        for table in tables:
            print(f"Migrating table: {table}...")
            
            # Truncate Target
            try:
                cur_tgt.execute(f'TRUNCATE TABLE "{table}" CASCADE;')
            except psycopg2.errors.UndefinedTable:
                print(f"Warning: Table {table} does not exist in target. Skipping.")
                conn_tgt.rollback()
                continue
            except Exception as e:
                print(f"Error truncating {table}: {e}")
                conn_tgt.rollback()
                continue
                
            # Copy Data
            # "COPY (SELECT * FROM table) TO STDOUT"
            f = sys.stdout # Dummy
            
            try:
                # Use query to avoid local file storage
                # We need to read from Source STDOUT and write to Target STDIN
                # Using copy_expert with file-like objects?
                # Actually, simpler to just fetchall and insert?
                # No, COPY is much faster.
                # Let's use a buffer.
                from io import StringIO
                buffer = StringIO()
                
                cur_src.copy_expert(f'COPY "{table}" TO STDOUT', buffer)
                buffer.seek(0)
                
                cur_tgt.copy_expert(f'COPY "{table}" FROM STDIN', buffer)
                conn_tgt.commit()
                print(f"  -> Success: {table}")
                
            except Exception as e:
                print(f"  -> Failed to copy {table}: {e}")
                conn_tgt.rollback()

        # 5. Re-enable Constraints
        print("Re-enabling Foreign Key checks...")
        cur_tgt.execute("SET session_replication_role = 'origin';")
        conn_tgt.commit()
        
        print("--- Migration Complete! ---")
        
    except Exception as e:
        print(f"Migration failed during process: {e}")
    finally:
        conn_src.close()
        conn_tgt.close()

if __name__ == "__main__":
    migrate()
