import prisma from "../db.server";

import { findStoreByName } from "../services/store-info.service";
import { EmailDTO } from "../dto/email.dto";
import { ProductInfo } from "../models/product-info.model";
import { ShopifyStoreInfo } from "~/models/shopify-store-info.model";
import { EmailVerificationStatus } from "~/enum/EmailVerificationStatus";
import { readFile } from "fs/promises";
import path from "path";
import Handlebars from "handlebars";
import { fileURLToPath } from 'url';

const loadConfig = () => {
  let { EMAIL_API_URL, EMAIL_API_KEY } = process.env;
  if (EMAIL_API_KEY == undefined) {
    throw new Error("Email API Key is missing in .env flie");
  }
  if (EMAIL_API_URL == undefined) {
    throw new Error("Email API URL is missing in .env flie");
  }
  return { EMAIL_API_URL, EMAIL_API_KEY };
};

const sendGridAdapter = async (
  uri: string,
  { data = {}, responseType = "json", method = "POST" } = {},
) => {
  let { EMAIL_API_URL, EMAIL_API_KEY } = loadConfig();
  const requestOptions = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${EMAIL_API_KEY}`,
    },
    body: JSON.stringify(data),
  };

  return await fetch(`${EMAIL_API_URL}/${uri}`, requestOptions)
    .then((response) => {
      if (responseType == "text") {
        return response.text();
      } else {
        return response.json();
      }
    })
    .catch((response) => {
      return response;
    });
};

const loadEmailTemplate = async (email: Partial<EmailDTO> | undefined) => {
  let { store, imageURL, productTitle, price, productHandle } = email.productInfo;
  console.log(store, imageURL, productTitle, price, productHandle);
  const emailPath = path.join(__dirname, "..", "utils", "email-template.hbs");
  const file = (await readFile(emailPath)).toString();
  const template = Handlebars.compile(file);
  if (!imageURL.startsWith('https://')) {
    imageURL = 'https:' + imageURL;
  }
  return `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;700&display=swap" rel="stylesheet" />
      </head>
        <body
          style="font-family: 'Barlow'; box-sizing: border-box; margin: 0; padding: 0; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;">
          <div style="width: fit-content; border: 1px solid black;">
            <div style="padding-block: 30px; padding-inline: 38px; text-align: center; font-size: 1.4rem;">
              <p>${store.storeName}</p>
            </div>
            <div
              style="text-align: center; background: linear-gradient(#f6f6f6, #f6f6f6) top, linear-gradient(white, white) bottom; background-size: 100% 50%; background-repeat: no-repeat; padding: 1.2rem 2rem;">
              <h1>Good News!</h1>
              <p>Your product is back in stock and now available.</p>
              <div style="width: fit-content; margin: auto;">
                <img src="${imageURL}" alt="" style="width: 15rem; height: 15rem;">
                <div style="margin-inline: auto; margin-top: 1rem; text-align: left;">
                  <p style="font-weight: bold;">${productTitle}</p>
                  <p>${price}$</p>
                </div>
              </div>
              <a href="${store.shopifyURL}/products/${productHandle}"
                style="color: white; display: block; background: black; text-decoration: none; font-weight: 400; width: fit-content; margin: 1.3rem auto; text-transform: uppercase; padding: 1.1rem 1.7rem; border-radius: 4rem;">Checkout
                Now</a>
              <hr style="margin-block: 1.3rem;">
              <p style="font-size: 0.65rem;">If you have any questions, reply to this email or contact us at xxxxx.</p>
            </div>
          </div>
        </body>

        </html>`;
};

const sendEmail = async (email: Partial<EmailDTO>) => {
  console.log(email);
  const data = {
    personalizations: [
      {
        to: [
          {
            email: email.toEmail,
            name: "Finally Back in Stock",
          },
        ],
        cc: [
          {
            email: email.senderEmail,
            name: "Finall Back In Stock",
          },
        ],
        subject: "Finally Back in Stock",
      },
    ],
    content: [
      {
        type: "text/html",
        value: await loadEmailTemplate(email),
      },
    ],
    from: {
      email: "access@nine15.com",
      name: "Finally Back in Stock",
    },
    reply_to: {
      email: email.senderEmail,
      name: "Support",
    },
  };
  return sendGridAdapter("mail/send", { data, responseType: "text" });
};

const sendVerificationEmail = async (
  email: EmailDTO,
  storeInfo: ShopifyStoreInfo,
) => {
  const data = {
    nickname: email.senderName,
    from_email: email.senderEmail,
    from_name: email.senderName,
    reply_to: email.senderEmail,
    reply_to_name: email.senderName,
    address: "CA",
    state: "CA",
    city: "San Francisco",
    country: "USA",
    zip: "94105",
  };

  console.log("Sender data", data);

  return await sendGridAdapter("verified_senders", {
    data: data,
    responseType: "json",
  });
};

const saveOrUpdate = async (email: Partial<EmailDTO>) => {
  let storeInfo: any = {};
  if (!email.storeId) {
    storeInfo = await findStoreByName(email.storeName);
  } else {
    storeInfo = {
      id: email.storeId,
    };
  }
  return prisma.emailConfiguartion.upsert({
    where: {
      storeId: storeInfo?.id,
    },
    create: {
      isEmailVerified: EmailVerificationStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      store: {
        connect: {
          id: storeInfo?.id,
        },
      },
    },
    update: {
      senderId: email.senderId,
      isEmailVerified: email.isEmailVerified,
      headerContent: email.headerContent,
      bodyContent: email.bodyContent,
      footerContent: email.footerContent,
      updatedAt: new Date(),
      store: {
        connect: {
          id: storeInfo?.id,
        },
      },
    },
  });
};

const updateSender = async (storeId: any, senderId: any) => {
  console.log("updateSender", { storeId, senderId });
  return await prisma.emailConfiguartion.update({
    where: {
      storeId: storeId,
    },
    data: {
      senderId: senderId,
      isEmailVerified: EmailVerificationStatus.PENDING,
      updatedAt: new Date(),
    },
  });
};

const updateEmail = async (email: Partial<EmailDTO>) => {
  const storeInfo = await findStoreByName(email.storeName);
  let emailInfo = await prisma.emailConfiguartion.upsert({
    where: {
      storeId: storeInfo?.id,
    },
    create: {
      senderEmail: email.senderEmail,
      senderName: email.senderName,
      isEmailVerified: EmailVerificationStatus.YES,
      createdAt: new Date(),
      updatedAt: new Date(),
      store: {
        connect: {
          id: storeInfo?.id,
        },
      },
    },
    update: {
      senderName: email.senderName,
      isEmailVerified: EmailVerificationStatus.YES,
      createdAt: new Date(),
      updatedAt: new Date(),
      store: {
        connect: {
          id: storeInfo?.id,
        },
      },
    },
  });

  try {
    // let emailVerification = await sendVerificationEmail(emailInfo as unknown as EmailDTO, storeInfo as ShopifyStoreInfo);
    // console.log('Verification Email Sent to :', emailVerification.id);
    // emailInfo = await updateSender(storeInfo?.id, emailVerification.id);
    console.log("Email Updated : ", emailInfo);
    return emailInfo;
  } catch (err) {
    console.log("Error Cautght", err);
  }
};

const findByStoreName = async (storeName: any) => {
  const storeInfo = await findStoreByName(storeName);
  return await prisma.emailConfiguartion.findFirst({
    where: {
      storeId: storeInfo?.id,
    },
  });
};

const findByStoreId = async (storeId: any) => {
  return await prisma.emailConfiguartion.findFirst({
    where: {
      storeId: storeId,
    },
  });
};


const isEmailVerified = async (storeName: string) => {
  const storeInfo = await findStoreByName(storeName);
  let data = await prisma.emailConfiguartion.findFirst({
    where: {
      storeId: storeInfo?.id,
    },
  });

  // TODO later on un-comment when send verification will start working
  // if (data && data?.id && data.isEmailVerified != EmailVerificationStatus.YES) {
  //   let verifiedSender = await sendGridAdapter(`verified_senders?id=${data.senderId}`, { responseType: "json", method: "GET" })
  //   if (verifiedSender.verified) {
  //     data.isEmailVerified = EmailVerificationStatus.YES;
  //     await saveOrUpdate(data);
  //   }
  // }
  return data?.isEmailVerified;
};

const getStoreInfo = async (email: Partial<EmailDTO>) => {
  if (!email.storeId) {
    return await findStoreByName(email.storeName);
  } else {
    return {
      id: email.storeId,
    };
  }
};

export {
  sendEmail,
  saveOrUpdate,
  findByStoreName,
  updateEmail,
  isEmailVerified,
  findByStoreId
};
