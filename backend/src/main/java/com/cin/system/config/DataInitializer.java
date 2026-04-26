package com.cin.system.config;

import com.cin.system.entity.Citoyen;
import com.cin.system.entity.Demande;
import com.cin.system.entity.User;
import com.cin.system.enums.Role;
import com.cin.system.enums.StatutDemande;
import com.cin.system.enums.TypeDemande;
import com.cin.system.repository.CitoyenRepository;
import com.cin.system.repository.DemandeRepository;
import com.cin.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CitoyenRepository citoyenRepository;
    private final DemandeRepository demandeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin
        if (!userRepository.existsByEmail("admin@cin.gov.mg")) {
            User admin = User.builder()
                    .nom("Administrateur")
                    .prenom("Système")
                    .email("admin@cin.gov.mg")
                    .motDePasse(passwordEncoder.encode("Admin123!"))
                    .role(Role.ADMIN)
                    .actif(true)
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin créé: admin@cin.gov.mg / Admin123!");
        }

        // Create agent
        if (!userRepository.existsByEmail("agent@cin.gov.mg")) {
            User agent = User.builder()
                    .nom("Rakoto")
                    .prenom("Jean")
                    .email("agent@cin.gov.mg")
                    .motDePasse(passwordEncoder.encode("Agent123!"))
                    .role(Role.AGENT_ENREGISTREMENT)
                    .actif(true)
                    .build();
            userRepository.save(agent);
        }

        // Create supervisor
        if (!userRepository.existsByEmail("superviseur@cin.gov.mg")) {
            User sup = User.builder()
                    .nom("Rabe")
                    .prenom("Marie")
                    .email("superviseur@cin.gov.mg")
                    .motDePasse(passwordEncoder.encode("Super123!"))
                    .role(Role.SUPERVISEUR)
                    .actif(true)
                    .build();
            userRepository.save(sup);
        }

        // Sample citizens
        if (citoyenRepository.count() == 0) {
            String[][] citoyens = {
                    { "101-234-567", "Rakotondrazaka", "Hery", "1990-05-15", "Antananarivo", "M",
                            "Lot II A 23, Antananarivo", "Analamanga", "Ingénieur" },
                    { "101-234-568", "Randrianarisoa", "Volatiana", "1988-03-22", "Fianarantsoa", "F",
                            "Rue de la Paix, Fianarantsoa", "Haute Matsiatra", "Médecin" },
                    { "101-234-569", "Rakotondrabe", "Tiana", "1995-11-08", "Toamasina", "M",
                            "Ave de la Mer, Toamasina", "Atsinanana", "Enseignant" },
                    { "101-234-570", "Rasoanandrasana", "Miora", "1992-07-30", "Mahajanga", "F",
                            "Rue du Commerce, Mahajanga", "Boeny", "Comptable" },
                    { "101-234-571", "Andriamahefa", "Njaka", "1985-01-12", "Toliara", "M", "Bd Lyautey, Toliara",
                            "Atsimo-Andrefana", "Agriculteur" },
                    { "101-234-572", "Raharimanga", "Lalaina", "1998-09-25", "Antsiranana", "F",
                            "Rue Colbert, Antsiranana", "DIANA", "Étudiante" },
            };

            for (String[] data : citoyens) {
                Citoyen c = Citoyen.builder()
                        .numeroNational(data[0])
                        .nom(data[1])
                        .prenom(data[2])
                        .dateNaissance(LocalDate.parse(data[3]))
                        .lieuNaissance(data[4])
                        .sexe(data[5])
                        .adresse(data[6])
                        .region(data[7])
                        .profession(data[8])
                        .build();
                citoyenRepository.save(c);
            }
            log.info("✅ 6 citoyens exemple créés");
        }

        // Sample demandes
        if (demandeRepository.count() == 0) {
            var citoyens = citoyenRepository.findAll();
            StatutDemande[] statuts = {
                    StatutDemande.EN_ATTENTE, StatutDemande.EN_COURS,
                    StatutDemande.VALIDEE, StatutDemande.IMPRIMEE,
                    StatutDemande.REJETEE, StatutDemande.EN_ATTENTE
            };
            TypeDemande[] types = {
                    TypeDemande.NOUVELLE_CARTE, TypeDemande.RENOUVELLEMENT,
                    TypeDemande.NOUVELLE_CARTE, TypeDemande.RENOUVELLEMENT,
                    TypeDemande.DUPLICATA, TypeDemande.NOUVELLE_CARTE
            };

            for (int i = 0; i < citoyens.size(); i++) {
                String numeroDossier = "DOS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                Demande d = Demande.builder()
                        .numeroDossier(numeroDossier)
                        .citoyen(citoyens.get(i))
                        .typeDemande(types[i])
                        .statut(statuts[i])
                        .qrCodeData(statuts[i] == StatutDemande.VALIDEE || statuts[i] == StatutDemande.IMPRIMEE
                                ? "CIN:" + citoyens.get(i).getNumeroNational() + ":DOS:" + numeroDossier + ":SIG:"
                                        + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase()
                                : null)
                        .build();
                demandeRepository.save(d);
            }
            log.info("✅ 6 demandes exemple créées");
        }
    }
}