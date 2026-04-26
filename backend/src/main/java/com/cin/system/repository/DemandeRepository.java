package com.cin.system.repository;

import com.cin.system.entity.Demande;
import com.cin.system.enums.StatutDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {
    Optional<Demande> findByNumeroDossier(String numeroDossier);

    Optional<Demande> findByQrCodeData(String qrCodeData);

    List<Demande> findByStatut(StatutDemande statut);

    long countByStatut(StatutDemande statut);

    @Query("SELECT d FROM Demande d WHERE d.statut = 'EN_ATTENTE' AND d.dateDepot < :threshold")
    List<Demande> findDossiersEnRetard(@Param("threshold") LocalDateTime threshold);

    @Query("SELECT MONTH(d.dateDepot), COUNT(d) FROM Demande d WHERE YEAR(d.dateDepot) = YEAR(CURRENT_DATE) GROUP BY MONTH(d.dateDepot)")
    List<Object[]> countByMonth();
}