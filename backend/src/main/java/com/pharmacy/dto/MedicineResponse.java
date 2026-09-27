package com.pharmacy.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class MedicineResponse {
    private Long id;
    private String name;
    private String description;
    private String manufacturer;
    private String category;
    private Boolean requiresPrescription;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private Instant createdAt;
}
