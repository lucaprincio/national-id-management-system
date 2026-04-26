package com.cin.system.service;

import com.cin.system.dto.CitoyenDto;
import com.cin.system.entity.Citoyen;
import com.cin.system.exception.BusinessException;
import com.cin.system.exception.ResourceNotFoundException;
import com.cin.system.repository.CitoyenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CitoyenService {

    private final CitoyenRepository citoyenRepository;

    public CitoyenDto.Response create(CitoyenDto.CreateRequest request) {
        if (citoyenRepository.existsByNumeroNational(request.getNumeroNational())) {
            throw new BusinessException("Un citoyen avec ce numéro national existe déjà");
        }

        Citoyen citoyen = Citoyen.builder()
                .numeroNational(request.getNumeroNational())
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .dateNaissance(request.getDateNaissance())
                .lieuNaissance(request.getLieuNaissance())
                .sexe(request.getSexe())
                .adresse(request.getAdresse())
                .region(request.getRegion())
                .profession(request.getProfession())
                .photoBase64(request.getPhotoBase64())
                .build();

        return toResponse(citoyenRepository.save(citoyen));
    }

    public List<CitoyenDto.Response> getAll() {
        return citoyenRepository.findByArchiveFalse()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CitoyenDto.Response getById(Long id) {
        return toResponse(findById(id));
    }

    public CitoyenDto.Response getByNumeroNational(String numero) {
        return toResponse(citoyenRepository.findByNumeroNational(numero)
                .orElseThrow(() -> new ResourceNotFoundException("Citoyen non trouvé: " + numero)));
    }

    public List<CitoyenDto.Response> search(String query) {
        return citoyenRepository.search(query)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CitoyenDto.Response update(Long id, CitoyenDto.CreateRequest request) {
        Citoyen citoyen = findById(id);
        citoyen.setNom(request.getNom());
        citoyen.setPrenom(request.getPrenom());
        citoyen.setDateNaissance(request.getDateNaissance());
        citoyen.setLieuNaissance(request.getLieuNaissance());
        citoyen.setSexe(request.getSexe());
        citoyen.setAdresse(request.getAdresse());
        citoyen.setRegion(request.getRegion());
        citoyen.setProfession(request.getProfession());
        if (request.getPhotoBase64() != null) {
            citoyen.setPhotoBase64(request.getPhotoBase64());
        }
        return toResponse(citoyenRepository.save(citoyen));
    }

    public void archive(Long id) {
        Citoyen citoyen = findById(id);
        citoyen.setArchive(true);
        citoyenRepository.save(citoyen);
    }

    public void delete(Long id) {
        Citoyen citoyen = findById(id);
        citoyenRepository.delete(citoyen);
    }

    private Citoyen findById(Long id) {
        return citoyenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Citoyen non trouvé: " + id));
    }

    private CitoyenDto.Response toResponse(Citoyen c) {
        return CitoyenDto.Response.builder()
                .id(c.getId())
                .numeroNational(c.getNumeroNational())
                .nom(c.getNom())
                .prenom(c.getPrenom())
                .dateNaissance(c.getDateNaissance())
                .lieuNaissance(c.getLieuNaissance())
                .sexe(c.getSexe())
                .adresse(c.getAdresse())
                .region(c.getRegion())
                .profession(c.getProfession())
                .photoBase64(c.getPhotoBase64())
                .archive(c.isArchive())
                .dateEnregistrement(c.getDateEnregistrement())
                .build();
    }
}