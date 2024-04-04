package com.nine15.fbis.service.impl;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.nine15.fbis.dto.EmailDTO;
import com.nine15.fbis.entity.EmailConfigurationEntity;
import com.nine15.fbis.repository.EmailConfigurationRepository;
import com.nine15.fbis.service.EmailService;
import com.nine15.fbis.utils.EncryptionUtil;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    EmailConfigurationRepository emailConfigurationRepository;

    @Autowired
    TemplateEngine templateEngine;

    @Autowired
    ObjectMapper mapper;

    @Value("${email.sendgrid.api-key}")
    private String apiKey;

    @Value("${app.url}")
    private String appURL;
    @Value("${app.aes-secret-key}")
    private String secretKey;


    @Override
    public EmailConfigurationEntity loadEmailConfig(int storeId) {

        return emailConfigurationRepository.findByStoreInfoId(storeId).orElseGet(EmailConfigurationEntity::new);
    }

    @Override
    public void sendEmail(EmailDTO emailDTO) throws Exception {
        Content content = new Content("text/html", loadEmailTemplate(emailDTO));
        Personalization p = new Personalization();
        Email from = new Email("access@nine15.com");
        Email cc = new Email(emailDTO.getSenderEmail());
        Email to = new Email(emailDTO.getToEmail());
        p.addCc(cc);
        p.addTo(to);
        p.setSubject("Finally Back in Stock");
        Mail mail = new Mail();
        mail.setSubject("Finally Back in Stock");
        mail.addContent(content);
        mail.setFrom(from);
        mail.addPersonalization(p);
        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            log.info("Email Sent to {} with status code {}", emailDTO.getSenderEmail(), response.getStatusCode());
        } catch (IOException ex) {
            throw ex;
        }
    }

    public String loadEmailTemplate(EmailDTO emailDTO) throws Exception {
        var productInfo = emailDTO.getProductInfo();
        ObjectNode jsonObject = mapper.createObjectNode();
        jsonObject.put("sid", emailDTO.getSubscriberId());
        var token = EncryptionUtil.encrypt(mapper.writeValueAsString(jsonObject), secretKey);
        String unsubscribeLink = appURL + "/public/unsubscribe?token=" + token;
        String productURL = emailDTO.getShopifyURL() + "/products/" + productInfo.getProductHandle() + "?variant=" + productInfo.getVariantId() + "&fbis=" + emailDTO.getUuid();
        String imageURL = productInfo.getImageURL();
        if (imageURL != null && !imageURL.startsWith("https://")) {
            imageURL = "https:" + productInfo.getImageURL();
        }
        Context context = getContext(emailDTO, productURL, unsubscribeLink, imageURL);
        return templateEngine.process("email", context);
    }

    private Context getContext(EmailDTO emailDTO, String productURL, String unsubscribeLink, String imageURL) {
        log.info("Unsubscrive link {}", unsubscribeLink);
        Context context = new Context();
        context.setVariable("storeName", emailDTO.getStoreName());
        context.setVariable("headerContent", emailDTO.getHeaderContent());
        context.setVariable("bodyContent", emailDTO.getBodyContent());
        context.setVariable("footerContent", emailDTO.getFooterContent());
        context.setVariable("productURL", productURL);
        context.setVariable("imageURL", imageURL);
        context.setVariable("productTitle", emailDTO.getProductInfo().getProductTitle());
        context.setVariable("price", emailDTO.getProductInfo().getPrice());
        context.setVariable("buttonContent", emailDTO.getBodyContent());
        context.setVariable("unsubscribeLink", unsubscribeLink);
        return context;
    }
}
