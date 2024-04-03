package com.nine15.fbis.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
@Builder
public class ProductInfoDTO {
    private String storeId;
    private String storeName;
    private String productHandle;
    private Long productId;
    private String productTitle;
    private Long variantId;
    private String variantTitle;
    private Double price;
    private String imageURL;
    private Boolean status;
    private Boolean inStock;
    private Boolean isActive;

}
