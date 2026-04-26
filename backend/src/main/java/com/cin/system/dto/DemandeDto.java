package com.cin.system.dto;

import com.cin.system.enums.StatutDemande;
import com.cin.system.enums.TypeDemande;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class DemandeDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private Long citoyenId;
        private String typeDemande;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusUpdateRequest {
        private String statut;
        private String motifRejet;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String numeroDossier;
        private Long citoyenId;
        private String citoyenNom;
        private String citoyenPrenom;
        private String citoyenNumeroNational;
        private TypeDemande typeDemande;
        private StatutDemande statut;
        private String agentNom;
        private String motifRejet;
        private String qrCodeData;
        private LocalDateTime dateDepot;
        private LocalDateTime dateMiseAJour;
    }
}