import prisma from "../db.server";

import { findStoreByURL } from "../services/store-info.service";
import { EmailDTO } from "../dto/email.dto";
import { EmailVerificationStatus } from "~/enum/EmailVerificationStatus";
import { ProductInfoDTO } from "~/dto/product-info.dto";
import { ProductInfo } from "~/models/product-info.model";
import EncryptionUtil from "~/utils/encryption.util";
import { EmailConfiguration } from "~/models/email-config.model";

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

const loadEmailTemplate = async (email: EmailDTO) => {
  console.log("Email Content", email)
  let { productInfo, storeName, shopifyURL }: EmailDTO = email;
  if (productInfo?.imageURL && !productInfo?.imageURL?.startsWith('https://')) {
    productInfo.imageURL = 'https:' + productInfo.imageURL;
  }
  let { SHOPIFY_APP_URL, AES_SECRET_KEY } = process.env;
  if (AES_SECRET_KEY == undefined) {
    throw new Error("API SECRECT key is missing in .env flie");
  }
  let token = EncryptionUtil.encrypt(JSON.stringify({ sid: email.subscriberId }), AES_SECRET_KEY);
  let unsubscribeLink = `${SHOPIFY_APP_URL}/public/unsubscribe?token=${token}`;
  let productURL = `${shopifyURL}/products/${productInfo?.productHandle}?variant=${productInfo?.variantId}&fbis=${email.uuid}&email=${email.senderEmail}`;
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Modern HTML Email Template</title>
<style type="text/css">
	@import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Montserrat:wght@200;300;400;500;600;700;800&display=swap')
	body {
		margin: 0;
		background-color: #cccccc;
	}
	table {
		border-spacing: 0;
	}
	td {
		padding: 0;
	}
	img {
		border: 0;
	}
	.wrapper{
		width:  100%;
		table-layout: fixed;
		background-color: #cccccc;
		padding-bottom: 60px;
		padding-top: 60px;
	}	
	.main{
		background-color: #ffffff;
		margin: 0 auto;
		width: 100%;
		max-width: 600px;
		border-spacing: 0;
		font-family: "Barlow", sans-serif;
		color: #303030;


	}
	.two-columns{
		text-align: center;
		font-size: 0;
	}
	.two-columns .column{
		width: 100%;
		max-width: 250px;
		display: inline-block;
		vertical-align: middle;
		text-align: start;
	}
	.column p,
	.column b{
		font-size: 16px;
		line-height: 1.5;
	}
	.name{
		padding: 15px 15px;
	}
	.three-columns{
		text-align: center;
		font-size: 0;
		padding: 15px 0 25px;
	}
	.three-columns .column{

		width: 100%;
		max-width: 200px;
		display: inline-block;
		vertical-align: middle;
		text-align: start;
	}
	.three-columns .column .padding{
	 padding:  30px 35px;
	}
	.icon-grid .icon{
		width: 100%;
		max-width:35px;
		display: inline-block;
		vertical-align: middle;
		text-align: start;
	}
	.icon-grid .column{
		width: 100%;
		display: inline-block;
		vertical-align: middle;
		text-align: start;
		background-color: #F7F7F7;
	}
	.icon-grid{
		padding: 12%;
	}
</style>
</head>
<body>

<center class="wrapper" style="padding-bottom: 60px;
		padding-top: 60px;">
<table class="main" style="width:100%;max-width:600px;border:solid 1px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);">
<!-- TOP BORDER -->

<tr>
	<td>
		<table align="end" width="100%">
			<tr>
				<td align="end" style="
			    color: black;
			    text-align: end;
			    vertical-align: baseline;">
					<p style="text-align: center; font-size:20px;">${storeName}</p>

			</td>
			</tr>
		</table>
	</td>
</tr>

<!-- Intro text-->

<tr>
	<td>
		<table align="center" width="100%" style="background: #F6F6F6">
			<tr>
				<td align="center" style="text-align:center;">
		      	<h3 style="font-size: 30px; font-weight: bold; text-align: center;">${email?.headerContent || "Good News!"}</h3>
		       	<p align="center" style="font-size: 18px;vertical-align: middle;margin-top: 0; padding: 0 15px;">
             ${email?.bodyContent || "Your product is back in stock and now available."}
		      	</p>
		      	<a href="${productURL}" style="    
		      	font-size: 18px;
    			display: inline-block;
    			vertical-align: middle;
    			margin-top: 0;
    			padding: 0 15px;
    			text-decoration: none;
    			padding-bottom: 30px;">
					<img src="${productInfo?.imageURL}" alt="Wexel" title="Wexel" width="330px" alt="">
					<p align="left" style=" color: black; margin: 0;"><strong> ${productInfo?.productTitle}</strong></p>
					<p align="left" style=" color: black;  margin: 0;">$${productInfo?.price}</p>
				</a>
			</td>
			</tr>
		</table>
	</td>
</tr>
<tr align="center">
	<td>
<table class="btn" role="presentation" border="0" cellpadding="0" cellspacing="0" style=" margin-bottom:  60px;margin-top:  30px;">
        <tbody>
            <tr>
                <td style="line-height: 24px; font-size: 16px; border-radius: 6px; margin: 0; background: black; padding: 15px 30px;border-radius: 50px;" align="center">
                    <a href="${productURL}" style="color: white !important; text-decoration: none !important;" > ${email?.buttonContent || "Checkout Now"}</a>
                </td>
            </tr>
        </tbody>
    </table>
	</td>
</tr>


<!-- TITLE, TEXT & BUTTON -->

  <tr>
    <td>
      <hr style="
          border-top: .5px solid #BDBDBD;
          max-width: 500px;
            vertical-align: middle;
            padding: 0 15px;
            ">
      <table align="center" width="100%">
        <p class="bottom-text text-center" style="line-height: 24px; font-size: 13px; width: 100%;margin: 0;" align="center">
        ${email?.footerContent || 'If you have any questions, reply to this email or contact us at xxxxx'}
        </p>
        <p class="bottom-text text-center" style="line-height: 24px; font-size: 13px; width: 100%; padding-bottom: 15px; margin: 0;" align="center">
            To unsubscribe this product email, <a href="${unsubscribeLink}"> Click </a> 
        </p>
      </table>
    </td>
  </tr>

<!-- FOOTER SECTION -->
</table>
</center>
</body>
</html>
<!-- Begin Social Share **you can remove this to center the template :) -->
  `;
};

const sendEmail = async (email: EmailDTO) => {
  try {
    const data = {
      personalizations: [
        {
          to: [
            {
              email: email.toEmail,
              name: email.title,
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
  } catch (error) {
    console.log(error);
  }
};


const saveOrUpdate = async (email: Partial<EmailDTO>) => {
  const storeInfo = await findStoreByURL(email.shopifyURL);
  return prisma.emailConfiguartion.upsert({
    where: {
      storeId: storeInfo?.id,
    },
    create: {
      title: email.title,
      senderEmail: email.senderEmail,
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
      headerContent: email.headerContent,
      bodyContent: email.bodyContent,
      footerContent: email.footerContent,
      buttonContent: email.buttonContent,
      updatedAt: new Date(),
      store: {
        connect: {
          id: storeInfo?.id,
        },
      },
    },
  });
};


const upsertEmail = async (email: Partial<EmailDTO>) => {
  const storeInfo = await findStoreByURL(email.shopifyURL);
  let emailInfo = await prisma.emailConfiguartion.upsert({
    where: {
      storeId: storeInfo?.id,
    },
    create: {
      senderEmail: email.senderEmail,
      title: email.title,
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
      senderEmail: email.senderEmail,
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
    console.log("Email Updated : ", emailInfo);
    return emailInfo;
  } catch (err) {
    console.log("Error Cautght", err);
  }
};

const findEmailConfigByStoreURL = async (url: any) => {
  const storeInfo = await findStoreByURL(url);
  return await prisma.emailConfiguartion.findFirst({
    where: {
      storeId: storeInfo?.id,
    },
  }) || {} as EmailConfiguration;
};

const findByStoreId = async (storeId: any) => {
  return await prisma.emailConfiguartion.findFirst({
    where: {
      storeId: storeId,
    },
  });
};


const isEmailVerified = async (storeName: string) => {
  const storeInfo = await findStoreByURL(storeName);
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
    return await findStoreByURL(email.storeName);
  } else {
    return {
      id: email.storeId,
    };
  }
};

export {
  sendEmail,
  saveOrUpdate,
  findEmailConfigByStoreURL,
  upsertEmail,
  isEmailVerified,
  findByStoreId
};
