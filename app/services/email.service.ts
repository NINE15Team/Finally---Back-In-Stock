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
import { Optional } from "@prisma/client/runtime/library";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const loadEmailTemplate = async (email: Optional<EmailDTO>) => {
  let { store, imageURL, productTitle, price, productHandle } =
    email.productInfo;
  console.log(store, imageURL, productTitle, price, productHandle);
  const emailPath = path.join(__dirname, "..", "utils", "email-template.hbs");
  const file = (await readFile(emailPath)).toString();
  const template = Handlebars.compile(file);
  if (!imageURL.startsWith('https://')) {
    imageURL = 'https:' + imageURL;
  }
  const populatedTemplate = template({
    shop: store.storeName,
    product: {
      image: imageURL,
      name: productTitle,
      price,
      url: `${store.shopifyURL}/products/${productHandle}`,
    },
  });
  return populatedTemplate.toString();
};

const sendEmail = async (email: Optional<EmailDTO>) => {
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
