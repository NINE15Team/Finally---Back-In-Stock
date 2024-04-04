package com.nine15.fbis.client;


import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "sendGrid", url = "${email.sendgrid.api-url}")
public interface SendGridClient {




}
