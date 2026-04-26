package com.cin.system.controller;

import com.cin.system.dto.CitoyenDto;
import com.cin.system.service.CitoyenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citizens")
@RequiredArgsConstructor
public class CitoyenController {

    private final CitoyenService citoyenService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','AGENT_ENREGISTREMENT')")
    public ResponseEntity<CitoyenDto.Response> create(@RequestBody CitoyenDto.CreateRequest request) {
        return ResponseEntity.ok(citoyenService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<CitoyenDto.Response>> getAll(
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(citoyenService.search(search));
        }
        return ResponseEntity.ok(citoyenService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CitoyenDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(citoyenService.getById(id));
    }

    @GetMapping("/numero/{numero}")
    public ResponseEntity<CitoyenDto.Response> getByNumero(@PathVariable String numero) {
        return ResponseEntity.ok(citoyenService.getByNumeroNational(numero));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT_ENREGISTREMENT')")
    public ResponseEntity<CitoyenDto.Response> update(
            @PathVariable Long id,
            @RequestBody CitoyenDto.CreateRequest request) {
        return ResponseEntity.ok(citoyenService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        citoyenService.archive(id);
        return ResponseEntity.ok(Map.of("message", "Citoyen archivé avec succès"));
    }
}