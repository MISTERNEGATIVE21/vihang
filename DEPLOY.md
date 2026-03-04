# Vihang — Deployment Guide

The Docker image includes **Caddy** as a built-in reverse proxy that automatically provisions SSL certificates from Let's Encrypt. No separate web server or certbot setup needed.

---

## One-Step Quick Start (uses default `.env`)

A default `.env.default` file is included with sensible defaults. Copy it and start:

```bash
cp .env.default .env
docker compose up -d
```

This starts MongoDB + the app on `http://localhost`. Done!

> To use SSL on a VPS, just change `DOMAIN` in the `.env` file to your real domain:
>
> ```env
> DOMAIN=vihang.yourdomain.com
> JWT_SECRET=a_real_strong_secret
> ```
>
> Then run `docker compose up -d` — Caddy handles SSL automatically.

---

## Default `.env` values

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend port (internal) |
| `MONGODB_URI` | `mongodb://mongo:27017/vihang` | MongoDB connection string |
| `JWT_SECRET` | `supersecret123` | JWT secret — **change in production** |
| `DOMAIN` | `localhost` | Set to your domain for automatic SSL |

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

## GitHub Actions

Both workflows include `workflow_dispatch` — you can manually trigger builds from the **Actions** tab → **Run workflow** button.

---

## Useful Commands

| Task | Command |
|------|---------|
| View running containers | `docker ps` |
| View app logs | `docker logs -f vihang_backend` |
| Restart app | `docker restart vihang_backend` |
| Stop everything | `docker stop vihang_backend vihang_mongodb` |
| Remove containers | `docker rm vihang_backend vihang_mongodb` |
