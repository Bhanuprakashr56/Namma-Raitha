package com.nammaraitha.repository;

import com.nammaraitha.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    List<Order> findByBuyerPhoneOrderByCreatedAtDesc(String buyerPhone);
    List<Order> findByStatusOrderByCreatedAtDesc(String status);
}
