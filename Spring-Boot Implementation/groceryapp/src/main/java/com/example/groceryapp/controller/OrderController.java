package com.example.groceryapp.controller;

import com.example.groceryapp.entity.*;
import com.example.groceryapp.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // ===============================
    // ✅ PLACE ORDER FROM CART
    // ===============================
    @PostMapping("/place/{cartId}")
    public Order placeOrder(@PathVariable Long cartId) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCart_Id(cartId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setTotalAmount(cart.getTotalAmount());
        order.setDiscount(cart.getDiscount());
        order.setFinalAmount(cart.getFinalAmount());

        Map<Product, Integer> productMap = new HashMap<>();

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            // Reduce stock
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for " + product.getName());
            }

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            productMap.put(product, cartItem.getQuantity());
        }

        order.setProducts(productMap);

        order = orderRepository.save(order);

        // Clear cart
        cartItemRepository.deleteAll(cartItems);
        cart.setTotalAmount(0);
        cart.setDiscount(0);
        cart.setFinalAmount(0);
        cartRepository.save(cart);

        return order;
    }

    // ===============================
    // GET ORDER
    // ===============================
    @GetMapping("/{orderId}")
    public Order getOrder(@PathVariable Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
