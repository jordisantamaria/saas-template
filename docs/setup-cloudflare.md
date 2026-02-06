# Cloudflare Setup Guide

## 1. DNS Configuration

1. Add your domain to Cloudflare
2. Update nameservers at your registrar to Cloudflare's
3. Add DNS records:
   - `A` record pointing to Vercel: `76.76.21.21`
   - `CNAME` for `www` pointing to `cname.vercel-dns.com`

## 2. SSL/TLS

- Set SSL/TLS mode to **Full (strict)**
- Enable **Always Use HTTPS**
- Set Minimum TLS Version to **1.2**

## 3. Security

### WAF Rules
- Enable **Managed Rules** (OWASP Core Rule Set)
- Add custom rule to block requests without valid User-Agent
- Rate limit: 100 requests per 10 seconds per IP on `/api/*`

### DDoS Protection
- Cloudflare DDoS protection is enabled by default on all plans
- For additional protection, enable **Under Attack Mode** during active attacks

### Bot Management
- Enable **Bot Fight Mode** (free tier)
- Configure challenge for suspicious traffic on sensitive endpoints

## 4. Performance

### Caching
- Set browser cache TTL to 4 hours for static assets
- Cache Level: **Standard**
- Add Page Rules:
  - `yourdomain.com/api/*` → Cache Level: Bypass
  - `yourdomain.com/_next/static/*` → Cache Level: Cache Everything, Edge TTL: 1 month

### Speed
- Enable **Auto Minify** for JavaScript, CSS, HTML
- Enable **Brotli** compression
- Enable **Early Hints**

## 5. Page Rules (3 free rules)

1. `*yourdomain.com/api/*` → Cache Level: Bypass
2. `*yourdomain.com/_next/static/*` → Cache Level: Cache Everything, Edge Cache TTL: 1 month
3. `*yourdomain.com/login*` → Security Level: High

## 6. Environment Variables

Add to your `.env`:

```
# No env variables needed — Cloudflare sits in front as CDN/proxy
# Just ensure your domain DNS points through Cloudflare
```
