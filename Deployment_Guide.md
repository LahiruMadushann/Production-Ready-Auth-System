# 🚀 Deployment Guide

Complete guide for deploying the Production-Ready Auth System to various platforms.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Deployment Options](#deployment-options)
4. [Platform-Specific Guides](#platform-specific-guides)
5. [Database Migration](#database-migration)
6. [Monitoring & Logging](#monitoring--logging)
7. [Backup & Recovery](#backup--recovery)

---

## Pre-Deployment Checklist

### Security

- [ ] Change default admin password
- [ ] Generate secure JWT secret (256-bit minimum)
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS for production domain only
- [ ] Remove development credentials
- [ ] Review and update security headers
- [ ] Enable rate limiting
- [ ] Configure firewall rules

### Configuration

- [ ] Set production database credentials
- [ ] Configure environment variables
- [ ] Update frontend API URL
- [ ] Set correct CORS origins
- [ ] Configure email service (if applicable)
- [ ] Set up logging configuration
- [ ] Configure session timeout
- [ ] Review JWT expiration time

### Testing

- [ ] Run all unit tests
- [ ] Run integration tests
- [ ] Perform load testing
- [ ] Test authentication flows
- [ ] Verify protected routes
- [ ] Check error handling
- [ ] Test database connections
- [ ] Verify backup procedures

### Documentation

- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document environment variables
- [ ] Create disaster recovery plan

---

## Environment Configuration

### Production Environment Variables

#### Backend (.env)

```env
# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod

# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/authdb
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_secure_password

# JWT - CRITICAL: Use a secure 256-bit key
JWT_SECRET=your-super-secure-256-bit-jwt-secret-key-generated-with-openssl
JWT_EXPIRATION=3600000

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Logging
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_AUTHSYSTEM=INFO
LOGGING_FILE_NAME=/var/log/auth-system/application.log
```

#### Frontend (.env.production)

```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Generate Secure JWT Secret

```bash
# Generate 256-bit secret
openssl rand -base64 32

# Or 512-bit for extra security
openssl rand -base64 64
```

---

## Deployment Options

### Option 1: Docker Deployment (Recommended)

Best for: Quick deployment, consistent environments

```bash
# 1. Build images
docker-compose -f docker-compose.prod.yml build

# 2. Start services
docker-compose -f docker-compose.prod.yml up -d

# 3. Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Option 2: Traditional Server Deployment

Best for: Full control, existing infrastructure

**Backend**:
```bash
# Build JAR
./mvnw clean package -DskipTests

# Run with systemd service
sudo systemctl start auth-backend
```

**Frontend**:
```bash
# Build production bundle
npm run build

# Serve with Nginx
sudo systemctl start nginx
```

### Option 3: Cloud Platform Deployment

Best for: Scalability, managed infrastructure

Supported platforms:
- AWS (EC2, ECS, Elastic Beanstalk)
- Google Cloud Platform (GCE, Cloud Run)
- Microsoft Azure (App Service, AKS)
- Heroku
- DigitalOcean App Platform

---

## Platform-Specific Guides

### AWS Deployment

#### Architecture

```
              ┌──────────────┐
              │  CloudFront  │ (CDN)
              └──────┬───────┘
                     │
         ┌───────────┴────────────┐
         │                        │
    ┌────▼─────┐           ┌─────▼────┐
    │  S3      │           │   ALB    │
    │ (Static) │           │(Backend) │
    └──────────┘           └─────┬────┘
                                 │
                      ┌──────────┴───────────┐
                      │                      │
                 ┌────▼────┐          ┌─────▼─────┐
                 │  EC2    │          │    EC2    │
                 │(Backend)│          │ (Backend) │
                 └────┬────┘          └─────┬─────┘
                      │                     │
                      └──────────┬──────────┘
                                 │
                           ┌─────▼─────┐
                           │    RDS    │
                           │(PostgreSQL)│
                           └───────────┘
```

#### Step-by-Step AWS Deployment

**1. Setup RDS Database**

```bash
# Create PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier auth-system-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.3 \
  --master-username admin \
  --master-user-password YourSecurePassword123! \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxx
```

**2. Deploy Backend to EC2**

```bash
# Launch EC2 instance (Amazon Linux 2)
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Java 17
sudo yum install java-17-amazon-corretto

# Upload JAR file
scp -i your-key.pem target/auth-system-0.0.1-SNAPSHOT.jar ec2-user@your-instance-ip:~/

# Create systemd service
sudo nano /etc/systemd/system/auth-backend.service
```

Service file content:
```ini
[Unit]
Description=Auth System Backend
After=syslog.target

[Service]
User=ec2-user
ExecStart=/usr/bin/java -jar /home/ec2-user/auth-system-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
EnvironmentFile=/home/ec2-user/.env

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl enable auth-backend
sudo systemctl start auth-backend
```

**3. Deploy Frontend to S3 + CloudFront**

```bash
# Build frontend
npm run build

# Create S3 bucket
aws s3 mb s3://your-app-frontend

# Enable static website hosting
aws s3 website s3://your-app-frontend \
  --index-document index.html \
  --error-document index.html

# Upload files
aws s3 sync dist/ s3://your-app-frontend --acl public-read

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name your-app-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

**4. Configure Application Load Balancer**

```bash
# Create target group
aws elbv2 create-target-group \
  --name auth-backend-targets \
  --protocol HTTP \
  --port 8080 \
  --vpc-id vpc-xxxxx

# Create load balancer
aws elbv2 create-load-balancer \
  --name auth-backend-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx

# Register targets
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --targets Id=i-xxxxx
```

---

### Heroku Deployment

**Backend Deployment**

1. Create `Procfile`:
```
web: java -jar -Dserver.port=$PORT target/auth-system-0.0.1-SNAPSHOT.jar
```

2. Create `system.properties`:
```
java.runtime.version=17
```

3. Deploy:
```bash
# Login
heroku login

# Create app
heroku create your-auth-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set CORS_ALLOWED_ORIGINS=https://your-frontend.herokuapp.com

# Deploy
git push heroku main

# Open app
heroku open
```

**Frontend Deployment**

1. Create `static.json`:
```json
{
  "root": "dist",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  }
}
```

2. Deploy:
```bash
# Create app
heroku create your-auth-frontend

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Set API URL
heroku config:set VITE_API_URL=https://your-auth-backend.herokuapp.com/api

# Deploy
git push heroku main
```

---

### DigitalOcean App Platform

**1. Create `app.yaml`**:

```yaml
name: auth-system
services:
  - name: backend
    github:
      repo: your-username/auth-system
      branch: main
      deploy_on_push: true
    dockerfile_path: backend/Dockerfile
    envs:
      - key: JWT_SECRET
        value: ${JWT_SECRET}
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
    routes:
      - path: /api
  
  - name: frontend
    github:
      repo: your-username/auth-system
      branch: main
      deploy_on_push: true
    dockerfile_path: frontend/Dockerfile
    envs:
      - key: VITE_API_URL
        value: ${backend.PRIVATE_URL}/api
    routes:
      - path: /

databases:
  - name: db
    engine: PG
    version: "15"
```

**2. Deploy**:

```bash
# Install doctl CLI
brew install doctl

# Authenticate
doctl auth init

# Deploy
doctl apps create --spec app.yaml
```

---

### Docker Compose Production

**docker-compose.prod.yml**:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    restart: always
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/${DB_NAME}
      SPRING_DATASOURCE_USERNAME: ${DB_USER}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      CORS_ALLOWED_ORIGINS: ${FRONTEND_URL}
    depends_on:
      - postgres
    networks:
      - app-network
    expose:
      - "8080"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: always
    environment:
      VITE_API_URL: ${BACKEND_URL}/api
    networks:
      - app-network
    expose:
      - "80"

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
```

**Nginx Configuration**:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8080;
    }

    upstream frontend {
        server frontend:80;
    }

    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
        }
    }
}
```

---

## Database Migration

### Production Database Setup

**1. Create Production Database**:

```sql
CREATE DATABASE authdb_production;
CREATE USER authuser_prod WITH ENCRYPTED PASSWORD 'very-secure-password';
GRANT ALL PRIVILEGES ON DATABASE authdb_production TO authuser_prod;
```

**2. Run Migrations**:

Spring Boot will auto-create tables with `ddl-auto: update`.

For production, use Flyway or Liquibase:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

**3. Backup Before Migration**:

```bash
pg_dump -h localhost -U authuser authdb > backup_$(date +%Y%m%d).sql
```

---

## Monitoring & Logging

### Application Monitoring

**1. Spring Boot Actuator**:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**2. Prometheus Metrics**:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
```

**3. ELK Stack (Elasticsearch, Logstash, Kibana)**:

```yaml
logging:
  file:
    name: /var/log/auth-system/application.log
  pattern:
    file: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
```

### Error Tracking

**Sentry Integration**:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter</artifactId>
    <version>7.0.0</version>
</dependency>
```

```yaml
sentry:
  dsn: https://your-dsn@sentry.io/project-id
```

---

## Backup & Recovery

### Database Backups

**Automated Backup Script**:

```bash
#!/bin/bash
BACKUP_DIR=/backups
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U authuser authdb > $BACKUP_DIR/authdb_$DATE.sql
find $BACKUP_DIR -mtime +7 -delete
```

**Cron Job**:

```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

### Recovery Procedure

```bash
# Restore from backup
psql -h localhost -U authuser authdb < backup_20250103.sql
```

---

## SSL/TLS Configuration

### Let's Encrypt (Free SSL)

```bash
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Configure Spring Boot for HTTPS

```yaml
server:
  port: 8443
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: changeit
    key-store-type: PKCS12
```

---

## Performance Optimization

### 1. Database Connection Pooling

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
```

### 2. Enable Compression

```yaml
server:
  compression:
    enabled: true
    mime-types: application/json,application/xml,text/html,text/xml,text/plain
```

### 3. Caching

```java
@EnableCaching
@Configuration
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("users", "roles");
    }
}
```

---

## Troubleshooting Production Issues

### Common Issues

**1. Application Won't Start**
- Check logs: `docker-compose logs backend`
- Verify database connection
- Check environment variables

**2. 502 Bad Gateway**
- Backend service not running
- Check Nginx configuration
- Verify upstream health

**3. Database Connection Timeout**
- Check database is accessible
- Verify firewall rules
- Check connection string

---

## Post-Deployment

### Health Check

```bash
# Backend health
curl https://api.yourdomain.com/actuator/health

# Frontend
curl https://yourdomain.com
```

### Load Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test login endpoint
ab -n 1000 -c 10 -p login.json -T application/json \
  https://api.yourdomain.com/api/auth/login
```

---

## Rollback Procedure

```bash
# 1. Stop current deployment
docker-compose down

# 2. Restore database backup
psql -h localhost -U authuser authdb < backup_previous.sql

# 3. Deploy previous version
git checkout previous-tag
docker-compose up -d

# 4. Verify
curl https://api.yourdomain.com/actuator/health
```

---

## Scaling Strategy

### Horizontal Scaling

```yaml
# docker-compose.scale.yml
services:
  backend:
    deploy:
      replicas: 3
```

```bash
docker-compose -f docker-compose.prod.yml \
  -f docker-compose.scale.yml up -d --scale backend=3
```

### Load Balancing

Use Nginx, HAProxy, or cloud load balancers to distribute traffic across backend instances.

---

For more information:
- [Setup Guide](../SETUP_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Architecture](./ARCHITECTURE.md)