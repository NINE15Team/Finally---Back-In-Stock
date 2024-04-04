package com.nine15.fbis.cron;

import com.nine15.fbis.dto.EmailDTO;
import com.nine15.fbis.dto.ProductInfoDTO;
import com.nine15.fbis.entity.CustomerSubscriptionEntity;
import com.nine15.fbis.entity.NotificationHistoryEntity;
import com.nine15.fbis.entity.ProductInfoEntity;
import com.nine15.fbis.service.CustomerSubscriptionService;
import com.nine15.fbis.service.EmailService;
import com.nine15.fbis.service.NotificationHistoryService;
import com.nine15.fbis.service.ProductInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Configuration
@Slf4j
public class ScheduledTasks {

    @Autowired
    ProductInfoService productInfoService;

    @Autowired
    CustomerSubscriptionService customerSubscriptionService;

    @Autowired
    NotificationHistoryService notificationHistoryService;

    @Autowired
    EmailService emailService;
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    @Scheduled(initialDelay = 60000, fixedDelay = 900000)
    public void reportCurrentTime() throws Exception {
        var unNotifiedList = productInfoService.findInStockProduct();
        for (ProductInfoEntity productInfo : unNotifiedList) {
            String uuid = UUID.randomUUID().toString();
            int count = 0;
            for (CustomerSubscriptionEntity subscriptionEntity : productInfo.getCustomerSubscriptions()) {
                if (!subscriptionEntity.isNotified()) {
                    ++count;
                    var emailConfig = emailService.loadEmailConfig(productInfo.getStoreInfo().getId());
                    log.info("UUID Generated {}", uuid);
                    var productInfoDTO = ProductInfoDTO.builder()
                            .productHandle(productInfo.getProductHandle())
                            .productTitle(productInfo.getProductTitle())
                            .variantTitle(productInfo.getVariantTitle())
                            .variantId(productInfo.getVariantId())
                            .price(productInfo.getPrice())
                            .imageURL(productInfo.getImageUrl())
                            .build();
                    var emailDTO = EmailDTO.builder()
                            .productInfo(productInfoDTO)
                            .shopifyURL(productInfo.getStoreInfo().getShopifyURL())
                            .toEmail(subscriptionEntity.getCustomerEmail())
                            .senderEmail(emailConfig.getSenderEmail())
                            .headerContent(emailConfig.getHeaderContent())
                            .bodyContent(emailConfig.getBodyContent())
                            .buttonContent(emailConfig.getBodyContent())
                            .footerContent(emailConfig.getFooterContent())
                            .uuid(uuid)
                            .build();

                    emailService.sendEmail(emailDTO);
                    customerSubscriptionService.updateNotificationStatus(subscriptionEntity.getId(), true);
                }
            }
            if (count > 0) {
                var notificationEntity = NotificationHistoryEntity
                        .builder()
                        .noOfNotifications(count)
                        .productInfo(productInfo)
                        .uuid(uuid)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                notificationHistoryService.save(notificationEntity);
            }
            log.info("The time is now {}", dateFormat.format(new Date()));
        }
    }
}