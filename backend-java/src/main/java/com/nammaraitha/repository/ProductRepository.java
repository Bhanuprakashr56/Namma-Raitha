package com.nammaraitha.repository;

import com.nammaraitha.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByCategoryIgnoreCase(String category);
    List<Product> findByIsOrganicTrue();

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.farmerName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);

    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.location) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> filterProducts(@Param("category") String category, @Param("query") String query);
}
