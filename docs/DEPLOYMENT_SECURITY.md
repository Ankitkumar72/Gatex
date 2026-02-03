# Deployment Security Checklist

## Pre-Deployment

### Environment Configuration
- [ ] `DEBUG=False` in production
- [ ] Generate strong `JWT_SECRET_KEY` (`openssl rand -hex 32`)
- [ ] Set `ALLOWED_ORIGINS` to production domain only
- [ ] Configure `DATABASE_URL` to production database
- [ ] Set `LOG_LEVEL=INFO` or `WARNING`

### Secrets Management
- [ ] `.env` file not committed to Git
- [ ] Secrets configured in hosting platform dashboard
- [ ] API keys stored securely
- [ ] Database credentials not in code

### Database
- [ ] Migrate from SQLite to PostgreSQL
- [ ] Enable automated daily backups
- [ ] Database user has minimum required permissions
- [ ] Connection pooling configured

## Deployment Platform

### SSL/HTTPS
- [ ] SSL certificate installed
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Verify with: `curl -I https://yourdomain.com`

### CORS
- [ ] Verify only allowed origins in config
- [ ] Test cross-origin requests blocked
- [ ] Check browser console for CORS errors

### Rate Limiting
- [ ] Rate limits active in production
- [ ] Test limits work: rapid requests return 429
- [ ] Adjust limits based on traffic patterns

## Cloudflare Setup (Strongly Recommended)

### DNS
- [ ] Domain points to Cloudflare nameservers
- [ ] Proxy enabled (orange cloud)

### SSL/TLS
- [ ] Mode: Full (Strict)
- [ ] Always Use HTTPS: On
- [ ] Minimum TLS Version: 1.2

### Security
- [ ] Bot Fight Mode: On
- [ ] Rate Limiting rules configured
- [ ] WAF (Web Application Firewall): On
- [ ] DDoS protection: Automatic

### Performance
- [ ] Auto Minify: JS, CSS, HTML
- [ ] Brotli compression: On
- [ ] Caching configured

## Post-Deployment

### Verification
- [ ] Test login flow works
- [ ] Test protected endpoints require auth
- [ ] Verify role-based access (try accessing manager endpoint as user)
- [ ] Check rate limiting (hit limit and verify 429 response)
- [ ] Verify CORS (try request from unauthorized origin)
- [ ] Check logs are being generated
- [ ] Test HTTPS works (no mixed content warnings)

### Security Tests
```bash
# Test authentication required
curl https://yourdomain.com/agent/chat
# Should return 401 Unauthorized

# Test CORS
curl -H "Origin: https://evil.com" https://yourdomain.com/health
# Should block or return error

# Test rate limiting
for i in {1..10}; do curl https://yourdomain.com/auth/login; done
# Should return 429 after limit

# Test HTTPS redirect
curl -I http://yourdomain.com
# Should redirect to https://
```

### Monitoring Setup
- [ ] Configure error alerts (email/Slack)
- [ ] Set up uptime monitoring
- [ ] Enable access logs review
- [ ] Database backup notifications

## Monthly Maintenance

- [ ] Rotate JWT secret key
- [ ] Update Python dependencies: `pip install --upgrade -r requirements.txt`
- [ ] Review security logs for anomalies
- [ ] Check failed login attempts
- [ ] Verify backups are working
- [ ] Test backup restoration process

## Security Incident Response Plan

### If Breach Detected:
1. **Immediate**:
   - Revoke compromised credentials
   - Rotate JWT secret
   - Block suspicious IPs at Cloudflare
   - Take affected systems offline if needed

2. **Investigation**:
   - Review access logs
   - Identify scope of breach
   - Document timeline

3. **Remediation**:
   - Patch vulnerabilities
   - Force password reset for affected users
   - Restore from backup if data modified

4. **Communication**:
   - Notify affected users (if applicable)
   - Document lessons learned
   - Update security measures

## Emergency Contacts

- Hosting Platform Support: __________
- Cloudflare Support: __________
- Database Provider Support: __________

## Production URLs

- Frontend: __________
- Backend API: __________
- Database: __________
- Cloudflare Dashboard: __________

---

**Last Updated:** [Date]
**Reviewed By:** [Name]
