package com.cin.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CitoyenDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String numeroNational;
        private String nom;
        private String prenom;
        private LocalDate dateNaissance;
        private String lieuNaissance;
        private String sexe;
        private String adresse;
        private String region;
        private String profession;
        private String photoBase64;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String numeroNational;
        private String nom;
        private String prenom;
        private LocalDate dateNaissance;
        private String lieuNaissance;
        private String sexe;
        private String adresse;
        private String region;
        private String profession;
        private String photoBase64;
        private boolean archive;
        private LocalDateTime dateEnregistrement;
    }
}