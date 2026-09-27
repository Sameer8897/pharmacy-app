package com.pharmacy.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AdminDashboardResponse {
    private long totalUsers;
    private long totalCustomers;
    private long totalAdmins;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private List<AdminCustomerSummary> customers;
    private List<AdminOrderSummary> recentOrders;
}
