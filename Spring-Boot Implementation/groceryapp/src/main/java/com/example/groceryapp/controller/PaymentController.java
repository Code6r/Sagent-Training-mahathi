package com.example.groceryapp.controller;

import com.example.groceryapp.entity.Cart;
import com.example.groceryapp.entity.Payment;
import com.example.groceryapp.repository.CartRepository;
import com.example.groceryapp.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CartRepository cartRepository;

    // ===============================
    // 💳 MAKE PAYMENT
    // ===============================
    @PostMapping("/pay/{cartId}")
    public Payment makePayment(
            @PathVariable Long cartId,
            @RequestParam String method) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getFinalAmount() == 0) {
            throw new RuntimeException("Cart is empty. Cannot pay.");
        }

        Payment payment = new Payment();
        payment.setCart(cart);
        payment.setAmount(cart.getFinalAmount());
        payment.setPaymentMethod(method);
        payment.setStatus("SUCCESS");  // simulate success

        return paymentRepository.save(payment);
    }

    // ===============================
    // 🔍 GET PAYMENT BY CART
    // ===============================
    @GetMapping("/cart/{cartId}")
    public Payment getPayment(@PathVariable Long cartId) {

        return paymentRepository.findByCart_Id(cartId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}
