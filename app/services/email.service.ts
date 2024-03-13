import prisma from "../db.server";

import { findStoreByName } from "../services/store-info.service";
import { EmailDTO } from "../dto/email.dto";
import { ProductInfo } from "../models/product-info.model";
import { ShopifyStoreInfo } from "~/models/shopify-store-info.model";

const loadConfig = () => {
    let { EMAIL_API_URL, EMAIL_API_KEY } = process.env;
    if (EMAIL_API_KEY == undefined) {
        throw new Error('Email API Key is missing in .env flie');
    }
    if (EMAIL_API_URL == undefined) {
        throw new Error('Email API URL is missing in .env flie');
    }
    return { EMAIL_API_URL, EMAIL_API_KEY };
}

const sendGridAdapter = async (uri: string, data: any) => {
    let { EMAIL_API_URL, EMAIL_API_KEY } = loadConfig();
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${EMAIL_API_KEY}`
        },
        body: JSON.stringify(data),
    };

    return await fetch(`${EMAIL_API_URL}/${uri}`, requestOptions)
        .then((response) => response.text())
        .catch((response) => response.text())
}

const loadEmailTemplate = (productInfo: ProductInfo) => {
    let { store } = productInfo
    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                max-width: 600px;
                margin: auto;
                border: 1px solid #ddd;
            }
            .header {
                background-color: #f8f8f8;
                padding: 10px;
                text-align: center;
                border-bottom: 1px solid #ddd;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .footer {
                background-color: #f8f8f8;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
            }
            a.button {
                background-color: #007bff;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Back in Stock!</h2>
            </div>
            <div class="content">
                <p>Dear Customer</p>
                <p>The product you've been waiting for is back in stock!</p>
                <a href="${store.shopifyURL}/products/${productInfo.productHandle}" class="button">Shop Now</a>
                <p>Don't miss out this time.</p>
            </div>
            <div class="footer">
                <p>Thank you for shopping with ${productInfo.store.storeName}!</p>
            </div>
        </div>
    </body>
    </html>
    `;
}


const sendEmail = async (email: EmailDTO) => {
    const data = {
        "personalizations": [
            {
                "to": [
                    {
                        "email": email.email,
                        "name": email.name
                    }
                ],
                "subject": email.title
            }
        ],
        "content": [
            {
                "type": "text/html",
                "value": loadEmailTemplate(email.productInfo)
            }
        ],
        "from": {
            "email": "khair@nine15.com",
            "name": "Product has been re-stocked"
        },
        "reply_to": {
            "email": "khair@nine15.com",
            "name": "Support"
        }
    };

    return sendGridAdapter('mail/send', data);
};

const sendVerificationEmail = async (email: EmailDTO, storeInfo: ShopifyStoreInfo) => {
    const data = {
        "nickname": email.senderName,
        "from_email": email.senderEmail,
        "from_name": email.senderName,
        "reply_to": email.senderEmail,
        "reply_to_name": email.senderName,
        "address": "CA",
        "state": "CA",
        "city": "San Francisco",
        "country": "USA",
        "zip": "94105"
    };

    console.log('Sender data', data);

    return sendGridAdapter('verified_senders', data);
}


const save = async (email: EmailDTO) => {
    const storeInfo = await findStoreByName(email.storeName)
    return prisma.emailConfiguartion.upsert({
        where: {
            storeId: storeInfo?.id
        },
        create: {
            senderEmail: email.senderEmail,
            isEmailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            store: {
                connect: {
                    id: storeInfo?.id
                }
            }

        },
        update: {
            senderName: email.senderName,
            headerContent: email.headerContent,
            bodyContent: email.bodyContent,
            footerContent: email.footerContent,
            updatedAt: new Date(),
            store: {
                connect: {
                    id: storeInfo?.id
                }
            }

        }
    })
}

const updateEmail = async (email: EmailDTO) => {
    const storeInfo = await findStoreByName(email.storeName)
    let emailInfo = await prisma.emailConfiguartion.update({
        where: {
            storeId: storeInfo?.id
        },
        data: {
            senderEmail: email.senderEmail,
            updatedAt: new Date(),
        }
    });
    let emailVerification = await sendVerificationEmail(emailInfo as unknown as EmailDTO, storeInfo as ShopifyStoreInfo);
    console.log('Verification Email Sent to :', emailVerification);
    return emailInfo;
}


const findByStoreName = async (storeName: any) => {
    const storeInfo = await findStoreByName(storeName)
    prisma.emailConfiguartion.findFirst({
        where: {
            storeId: storeInfo?.id
        },
    })
}

const isEmailVerified = async (storeName: string) => {
    const storeInfo = await findStoreByName(storeName)
    let count = await prisma.emailConfiguartion.count({
        where: {
            storeId: storeInfo?.id,
            isEmailVerified: true
        },
    });
    return count > 0;
}

export { sendEmail, save, findByStoreName, updateEmail, isEmailVerified }