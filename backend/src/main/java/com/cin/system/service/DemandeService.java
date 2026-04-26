package com.cin.system.service;

import com.cin.system.dto.DemandeDto;
import com.cin.system.entity.Citoyen;
import com.cin.system.entity.Demande;
import com.cin.system.entity.User;
import com.cin.system.enums.StatutDemande;
import com.cin.system.enums.TypeDemande;
import com.cin.system.exception.BusinessException;
import com.cin.system.exception.ResourceNotFoundException;
import com.cin.system.repository.CitoyenRepository;
import com.cin.system.repository.DemandeRepository;
import com.cin.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DemandeService {

    private final DemandeRepository demandeRepository;
    private final CitoyenRepository citoyenRepository;
    private final UserRepository userRepository;

    public DemandeDto.Response create(DemandeDto.CreateRequest request) {
        Citoyen citoyen = citoyenRepository.findById(request.getCitoyenId())
                .orElseThrow(() -> new ResourceNotFoundException("Citoyen non trouvé"));

        String numeroDossier = "DOS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Demande demande = Demande.builder()
                .numeroDossier(numeroDossier)
                .citoyen(citoyen)
                .typeDemande(TypeDemande.valueOf(request.getTypeDemande()))
                .statut(StatutDemande.EN_ATTENTE)
                .build();

        return toResponse(demandeRepository.save(demande));
    }

    public List<DemandeDto.Response> getAll() {
        return demandeRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public DemandeDto.Response getById(Long id) {
        return toResponse(findById(id));
    }

    public DemandeDto.Response updateStatus(Long id, DemandeDto.StatusUpdateRequest request) {
        Demande demande = findById(id);
        StatutDemande newStatut = StatutDemande.valueOf(request.getStatut());

        // Assign current agent
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User agent = userRepository.findByEmail(email).orElse(null);
        demande.setAgentResponsable(agent);
        demande.setStatut(newStatut);

        if (request.getMotifRejet() != null) {
            demande.setMotifRejet(request.getMotifRejet());
        }

        // Generate QR code data when validated
        if (newStatut == StatutDemande.VALIDEE || newStatut == StatutDemande.IMPRIMEE) {
            String qrData = "CIN:" + demande.getCitoyen().getNumeroNational()
                    + ":DOS:" + demande.getNumeroDossier()
                    + ":SIG:" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
            demande.setQrCodeData(qrData);
        }

        return toResponse(demandeRepository.save(demande));
    }

    public DemandeDto.Response verifyByQrCode(String qrCode) {
        Demande demande = demandeRepository.findByQrCodeData(qrCode)
                .orElseThrow(() -> new ResourceNotFoundException("QR Code invalide ou non trouvé"));
        return toResponse(demande);
    }

    private Demande findById(Long id) {
        return demandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée: " + id));
    }

    private DemandeDto.Response toResponse(Demande d) {
        return DemandeDto.Response.builder()
                .id(d.getId())
                .numeroDossier(d.getNumeroDossier())
                .citoyenId(d.getCitoyen().getId())
                .citoyenNom(d.getCitoyen().getNom())
                .citoyenPrenom(d.getCitoyen().getPrenom())
                .citoyenNumeroNational(d.getCitoyen().getNumeroNational())
                .typeDemande(d.getTypeDemande())
                .statut(d.getStatut())
                .agentNom(d.getAgentResponsable() != null
                        ? d.getAgentResponsable().getNom() + " " + d.getAgentResponsable().getPrenom()
                        : null)
                .motifRejet(d.getMotifRejet())
                .qrCodeData(d.getQrCodeData())
                .dateDepot(d.getDateDepot())
                .dateMiseAJour(d.getDateMiseAJour())
                .build();
    }
}