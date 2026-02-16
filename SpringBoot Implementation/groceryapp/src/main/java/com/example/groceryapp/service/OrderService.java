package com.example.groceryapp.service;

import com.example.groceryapp.entity.Order;
import com.example.groceryapp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order placeOrder(Long userId) {

        Order order = new Order();
        order.setStatus("PLACED");
        order.setTotalAmount(500.0); // example

        return orderRepository.save(order);
    }

    public void makePayment(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus("PAID");

        orderRepository.save(order);
    }

    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
