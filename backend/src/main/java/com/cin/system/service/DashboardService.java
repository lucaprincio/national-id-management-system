package com.cin.system.service;

import com.cin.system.dto.DashboardDto;
import com.cin.system.enums.StatutDemande;
import com.cin.system.repository.CitoyenRepository;
import com.cin.system.repository.DemandeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CitoyenRepository citoyenRepository;
    private final DemandeRepository demandeRepository;

    public DashboardDto getStats() {
        long totalCitoyens = citoyenRepository.countByArchiveFalse();
        long cartesDelivrees = demandeRepository.countByStatut(StatutDemande.IMPRIMEE);
        long enAttente = demandeRepository.countByStatut(StatutDemande.EN_ATTENTE);
        long validees = demandeRepository.countByStatut(StatutDemande.VALIDEE);
        long rejetees = demandeRepository.countByStatut(StatutDemande.REJETEE);
        long enCours = demandeRepository.countByStatut(StatutDemande.EN_COURS);

        LocalDateTime threshold = LocalDateTime.now().minusDays(7);
        long dossiersEnRetard = demandeRepository.findDossiersEnRetard(threshold).size();

        // Monthly stats
        List<DashboardDto.MonthlyStats> monthly = demandeRepository.countByMonth()
                .stream()
                .map(row -> DashboardDto.MonthlyStats.builder()
                        .mois(((Number) row[0]).intValue())
                        .nombre(((Number) row[1]).longValue())
                        .build())
                .collect(Collectors.toList());

        // Region stats
        Map<String, Long> regionMap = new LinkedHashMap<>();
        citoyenRepository.countByRegion().forEach(row -> {
            String region = row[0] != null ? (String) row[0] : "Non définie";
            Long count = ((Number) row[1]).longValue();
            regionMap.put(region, count);
        });

        return DashboardDto.builder()
                .totalCitoyens(totalCitoyens)
                .cartesDelivrees(cartesDelivrees)
                .demandesEnAttente(enAttente)
                .demandesValidees(validees)
                .demandesRejetees(rejetees)
                .demandesEnCours(enCours)
                .dossiersEnRetard(dossiersEnRetard)
                .statistiquesMensuelles(monthly)
                .repartitionRegion(regionMap)
                .build();
    }
}