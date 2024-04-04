package com.nine15.fbis.service.impl;

import com.nine15.fbis.entity.CustomerSubscriptionEntity;
import com.nine15.fbis.repository.CustomerSubscriptionRepository;
import com.nine15.fbis.service.CustomerSubscriptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class CustomerSubscriptionServiceImpl implements CustomerSubscriptionService {

    @Autowired
    CustomerSubscriptionRepository customerSubscriptionRepository;

    @Override
    public List<CustomerSubscriptionEntity> findAll() {
        return customerSubscriptionRepository.findAll();
    }

    @Override
    public List<CustomerSubscriptionEntity> findAllNotNotified() {
        return customerSubscriptionRepository.findByIsNotified(false);
    }

    @Override
    public void updateNotificationStatus(long id, boolean notificationStatus) {
        customerSubscriptionRepository.updateIsNotified(id, notificationStatus);
    }
}
