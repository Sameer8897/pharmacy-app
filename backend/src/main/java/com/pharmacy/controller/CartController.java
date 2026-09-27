package com.pharmacy.controller;

import com.pharmacy.dto.CartItemRequest;
import com.pharmacy.dto.CartResponse;
import com.pharmacy.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCart() {
        return cartService.getCart();
    }

    @PostMapping("/items")
    public CartResponse addItem(@Valid @RequestBody CartItemRequest request) {
        return cartService.addItem(request);
    }

    @PutMapping("/items/{medicineId}")
    public CartResponse updateQuantity(@PathVariable Long medicineId, @RequestBody Map<String, Integer> body) {
        Integer quantity = body.get("quantity");
        if (quantity == null) {
            throw new IllegalArgumentException("quantity is required");
        }
        return cartService.updateQuantity(medicineId, quantity);
    }

    @DeleteMapping("/items/{medicineId}")
    public CartResponse removeItem(@PathVariable Long medicineId) {
        return cartService.removeItem(medicineId);
    }
}
