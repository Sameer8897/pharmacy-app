package com.pharmacy.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CheckoutRequest {
    @NotBlank
    private String shippingAddress;
}
