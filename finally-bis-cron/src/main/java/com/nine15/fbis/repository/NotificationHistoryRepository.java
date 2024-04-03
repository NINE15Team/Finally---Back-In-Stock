package com.nine15.fbis.repository;

import com.nine15.fbis.entity.NotificationHistoryEntity;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationHistoryRepository extends ListCrudRepository<NotificationHistoryEntity, Long> {


}
