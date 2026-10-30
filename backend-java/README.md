# Namma Raitha - Java 21 & Spring Boot 3.x Backend Architecture

Full-stack production backend architecture for the Namma Raitha agricultural platform.

## Technology Stack
- **Runtime**: Java 21 (LTS)
- **Framework**: Spring Boot 3.3.x
- **Web Layer**: Spring Web (RESTful APIs)
- **Security**: Spring Security 6 with Stateless Session
- **Authentication**: JWT (JSON Web Token) with HMAC-SHA256
- **Persistence**: Spring Data JPA & Hibernate ORM
- **Database**: MySQL 8.x
- **Containerization**: Docker & Docker Compose

---

## Project Structure
```
backend-java/
├── pom.xml                               # Maven project definition (Java 21, Spring Boot 3.x)
├── Dockerfile                            # Multi-stage container build (Eclipse Temurin 21)
├── docker-compose.yml                    # Multi-container orchestration (MySQL 8 + Spring Boot)
├── src/
│   ├── main/
│   │   ├── java/com/nammaraitha/
│   │   │   ├── NammaRaithaApplication.java     # Application entry point
│   │   │   ├── entity/                        # JPA Entities (@Entity, Hibernate)
│   │   │   │   ├── User.java
│   │   │   │   ├── Product.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── OrderItem.java
│   │   │   │   └── MandiPrice.java
│   │   │   ├── repository/                    # Spring Data JPA Repositories
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── ProductRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   └── MandiPriceRepository.java
│   │   │   ├── security/                      # Spring Security & JWT Filter
│   │   │   │   ├── SecurityConfig.java        # SecurityFilterChain, CORS, PasswordEncoder
│   │   │   │   ├── JwtTokenProvider.java      # Token generation, claims, validation
│   │   │   │   ├── JwtAuthenticationFilter.java # OncePerRequestFilter (Bearer auth)
│   │   │   │   └── CustomUserDetailsService.java
│   │   │   ├── dto/                           # Data Transfer Objects
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── JwtAuthResponse.java
│   │   │   │   └── ApiResponse.java
│   │   │   ├── service/                       # Business Logic Layer
│   │   │   │   ├── AuthService.java
│   │   │   │   └── ProductService.java
│   │   │   └── controller/                    # Spring Web REST Controllers
│   │   │       ├── AuthController.java        # /api/v1/auth
│   │   │       ├── ProductController.java     # /api/v1/products
│   │   │       ├── OrderController.java       # /api/v1/orders
│   │   │       └── MandiController.java       # /api/v1/mandi
│   │   └── resources/
│   │       ├── application.yml                # MySQL datasource, JPA, and JWT configuration
│   │       └── db/
│   │           ├── schema.sql                 # MySQL 8 table DDL
│   │           └── data.sql                   # Initial seed data
```

---

## REST Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Authenticate & get JWT token | Public |
| POST | `/api/v1/auth/register` | Register new farmer/buyer account | Public |
| GET | `/api/v1/auth/me` | Get authenticated user info | Bearer JWT |
| GET | `/api/v1/products` | Query marketplace products (category/search) | Public |
| GET | `/api/v1/products/{id}` | Get product details | Public |
| POST | `/api/v1/products` | Create produce/input listing | Farmer / Admin |
| PUT | `/api/v1/products/{id}` | Update product details | Farmer / Admin |
| DELETE | `/api/v1/products/{id}` | Delete product listing | Farmer / Admin |
| GET | `/api/v1/orders` | List buyer / farmer orders | Bearer JWT |
| POST | `/api/v1/orders` | Place new order | Public / User |
| GET | `/api/v1/mandi` | Real-time APMC Mandi prices (State/Commodity) | Public |

---

## How to Run

### Method 1: Using Docker Compose (Recommended)
Run MySQL 8 and the Spring Boot 3 application in one command:
```bash
cd backend-java
docker compose up --build -d
```
Access points:
- Spring Boot REST APIs: `http://localhost:8080`
- MySQL Database: `localhost:3306` (User: `root`, Password: `rootpassword`, DB: `nammaraitha_db`)
- phpMyAdmin visual admin: `http://localhost:8081`

### Method 2: Running with Local Maven & Java 21
1. Start MySQL and ensure `nammaraitha_db` exists.
2. Build and run:
```bash
cd backend-java
mvn clean package
mvn spring-boot:run
```
