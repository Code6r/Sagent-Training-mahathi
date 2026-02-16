package com.example.groceryapp.entity;

import jakarta.persistence.*;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private Double price;
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    // Getters and Setters
}
