package com.nammaraitha.controller;

import com.nammaraitha.dto.ApiResponse;
import com.nammaraitha.entity.MandiPrice;
import com.nammaraitha.repository.MandiPriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mandi")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MandiController {

    private final MandiPriceRepository mandiPriceRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MandiPrice>>> getMandiPrices(
            @RequestParam(required = false, defaultValue = "all") String state,
            @RequestParam(required = false, defaultValue = "all") String category,
            @RequestParam(required = false) String query
    ) {
        String q = (query != null && !query.isBlank()) ? query.trim() : null;
        List<MandiPrice> prices = mandiPriceRepository.filterMandiPrices(state, category, q);
        return ResponseEntity.ok(ApiResponse.ok("Mandi APMC prices fetched from MySQL database", prices));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MandiPrice>> saveMandiPrice(@RequestBody MandiPrice price) {
        MandiPrice saved = mandiPriceRepository.save(price);
        return ResponseEntity.ok(ApiResponse.ok("Mandi price recorded", saved));
    }
}
