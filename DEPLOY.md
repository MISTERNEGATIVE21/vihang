# Vihang — Deployment Guide

The app runs directly on **port 80**. For SSL on a VPS, use **Nginx + Certbot** as a reverse proxy.

---

## Quick Start with Docker Compose

```bash
cp .env.default .env
docker compose up -d
```

App is live at `http://localhost`. Done!

---

## Quick Start with Docker (No Compose)

```bash
docker network create vihang-net
docker run -d --name vihang_mongodb --network vihang-net -v mongodb_data:/data/db --restart unless-stopped mongo:latest
docker run -d --name vihang_backend --network vihang-net -p 80:80 -e PORT=80 -e MONGODB_URI=mongodb://vihang_mongodb:27017/vihang -e JWT_SECRET=your_secret --restart unless-stopped ghcr.io/misternegative21/vihang:latest
```

---

## Default `.env` values

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `80` | Port the app listens on |
| `MONGODB_URI` | `mongodb://mongo:27017/vihang` | MongoDB connection string |
| `JWT_SECRET` | `supersecret123` | **Change this in production!** |

---

## Hosting on a VPS with SSL (Certbot + Nginx)

### Prerequisites

- A VPS with a public IP
- A domain (e.g. `vihang.yourdomain.com`) with an **A record** pointing to your VPS IP
- Docker installed
- Ports **80** and **443** open in your firewall

### Step 1 — Run the App on port 8080 (internal)

Update `.env` to use port 8080 (Nginx will handle 80/443):

```env
PORT=8080
```

Update docker-compose port mapping:

```yaml
ports:
  - "8080:8080"
```

Then start:

```bash
docker compose up -d
```

### Step 2 — Install Nginx & Certbot

```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
```

### Step 3 — Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/vihang
```

Paste (replace `vihang.yourdomain.com`):

```nginx
server {
    listen 80;
    server_name vihang.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/vihang /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Step 4 — Get SSL Certificate (auto)

```bash
sudo certbot --nginx -d vihang.yourdomain.com
```

Certbot will automatically:
1. Obtain a free Let's Encrypt SSL certificate
2. Configure Nginx for HTTPS + HTTP→HTTPS redirect
3. Set up auto-renewal (verify: `sudo certbot renew --dry-run`)

### Step 5 — Verify

Visit `https://vihang.yourdomain.com` — your site is live with HTTPS!

---

## Deployment with Cloudflare & External MongoDB

Use this method if you have an external MongoDB (e.g., MongoDB Atlas) and want to point your Cloudflare **A record** directly to your server.

### Step 1 — Prepare `.env`
Ensure your `.env` has the external `MONGODB_URI`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vihang
PORT=80
```

### Step 2 — Start with Cloudflare-ready Compose
```bash
docker compose -f docker-compose.cloudflare.yml up -d
```
> **Note:** The `latest` image is automatically built and pushed to GHCR by GitHub Actions on every push to `main`.

### Step 3 — Cloudflare Configuration
1. In Cloudflare, point an **A record** (e.g., `vihang.com`) to your VPS IP.
2. Go to **SSL/TLS** settings:
    - Set to **Flexible** (Traffic flows as HTTPS to Cloudflare, and HTTP to your VPS on port 80).
    - Or use **Full** if you set up a reverse proxy with a self-signed cert on the server.

---

## GitHub Actions

Both workflows include `workflow_dispatch` — trigger builds manually from the **Actions** tab → **Run workflow** button.

---

## Useful Commands

| Task | Command |
|------|---------|
| View running containers | `docker ps` |
| View app logs | `docker logs -f vihang_backend` |
| Restart app | `docker restart vihang_backend` |
| Stop everything | `docker compose -f docker-compose.cloudflare.yml down` |
| Remove containers | `docker rm -f vihang_backend` |
| Renew SSL manually | `sudo certbot renew` |
| Test Nginx config | `sudo nginx -t` |
| Check config | `docker compose -f docker-compose.cloudflare.yml config` |
