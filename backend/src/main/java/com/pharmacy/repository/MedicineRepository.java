package com.pharmacy.repository;

import com.pharmacy.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    @Query("SELECT m FROM Medicine m WHERE " +
            "LOWER(m.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
            "LOWER(m.category) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
            "LOWER(m.manufacturer) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Medicine> search(@Param("q") String q);

    List<Medicine> findByCategoryIgnoreCase(String category);
}
