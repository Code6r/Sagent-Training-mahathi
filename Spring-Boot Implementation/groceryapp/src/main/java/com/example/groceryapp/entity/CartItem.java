package com.example.groceryapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    private double subtotal;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonIgnore   // prevents infinite recursion
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // ===== GETTERS =====

    public Long getId() {
        return id;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public Cart getCart() {
        return cart;
    }

    public Product getProduct() {
        return product;
    }

    // ===== SETTERS =====

    public void setId(Long id) {
        this.id = id;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
