package com.nine15.fbis.repository;

import com.nine15.fbis.entity.CustomerSubscriptionEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerSubscriptionRepository extends ListCrudRepository<CustomerSubscriptionEntity, Integer> {


    List<CustomerSubscriptionEntity> findByIsNotified(boolean isNotified);

    @Modifying
    @Transactional
    @Query("UPDATE CustomerSubscriptionEntity c SET c.isNotified = :isNotified WHERE c.id = :id")
    void updateIsNotified(@Param("id") Long id, @Param("isNotified") boolean isNotified);

}
