# 📚 API Documentation

Complete API reference for the Production-Ready Auth System.

## Base URL

```
http://localhost:8080/api
```

## Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Authentication Endpoints

#### Register User

Create a new user account.

**Endpoint**: `POST /auth/register`

**Access**: Public

**Request Body**:
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePass@123"
}
```

**Validation Rules**:
- `email`: Required, valid email format
- `firstName`: Required, 2-50 characters
- `lastName`: Required, 2-50 characters
- `password`: Required, minimum 8 characters, must contain:
  - At least one digit
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one special character (@#$%^&+=)

**Success Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["ROLE_USER"]
}
```

**Error Response** (400 Bad Request):
```json
{
  "timestamp": "2025-01-03T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "path": "/api/auth/register",
  "validationErrors": {
    "email": "Email should be valid",
    "password": "Password must contain at least one digit"
  }
}
```

**Error Response** (409 Conflict):
```json
{
  "timestamp": "2025-01-03T10:30:00",
  "status": 409,
  "error": "Duplicate User",
  "message": "User with email user@example.com already exists",
  "path": "/api/auth/register"
}
```

---

#### Login User

Authenticate and receive JWT token.

**Endpoint**: `POST /auth/login`

**Access**: Public

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["ROLE_USER"]
}
```

**Error Response** (401 Unauthorized):
```json
{
  "timestamp": "2025-01-03T10:30:00",
  "status": 401,
  "error": "Authentication Failed",
  "message": "Invalid email or password",
  "path": "/api/auth/login"
}
```

---

### User Endpoints

#### Get Current User

Get authenticated user's information.

**Endpoint**: `GET /users/me`

**Access**: Authenticated users only

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["ROLE_USER"],
  "enabled": true,
  "createdAt": "2025-01-03T10:00:00",
  "updatedAt": "2025-01-03T10:00:00"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "timestamp": "2025-01-03T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required",
  "path": "/api/users/me"
}
```

---

#### Get User by ID

Get specific user by ID (Admin only).

**Endpoint**: `GET /users/{id}`

**Access**: Admin role required (`ROLE_ADMIN`)

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Path Parameters**:
- `id` (Long): User ID

**Success Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["ROLE_USER"],
  "enabled": true,
  "createdAt": "2025-01-03T10:00:00",
  "updatedAt": "2025-01-03T10:00:00"
}
```

**Error Response** (403 Forbidden):
```json
{
  "timestamp": "2025-01-03T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied",
  "path": "/api/users/1"
}
```

**Error Response** (404 Not Found):
```json
{
  "timestamp": "2025-01-03T10:30:00",
  "status": 404,
  "error": "User Not Found",
  "message": "User not found with id: 1",
  "path": "/api/users/1"
}
```

---

#### Get All Users

Get list of all users (Admin only).

**Endpoint**: `GET /users`

**Access**: Admin role required (`ROLE_ADMIN`)

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "email": "admin@authsystem.com",
    "firstName": "Admin",
    "lastName": "User",
    "roles": ["ROLE_USER", "ROLE_ADMIN"],
    "enabled": true,
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  },
  {
    "id": 2,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["ROLE_USER"],
    "enabled": true,
    "createdAt": "2025-01-03T10:00:00",
    "updatedAt": "2025-01-03T10:00:00"
  }
]
```

---

## cURL Examples

### Register

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "password": "SecurePass@123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass@123"
  }'
```

### Get Current User

```bash
curl http://localhost:8080/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Get All Users (Admin)

```bash
curl http://localhost:8080/api/users \
  -H "Authorization: Bearer <admin-token>"
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## Error Response Format

All error responses follow this structure:

```json
{
  "timestamp": "2025-01-03T10:30:00",
  "status": 400,
  "error": "Error Type",
  "message": "Detailed error message",
  "path": "/api/endpoint",
  "validationErrors": {
    "field": "Field-specific error message"
  }
}
```

The `validationErrors` field is only present for validation errors (400 Bad Request).

---

## JWT Token

### Token Structure

The JWT token contains:
- **Header**: Algorithm and token type
- **Payload**: User information (email, roles)
- **Signature**: Verification signature

### Token Expiration

Default: 24 hours (86400000 milliseconds)

Configure in `application.yml`:
```yaml
jwt:
  expiration: 86400000
```

### Token Usage

Include in every authenticated request:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Refresh

Currently, tokens must be renewed by logging in again. To implement automatic refresh:

1. Add refresh token endpoint
2. Store refresh token in database
3. Implement token refresh logic

---

## Rate Limiting

Currently, no rate limiting is implemented. For production:

1. Add Spring Security rate limiting
2. Use Redis for distributed rate limiting
3. Configure per-endpoint limits

Example configuration:
```java
@Bean
public RateLimiter rateLimiter() {
    return RateLimiter.create(100.0); // 100 requests per second
}
```

---

## CORS Configuration

Configured in `application.yml`:

```yaml
cors:
  allowed-origins: http://localhost:3000,https://yourdomain.com
```

Allowed methods: GET, POST, PUT, DELETE, OPTIONS

---

## Security Headers

The API includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## Postman Collection

You can import this API into Postman:

1. Create new collection
2. Add endpoints from this documentation
3. Set `{{baseUrl}}` variable to `http://localhost:8080/api`
4. Set `{{token}}` variable after login

---

## Testing with Frontend

The React frontend automatically handles:
- Token storage in localStorage
- Authorization header injection
- Token refresh on 401 errors
- CORS requests

See `frontend/src/api/axios.ts` for implementation details.

---

## Production Considerations

Before deploying to production:

1. **Enable HTTPS**: All requests should use SSL/TLS
2. **Rate Limiting**: Implement to prevent abuse
3. **Request Logging**: Log all API requests
4. **Error Monitoring**: Use tools like Sentry
5. **API Versioning**: Add `/v1/` to endpoints
6. **Documentation**: Consider Swagger/OpenAPI

---

## Future Enhancements

Potential additions:

- ✅ Email verification endpoint
- ✅ Password reset endpoint
- ✅ User profile update endpoint
- ✅ Admin user management (create, update, delete)
- ✅ Role management endpoints
- ✅ Audit log endpoints
- ✅ OAuth2 integration (Google, GitHub)
- ✅ Two-factor authentication

---

For more information, see:
- [Setup Guide](../SETUP_GUIDE.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)