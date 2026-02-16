package com.example.groceryapp.repository;

import com.example.groceryapp.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Get all orders of a specific user
    List<Order> findByUserId(Long userId);

}
