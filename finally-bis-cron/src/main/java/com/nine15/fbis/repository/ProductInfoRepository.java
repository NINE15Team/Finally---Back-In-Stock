package com.nine15.fbis.repository;

import com.nine15.fbis.entity.ProductInfoEntity;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductInfoRepository extends ListCrudRepository<ProductInfoEntity, Integer> {

    List<ProductInfoEntity> findByInStock(boolean inStock);

    List<ProductInfoEntity> findByInStockAndCustomerSubscriptions_IsNotified(boolean inStock,boolean notified);

}
