package com.nammaraitha.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "name_kn")
    private String nameKn;

    @Column(nullable = false, length = 50)
    private String category; // vegetables, produce, fertilizers, seeds, tools

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 30)
    private String unit; // kg, quintal, piece, 50kg bag

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "location_kn", length = 150)
    private String locationKn;

    @Column(name = "farmer_name", nullable = false, length = 150)
    private String farmerName;

    @Column(name = "farmer_phone", nullable = false, length = 25)
    private String farmerPhone;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "is_organic")
    private Boolean isOrganic;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.id == null || this.id.isBlank()) {
            this.id = "prod-" + System.currentTimeMillis();
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isOrganic == null) this.isOrganic = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
