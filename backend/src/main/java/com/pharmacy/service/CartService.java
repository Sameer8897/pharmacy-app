package com.pharmacy.service;

import com.pharmacy.dto.CartItemRequest;
import com.pharmacy.dto.CartItemResponse;
import com.pharmacy.dto.CartResponse;
import com.pharmacy.entity.CartItem;
import com.pharmacy.entity.Medicine;
import com.pharmacy.entity.User;
import com.pharmacy.repository.CartItemRepository;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;

    public CartResponse getCart() {
        User user = currentUser();
        List<CartItem> items = cartItemRepository.findByUser(user);
        return toCartResponse(items);
    }

    @Transactional
    public CartResponse addItem(CartItemRequest request) {
        User user = currentUser();
        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));

        if (medicine.getStockQuantity() < request.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock for " + medicine.getName());
        }

        CartItem item = cartItemRepository.findByUserAndMedicineId(user, medicine.getId())
                .orElse(CartItem.builder().user(user).medicine(medicine).quantity(0).build());

        int newQty = item.getQuantity() + request.getQuantity();
        if (newQty > medicine.getStockQuantity()) {
            throw new IllegalArgumentException("Cannot add more than available stock");
        }
        item.setQuantity(newQty);
        cartItemRepository.save(item);
        return getCart();
    }

    @Transactional
    public CartResponse updateQuantity(Long medicineId, int quantity) {
        User user = currentUser();
        CartItem item = cartItemRepository.findByUserAndMedicineId(user, medicineId)
                .orElseThrow(() -> new IllegalArgumentException("Item not in cart"));
        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            if (quantity > item.getMedicine().getStockQuantity()) {
                throw new IllegalArgumentException("Insufficient stock");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return getCart();
    }

    @Transactional
    public CartResponse removeItem(Long medicineId) {
        User user = currentUser();
        CartItem item = cartItemRepository.findByUserAndMedicineId(user, medicineId)
                .orElseThrow(() -> new IllegalArgumentException("Item not in cart"));
        cartItemRepository.delete(item);
        return getCart();
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private CartResponse toCartResponse(List<CartItem> items) {
        List<CartItemResponse> responses = items.stream().map(this::toItemResponse).collect(Collectors.toList());
        BigDecimal total = responses.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int count = responses.stream().mapToInt(CartItemResponse::getQuantity).sum();
        return CartResponse.builder()
                .items(responses)
                .totalAmount(total)
                .itemCount(count)
                .build();
    }

    private CartItemResponse toItemResponse(CartItem item) {
        Medicine m = item.getMedicine();
        BigDecimal lineTotal = m.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemResponse.builder()
                .id(item.getId())
                .medicineId(m.getId())
                .medicineName(m.getName())
                .imageUrl(m.getImageUrl())
                .unitPrice(m.getPrice())
                .quantity(item.getQuantity())
                .lineTotal(lineTotal)
                .stockQuantity(m.getStockQuantity())
                .requiresPrescription(m.getRequiresPrescription())
                .build();
    }
}
