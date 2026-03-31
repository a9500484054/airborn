# AirBorn Deployment Guide

This guide covers deployment options for the AirBorn application, from development to production.

---

## Table of Contents

1. [Development Environment](#development-environment)
2. [Production Deployment](#production-deployment)
3. [Server Requirements](#server-requirements)
4. [Docker Deployment](#docker-deployment)
5. [Manual Deployment](#manual-deployment)
6. [Environment Configuration](#environment-configuration)
7. [SSL/HTTPS Setup](#sslhttps-setup)
8. [Monitoring & Logging](#monitoring--logging)
9. [Backup & Recovery](#backup--recovery)
10. [Scaling](#scaling)

---

## Development Environment

### Quick Start with Docker

```bash
# Start development environment
docker-compose -f docker/docker-compose.dev.yml up --build

# Access services:
# - Frontend: http://localhost:3001
# - Backend: http://localhost:3000
# - PostgreSQL: localhost:5432
```

### Local Development Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd airborn

# 2. Start PostgreSQL
docker run -d --name airborn-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=airborn \
  -p 5432:5432 \
  postgres:15-alpine

# 3. Setup backend
cd backend
cp .env.example .env
npm install
npm run migration:run
npm run seed
npm run start:dev

# 4. Setup frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## Production Deployment

### Prerequisites

- Server with Ubuntu 22.04 LTS or similar
- Minimum 2GB RAM (4GB recommended)
- 20GB storage
- Domain name configured
- SSL certificate (Let's Encrypt recommended)

### Server Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 2 GB | 4-8 GB |
| Storage | 20 GB | 50+ GB SSD |
| Network | 100 Mbps | 1 Gbps |

---

## Docker Deployment

### Step 1: Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

### Step 2: Clone and Configure

```bash
# Clone repository
cd /var/www
git clone <repository-url> airborn
cd airborn

# Create production .env files
mkdir -p backend-config frontend-config

# Backend .env
cat > backend-config/.env << EOF
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<strong-password>
DB_DATABASE=airborn
JWT_SECRET=<strong-jwt-secret>
JWT_EXPIRATION=15m
REFRESH_SECRET=<strong-refresh-secret>
REFRESH_EXPIRATION=7d
CORS_ORIGIN=http://your-domain.com
UPLOAD_PATH=/app/uploads
MAX_FILE_SIZE=20971520
EOF

# Frontend .env
cat > frontend-config/.env << EOF
NUXT_PUBLIC_API_URL=https://your-domain.com/api
NUXT_PUBLIC_WS_URL=wss://your-domain.com/chat
EOF
```

### Step 3: Update docker-compose.yml

```bash
# Create production docker-compose override
cat > docker/docker-compose.prod.yml << EOF
version: '3.8'

services:
  backend:
    env_file:
      - ../backend-config/.env
    volumes:
      - backend_uploads:/app/uploads

  frontend:
    env_file:
      - ../frontend-config/.env

  postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
  backend_uploads:
EOF
```

### Step 4: Start Services

```bash
# Build and start
docker-compose -f docker/docker-compose.yml \
  -f docker/docker-compose.prod.yml \
  up -d --build

# Check status
docker-compose -f docker/docker-compose.yml ps

# View logs
docker-compose -f docker/docker-compose.yml logs -f
```

---

## Manual Deployment

### Step 1: Install Dependencies

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx
```

### Step 2: Setup Database

```bash
# Create database
sudo -u postgres psql << EOF
CREATE DATABASE airborn;
CREATE USER airborn_user WITH PASSWORD '<strong-password>';
GRANT ALL PRIVILEGES ON DATABASE airborn TO airborn_user;
EOF
```

### Step 3: Deploy Backend

```bash
cd /var/www/airborn/backend

# Install dependencies
npm install --production

# Build
npm run build

# Run migrations
npm run migration:run

# Seed (optional in production)
npm run seed

# Create systemd service
sudo cat > /etc/systemd/system/airborn-backend.service << EOF
[Unit]
Description=AirBorn Backend
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/airborn/backend
ExecStart=/usr/bin/node dist/main.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable airborn-backend
sudo systemctl start airborn-backend
```

### Step 4: Deploy Frontend

```bash
cd /var/www/airborn/frontend

# Install dependencies
npm install

# Build
npm run build

# Create systemd service
sudo cat > /etc/systemd/system/airborn-frontend.service << EOF
[Unit]
Description=AirBorn Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/airborn/frontend
ExecStart=/usr/bin/npm run preview
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable airborn-frontend
sudo systemctl start airborn-frontend
```

### Step 5: Configure Nginx

```bash
sudo cat > /etc/nginx/sites-available/airborn << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    # WebSocket
    location /chat {
        proxy_pass http://localhost:3000/chat;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_read_timeout 86400;
    }

    # Uploaded files
    location /uploads {
        alias /var/www/airborn/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/airborn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## SSL/HTTPS Setup

### Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

---

## Monitoring & Logging

### Systemd Logs

```bash
# Backend logs
sudo journalctl -u airborn-backend -f

# Frontend logs
sudo journalctl -u airborn-frontend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Docker Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Health Checks

```bash
# Backend health
curl http://localhost:3000/api/health

# Frontend health
curl http://localhost:3001
```

---

## Backup & Recovery

### Database Backup

```bash
# Backup
pg_dump -U airborn_user airborn > backup_$(date +%Y%m%d).sql

# Restore
psql -U airborn_user airborn < backup_20240101.sql

# Automated backup script
cat > /usr/local/bin/airborn-backup.sh << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/airborn"
mkdir -p \$BACKUP_DIR
pg_dump -U airborn_user airborn | gzip > \$BACKUP_DIR/db_\$(date +%Y%m%d_%H%M%S).sql.gz
find \$BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/airborn-backup.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /usr/local/bin/airborn-backup.sh" | sudo crontab -
```

### File Uploads Backup

```bash
# Backup uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /var/www/airborn/backend/uploads

# Restore uploads
tar -xzf uploads_backup_20240101.tar.gz -C /
```

---

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.scale.yml
version: '3.8'

services:
  backend:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  frontend:
    deploy:
      replicas: 2
```

### Load Balancer Configuration

```nginx
upstream backend_servers {
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}

server {
    location /api {
        proxy_pass http://backend_servers;
    }
}
```

---

## Troubleshooting

### Common Issues

**1. Service won't start:**
```bash
sudo systemctl status airborn-backend
sudo journalctl -u airborn-backend -n 50
```

**2. Database connection failed:**
```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "\l"
```

**3. Nginx 502 Bad Gateway:**
```bash
sudo nginx -t
sudo systemctl status airborn-backend
sudo systemctl status airborn-frontend
```

**4. SSL certificate issues:**
```bash
sudo certbot certificates
sudo certbot renew
```

---

## Performance Optimization

### PostgreSQL Tuning

```sql
-- Add to postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
max_connections = 100
```

### Nginx Caching

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:10m;

location /api {
    proxy_cache app_cache;
    proxy_cache_valid 200 10m;
}
```

---

## Security Checklist

- [ ] Change default passwords
- [ ] Enable firewall (ufw)
- [ ] Configure fail2ban
- [ ] Enable automatic security updates
- [ ] Set up SSL/TLS
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Monitor logs regularly
- [ ] Use strong JWT secrets

---

For support, contact: support@airborn.com
