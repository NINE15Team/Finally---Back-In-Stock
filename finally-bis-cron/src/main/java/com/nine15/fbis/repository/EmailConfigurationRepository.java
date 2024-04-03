package com.nine15.fbis.repository;

import com.nine15.fbis.entity.EmailConfigurationEntity;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailConfigurationRepository extends ListCrudRepository<EmailConfigurationEntity, Integer> {

    Optional<EmailConfigurationEntity> findByStoreInfoId(int storeId);

}
