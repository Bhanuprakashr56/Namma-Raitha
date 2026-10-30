-- ==============================================================================
-- Namma Raitha Agricultural Platform - MySQL 8.x Database Schema
-- Compatible with Java 21, Spring Boot 3.x, Hibernate / Spring Data JPA
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS nammaraitha_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nammaraitha_db;

-- 1. Users & Authentication Table
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
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Agricultural Products Table (Marketplace Produce, Agri Inputs, Tools)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_kn VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    location VARCHAR(150) NOT NULL,
    location_kn VARCHAR(150),
    farmer_name VARCHAR(150) NOT NULL,
    farmer_phone VARCHAR(25) NOT NULL,
    image_url TEXT,
    is_organic BOOLEAN DEFAULT FALSE,
    harvest_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_prod_category (category),
    INDEX idx_prod_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Customer Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(60) PRIMARY KEY,
    buyer_id BIGINT,
    buyer_name VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(25) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'COD',
    delivery_address TEXT NOT NULL,
    delivery_district VARCHAR(100),
    delivery_state VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_orders_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Order Line Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(60) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Mandi Market APMC Daily Prices
CREATE TABLE IF NOT EXISTS mandi_prices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    commodity VARCHAR(100) NOT NULL,
    commodity_kn VARCHAR(100),
    market VARCHAR(120) NOT NULL,
    market_kn VARCHAR(120),
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    min_price DECIMAL(10, 2) NOT NULL,
    max_price DECIMAL(10, 2) NOT NULL,
    modal_price DECIMAL(10, 2) NOT NULL,
    change_type VARCHAR(20) DEFAULT 'same',
    arrival_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mandi_state (state),
    INDEX idx_mandi_commodity (commodity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Soil Health Cards
CREATE TABLE IF NOT EXISTS soil_health_cards (
    id VARCHAR(50) PRIMARY KEY,
    farmer_name VARCHAR(150) NOT NULL,
    survey_number VARCHAR(80),
    village VARCHAR(100),
    district VARCHAR(100) NOT NULL,
    soil_type VARCHAR(80) NOT NULL,
    target_crop VARCHAR(100) NOT NULL,
    ph DECIMAL(4, 2) NOT NULL,
    nitrogen_kg_ha DECIMAL(6, 2) NOT NULL,
    phosphorus_kg_ha DECIMAL(6, 2) NOT NULL,
    potassium_kg_ha DECIMAL(6, 2) NOT NULL,
    organic_carbon_percent DECIMAL(4, 2) NOT NULL,
    overall_score INT NOT NULL,
    health_grade VARCHAR(30) NOT NULL,
    tested_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
