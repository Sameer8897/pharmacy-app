package com.pharmacy.repository;

import com.pharmacy.entity.CartItem;
import com.pharmacy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndMedicineId(User user, Long medicineId);
    void deleteByUser(User user);
}
