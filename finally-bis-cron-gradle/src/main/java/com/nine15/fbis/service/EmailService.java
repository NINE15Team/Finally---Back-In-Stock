package com.nine15.fbis.service;

import com.nine15.fbis.dto.EmailDTO;
import com.nine15.fbis.entity.EmailConfigurationEntity;

import java.io.IOException;
import java.util.Optional;

public interface EmailService {


    EmailConfigurationEntity loadEmailConfig(int storeId);

    void sendEmail(EmailDTO emailDTO) throws Exception;
}
