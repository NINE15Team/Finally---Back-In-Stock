package com.nine15.fbis.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter

@Entity
@Table(name = "customer_activity")
public class CustomerActivityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String status;

    @Column(name = "store_id")
    private int storeId;

    @Column(name = "product_info_id")
    private int productInfoId;

    @Column(name = "browser_track_id")
    private String browserTrackId;

    @Column(name = "notification_history_id")
    private int notificationHistoryId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "store_id", insertable = false, updatable = false)
    private StoreInfoEntity store;

    @ManyToOne
    @JoinColumn(name = "notification_history_id", insertable = false, updatable = false)
    private NotificationHistoryEntity notificationHistory;

    @ManyToOne
    @JoinColumn(name = "product_info_id", insertable = false, updatable = false)
    private ProductInfoEntity productInfo;

    // Getters and Setters
}
