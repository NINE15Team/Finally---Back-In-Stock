package com.nine15.fbis.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@Entity
@Table(name = "customer_subscription")
public class CustomerSubscriptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_email", length = 50)
    private String customerEmail;

    @Column
    private boolean status;

    @Column(name = "is_notified")
    private boolean isNotified;

    @Column(name = "is_subscribed")
    private boolean isSubscribed;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "product_info_id", insertable = false, updatable = false)
    private ProductInfoEntity productInfo;

    // Getters and Setters
}
