# 🏗️ Architecture Documentation

Complete system architecture and design patterns of the Production-Ready Auth System.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Design Patterns](#design-patterns)
4. [Security Architecture](#security-architecture)
5. [Database Design](#database-design)
6. [Flow Diagrams](#flow-diagrams)

---

## System Overview

### High-Level Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│                 │      │                  │      │                 │
│  React Frontend │─────▶│  Spring Boot API │─────▶│   PostgreSQL    │
│   (Port 3000)   │◀─────│   (Port 8080)    │◀─────│   (Port 5432)   │
│                 │      │                  │      │                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
      │                           │
      │                           │
      ▼                           ▼
   Browser                   JWT Token
   Storage                   Validation
```

### Technology Stack

**Backend**:
- Java 17
- Spring Boot 3.2
- Spring Security 6
- Spring Data JPA
- Hibernate ORM
- JWT (JJWT 0.12.3)
- PostgreSQL/MySQL

**Frontend**:
- React 18
- TypeScript 5
- Vite
- React Router 6
- Axios

**DevOps**:
- Docker & Docker Compose
- Maven

---

## Architecture Layers

### Backend Architecture

The backend follows a **layered architecture** pattern:

```
┌────────────────────────────────────────┐
│         Controller Layer               │  ← HTTP Request/Response
├────────────────────────────────────────┤
│         Service Layer                  │  ← Business Logic
├────────────────────────────────────────┤
│         Repository Layer               │  ← Data Access
├────────────────────────────────────────┤
│         Entity Layer                   │  ← Database Models
└────────────────────────────────────────┘
```

#### 1. Controller Layer

**Responsibility**: Handle HTTP requests and responses

**Components**:
- `AuthController`: Authentication endpoints
- `UserController`: User management endpoints

**Features**:
- Request validation with `@Valid`
- Exception handling
- CORS configuration
- HTTP status codes

**Example**:
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // Delegates to service layer
    }
}
```

#### 2. Service Layer

**Responsibility**: Business logic and orchestration

**Components**:
- `AuthService`: Registration, login logic
- `UserService`: User operations, UserDetailsService
- `JwtService`: Token generation and validation

**Features**:
- Transaction management
- Business rule enforcement
- Security logic
- DTO transformations

**Design Pattern**: Service Layer Pattern

#### 3. Repository Layer

**Responsibility**: Database operations

**Components**:
- `UserRepository`: User CRUD operations
- `RoleRepository`: Role CRUD operations

**Features**:
- Spring Data JPA
- Custom queries with `@Query`
- Automatic query generation

**Design Pattern**: Repository Pattern

#### 4. Entity Layer

**Responsibility**: Database models

**Components**:
- `User`: User entity with roles
- `Role`: Role entity

**Features**:
- JPA annotations
- Entity relationships
- Lifecycle callbacks

---

### Frontend Architecture

```
┌────────────────────────────────────────┐
│         Pages/Views                    │  ← User Interface
├────────────────────────────────────────┤
│         Components                     │  ← Reusable UI Elements
├────────────────────────────────────────┤
│         Context (State)                │  ← Global State Management
├────────────────────────────────────────┤
│         API Layer                      │  ← HTTP Client
└────────────────────────────────────────┘
```

#### Component Hierarchy

```
App
├── AuthProvider (Context)
│   ├── Router
│   │   ├── Login (Page)
│   │   ├── Register (Page)
│   │   └── ProtectedRoute
│   │       ├── Layout
│   │       │   ├── Navbar (Component)
│   │       │   ├── Dashboard (Page)
│   │       │   └── Profile (Page)
```

---

## Design Patterns

### 1. Layered Architecture

**Purpose**: Separation of concerns

**Benefits**:
- Clear responsibility boundaries
- Easy to test individual layers
- Maintainable and scalable
- Follows SOLID principles

### 2. Repository Pattern

**Purpose**: Abstraction over data access

**Implementation**:
```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

**Benefits**:
- Decouples business logic from persistence
- Easy to mock for testing
- Consistent data access API

### 3. Service Layer Pattern

**Purpose**: Encapsulate business logic

**Implementation**:
```java
@Service
public class AuthService {
    public AuthResponse register(RegisterRequest request) {
        // Business logic here
    }
}
```

**Benefits**:
- Centralized business rules
- Transaction management
- Reusable across controllers

### 4. DTO Pattern

**Purpose**: Data transfer between layers

**Implementation**:
```java
public class LoginRequest {
    private String email;
    private String password;
}
```

**Benefits**:
- Prevents over-fetching
- API versioning flexibility
- Input validation

### 5. Dependency Injection

**Purpose**: Loose coupling

**Implementation**:
```java
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
}
```

**Benefits**:
- Testability
- Flexibility
- Reduced coupling

### 6. Strategy Pattern (Security)

**Purpose**: Flexible authentication

**Implementation**:
```java
@Bean
public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
}
```

### 7. Filter Chain Pattern

**Purpose**: Request processing pipeline

**Implementation**:
```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(...) {
        // Extract and validate JWT
        // Set authentication in context
    }
}
```

---

## Security Architecture

### Authentication Flow

```
1. User submits credentials
   │
   ├──▶ AuthController receives request
   │
   ├──▶ AuthService validates credentials
   │
   ├──▶ Spring Security AuthenticationManager
   │
   ├──▶ UserDetailsService loads user
   │
   ├──▶ PasswordEncoder verifies password
   │
   ├──▶ JwtService generates token
   │
   └──▶ Token returned to client
```

### Authorization Flow

```
1. Client sends request with JWT
   │
   ├──▶ JwtAuthenticationFilter intercepts
   │
   ├──▶ Extract and validate JWT token
   │
   ├──▶ Load UserDetails from database
   │
   ├──▶ Set Authentication in SecurityContext
   │
   ├──▶ Method-level security checks (@PreAuthorize)
   │
   └──▶ Proceed to controller or deny access
```

### Security Components

#### 1. JWT Service

**Responsibilities**:
- Generate JWT tokens
- Validate JWT tokens
- Extract claims from tokens

**Key Features**:
- HS256 algorithm
- Configurable expiration
- Secure signing key

#### 2. JWT Authentication Filter

**Responsibilities**:
- Intercept all requests
- Extract and validate JWT
- Set authentication context

**Execution Order**:
- Runs before UsernamePasswordAuthenticationFilter
- Early in the filter chain

#### 3. Security Configuration

**Features**:
- Stateless sessions
- CORS configuration
- Endpoint security rules
- Custom authentication provider

#### 4. Password Encoding

**Algorithm**: BCrypt with strength 12

**Benefits**:
- Salted hashing
- Slow algorithm (brute-force resistant)
- Industry standard

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐          ┌─────────────────┐
│      User       │          │      Role       │
├─────────────────┤          ├─────────────────┤
│ id (PK)         │          │ id (PK)         │
│ email           │◀────────▶│ name            │
│ firstName       │   M:N    │ description     │
│ lastName        │          │ createdAt       │
│ password        │          └─────────────────┘
│ enabled         │
│ accountNonExp.. │
│ accountNonLoc.. │
│ credentialsNo.. │
│ createdAt       │
│ updatedAt       │
└─────────────────┘

        │
        │ M:N
        │
        ▼
┌─────────────────┐
│   user_roles    │  ← Join Table
├─────────────────┤
│ user_id (FK)    │
│ role_id (FK)    │
└─────────────────┘
```

### Tables

#### users

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| enabled | BOOLEAN | NOT NULL, DEFAULT true |
| account_non_expired | BOOLEAN | NOT NULL, DEFAULT true |
| account_non_locked | BOOLEAN | NOT NULL, DEFAULT true |
| credentials_non_expired | BOOLEAN | NOT NULL, DEFAULT true |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

#### roles

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(50) | UNIQUE, NOT NULL |
| description | VARCHAR(255) | NULL |
| created_at | TIMESTAMP | NOT NULL |

#### user_roles

| Column | Type | Constraints |
|--------|------|-------------|
| user_id | BIGINT | FOREIGN KEY (users.id) |
| role_id | BIGINT | FOREIGN KEY (roles.id) |
| | | PRIMARY KEY (user_id, role_id) |

### Relationships

- **User to Role**: Many-to-Many
  - A user can have multiple roles
  - A role can be assigned to multiple users
  - Join table: `user_roles`

### Indexes

Recommended indexes for performance:

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

---

## Flow Diagrams

### User Registration Flow

```
Frontend                Backend                  Database
   │                       │                         │
   ├──Register Request────▶│                         │
   │   (email, password)   │                         │
   │                       ├──Validate Input         │
   │                       │                         │
   │                       ├──Check Email Exists────▶│
   │                       │◀────Return Result───────┤
   │                       │                         │
   │                       ├──Hash Password          │
   │                       │                         │
   │                       ├──Create User Entity     │
   │                       │                         │
   │                       ├──Assign Default Role    │
   │                       │                         │
   │                       ├──Save User─────────────▶│
   │                       │◀────Return User─────────┤
   │                       │                         │
   │                       ├──Generate JWT Token     │
   │                       │                         │
   │◀──Return Token────────┤                         │
   │   (with user data)    │                         │
   │                       │                         │
   ├──Store Token          │                         │
   │   (localStorage)      │                         │
   │                       │                         │
   └──Redirect Dashboard   │                         │
```

### User Login Flow

```
Frontend                Backend                  Database
   │                       │                         │
   ├──Login Request───────▶│                         │
   │   (email, password)   │                         │
   │                       ├──AuthenticationManager  │
   │                       │                         │
   │                       ├──Load User by Email────▶│
   │                       │◀────Return User─────────┤
   │                       │                         │
   │                       ├──Verify Password        │
   │                       │   (BCrypt compare)      │
   │                       │                         │
   │                       ├──Generate JWT Token     │
   │                       │                         │
   │◀──Return Token────────┤                         │
   │   (with user data)    │                         │
   │                       │                         │
   ├──Store Token          │                         │
   │   (localStorage)      │                         │
   │                       │                         │
   └──Redirect Dashboard   │                         │
```

### Protected Route Access Flow

```
Frontend                Backend                  Database
   │                       │                         │
   ├──API Request─────────▶│                         │
   │   + JWT Token         │                         │
   │                       ├──Extract JWT from Header│
   │                       │                         │
   │                       ├──Validate JWT Signature │
   │                       │                         │
   │                       ├──Check Expiration       │
   │                       │                         │
   │                       ├──Extract Username       │
   │                       │                         │
   │                       ├──Load User────────────▶│
   │                       │◀────Return User─────────┤
   │                       │                         │
   │                       ├──Verify User Match      │
   │                       │                         │
   │                       ├──Set SecurityContext    │
   │                       │                         │
   │                       ├──Check @PreAuthorize    │
   │                       │   (Role validation)     │
   │                       │                         │
   │                       ├──Execute Controller     │
   │                       │                         │
   │◀──Return Data─────────┤                         │
   │                       │                         │
```

---

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)

Each class has one reason to change:
- `AuthController`: Handle HTTP requests
- `AuthService`: Business logic
- `JwtService`: Token operations
- `UserRepository`: Data access

### Open/Closed Principle (OCP)

System is open for extension, closed for modification:
- New authentication providers can be added
- New roles can be created without code changes
- Custom user fields via inheritance

### Liskov Substitution Principle (LSP)

Implementations are substitutable:
- `UserRepository` can be replaced with any JPA repository
- Authentication providers are interchangeable

### Interface Segregation Principle (ISP)

Clients don't depend on unnecessary interfaces:
- Specific repository methods per entity
- Focused service interfaces

### Dependency Inversion Principle (DIP)

Depend on abstractions:
- Controllers depend on Service interfaces
- Services depend on Repository interfaces
- Spring DI manages dependencies

---

## Performance Considerations

### Database Optimization

1. **Eager vs Lazy Loading**
   - Roles loaded eagerly with users
   - Prevents N+1 query problem

2. **Query Optimization**
   - Custom JPQL with JOIN FETCH
   - Indexed columns (email, role names)

3. **Connection Pooling**
   - HikariCP (default in Spring Boot)
   - Configured pool size

### Caching Strategy

Future implementation:
```java
@Cacheable("users")
public User getUserById(Long id) {
    return userRepository.findById(id);
}
```

### Stateless Architecture

- No server-side sessions
- Horizontal scaling friendly
- JWT contains all needed info

---

## Testing Strategy

### Unit Tests

- Service layer logic
- JWT token generation/validation
- Password encoding

### Integration Tests

- Controller endpoints
- Database operations
- Security configuration

### End-to-End Tests

- Complete user flows
- Authentication workflows
- Protected route access

---

## Future Architecture Enhancements

1. **Microservices**: Split into auth and user services
2. **Event-Driven**: Add event bus for user activities
3. **CQRS**: Separate read and write models
4. **API Gateway**: Centralized entry point
5. **Service Mesh**: For microservices communication

---

For implementation details, see:
- [Setup Guide](../SETUP_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)