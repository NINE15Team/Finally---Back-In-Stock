package com.nine15.fbis.service.impl;

import com.nine15.fbis.entity.NotificationHistoryEntity;
import com.nine15.fbis.repository.NotificationHistoryRepository;
import com.nine15.fbis.service.NotificationHistoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationHistoryServiceImpl implements NotificationHistoryService {

    @Autowired
    NotificationHistoryRepository notificationHistoryRepository;

    @Override
    public void save(NotificationHistoryEntity notificationHistoryEntity) {
        notificationHistoryRepository.save(notificationHistoryEntity);
    }
}
