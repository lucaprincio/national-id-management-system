package com.cin.system.controller;

import com.cin.system.dto.AuthDto;
import com.cin.system.entity.User;
import com.cin.system.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.LoginResponse> login(@RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> register(@RequestBody AuthDto.RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(Map.of("message", "Utilisateur créé avec succès"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthDto.LoginResponse> verifyOtp(@RequestBody AuthDto.OtpVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    @PostMapping("/setup-2fa")
    public ResponseEntity<AuthDto.TwoFASetupResponse> setup2FA(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.setup2FA(user.getEmail()));
    }
}