# Supabase Connection Troubleshooting Guide

## Current Issue
Build is failing with: `password authentication failed for user "postgres"`

## Step-by-Step Fix

### 1. Get Fresh Credentials from Supabase

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Database**
4. Click **"Reset database password"**
5. **IMPORTANT**: Copy the new password immediately - you won't see it again!
6. After reset, go to **Connection String** section
7. Select **"Transaction pooler"** mode (port 6543)
8. Copy the full connection string

The connection string format should be:
```
postgresql://postgres.PROJECT_REF:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

### 2. Check for Special Characters in Password

If your password contains special characters, they MUST be URL-encoded:

| Character | URL Encoded |
|-----------|-------------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `/` | `%2F` |
| `:` | `%3A` |
| `?` | `%3F` |
| `[` | `%5B` |
| `]` | `%5D` |

**Example**:
- Password: `MyP@ss#123`
- URL-encoded: `MyP%40ss%23123`
- Full string: `postgresql://postgres.xxx:MyP%40ss%23123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres`

### 3. Update Render Environment Variable

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click on your **astra-backend** service
3. Go to **Environment** tab
4. Look for these variables (in order of priority):
   - `EXTERNAL_DATABASE_URL`
   - `SUPABASE_URL`
   - `DATABASE_URL`

5. **Delete any old database variables** to avoid conflicts
6. **Add a new variable**:
   - Key: `SUPABASE_URL`
   - Value: Your full connection string with URL-encoded password
   
7. Click **Save Changes**

### 4. Verify in Build Logs

After the next deployment, check the build logs for this section:

```
============================================================
DATABASE CONNECTION DEBUG
Host: aws-1-ap-south-1.pooler.supabase.com
Port: 6543
Database: postgres
Username: postgres.YOUR_PROJECT_REF
Password length: XX chars
Password starts with: abc...
============================================================
```

**Check these values**:
- ✅ Host should be: `aws-1-ap-south-1.pooler.supabase.com`
- ✅ Port should be: `6543`
- ✅ Username should be: `postgres.YOUR_PROJECT_REF` (not just `postgres`)
- ✅ Password length should match your actual password length

### 5. Common Mistakes

❌ **Wrong username format**:
- Wrong: `postgres`
- Correct: `postgres.mfgjfpxqirljyycciowe`

❌ **Using Direct Connection instead of Pooler**:
- Wrong port: `5432`
- Correct port: `6543`

❌ **Password not URL-encoded**:
- If password has special characters, they must be encoded

❌ **Multiple DATABASE_URL variables**:
- Delete all old database variables
- Keep only `SUPABASE_URL`

❌ **Brackets in password**:
- Don't include `[` or `]` around the password
- `[YOUR-PASSWORD]` is just a placeholder

### 6. Test Connection Manually

You can test the connection string locally:

```bash
# Install psql if needed
sudo apt-get install postgresql-client

# Test connection (replace with your actual values)
psql "postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
```

If this works, the connection string is correct!

## Still Not Working?

If you've tried everything above and it still fails:

1. **Share the debug output** from the build logs (the DATABASE CONNECTION DEBUG section)
2. **Verify the username** - it should be `postgres.PROJECT_REF`, not just `postgres`
3. **Try a simpler password** - reset to a password with only letters and numbers (no special characters)
