package com.nine15.fbis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableFeignClients
public class FinallyBisCronApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinallyBisCronApplication.class, args);
    }

}
