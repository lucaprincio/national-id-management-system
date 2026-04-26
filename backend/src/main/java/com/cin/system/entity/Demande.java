package com.cin.system.entity;

import com.cin.system.enums.StatutDemande;
import com.cin.system.enums.TypeDemande;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "demandes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Demande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroDossier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citoyen_id", nullable = false)
    private Citoyen citoyen;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeDemande typeDemande;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutDemande statut;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private User agentResponsable;

    private String motifRejet;
    private String qrCodeData;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateDepot;

    private LocalDateTime dateMiseAJour;

    @PrePersist
    protected void onCreate() {
        dateDepot = LocalDateTime.now();
        dateMiseAJour = LocalDateTime.now();
        if (statut == null)
            statut = StatutDemande.EN_ATTENTE;
    }

    @PreUpdate
    protected void onUpdate() {
        dateMiseAJour = LocalDateTime.now();
    }
}