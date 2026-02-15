package com.example.groceryapp.repository;

import com.example.groceryapp.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByCart_Id(Long cartId);
}
