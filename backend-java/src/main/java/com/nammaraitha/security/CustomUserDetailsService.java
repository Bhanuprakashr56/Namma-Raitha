package com.nammaraitha.security;

import com.nammaraitha.entity.User;
import com.nammaraitha.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrPhone) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(usernameOrPhone)
                .or(() -> userRepository.findByPhone(usernameOrPhone))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or phone: " + usernameOrPhone));

        Set<GrantedAuthority> authorities = Collections.singleton(
                new SimpleGrantedAuthority(user.getRole().startsWith("ROLE_") ? user.getRole() : "ROLE_" + user.getRole())
        );

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }
}
