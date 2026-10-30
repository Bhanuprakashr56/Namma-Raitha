package com.nammaraitha.repository;

import com.nammaraitha.entity.MandiPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MandiPriceRepository extends JpaRepository<MandiPrice, Long> {
    List<MandiPrice> findByStateIgnoreCase(String state);
    List<MandiPrice> findByCategoryIgnoreCase(String category);

    @Query("SELECT m FROM MandiPrice m WHERE " +
           "(:state = 'all' OR LOWER(m.state) = LOWER(:state)) AND " +
           "(:category = 'all' OR LOWER(m.category) = LOWER(:category)) AND " +
           "(:query IS NULL OR LOWER(m.commodity) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.market) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<MandiPrice> filterMandiPrices(
            @Param("state") String state,
            @Param("category") String category,
            @Param("query") String query);
}
