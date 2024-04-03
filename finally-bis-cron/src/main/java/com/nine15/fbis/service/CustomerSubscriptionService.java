package com.nine15.fbis.service;

import com.nine15.fbis.entity.CustomerSubscriptionEntity;

import java.util.List;

public interface CustomerSubscriptionService {


    List<CustomerSubscriptionEntity> findAll();

    List<CustomerSubscriptionEntity> findAllNotNotified();

    void updateNotificationStatus(long id, boolean notificationStatus);

}
