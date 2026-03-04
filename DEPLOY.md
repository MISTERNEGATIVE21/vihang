# Vihang — Deployment Guide

The Docker image includes **Caddy** as a built-in reverse proxy that automatically provisions SSL certificates from Let's Encrypt. No separate web server or certbot setup needed.

---

## Quick Start with Docker Compose

```bash
# For local dev (HTTP on port 80)
docker compose up -d

# For production with SSL — set your domain
DOMAIN=vihang.yourdomain.com docker compose up -d
```

---

## Quick Start with Docker (No Compose)

### 1. Create a shared network

```bash
docker network create vihang-net
```

### 2. Start MongoDB

```bash
docker run -d --name vihang_mongodb --network vihang-net -v mongodb_data:/data/db --restart unless-stopped mongo:latest
```

### 3. Start the App (local dev — HTTP only)

```bash
docker run -d --name vihang_app --network vihang-net -p 80:80 -p 443:443 -v caddy_data:/data -v caddy_config:/config -e PORT=5000 -e MONGODB_URI=mongodb://vihang_mongodb:27017/vihang -e JWT_SECRET=your_strong_secret_here -e DOMAIN=localhost --restart unless-stopped ghcr.io/misternegative21/vihang:latest
```

### 4. Start the App (VPS — automatic SSL)

Just change `DOMAIN` to your real domain:

```bash
docker run -d --name vihang_app --network vihang-net -p 80:80 -p 443:443 -v caddy_data:/data -v caddy_config:/config -e PORT=5000 -e MONGODB_URI=mongodb://vihang_mongodb:27017/vihang -e JWT_SECRET=your_strong_secret_here -e DOMAIN=vihang.yourdomain.com --restart unless-stopped ghcr.io/misternegative21/vihang:latest
```

Caddy will automatically:

1. Obtain a Let's Encrypt SSL certificate for your domain
2. Serve your app over HTTPS on port **443**
3. Redirect all HTTP (port 80) traffic to HTTPS
4. Auto-renew the certificate before it expires

---

## VPS Prerequisites

- A VPS with a public IP
- A domain with an **A record** pointing to your VPS IP
- Docker installed
- Ports **80** and **443** open in your firewall

---

## Useful Commands

| Task | Command |
|------|---------|
| View running containers | `docker ps` |
| View app logs | `docker logs -f vihang_app` |
| Restart app | `docker restart vihang_app` |
| Stop everything | `docker stop vihang_app vihang_mongodb` |
| Remove containers | `docker rm vihang_app vihang_mongodb` |
