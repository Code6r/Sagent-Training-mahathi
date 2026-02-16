package com.example.groceryapp.repository;

import com.example.groceryapp.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    // Find delivery by order id (for tracking)
    Optional<Delivery> findByOrder_Id(Long orderId);

    // Optional: find by agent name (useful for admin)
    List<Delivery> findByAgentName(String agentName);

    // Optional: find by status
    List<Delivery> findByStatus(com.example.groceryapp.entity.DeliveryStatus status);
}
