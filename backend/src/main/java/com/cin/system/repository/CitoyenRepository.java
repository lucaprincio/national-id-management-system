package com.cin.system.repository;

import com.cin.system.entity.Citoyen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CitoyenRepository extends JpaRepository<Citoyen, Long> {
    Optional<Citoyen> findByNumeroNational(String numeroNational);

    boolean existsByNumeroNational(String numeroNational);

    List<Citoyen> findByArchiveFalse();

    @Query("SELECT c FROM Citoyen c WHERE c.archive = false AND " +
            "(LOWER(c.nom) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.prenom) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.numeroNational) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Citoyen> search(@Param("query") String query);

    long countByArchiveFalse();

    @Query("SELECT c.region, COUNT(c) FROM Citoyen c WHERE c.archive = false GROUP BY c.region")
    List<Object[]> countByRegion();
}