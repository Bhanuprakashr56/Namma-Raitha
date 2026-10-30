package com.nammaraitha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Namma Raitha - Agricultural Full Stack Platform
 * Backend: Java 21, Spring Boot 3.3.x, Spring Web, Spring Security, JWT, Spring Data JPA, Hibernate
 * Database: MySQL 8.x
 */
@SpringBootApplication
public class NammaRaithaApplication {

    public static void main(String[] args) {
        SpringApplication.run(NammaRaithaApplication.class, args);
        System.out.println("🌱 Namma Raitha Spring Boot 3.x Backend Started Successfully on Port 8080!");
        System.out.println("🚀 MySQL Database Connected: nammaraitha_db");
        System.out.println("🔒 Spring Security 6 & JWT Filter Initialized");
    }
}
