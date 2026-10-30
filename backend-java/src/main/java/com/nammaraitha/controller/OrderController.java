package com.nammaraitha.controller;

import com.nammaraitha.dto.ApiResponse;
import com.nammaraitha.entity.Order;
import com.nammaraitha.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok("Orders retrieved from MySQL database", orders));
    }

    @GetMapping("/buyer/{phone}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByPhone(@PathVariable String phone) {
        List<Order> orders = orderRepository.findByBuyerPhoneOrderByCreatedAtDesc(phone);
        return ResponseEntity.ok(ApiResponse.ok("Orders for phone " + phone, orders));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> placeOrder(@RequestBody Order order) {
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }
        Order saved = orderRepository.save(order);
        return new ResponseEntity<>(ApiResponse.ok("Order placed successfully. Stored in MySQL database.", saved), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id,
            @RequestParam String status
    ) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(status.toUpperCase());
        Order updated = orderRepository.save(order);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated", updated));
    }
}
