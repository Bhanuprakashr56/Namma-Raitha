package com.nammaraitha.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "mandi_prices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MandiPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String commodity;

    @Column(name = "commodity_kn", length = 100)
    private String commodityKn;

    @Column(nullable = false, length = 120)
    private String market;

    @Column(name = "market_kn", length = 120)
    private String marketKn;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "min_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal minPrice;

    @Column(name = "max_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal maxPrice;

    @Column(name = "modal_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal modalPrice;

    @Column(name = "change_type", length = 20)
    private String changeType; // up, down, same

    @Column(name = "arrival_date", nullable = false)
    private LocalDate arrivalDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.arrivalDate == null) this.arrivalDate = LocalDate.now();
        if (this.changeType == null) this.changeType = "same";
    }
}
