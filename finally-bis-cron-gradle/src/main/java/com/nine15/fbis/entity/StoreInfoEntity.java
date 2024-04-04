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
@Table(name = "store_info")
public class StoreInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "store_id")
    private String storeId;

    @Column(name = "store_name", length = 50)
    private String storeName;

    @Column(name = "shopify_url", unique = true, length = 100)
    private String shopifyURL;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_initilized")
    private boolean isInitialized;

    @Column(name = "is_active")
    private boolean isActive;

}
