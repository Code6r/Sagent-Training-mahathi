package com.example.groceryapp.controller;

import com.example.groceryapp.entity.Delivery;
import com.example.groceryapp.entity.DeliveryStatus;
import com.example.groceryapp.entity.Order;
import com.example.groceryapp.repository.DeliveryRepository;
import com.example.groceryapp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    // ASSIGN DELIVERY + AGENT
    @PostMapping("/assign/{orderId}")
    public Delivery assignDelivery(
            @PathVariable Long orderId,
            @RequestParam String agentName,
            @RequestParam String agentPhone) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setAgentName(agentName);
        delivery.setAgentPhone(agentPhone);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        delivery.setAssignedTime(LocalDateTime.now());
        delivery.setTrackingNumber("TRK" + System.currentTimeMillis());

        return deliveryRepository.save(delivery);
    }

    // UPDATE STATUS + LOCATION
    @PutMapping("/update/{orderId}")
    public Delivery updateDelivery(
            @PathVariable Long orderId,
            @RequestParam DeliveryStatus status,
            @RequestParam(required = false) String location) {

        Delivery delivery = deliveryRepository.findByOrder_Id(orderId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        delivery.setStatus(status);
        delivery.setCurrentLocation(location);

        if (status == DeliveryStatus.PICKED_UP) {
            delivery.setPickedUpTime(LocalDateTime.now());
        }

        if (status == DeliveryStatus.DELIVERED) {
            delivery.setDeliveredTime(LocalDateTime.now());
        }

        return deliveryRepository.save(delivery);
    }

    // TRACK DELIVERY
    @GetMapping("/{orderId}")
    public Delivery trackDelivery(@PathVariable Long orderId) {
        return deliveryRepository.findByOrder_Id(orderId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
    }
}
