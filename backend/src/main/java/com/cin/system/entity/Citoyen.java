package com.cin.system.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "citoyens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Citoyen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroNational;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private LocalDate dateNaissance;

    @Column(nullable = false)
    private String lieuNaissance;

    @Column(nullable = false)
    private String sexe; // M / F

    @Column(nullable = false)
    private String adresse;

    private String region;

    private String profession;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String photoBase64;

    private boolean archive = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateEnregistrement;

    @PrePersist
    protected void onCreate() {
        dateEnregistrement = LocalDateTime.now();
    }
}