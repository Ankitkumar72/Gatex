# PropFlow Security - Quick Reference

## 🚀 Quick Start

### 1. Setup Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Generate a secure JWT secret
openssl rand -hex 32

# Add to .env:
JWT_SECRET_KEY=<your-generated-secret-here>
ALLOWED_ORIGINS=http://localhost:3000
DEBUG=True
LOG_LEVEL=INFO
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Server

```bash
cd backend
python main.py
```

The server will:
- Initialize the database
- Enable rate limiting
- Configure CORS
- Start logging

---

## 📝 API Usage Examples

### Register a User

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tenant@example.com",
    "password": "securepassword123",
    "name": "John Doe",
    "role": "tenant"
  }'
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "uuid-here",
    "email": "tenant@example.com",
    "role": "tenant",
    "name": "John Doe",
    "is_active": true
  }
}
```

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tenant@example.com",
    "password": "securepassword123"
  }'
```

### Call Protected Endpoint

```bash
curl http://localhost:8000/agent/chat \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "My AC is not working",
    "thread_id": null
  }'
```

### Check Current User

```bash
curl http://localhost:8000/auth/me \
  -H "Authorization: Bearer <your-access-token>"
```

---

## 🔐 User Roles

| Role | Permissions | Endpoints |
|------|-------------|-----------|
| **tenant** | Basic access | `/agent/chat`, `/auth/me` |
| **technician** | Field work | Same as tenant + technician routes |
| **manager** | Approvals | Same as technician + `/agent/approve` |
| **admin** | Full access | All endpoints |

---

## 🛡️ Security Features Active

### ✅ Authentication
- JWT tokens (30 min expiry)
- Bcrypt password hashing
- Role-based access control

### ✅ Rate Limiting
- Login: 5/min
- Registration: 3/min
- Chat: 20/min
- General API: 60/min

### ✅ Protection
- CORS locked to configured origins
- SQL injection prevention (SQLAlchemy ORM)
- Input validation (Pydantic)
- Security event logging

---

## 🔧 Common Tasks

### Create Admin User

```python
# Run in backend directory
python
>>> from backend.database import SessionLocal, UserDB
>>> from backend.auth import hash_password
>>> import uuid
>>> db = SessionLocal()
>>> admin = UserDB(
...     id=str(uuid.uuid4()),
...     email="admin@gatex.com",
...     hashed_password=hash_password("admin123"),
...     name="Admin User",
...     role="admin",
...     is_active=True
... )
>>> db.add(admin)
>>> db.commit()
>>> exit()
```

### View Logged Events

```bash
# Logs appear in console
tail -f logs/app.log  # if configured to file
```

### Reset User Password

```python
from backend.database import SessionLocal, UserDB
from backend.auth import hash_password

db = SessionLocal()
user = db.query(UserDB).filter(UserDB.email == "user@example.com").first()
user.hashed_password = hash_password("newpassword123")
db.commit()
```

### Rotate JWT Secret

1. Generate new secret: `openssl rand -hex 32`
2. Update `.env`: `JWT_SECRET_KEY=new-secret-here`
3. Restart server
4. All users must re-login

---

## 🐛 Troubleshooting

### "Could not validate credentials"
- Token expired (30 min limit)
- Wrong token or malformed
- **Fix:** Login again to get new token

### "403 Forbidden"
- User role doesn't have permission
- **Fix:** Ensure user has correct role for endpoint

### "429 Too Many Requests"
- Hit rate limit
- **Fix:** Wait 1 minute, then retry

### "CORS Error"
- Frontend origin not in `ALLOWED_ORIGINS`
- **Fix:** Add frontend URL to `.env`

### Import Errors
- Missing dependencies
- **Fix:** `pip install -r requirements.txt`

---

## 📊 Testing Security

### Test Rate Limiting

```bash
# Rapid fire requests
for i in {1..10}; do
  curl -X POST http://localhost:8000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}' &
done
wait

# Should see 429 after limit hit
```

### Test Role-Based Access

```bash
# Login as tenant
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tenant@test.com","password":"test123"}' \
  | jq -r '.access_token')

# Try to access manager endpoint (should fail with 403)
curl http://localhost:8000/agent/approve \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📂 File Structure

```
backend/
├── main.py              # Main FastAPI app with security
├── config.py            # Environment configuration
├── auth.py              # Authentication & JWT
├── database.py          # Database models & session
├── rate_limiting.py     # Rate limit configuration
└── logging_config.py    # Logging setup

docs/
├── SECURITY.md                  # Security documentation
└── DEPLOYMENT_SECURITY.md       # Deployment checklist
```

---

## 🚦 Next Steps

1. **Frontend Integration:**
   - Store access_token securely
   - Add Authorization header to requests
   - Handle 401 (redirect to login)
   - Handle 403 (show permission error)

2. **Production Deployment:**
   - Set `DEBUG=False`
   - Use PostgreSQL
   - Configure domain in `ALLOWED_ORIGINS`
   - Set up Cloudflare
   - Enable HTTPS

3. **Monitoring:**
   - Set up log aggregation
   - Configure alerts for failed logins
   - Monitor rate limit hits

---

**Need Help?** See `docs/SECURITY.md` for full documentation.
