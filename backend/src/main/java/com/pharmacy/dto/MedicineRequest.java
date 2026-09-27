package com.pharmacy.dto;

import lombok.Data;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class MedicineRequest {
    @NotBlank
    private String name;
    private String description;
    private String manufacturer;
    private String category;
    private Boolean requiresPrescription;
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;
    @NotNull
    @Min(0)
    private Integer stockQuantity;
    private String imageUrl;
}
