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
@Table(name = "email_configuration")
public class EmailConfigurationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "sender_email", length = 50)
    private String senderEmail;

    @Column(name = "email_verified", length = 5)
    private String isEmailVerified;

    @Column(name = "header_content")
    private String headerContent;

    @Column(name = "body_content")
    private String bodyContent;

    @Column(name = "footer_content")
    private String footerContent;

    @Column(name = "sender_id")
    private int senderId;

    @Column(name = "button_content")
    private String buttonContent;

    @Column(name = "email_title")
    private String title;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "store_id", insertable = false, updatable = false)
    private StoreInfoEntity storeInfo;

}
