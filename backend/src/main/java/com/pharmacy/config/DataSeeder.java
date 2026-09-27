package com.pharmacy.config;

import com.pharmacy.entity.Medicine;
import com.pharmacy.entity.User;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;
    private final PasswordEncoder passwordEncoder;
    @Value("${app.seed-demo-users:false}")
    private boolean seedDemoUsers;
    @Value("${app.admin.seed:false}")
    private boolean seedAdmin;
    @Value("${app.admin.email:}")
    private String adminEmail;
    @Value("${app.admin.password:}")
    private String adminPassword;
    @Value("${app.admin.name:Admin}")
    private String adminName;

    @Override
    public void run(String... args) {
        if (seedAdmin
                && adminEmail != null && !adminEmail.isBlank()
                && adminPassword != null && !adminPassword.isBlank()
                && !userRepository.existsByEmail(adminEmail.toLowerCase())) {
            userRepository.save(User.builder()
                    .name(adminName)
                    .email(adminEmail.toLowerCase())
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .role("ADMIN")
                    .build());
        }

        if (seedDemoUsers) {
            if (!userRepository.existsByEmail("admin@pharmacy.com")) {
                userRepository.save(User.builder()
                        .name("Admin")
                        .email("admin@pharmacy.com")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .phone("9999999999")
                        .role("ADMIN")
                        .build());
            }

            if (!userRepository.existsByEmail("customer@pharmacy.com")) {
                userRepository.save(User.builder()
                        .name("Demo Customer")
                        .email("customer@pharmacy.com")
                        .passwordHash(passwordEncoder.encode("customer123"))
                        .phone("8888888888")
                        .role("CUSTOMER")
                        .build());
            }
        }

        if (medicineRepository.count() == 0) {
            medicineRepository.saveAll(List.of(
                    medicine("Paracetamol 500mg", "Pain relief and fever reducer. Pack of 15 tablets.",
                            "Cipla", "Painkiller", false, "45.00", 200,
                            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"),
                    medicine("Amoxicillin 250mg", "Broad-spectrum antibiotic. Capsule strip of 10.",
                            "Sun Pharma", "Antibiotic", true, "120.00", 80,
                            "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400"),
                    medicine("Vitamin D3 60K", "Weekly vitamin D supplement. Softgel capsules.",
                            "Abbott", "Vitamin", false, "180.00", 150,
                            "https://images.unsplash.com/photo-1550571638-4f1d6d0c0f3a?w=400"),
                    medicine("Cetirizine 10mg", "Antihistamine for allergy relief. Pack of 10.",
                            "Dr Reddy's", "Allergy", false, "28.00", 300,
                            "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400"),
                    medicine("Omeprazole 20mg", "Acid reflux and GERD treatment. Capsules.",
                            "Torrent", "Digestive", false, "95.00", 120,
                            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"),
                    medicine("Metformin 500mg", "Type 2 diabetes management. Pack of 20.",
                            "USV", "Diabetes", true, "55.00", 90,
                            "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400"),
                    medicine("Ibuprofen 400mg", "Anti-inflammatory pain relief. Tablets.",
                            "Pfizer", "Painkiller", false, "65.00", 175,
                            "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400"),
                    medicine("Multivitamin Daily", "Complete daily multivitamin for adults.",
                            "Himalaya", "Vitamin", false, "249.00", 200,
                            "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400")
            ));
        }
    }

    private Medicine medicine(String name, String desc, String mfr, String category,
                              boolean rx, String price, int stock, String image) {
        return Medicine.builder()
                .name(name)
                .description(desc)
                .manufacturer(mfr)
                .category(category)
                .requiresPrescription(rx)
                .price(new BigDecimal(price))
                .stockQuantity(stock)
                .imageUrl(image)
                .build();
    }
}
