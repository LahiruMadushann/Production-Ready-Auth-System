# 🚀 Setup Guide - Production-Ready Auth System

This comprehensive guide will help you set up and customize the auth system for your SaaS application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Docker & Docker Compose** (Recommended)
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Includes Docker Compose automatically

**OR** (for manual setup)

- **Java Development Kit (JDK) 17+**
  - [Download OpenJDK 17](https://adoptium.net/)
  - Verify: `java -version`

- **Node.js 18+**
  - [Download Node.js](https://nodejs.org/)
  - Verify: `node -v`

- **PostgreSQL 15+** or **MySQL 8+**
  - [PostgreSQL Download](https://www.postgresql.org/download/)
  - [MySQL Download](https://dev.mysql.com/downloads/)

- **Maven 3.8+** (usually comes with Java IDEs)
  - [Download Maven](https://maven.apache.org/download.cgi)
  - Verify: `mvn -version`

---

## Installation Methods

### Method 1: Docker (Recommended) 🐳

This is the fastest way to get started. Everything is containerized and configured automatically.

#### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd auth-system
```

#### Step 2: Configure Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Edit the `.env` files if you want to change default values (optional for initial setup).

#### Step 3: Start Everything

```bash
docker-compose up -d
```

**That's it!** 🎉

- Backend API: http://localhost:8080
- Frontend UI: http://localhost:3000
- PostgreSQL: localhost:5432

#### Step 4: View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Step 5: Stop Services

```bash
docker-compose down

# Remove volumes (wipes database)
docker-compose down -v
```

---

### Method 2: Manual Setup 🔧

If you prefer running services individually or don't want to use Docker.

#### Backend Setup

1. **Configure Database**

Create a PostgreSQL database:

```sql
CREATE DATABASE authdb;
CREATE USER authuser WITH ENCRYPTED PASSWORD 'authpass123';
GRANT ALL PRIVILEGES ON DATABASE authdb TO authuser;
```

For MySQL:

```sql
CREATE DATABASE authdb;
CREATE USER 'authuser'@'localhost' IDENTIFIED BY 'authpass123';
GRANT ALL PRIVILEGES ON authdb.* TO 'authuser'@'localhost';
```

2. **Configure Backend**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/authdb
SPRING_DATASOURCE_USERNAME=authuser
SPRING_DATASOURCE_PASSWORD=authpass123
JWT_SECRET=your-256-bit-secret-key-change-this
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

For MySQL, change the URL:
```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/authdb
```

3. **Build and Run Backend**

```bash
# Build
./mvnw clean package

# Run
./mvnw spring-boot:run

# Or run the JAR
java -jar target/auth-system-0.0.1-SNAPSHOT.jar
```

Backend will start on http://localhost:8080

#### Frontend Setup

1. **Install Dependencies**

```bash
cd frontend
npm install
```

2. **Configure Frontend**

```bash
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

3. **Run Frontend**

```bash
npm run dev
```

Frontend will start on http://localhost:3000

---

## Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.yml`:

```yaml
server:
  port: 8080  # Change API port

jwt:
  secret: your-secret-key  # MUST be 256 bits minimum
  expiration: 86400000  # Token expiry in ms (24 hours)

cors:
  allowed-origins: http://localhost:3000,https://yourdomain.com

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/authdb
    username: authuser
    password: authpass123
```

### Frontend Configuration

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

### Security Best Practices

⚠️ **IMPORTANT**: Before going to production:

1. **Change JWT Secret**
   - Generate a secure 256-bit key
   - Use: `openssl rand -base64 32`

2. **Update Database Credentials**
   - Use strong, unique passwords
   - Never commit credentials to version control

3. **Configure CORS**
   - Only allow your production domain
   - Remove localhost origins

4. **Enable HTTPS**
   - Use SSL certificates
   - Configure Spring Security for HTTPS

---

## Database Setup

### PostgreSQL (Recommended)

#### Using Docker

Already included in `docker-compose.yml`. No additional setup needed.

#### Manual Setup

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt install postgresql-15
sudo systemctl start postgresql

# Windows
# Download installer from postgresql.org
```

Create database:

```sql
psql -U postgres
CREATE DATABASE authdb;
CREATE USER authuser WITH ENCRYPTED PASSWORD 'authpass123';
GRANT ALL PRIVILEGES ON DATABASE authdb TO authuser;
\q
```

### MySQL

#### Manual Setup

```bash
# macOS
brew install mysql
brew services start mysql

# Ubuntu/Debian
sudo apt install mysql-server
sudo systemctl start mysql
```

Create database:

```sql
mysql -u root -p
CREATE DATABASE authdb;
CREATE USER 'authuser'@'localhost' IDENTIFIED BY 'authpass123';
GRANT ALL PRIVILEGES ON authdb.* TO 'authuser'@'localhost';
FLUSH PRIVILEGES;
exit;
```

Update `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/authdb
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

---

## Running the Application

### Development Mode

#### With Docker

```bash
docker-compose up -d
```

Changes will auto-reload (hot reload enabled).

#### Without Docker

Terminal 1 (Backend):
```bash
cd backend
./mvnw spring-boot:run
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Production Mode

#### Build Backend

```bash
cd backend
./mvnw clean package
```

Run:
```bash
java -jar target/auth-system-0.0.1-SNAPSHOT.jar
```

#### Build Frontend

```bash
cd frontend
npm run build
```

Serve the `dist` folder with Nginx, Apache, or any static file server.

### Default Credentials

An admin user is automatically created on first run:

- **Email**: `admin@authsystem.com`
- **Password**: `Admin@123`

⚠️ **Change these credentials immediately in production!**

---

## Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Manual Testing

1. **Register a new user**
   - Go to http://localhost:3000/register
   - Fill in the form
   - Should redirect to dashboard

2. **Login**
   - Go to http://localhost:3000/login
   - Use registered credentials
   - Should redirect to dashboard

3. **Test protected routes**
   - Try accessing `/dashboard` without login
   - Should redirect to login page

4. **Test API endpoints**

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "Test@123"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'

# Get current user (replace TOKEN)
curl http://localhost:8080/api/users/me \
  -H "Authorization: Bearer TOKEN"
```

---

## Troubleshooting

### Port Already in Use

**Error**: `Port 8080 is already in use`

**Solution**:
```bash
# Find process using port
lsof -ti:8080

# Kill process
kill -9 <PID>

# Or change port in application.yml
server:
  port: 8081
```

### Database Connection Failed

**Error**: `Unable to connect to database`

**Solution**:
1. Verify database is running:
   ```bash
   # PostgreSQL
   pg_isready
   
   # MySQL
   mysqladmin ping
   ```

2. Check credentials in `.env` or `application.yml`

3. Verify database exists:
   ```sql
   \l  # PostgreSQL
   SHOW DATABASES;  # MySQL
   ```

### JWT Token Invalid

**Error**: `JWT signature does not match`

**Solution**:
- Ensure `JWT_SECRET` is the same in both `.env` and runtime
- Check token hasn't expired
- Clear browser localStorage and login again

### CORS Errors

**Error**: `Access-Control-Allow-Origin`

**Solution**:
- Add frontend URL to `CORS_ALLOWED_ORIGINS` in backend `.env`
- Restart backend after changes

### Maven Build Fails

**Error**: `Could not resolve dependencies`

**Solution**:
```bash
# Clear Maven cache
rm -rf ~/.m2/repository

# Rebuild
./mvnw clean install -U
```

### Docker Issues

**Error**: `Cannot connect to Docker daemon`

**Solution**:
- Ensure Docker Desktop is running
- Check Docker status: `docker ps`
- Restart Docker Desktop

**Error**: `port is already allocated`

**Solution**:
```bash
# Stop all containers
docker-compose down

# Remove all containers
docker rm $(docker ps -aq)

# Start again
docker-compose up -d
```

### Frontend Build Errors

**Error**: `Module not found`

**Solution**:
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

Once setup is complete:

1. ✅ Review [API Documentation](./docs/API_DOCUMENTATION.md)
2. ✅ Understand the [Architecture](./docs/ARCHITECTURE.md)
3. ✅ Plan your [Deployment](./docs/DEPLOYMENT.md)
4. ✅ Customize for your SaaS needs

---

## Support

Having issues? 

1. Check this troubleshooting guide
2. Review error logs: `docker-compose logs -f`
3. Verify all prerequisites are installed
4. Contact support: support@yourcompany.com

**Happy coding! 🚀**