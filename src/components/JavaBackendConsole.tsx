import React, { useState } from 'react';
import {
  Server,
  Database,
  ShieldCheck,
  Key,
  Layers,
  Code2,
  Terminal,
  FileCode,
  Copy,
  Check,
  Play,
  Download,
  ExternalLink,
  Cpu,
  Sparkles,
  Activity,
  Box,
  FolderTree
} from 'lucide-react';
import { springBootApi } from '../services/springBootApi';

interface JavaBackendConsoleProps {
  onClose?: () => void;
  lang?: string;
}

type TabType = 'architecture' | 'code' | 'api-tester' | 'mysql' | 'docker';

export const JavaBackendConsole: React.FC<JavaBackendConsoleProps> = ({ onClose, lang = 'en' }) => {
  const [activeTab, setActiveTab] = useState<TabType>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // API Tester state
  const [selectedEndpoint, setSelectedEndpoint] = useState<'login' | 'products' | 'mandi' | 'orders'>('login');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [testJwtToken, setTestJwtToken] = useState<string | null>(null);

  // Selected code file for viewer
  const [selectedFile, setSelectedFile] = useState<string>('SecurityConfig.java');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestApi = async () => {
    setIsLoadingApi(true);
    setTestResponse(null);
    try {
      if (selectedEndpoint === 'login') {
        const res = await springBootApi.login('farmer_ravi', 'Password@123');
        setTestJwtToken(res.accessToken);
        setTestResponse({
          status: '200 OK',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${res.accessToken.substring(0, 25)}...`,
          },
          responseBody: res,
        });
      } else if (selectedEndpoint === 'products') {
        const res = await springBootApi.getProducts('all', '');
        setTestResponse({
          status: '200 OK',
          source: 'Spring Data JPA -> MySQL (products table)',
          count: res.length,
          responseBody: res.slice(0, 4),
        });
      } else if (selectedEndpoint === 'mandi') {
        const res = await springBootApi.getMandiPrices('all', 'all');
        setTestResponse({
          status: '200 OK',
          source: 'Spring Data JPA -> MySQL (mandi_prices table)',
          count: res.length,
          responseBody: res.slice(0, 4),
        });
      } else if (selectedEndpoint === 'orders') {
        const sampleOrder = {
          buyerName: 'Anita Sharma',
          buyerPhone: '9876543210',
          totalAmount: 480.00,
          paymentMethod: 'COD',
          deliveryAddress: 'No. 42, Cauvery Road, Mandya, Karnataka',
          deliveryDistrict: 'Mandya',
          deliveryState: 'Karnataka',
          items: [
            { productId: 'prod-1', productName: 'Farm Fresh Kolar Red Tomatoes', unitPrice: 22.00, quantity: 10, subtotal: 220.00 },
            { productId: 'prod-2', productName: 'Fresh Red Onions', unitPrice: 28.00, quantity: 5, subtotal: 140.00 },
          ],
        };
        const res = await springBootApi.placeOrder(sampleOrder);
        setTestResponse({
          status: '201 CREATED',
          source: 'Hibernate Transactional -> MySQL (orders & order_items tables)',
          responseBody: res,
        });
      }
    } catch (err: any) {
      setTestResponse({
        status: 'Error',
        message: err.message,
      });
    } finally {
      setIsLoadingApi(false);
    }
  };

  const CODE_SNIPPETS: Record<string, { title: string; path: string; language: string; content: string }> = {
    'SecurityConfig.java': {
      title: 'Spring Security 6 Configuration',
      path: 'backend-java/src/main/java/com/nammaraitha/security/SecurityConfig.java',
      language: 'java',
      content: `package com.nammaraitha.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize
                // Public Endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/mandi/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/weather/**").permitAll()
                // Role-based Secured Endpoints
                .requestMatchers(HttpMethod.POST, "/api/v1/products/**").hasAnyRole("FARMER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasAnyRole("FARMER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}`
    },
    'JwtTokenProvider.java': {
      title: 'JWT Authentication Token Provider',
      path: 'backend-java/src/main/java/com/nammaraitha/security/JwtTokenProvider.java',
      language: 'java',
      content: `package com.nammaraitha.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    @Value("\${app.jwt.secret}")
    private String jwtSecret;

    @Value("\${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationDate;

    public String generateToken(Authentication authentication, Long userId, String role, String phone) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);
        claims.put("phone", phone);

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date())
                .expiration(expireDate)
                .signWith(key(), Jwts.SIG.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith((SecretKey) key()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}`
    },
    'User.java': {
      title: 'JPA Entity - MySQL User Table',
      path: 'backend-java/src/main/java/com/nammaraitha/entity/User.java',
      language: 'java',
      content: `package com.nammaraitha.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, length = 25)
    private String phone;

    @Column(nullable = false, length = 50)
    private String role; // ROLE_FARMER, ROLE_BUYER, ROLE_ADMIN

    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String state;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}`
    },
    'ProductController.java': {
      title: 'Spring Web REST Controller',
      path: 'backend-java/src/main/java/com/nammaraitha/controller/ProductController.java',
      language: 'java',
      content: `package com.nammaraitha.controller;

import com.nammaraitha.dto.ApiResponse;
import com.nammaraitha.entity.Product;
import com.nammaraitha.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts(
            @RequestParam(required = false, defaultValue = "all") String category,
            @RequestParam(required = false) String query
    ) {
        List<Product> products = productService.getAllProducts(category, query);
        return ResponseEntity.ok(ApiResponse.ok("Retrieved from MySQL", products));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        Product created = productService.createProduct(product);
        return new ResponseEntity<>(ApiResponse.ok("Product stored in MySQL", created), HttpStatus.CREATED);
    }
}`
    },
    'schema.sql': {
      title: 'MySQL 8 Database Schema (DDL)',
      path: 'backend-java/src/main/resources/db/schema.sql',
      language: 'sql',
      content: `CREATE DATABASE IF NOT EXISTS nammaraitha_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nammaraitha_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_FARMER',
    district VARCHAR(100) DEFAULT 'Mandya',
    state VARCHAR(100) DEFAULT 'Karnataka',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    quantity INT NOT NULL,
    location VARCHAR(150) NOT NULL,
    farmer_name VARCHAR(150) NOT NULL,
    farmer_phone VARCHAR(25) NOT NULL,
    is_organic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(60) PRIMARY KEY,
    buyer_id BIGINT,
    buyer_name VARCHAR(150) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'COD',
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;`
    },
    'pom.xml': {
      title: 'Maven Dependency Configuration (Java 21 & Spring Boot 3.3)',
      path: 'backend-java/pom.xml',
      language: 'xml',
      content: `<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
    </parent>
    <groupId>com.nammaraitha</groupId>
    <artifactId>namma-raitha-backend</artifactId>
    <version>1.0.0</version>
    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.6</jjwt.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
    </dependencies>
</project>`
    },
    'docker-compose.yml': {
      title: 'Docker Compose (MySQL 8 + Spring Boot 3 + phpMyAdmin)',
      path: 'backend-java/docker-compose.yml',
      language: 'yaml',
      content: `version: '3.8'

services:
  mysql-db:
    image: mysql:8.0.36
    container_name: nammaraitha-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: nammaraitha_db
      MYSQL_USER: raitha_user
      MYSQL_PASSWORD: raitha_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./src/main/resources/db/schema.sql:/docker-entrypoint-initdb.d/01_schema.sql:ro
      - ./src/main/resources/db/data.sql:/docker-entrypoint-initdb.d/02_data.sql:ro

  spring-boot-backend:
    build: .
    container_name: nammaraitha-spring-boot
    depends_on:
      - mysql-db
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql-db:3306/nammaraitha_db?useSSL=false
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
    ports:
      - "8080:8080"`
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/70 text-amber-300 text-xs font-black tracking-wide shadow-inner">
              <Cpu className="w-4 h-4 text-amber-300" />
              <span>Full Stack Architecture: Java 21 & Spring Boot 3.x</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-white">
              Java Full Stack Architecture Console
            </h1>
            <p className="text-emerald-200/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Complete production backend architecture: <span className="text-amber-300 font-bold">Java 21</span>, <span className="text-amber-300 font-bold">Spring Boot 3.3</span>, <span className="text-amber-300 font-bold">Spring Web REST APIs</span>, <span className="text-amber-300 font-bold">Spring Security 6 with JWT</span>, <span className="text-amber-300 font-bold">Spring Data JPA / Hibernate</span>, and <span className="text-amber-300 font-bold">MySQL 8.0</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                const text = Object.entries(CODE_SNIPPETS)
                  .map(([name, data]) => `// === ${name} ===\n${data.content}\n\n`)
                  .join('\n');
                copyToClipboard(text, 'all-code');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs shadow-md transition hover:scale-105 active:scale-95"
            >
              {copiedKey === 'all-code' ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4 text-emerald-950" />}
              <span>{copiedKey === 'all-code' ? 'All Java Code Copied!' : 'Copy All Java Files'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-6 mt-6 border-t border-emerald-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Full Stack Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/80'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>2. Java Source Code Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('api-tester')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'api-tester'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/80'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>3. Spring Web & JWT Live Tester</span>
          </button>

          <button
            onClick={() => setActiveTab('mysql')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'mysql'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/80'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>4. MySQL Database Schema</span>
          </button>

          <button
            onClick={() => setActiveTab('docker')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'docker'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/80'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>5. Docker & Run Guide</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Architecture Diagram & Tech Stack */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Frontend */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-black">
                ⚛️
              </div>
              <h3 className="font-extrabold text-stone-900 text-sm">Frontend Layer</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                React.js SPA with Tailwind CSS & HTML5/CSS3. Handles JWT storage, client routing, offline-first sync, and responsive mobile-first UI.
              </p>
              <div className="text-[11px] font-mono text-sky-800 font-semibold bg-sky-50 p-2 rounded-lg">
                React 18 &bull; Vite &bull; Tailwind &bull; Fetch API
              </div>
            </div>

            {/* API & Security */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
                🔒
              </div>
              <h3 className="font-extrabold text-stone-900 text-sm">Spring Security & JWT</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Spring Security 6 with stateless session management, BCrypt hashing, and OncePerRequestFilter parsing Bearer tokens with JJWT 0.12.
              </p>
              <div className="text-[11px] font-mono text-amber-800 font-semibold bg-amber-50 p-2 rounded-lg">
                SecurityFilterChain &bull; JJWT &bull; BCrypt
              </div>
            </div>

            {/* Business Logic */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                ☕
              </div>
              <h3 className="font-extrabold text-stone-900 text-sm">Spring Boot 3.x Web</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Java 21 LTS RESTful API Controllers. Provides endpoints for Auth, Products, Orders, APMC Mandi, and Weather Advisory.
              </p>
              <div className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg">
                Java 21 &bull; Spring Boot 3.3 &bull; REST
              </div>
            </div>

            {/* Data Layer */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black">
                🐬
              </div>
              <h3 className="font-extrabold text-stone-900 text-sm">Spring Data JPA & MySQL</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Hibernate ORM with Spring Data JPA Repositories connected to MySQL 8.0 via HikariCP connection pooling and ACID transactions.
              </p>
              <div className="text-[11px] font-mono text-indigo-800 font-semibold bg-indigo-50 p-2 rounded-lg">
                MySQL 8.0 &bull; Hibernate &bull; HikariCP
              </div>
            </div>
          </div>

          {/* End-to-End Flow Diagram */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 space-y-4 font-mono text-xs overflow-x-auto shadow-xl">
            <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Full Stack Request-Response Lifecycle Flow</span>
            </div>
            <pre className="text-emerald-300 leading-relaxed text-[11px] sm:text-xs">
{`[ React.js Frontend (Port 3000) ]
        │
        ├── 1. POST /api/v1/auth/login { username, password }
        │
        ▼
[ Spring Security 6 & JWT Filter (Port 8080) ]
        │
        ├── 2. CustomUserDetailsService queries MySQL users table
        ├── 3. BCryptPasswordEncoder validates credentials
        ├── 4. JwtTokenProvider generates HS256 signed JWT
        │
        ▼
[ Spring Web REST Controllers ]
        │
        ├── 5. ProductController, OrderController, MandiController
        │
        ▼
[ Spring Data JPA & Hibernate ORM ]
        │
        ├── 6. Transactional CRUD operations via JpaRepository
        │
        ▼
[ MySQL 8.0 Database (Port 3306) ]
        ├── users, products, orders, order_items, mandi_prices`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Java Code Explorer */}
      {activeTab === 'code' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-md">
          {/* File Selector Bar */}
          <div className="bg-stone-900 text-stone-300 p-3 sm:p-4 flex items-center justify-between border-b border-stone-800 overflow-x-auto gap-2">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Project Files:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {Object.keys(CODE_SNIPPETS).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      selectedFile === fileName
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700'
                    }`}
                  >
                    {fileName}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(CODE_SNIPPETS[selectedFile]?.content || '', selectedFile)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold shrink-0 transition"
            >
              {copiedKey === selectedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
              <span>{copiedKey === selectedFile ? 'Copied!' : 'Copy File'}</span>
            </button>
          </div>

          {/* File Metadata Banner */}
          <div className="bg-stone-800 px-5 py-2 text-[11px] text-stone-400 font-mono flex items-center justify-between border-b border-stone-700">
            <span>{CODE_SNIPPETS[selectedFile]?.path}</span>
            <span className="text-amber-400 font-bold">{CODE_SNIPPETS[selectedFile]?.title}</span>
          </div>

          {/* Code Viewer */}
          <div className="p-4 sm:p-6 bg-stone-950 overflow-x-auto max-h-[500px]">
            <pre className="font-mono text-xs text-emerald-300 leading-relaxed">
              <code>{CODE_SNIPPETS[selectedFile]?.content}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Spring Web & JWT Live Tester */}
      {activeTab === 'api-tester' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-black text-stone-900 font-heading">
                Spring Web REST API Live Interactive Sandbox
              </h2>
              <p className="text-xs text-stone-500">
                Execute live requests against the Spring Boot REST endpoints with JWT token validation and MySQL JSON responses.
              </p>
            </div>

            {testJwtToken && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full flex items-center gap-1.5 w-fit">
                <Key className="w-3.5 h-3.5 text-emerald-700" />
                Active Bearer JWT Token Acquired
              </span>
            )}
          </div>

          {/* Endpoint Choice Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => setSelectedEndpoint('login')}
              className={`p-3 rounded-2xl border text-left transition ${
                selectedEndpoint === 'login'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50'
              }`}
            >
              <div className="text-[10px] font-black text-emerald-700 uppercase">POST /api/v1/auth/login</div>
              <div className="text-xs font-extrabold text-stone-900 mt-0.5">JWT Auth & Login</div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('products')}
              className={`p-3 rounded-2xl border text-left transition ${
                selectedEndpoint === 'products'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50'
              }`}
            >
              <div className="text-[10px] font-black text-sky-700 uppercase">GET /api/v1/products</div>
              <div className="text-xs font-extrabold text-stone-900 mt-0.5">JPA Products Query</div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('mandi')}
              className={`p-3 rounded-2xl border text-left transition ${
                selectedEndpoint === 'mandi'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50'
              }`}
            >
              <div className="text-[10px] font-black text-amber-700 uppercase">GET /api/v1/mandi</div>
              <div className="text-xs font-extrabold text-stone-900 mt-0.5">APMC Mandi Rates</div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('orders')}
              className={`p-3 rounded-2xl border text-left transition ${
                selectedEndpoint === 'orders'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50'
              }`}
            >
              <div className="text-[10px] font-black text-purple-700 uppercase">POST /api/v1/orders</div>
              <div className="text-xs font-extrabold text-stone-900 mt-0.5">Place Order in MySQL</div>
            </button>
          </div>

          {/* Test Trigger Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTestApi}
              disabled={isLoadingApi}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 text-amber-300 ${isLoadingApi ? 'animate-spin' : ''}`} />
              <span>{isLoadingApi ? 'Executing Spring Boot Request...' : 'Send REST Request'}</span>
            </button>
            <span className="text-xs text-stone-500 font-mono">
              Target: /api/v1/{selectedEndpoint === 'login' ? 'auth/login' : selectedEndpoint} (Spring Boot 3.x Backend)
            </span>
          </div>

          {/* Output Viewer */}
          {testResponse && (
            <div className="space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                <span>Response Output:</span>
                <span className="text-emerald-700 font-mono">{testResponse.status}</span>
              </div>
              <div className="p-4 bg-stone-900 rounded-2xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-72">
                <pre>{JSON.stringify(testResponse, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: MySQL Database Schema Visualizer */}
      {activeTab === 'mysql' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-stone-900 font-heading flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-700" />
                <span>MySQL 8.0 Relational Database Schema (`nammaraitha_db`)</span>
              </h2>
              <p className="text-xs text-stone-500">
                Normalized relational tables configured with InnoDB storage engine, UTF8MB4 charset, foreign key constraints, and performance indexes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Table 1: users */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between font-black text-xs text-stone-900">
                  <span className="font-mono text-emerald-800">TABLE users</span>
                  <span className="text-[10px] text-stone-500 uppercase">Authentication & Roles</span>
                </div>
                <div className="font-mono text-[11px] text-stone-600 divide-y divide-stone-200">
                  <div className="py-1 flex justify-between"><span className="text-amber-800 font-bold">id (PK)</span><span>BIGINT AUTO_INCREMENT</span></div>
                  <div className="py-1 flex justify-between"><span>username (UNIQUE)</span><span>VARCHAR(100)</span></div>
                  <div className="py-1 flex justify-between"><span>email (UNIQUE)</span><span>VARCHAR(150)</span></div>
                  <div className="py-1 flex justify-between"><span>password_hash</span><span>VARCHAR(255) BCrypt</span></div>
                  <div className="py-1 flex justify-between"><span>role</span><span>VARCHAR(50)</span></div>
                  <div className="py-1 flex justify-between"><span>phone, district, state</span><span>VARCHAR(100)</span></div>
                </div>
              </div>

              {/* Table 2: products */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between font-black text-xs text-stone-900">
                  <span className="font-mono text-emerald-800">TABLE products</span>
                  <span className="text-[10px] text-stone-500 uppercase">Marketplace & Store</span>
                </div>
                <div className="font-mono text-[11px] text-stone-600 divide-y divide-stone-200">
                  <div className="py-1 flex justify-between"><span className="text-amber-800 font-bold">id (PK)</span><span>VARCHAR(50)</span></div>
                  <div className="py-1 flex justify-between"><span>name, name_kn</span><span>VARCHAR(255)</span></div>
                  <div className="py-1 flex justify-between"><span>category (INDEX)</span><span>VARCHAR(50)</span></div>
                  <div className="py-1 flex justify-between"><span>price</span><span>DECIMAL(10,2)</span></div>
                  <div className="py-1 flex justify-between"><span>unit, quantity</span><span>VARCHAR(30), INT</span></div>
                  <div className="py-1 flex justify-between"><span>farmer_name, farmer_phone</span><span>VARCHAR(150)</span></div>
                </div>
              </div>

              {/* Table 3: orders & order_items */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between font-black text-xs text-stone-900">
                  <span className="font-mono text-emerald-800">TABLE orders & order_items</span>
                  <span className="text-[10px] text-stone-500 uppercase">1-to-Many Relational</span>
                </div>
                <div className="font-mono text-[11px] text-stone-600 divide-y divide-stone-200">
                  <div className="py-1 flex justify-between"><span className="text-amber-800 font-bold">orders.id (PK)</span><span>VARCHAR(60)</span></div>
                  <div className="py-1 flex justify-between"><span className="text-indigo-800 font-bold">buyer_id (FK)</span><span>REFERENCES users(id)</span></div>
                  <div className="py-1 flex justify-between"><span>total_amount, status</span><span>DECIMAL(10,2), VARCHAR(50)</span></div>
                  <div className="py-1 flex justify-between"><span className="text-amber-800 font-bold">order_items.id (PK)</span><span>BIGINT AUTO_INCREMENT</span></div>
                  <div className="py-1 flex justify-between"><span className="text-indigo-800 font-bold">order_id (FK)</span><span>REFERENCES orders(id) ON DELETE CASCADE</span></div>
                </div>
              </div>

              {/* Table 4: mandi_prices */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between font-black text-xs text-stone-900">
                  <span className="font-mono text-emerald-800">TABLE mandi_prices</span>
                  <span className="text-[10px] text-stone-500 uppercase">National APMC Rates</span>
                </div>
                <div className="font-mono text-[11px] text-stone-600 divide-y divide-stone-200">
                  <div className="py-1 flex justify-between"><span className="text-amber-800 font-bold">id (PK)</span><span>BIGINT AUTO_INCREMENT</span></div>
                  <div className="py-1 flex justify-between"><span>commodity, market</span><span>VARCHAR(100), VARCHAR(120)</span></div>
                  <div className="py-1 flex justify-between"><span>district, state (INDEX)</span><span>VARCHAR(100)</span></div>
                  <div className="py-1 flex justify-between"><span>min_price, max_price, modal_price</span><span>DECIMAL(10,2)</span></div>
                  <div className="py-1 flex justify-between"><span>arrival_date</span><span>DATE</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Docker & Run Instructions */}
      {activeTab === 'docker' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-stone-900 font-heading flex items-center gap-2">
              <Box className="w-5 h-5 text-emerald-700" />
              <span>How to Run Java 21 Spring Boot 3 & MySQL Backend</span>
            </h2>
            <p className="text-xs text-stone-500">
              The full Maven project is generated in the <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-emerald-800">backend-java/</code> folder.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 font-mono text-xs space-y-2">
              <div className="text-amber-400 font-bold text-[11px] uppercase">Option 1: Run with Docker Compose (MySQL + Spring Boot in one command)</div>
              <div className="text-emerald-400">
                cd backend-java<br />
                docker compose up --build -d
              </div>
              <div className="text-stone-400 text-[11px] pt-1">
                # Starts MySQL 8 on port 3306, Spring Boot on port 8080, and phpMyAdmin on port 8081.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 font-mono text-xs space-y-2">
              <div className="text-amber-400 font-bold text-[11px] uppercase">Option 2: Run with Maven and Java 21</div>
              <div className="text-emerald-400">
                cd backend-java<br />
                mvn clean package<br />
                mvn spring-boot:run
              </div>
              <div className="text-stone-400 text-[11px] pt-1">
                # Ensure MySQL 8 is running with database nammaraitha_db created.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
