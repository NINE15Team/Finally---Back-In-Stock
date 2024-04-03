package com.nine15.fbis.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@Entity
@Table(name = "product_info")
public class ProductInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "store_id")
    private int storeId;

    @Column(name = "product_id")
    private long productId;

    @Column(name = "product_title", length = 50, nullable = false)
    private String productTitle;

    @Column(name = "product_handle", length = 50)
    private String productHandle;

    @Column(name = "variant_id")
    private Long variantId;

    @Column(name = "variant_title")
    private String variantTitle;

    @Column(name = "image_url")
    private String imageUrl;

    private Double price;

    @Column(name = "in_stock")
    private Boolean inStock;

    @ManyToOne
    @JoinColumn(name = "store_id", insertable = false, updatable = false)
    private StoreInfoEntity storeInfo;


    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @OneToMany(mappedBy = "productInfo", fetch = FetchType.EAGER)
    private List<CustomerSubscriptionEntity> customerSubscriptions;
//
//    @OneToMany(mappedBy = "productInfo")
//    private List<NotificationHistoryEntity> notificationHistories;
//
//    @OneToMany(mappedBy = "productInfo")
//    private List<CustomerActivityEntity> customerActivities;

    // Getters and Setters
}
