package com.pharmacy.dto;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
public class CartItemRequest {
    @NotNull
    private Long medicineId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
