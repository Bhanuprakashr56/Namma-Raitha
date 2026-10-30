package com.nammaraitha.service;

import com.nammaraitha.entity.Product;
import com.nammaraitha.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<Product> getAllProducts(String category, String query) {
        if ((category == null || category.equalsIgnoreCase("all")) && (query == null || query.isBlank())) {
            return productRepository.findAll();
        }
        String cat = (category != null && !category.equalsIgnoreCase("all")) ? category : null;
        String q = (query != null && !query.isBlank()) ? query.trim() : null;
        return productRepository.filterProducts(cat, q);
    }

    @Transactional(readOnly = true)
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(String id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setName(productDetails.getName());
        product.setNameKn(productDetails.getNameKn());
        product.setCategory(productDetails.getCategory());
        product.setPrice(productDetails.getPrice());
        product.setUnit(productDetails.getUnit());
        product.setQuantity(productDetails.getQuantity());
        product.setLocation(productDetails.getLocation());
        product.setLocationKn(productDetails.getLocationKn());
        product.setImageUrl(productDetails.getImageUrl());
        product.setIsOrganic(productDetails.getIsOrganic());

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
