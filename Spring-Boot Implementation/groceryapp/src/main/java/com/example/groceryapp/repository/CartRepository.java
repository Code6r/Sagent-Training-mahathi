package com.example.groceryapp.repository;

import com.example.groceryapp.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    // Find cart by user ID (useful for checkout flow)
    Optional<Cart> findByUser_Id(Long userId);
}
