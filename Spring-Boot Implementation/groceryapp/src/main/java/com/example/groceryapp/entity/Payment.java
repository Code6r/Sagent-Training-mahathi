package com.example.groceryapp.entity;

import jakarta.persistence.*;

@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentMethod; // UPI, CARD, WALLET, COD

    private double amount;

    private String status; // SUCCESS, FAILED

    @OneToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    // ===== GETTERS =====

    public Long getId() {
        return id;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public double getAmount() {
        return amount;
    }

    public String getStatus() {
        return status;
    }

    public Cart getCart() {
        return cart;
    }

    // ===== SETTERS =====

    public void setId(Long id) {
        this.id = id;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }
}
