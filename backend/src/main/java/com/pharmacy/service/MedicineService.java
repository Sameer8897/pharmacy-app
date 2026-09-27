package com.pharmacy.service;

import com.pharmacy.dto.MedicineRequest;
import com.pharmacy.dto.MedicineResponse;
import com.pharmacy.entity.Medicine;
import com.pharmacy.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public List<MedicineResponse> listAll(String search, String category) {
        List<Medicine> medicines;
        if (search != null && !search.trim().isEmpty()) {
            medicines = medicineRepository.search(search.trim());
        } else if (category != null && !category.trim().isEmpty()) {
            medicines = medicineRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            medicines = medicineRepository.findAll();
        }
        return medicines.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MedicineResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public MedicineResponse create(MedicineRequest request) {
        Medicine medicine = mapRequest(new Medicine(), request);
        return toResponse(medicineRepository.save(medicine));
    }

    @Transactional
    public MedicineResponse update(Long id, MedicineRequest request) {
        Medicine medicine = findOrThrow(id);
        mapRequest(medicine, request);
        return toResponse(medicineRepository.save(medicine));
    }

    @Transactional
    public void delete(Long id) {
        medicineRepository.delete(findOrThrow(id));
    }

    private Medicine findOrThrow(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found: " + id));
    }

    private Medicine mapRequest(Medicine medicine, MedicineRequest request) {
        medicine.setName(request.getName());
        medicine.setDescription(request.getDescription());
        medicine.setManufacturer(request.getManufacturer());
        medicine.setCategory(request.getCategory());
        medicine.setRequiresPrescription(
                request.getRequiresPrescription() != null && request.getRequiresPrescription());
        medicine.setPrice(request.getPrice());
        medicine.setStockQuantity(request.getStockQuantity());
        medicine.setImageUrl(request.getImageUrl());
        return medicine;
    }

    private MedicineResponse toResponse(Medicine m) {
        return MedicineResponse.builder()
                .id(m.getId())
                .name(m.getName())
                .description(m.getDescription())
                .manufacturer(m.getManufacturer())
                .category(m.getCategory())
                .requiresPrescription(m.getRequiresPrescription())
                .price(m.getPrice())
                .stockQuantity(m.getStockQuantity())
                .imageUrl(m.getImageUrl())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
