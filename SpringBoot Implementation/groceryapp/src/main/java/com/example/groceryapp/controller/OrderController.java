package com.example.groceryapp.controller;

import com.example.groceryapp.entity.Order;
import com.example.groceryapp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // PLACE ORDER
    @PostMapping("/place/{userId}")
    public Order placeOrder(@PathVariable Long userId) {
        return orderService.placeOrder(userId);
    }

    // PAYMENT
    @PostMapping("/pay/{orderId}")
    public String makePayment(@PathVariable Long orderId) {
        orderService.makePayment(orderId);
        return "Payment Successful!";
    }

    // GET ORDER
    @GetMapping("/{orderId}")
    public Order getOrder(@PathVariable Long orderId) {
        return orderService.getOrder(orderId);
    }
}
