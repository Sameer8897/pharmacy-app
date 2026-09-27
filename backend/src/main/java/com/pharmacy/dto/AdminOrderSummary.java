package com.pharmacy.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class AdminOrderSummary {
    private Long orderId;
    private String customerName;
    private String customerEmail;
    private BigDecimal totalAmount;
    private String status;
    private Instant createdAt;
}
