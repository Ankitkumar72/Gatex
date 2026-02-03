# Security Documentation

## Overview

This document outlines the security measures implemented in the PropFlow/GateX application.

## 🔒 Implemented Security Features

### 1. Authentication & Authorization

**JWT-based Authentication:**
- Access tokens expire in 30 minutes
- Refresh tokens expire in 7 days
- Tokens are signed with HS256 algorithm
- Bearer token authentication on protected routes

**Password Security:**
- Passwords hashed with bcrypt
- Never stored in plain text
- Minimum 8 characters recommended (add validation in frontend)

**Role-Based Access Control (RBAC):**
- `tenant` - Basic user access
- `technician` - Field technician access
- `manager` - Manager approval permissions
- `admin` - Full system access

### 2. Rate Limiting

**Implemented Limits:**
- Login: 5 requests/minute
- Registration: 3 requests/minute
- Chat: 20 requests/minute
- Approval: 10 requests/minute
- General API: 60 requests/minute

**Purpose:**
- Prevent brute force attacks
- Protect against DDoS
- Limit bot activity

### 3. CORS Configuration

**Secured Origins:**
- Development: `http://localhost:3000`
- Production: Set via `ALLOWED_ORIGINS` environment variable
- No wildcard (`*`) allowed

### 4. Database Security

**Features:**
- Parameterized queries via SQLAlchemy ORM
- No raw SQL string concatenation
- SQL injection protection built-in

**Models:**
- `UserDB` - User authentication data
- `TicketDB` - Support ticket data

### 5. Logging & Monitoring

**Logged Events:**
- All login attempts (success/failure)
- Registration attempts
- Failed authentication
- Rate limit hits
- API errors (500s)

**Log Levels:**
- INFO: Normal operations
- WARNING: Failed attempts, suspicious activity
- ERROR: System errors

## 🔐 API Endpoints

### Public Endpoints
- `GET /` - API information
- `GET /health` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Protected Endpoints (Authentication Required)
- `GET /auth/me` - Get current user
- `POST /agent/chat` - Chat with AI agent

### Manager/Admin Only
- `POST /agent/approve` - Approve dispatches

## 🛡️ Security Best Practices

### For Developers

1. **Never commit secrets**
   - Use `.env` file (gitignored)
   - No API keys in code
   - Rotate secrets regularly

2. **Always validate input**
   - Use Pydantic models
   - Add constraints (min_length, max_length)
   - Sanitize user input

3. **Use dependencies for auth**
   ```python
   @app.get("/protected")
   async def protected(user: User = Depends(get_current_user)):
       ...
   ```

4. **Log security events**
   ```python
   logger.warning(f"Failed login: {email}")
   ```

### For Deployment

1. **Environment Variables (Required):**
   ```bash
   JWT_SECRET_KEY=<generate-with-openssl-rand-hex-32>
   ALLOWED_ORIGINS=https://yourdomain.com
   DEBUG=False
   DATABASE_URL=<production-db-url>
   ```

2. **HTTPS Only:**
   - Use SSL/TLS certificates
   - Force HTTPS redirects
   - Most hosts provide free SSL (Render, Vercel, etc.)

3. **Database:**
   - Use PostgreSQL in production (not SQLite)
   - Enable automated backups
   - Restrict database user permissions

## 🚨 Incident Response

### If JWT Secret is Compromised:
1. Generate new secret: `openssl rand -hex 32`
2. Update `JWT_SECRET_KEY` in environment
3. Restart application
4. All existing tokens invalidated automatically

### If Database is Compromised:
1. Passwords are hashed (can't be decrypted)
2. Force password reset for all users
3. Rotate JWT secret
4. Review access logs
5. Restore from backup if needed

### If Rate Limits Triggered:
1. Review logs for suspicious IPs
2. Consider IP blocking at Cloudflare level
3. Adjust rate limits if legitimate traffic

## 📊 Monitoring Checklist

**Daily:**
- [ ] Check error logs
- [ ] Review failed login attempts
- [ ] Monitor rate limit hits

**Weekly:**
- [ ] Review access patterns
- [ ] Check for unusual activity
- [ ] Verify backups working

**Monthly:**
- [ ] Rotate JWT secret
- [ ] Update dependencies
- [ ] Security audit

## 🔧 Testing Security

### Test Authentication:
```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secure123","name":"Test User"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secure123"}'

# Use token
curl http://localhost:8000/auth/me \
  -H "Authorization: Bearer <your-token>"
```

### Test Rate Limiting:
```bash
# Hit endpoint 10 times rapidly
for i in {1..10}; do curl http://localhost:8000/auth/login; done
# Should see 429 after limit
```

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
