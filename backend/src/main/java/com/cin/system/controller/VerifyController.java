package com.cin.system.controller;

import com.cin.system.dto.DemandeDto;
import com.cin.system.service.DemandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class VerifyController {

    private final DemandeService demandeService;

    @GetMapping("/{qrCode}")
    public ResponseEntity<DemandeDto.Response> verify(@PathVariable String qrCode) {
        return ResponseEntity.ok(demandeService.verifyByQrCode(qrCode));
    }
}