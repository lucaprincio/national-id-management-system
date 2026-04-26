package com.cin.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    private long totalCitoyens;
    private long cartesDelivrees;
    private long demandesEnAttente;
    private long demandesValidees;
    private long demandesRejetees;
    private long demandesEnCours;
    private long dossiersEnRetard;
    private List<MonthlyStats> statistiquesMensuelles;
    private Map<String, Long> repartitionRegion;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyStats {
        private int mois;
        private long nombre;
    }
}