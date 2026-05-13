package com.agrima.auth.security;

import com.agrima.auth.model.AppUser;
import com.agrima.auth.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository repository;

    public CustomUserDetailsService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        var roles = user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());
        return User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(roles.toArray(String[]::new))
                .build();
    }
}
