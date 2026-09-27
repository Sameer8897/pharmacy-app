package com.pharmacy.service;

import com.pharmacy.dto.AdminDashboardResponse;
import com.pharmacy.dto.AdminOrderSummary;
import com.pharmacy.entity.Order;
import com.pharmacy.repository.OrderRepository;
import com.pharmacy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        List<AdminOrderSummary> recentOrders = orders.stream()
                .limit(20)
                .map(this::toOrderSummary)
                .collect(Collectors.toList());

        BigDecimal revenue = orderRepository.sumTotalAmount();
        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalCustomers(userRepository.countByRole("CUSTOMER"))
                .totalAdmins(userRepository.countByRole("ADMIN"))
                .totalOrders(orderRepository.count())
                .totalRevenue(revenue == null ? BigDecimal.ZERO : revenue)
                .recentOrders(recentOrders)
                .build();
    }

    private AdminOrderSummary toOrderSummary(Order order) {
        return AdminOrderSummary.builder()
                .orderId(order.getId())
                .customerName(order.getUser().getName())
                .customerEmail(order.getUser().getEmail())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
