package com.cin.system.controller;

import com.cin.system.dto.DashboardDto;
import com.cin.system.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISEUR')")
    public ResponseEntity<DashboardDto> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }
}