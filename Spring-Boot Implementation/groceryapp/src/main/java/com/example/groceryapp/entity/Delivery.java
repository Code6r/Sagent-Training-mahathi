package com.example.groceryapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== DELIVERY STATUS =====
    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    // ===== DELIVERY AGENT DETAILS =====
    private String agentName;
    private String agentPhone;

    // ===== TRACKING DETAILS =====
    private String trackingNumber;
    private String currentLocation;

    // ===== TIMESTAMPS =====
    private LocalDateTime assignedTime;
    private LocalDateTime pickedUpTime;
    private LocalDateTime deliveredTime;

    // ===== ORDER RELATION =====
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnoreProperties({"delivery"})
    private Order order;

    // ===== GETTERS & SETTERS =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }

    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }

    public String getAgentPhone() { return agentPhone; }
    public void setAgentPhone(String agentPhone) { this.agentPhone = agentPhone; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }

    public LocalDateTime getAssignedTime() { return assignedTime; }
    public void setAssignedTime(LocalDateTime assignedTime) { this.assignedTime = assignedTime; }

    public LocalDateTime getPickedUpTime() { return pickedUpTime; }
    public void setPickedUpTime(LocalDateTime pickedUpTime) { this.pickedUpTime = pickedUpTime; }

    public LocalDateTime getDeliveredTime() { return deliveredTime; }
    public void setDeliveredTime(LocalDateTime deliveredTime) { this.deliveredTime = deliveredTime; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}
