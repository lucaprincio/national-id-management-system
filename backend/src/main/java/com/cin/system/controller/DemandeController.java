package com.cin.system.controller;

import com.cin.system.dto.DemandeDto;
import com.cin.system.service.DemandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class DemandeController {

    private final DemandeService demandeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','AGENT_ENREGISTREMENT')")
    public ResponseEntity<DemandeDto.Response> create(@RequestBody DemandeDto.CreateRequest request) {
        return ResponseEntity.ok(demandeService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<DemandeDto.Response>> getAll() {
        return ResponseEntity.ok(demandeService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DemandeDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(demandeService.getById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT_VALIDATION','SUPERVISEUR')")
    public ResponseEntity<DemandeDto.Response> updateStatus(
            @PathVariable Long id,
            @RequestBody DemandeDto.StatusUpdateRequest request) {
        return ResponseEntity.ok(demandeService.updateStatus(id, request));
    }
}