package com.nine15.fbis;

import com.nine15.fbis.entity.ProductInfoEntity;
import com.nine15.fbis.service.CustomerSubscriptionService;
import com.nine15.fbis.service.ProductInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
public class SimpleController {

    @Autowired
    ProductInfoService productInfoService;

    @Autowired
    CustomerSubscriptionService customerSubscriptionService;

    @GetMapping("/hello")
    public List<ProductInfoEntity> greeting() {
        return productInfoService.findInStockProduct();
    }
}