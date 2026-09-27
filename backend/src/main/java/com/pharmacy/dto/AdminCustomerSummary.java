package com.pharmacy.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class AdminCustomerSummary {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Instant createdAt;
}
