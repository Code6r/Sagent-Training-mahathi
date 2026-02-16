package com.example.groceryapp.entity;

import jakarta.persistence.*;
import java.util.Map;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double totalAmount;
    private double discount;
    private double finalAmount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Store product + quantity
    @ElementCollection
    @CollectionTable(name = "order_products",
            joinColumns = @JoinColumn(name = "order_id"))
    @MapKeyJoinColumn(name = "product_id")
    @Column(name = "quantity")
    private Map<Product, Integer> products;

    // ===== Getters & Setters =====

    public Long getId() { return id; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }

    public double getFinalAmount() { return finalAmount; }
    public void setFinalAmount(double finalAmount) { this.finalAmount = finalAmount; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Map<Product, Integer> getProducts() { return products; }
    public void setProducts(Map<Product, Integer> products) { this.products = products; }
}
