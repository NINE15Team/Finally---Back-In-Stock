package com.nine15.fbis.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@Builder
@Entity
@Table(name = "notification_history")
public class NotificationHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "no_of_notifications")
    private int noOfNotifications;

    @Column
    private String uuid;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "product_info_id", insertable = true, updatable = false)
    private ProductInfoEntity productInfo;

    @OneToMany(mappedBy = "notificationHistory")
    private List<CustomerActivityEntity> customerActivities;

    // Getters and Setters
}
