package com.nine15.fbis.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Setter
@Getter
@Builder
public class EmailDTO {
    private Long id;
    private String toEmail;
    private String title;
    private String html;
    private ProductInfoDTO productInfo;
    private Long storeId;
    private String storeName;
    private String shopifyURL;
    private String senderEmail;
    private String isEmailVerified;
    private Long senderId;
    private Long subscriberId;
    private String headerContent;
    private String bodyContent;
    private String footerContent;
    private String buttonContent;
    private String uuid;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
