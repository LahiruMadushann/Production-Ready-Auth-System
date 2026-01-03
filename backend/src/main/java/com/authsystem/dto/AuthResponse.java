package com.authsystem.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private UserResponse user;
}