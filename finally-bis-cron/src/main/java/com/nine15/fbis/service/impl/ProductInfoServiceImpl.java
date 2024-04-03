package com.nine15.fbis.service.impl;

import com.nine15.fbis.entity.ProductInfoEntity;
import com.nine15.fbis.repository.ProductInfoRepository;
import com.nine15.fbis.service.ProductInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ProductInfoServiceImpl implements ProductInfoService {

    @Autowired
    ProductInfoRepository productInfoRepository;

    @Override
    public List<ProductInfoEntity> findAll() {
        return productInfoRepository.findAll();
    }

    @Override
    public List<ProductInfoEntity> findInStockProduct() {
        return productInfoRepository.findByInStockAndCustomerSubscriptions_IsNotified(true,false);
    }
}
