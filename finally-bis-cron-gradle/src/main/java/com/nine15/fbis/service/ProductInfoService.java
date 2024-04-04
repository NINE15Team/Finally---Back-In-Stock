package com.nine15.fbis.service;

import com.nine15.fbis.entity.ProductInfoEntity;

import java.util.List;

public interface ProductInfoService {


    List<ProductInfoEntity> findAll();
    List<ProductInfoEntity> findInStockProduct();

}
