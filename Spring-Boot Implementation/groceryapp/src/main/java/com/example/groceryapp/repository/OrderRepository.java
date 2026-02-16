package com.example.groceryapp.repository;

import com.example.groceryapp.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
