package com.cin.system.service;

import com.cin.system.dto.AuthDto;
import com.cin.system.entity.User;
import com.cin.system.enums.Role;
import com.cin.system.exception.BusinessException;
import com.cin.system.repository.UserRepository;
import com.cin.system.security.JwtUtil;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authenticationManager;

        @Value("${app.2fa.issuer}")
        private String issuer;

        // @Lazy sur AuthenticationManager pour éviter cycle potentiel avec
        // SecurityConfig
        @Autowired
        public AuthService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil,
                        @Lazy AuthenticationManager authenticationManager) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtUtil = jwtUtil;
                this.authenticationManager = authenticationManager;
        }

        public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

                if (user.isTwoFactorEnabled()) {
                        String tempToken = jwtUtil.generateToken(user);
                        return AuthDto.LoginResponse.builder()
                                        .requireOtp(true)
                                        .tempToken(tempToken)
                                        .email(user.getEmail())
                                        .build();
                }

                String token = jwtUtil.generateToken(user);
                return AuthDto.LoginResponse.builder()
                                .token(token)
                                .email(user.getEmail())
                                .nom(user.getNom())
                                .prenom(user.getPrenom())
                                .role(user.getRole().name())
                                .requireOtp(false)
                                .build();
        }

        public AuthDto.LoginResponse verifyOtp(AuthDto.OtpVerifyRequest request) {
                String email = jwtUtil.extractUsername(request.getTempToken());
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new BusinessException("Session invalide"));

                GoogleAuthenticator gAuth = new GoogleAuthenticator();
                boolean isValid = gAuth.authorize(user.getTotpSecret(), request.getOtpCode());

                if (!isValid) {
                        throw new BusinessException("Code OTP invalide");
                }

                String token = jwtUtil.generateToken(user);
                return AuthDto.LoginResponse.builder()
                                .token(token)
                                .email(user.getEmail())
                                .nom(user.getNom())
                                .prenom(user.getPrenom())
                                .role(user.getRole().name())
                                .requireOtp(false)
                                .build();
        }

        public User register(AuthDto.RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new BusinessException("Email déjà utilisé");
                }

                User user = User.builder()
                                .nom(request.getNom())
                                .prenom(request.getPrenom())
                                .email(request.getEmail())
                                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                                .role(Role.valueOf(request.getRole()))
                                .actif(true)
                                .build();

                return userRepository.save(user);
        }

        public AuthDto.TwoFASetupResponse setup2FA(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

                GoogleAuthenticator gAuth = new GoogleAuthenticator();
                GoogleAuthenticatorKey key = gAuth.createCredentials();

                user.setTotpSecret(key.getKey());
                user.setTwoFactorEnabled(true);
                userRepository.save(user);

                String qrUrl = GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL(issuer, email, key);

                return AuthDto.TwoFASetupResponse.builder()
                                .qrCodeUrl(qrUrl)
                                .secret(key.getKey())
                                .build();
        }
}