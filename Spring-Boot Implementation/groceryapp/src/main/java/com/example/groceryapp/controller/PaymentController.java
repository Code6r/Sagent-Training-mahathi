package com.example.groceryapp.controller;

import com.example.groceryapp.entity.Cart;
import com.example.groceryapp.entity.Payment;
import com.example.groceryapp.repository.CartRepository;
import com.example.groceryapp.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/pay/{userId}")
    public Payment makePayment(
            @PathVariable Long userId,
            @RequestParam String method) {

        Cart cart = cartRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getFinalAmount() <= 0) {
            throw new RuntimeException("Cart is empty");
        }

        Payment payment = new Payment();
        payment.setAmount(cart.getFinalAmount());
        payment.setPaymentMethod(method);
        payment.setPaymentStatus("SUCCESS");

        return paymentRepository.save(payment);
    }
}
