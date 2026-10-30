package com.nammaraitha.controller;

import com.nammaraitha.dto.ApiResponse;
import com.nammaraitha.dto.JwtAuthResponse;
import com.nammaraitha.dto.LoginRequest;
import com.nammaraitha.dto.RegisterRequest;
import com.nammaraitha.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.ok("Login successful. JWT token generated.", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        JwtAuthResponse response = authService.register(registerRequest);
        return new ResponseEntity<>(ApiResponse.ok("User registered successfully. JWT issued.", response), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<String>> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthenticated"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Authenticated user", authentication.getName()));
    }
}
