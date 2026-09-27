package com.pharmacy.service;

import com.pharmacy.dto.CheckoutRequest;
import com.pharmacy.dto.OrderItemResponse;
import com.pharmacy.dto.OrderResponse;
import com.pharmacy.entity.*;
import com.pharmacy.repository.CartItemRepository;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.OrderRepository;
import com.pharmacy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    @Transactional
    public OrderResponse checkout(CheckoutRequest request) {
        User user = currentUser();
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .status("PENDING")
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Medicine medicine = medicineRepository.findById(cartItem.getMedicine().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Medicine missing"));

            if (medicine.getStockQuantity() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for " + medicine.getName());
            }

            medicine.setStockQuantity(medicine.getStockQuantity() - cartItem.getQuantity());
            medicineRepository.save(medicine);

            BigDecimal line = medicine.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(line);

            OrderItem orderItem = OrderItem.builder()
                    .medicine(medicine)
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(medicine.getPrice())
                    .build();
            order.addItem(orderItem);
        }

        // Dummy / test-mode payment — replace with Razorpay later
        String paymentId = "pay_test_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        order.setTotalAmount(total);
        order.setPaymentId(paymentId);
        order.setStatus("PAID");

        Order saved = orderRepository.save(order);
        cartService.clearCart(user);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> myOrders() {
        User user = currentUser();
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long id) {
        User user = currentUser();
        Order order = orderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return toResponse(order);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream().map(oi -> {
            BigDecimal line = oi.getPriceAtPurchase().multiply(BigDecimal.valueOf(oi.getQuantity()));
            return OrderItemResponse.builder()
                    .medicineId(oi.getMedicine().getId())
                    .medicineName(oi.getMedicine().getName())
                    .quantity(oi.getQuantity())
                    .priceAtPurchase(oi.getPriceAtPurchase())
                    .lineTotal(line)
                    .build();
        }).collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentId(order.getPaymentId())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
