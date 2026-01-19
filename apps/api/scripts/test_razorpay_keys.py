import razorpay
import os
from dotenv import load_dotenv

# Load env from apps/api/.env
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)

key_id = os.environ.get('RAZORPAY_KEY_ID')
key_secret = os.environ.get('RAZORPAY_KEY_SECRET')

print(f"Testing Keys from: {env_path}")
print(f"Key ID: {key_id}")
print(f"Key Secret: {key_secret[:4]}***" if key_secret else "Key Secret: None")

if not key_id or not key_secret:
    print("❌ ERROR: Keys are missing in .env")
    exit(1)

try:
    client = razorpay.Client(auth=(key_id, key_secret))
    # Try to fetch orders (empty) or just authenticate by creating a dummy order (will fail validation but pass auth)
    # Actually, fetching payments or orders is a good auth test.
    # Let's try to fetch a dummy order or something simple.
    # client.order.all({'count': 1}) might be safe.
    
    print("Attempting to authenticate with Razorpay...")
    orders = client.order.all({'count': 1})
    print("✅ SUCCESS: Authentication successful! Keys are valid.")
    print(f"Retrieved {len(orders['items'])} orders.")
    
except Exception as e:
    print(f"❌ FAILED: Authentication failed. Error: {e}")
