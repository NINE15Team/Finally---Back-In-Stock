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

const sendGridAdapter = async (uri: string, { data = {}, responseType = 'json', method = 'POST' } = {}) => {
  let { EMAIL_API_URL, EMAIL_API_KEY } = loadConfig();
  const requestOptions = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${EMAIL_API_KEY}`
    },
    body: JSON.stringify(data),
  };

  return await fetch(`${EMAIL_API_URL}/${uri}`, requestOptions)
    .then((response) => {
      if (responseType == 'responseType') {
        return response.text()
      } else {
        return response.json()
      }
    })
    .catch((response) => response.text())
}

const loadEmailTemplate = (email: EmailDTO) => {
  let { store } = email.productInfo;
  return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
      <title></title>
    
        <style type="text/css">
          @media only screen and (min-width: 520px) {
      .u-row {
        width: 500px !important;
      }
      .u-row .u-col {
        vertical-align: top;
      }
    
      .u-row .u-col-100 {
        width: 500px !important;
      }
    
    }
    
    @media (max-width: 520px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
      .u-row .u-col {
        min-width: 320px !important;
        max-width: 100% !important;
        display: block !important;
      }
      .u-row {
        width: 100% !important;
      }
      .u-col {
        width: 100% !important;
      }
      .u-col > div {
        margin: 0 auto;
      }
    }
    body {
      margin: 0;
      padding: 0;
    }
    
    table,
    tr,
    td {
      vertical-align: top;
      border-collapse: collapse;
    }
    
    p {
      margin: 0;
    }
    
    .ie-container table,
    .mso-container table {
      table-layout: fixed;
    }
    
    * {
      line-height: inherit;
    }
    
    a[x-apple-data-detectors='true'] {
      color: inherit !important;
      text-decoration: none !important;
    }
    
    table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
    font-family: sans-serif !important;
        </style>
    
    
    
    <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
    
    </head>
    
    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
      <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
    
    
    <div class="u-row-container" style="padding: 0px;background-color: #ffffff">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
    
    <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
      <div style="height: 100%;width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
    
    <table style="" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px;" align="left">
    
      <h2 style="margin: 0px; line-height: 250%; text-align: center; word-wrap: break-word; font-size: 20px; font-weight: 700;">${email.storeName}</h2>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: #eeeeee">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #eeeeee;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
    
    <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
      <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
    
    <table style="" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 20px;" align="left">
    
      <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 14px; font-weight: 400;"><strong>${email.title}</strong></h1>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: #eeeeee">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #eeeeee;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
    
    <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
      <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
    
    <table style="" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;" align="left">
    
      <div style=" font-size: 14px; color: #ecf0f1; line-height: 140%; text-align: center; word-wrap: break-word;">
        <p style="line-height: 140%;"><span style="color: #000000; float: none; display: inline; line-height: 19.6px;">${email.bodyContent}</span></p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: #eeeeee">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #eeeeee;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
    
    <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
      <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
    
    <table style="" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;" align="left">
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;display:none" align="center">
    
          <img align="center" border="0" src="" alt="" title="" style=" outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;" width="480"/>
    
        </td>
      </tr>
    </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;" align="left">
    
      <div style="font-size: 16px; line-height: 140%; text-align: left; word-wrap: break-word;">
        <p style="line-height: 140%;">${email.productInfo.productTitle}</p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: #eeeeee">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #eeeeee;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
    
    <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
      <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
    
    <table style="" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;" align="left">
    
      <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
    <div align="center">
       <a href="${store.storeName}/products/${email.productInfo.productHandle}" style="height:37px; v-text-anchor:middle; width:192px;" arcsize="11%"  stroke="f" fillcolor="#000000"><w:anchorlock/><center style="color:#FFFFFF;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: ${email.bodyBgColor}; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:40%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
          <span style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 16.8px;">Checkout</span></span>
        </a>
    </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: #eeeeee">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #eeeeee;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
    
    <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
      <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
    
    <table style="" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;" align="left">
    
      <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
        <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
              <span>&#160;</span>
            </td>
          </tr>
        </tbody>
      </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: #eeeeee">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #eeeeee;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
    
    <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
      <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
    
    <table style="" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;" align="left">
    
      <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
        <p style="line-height: 140%;">If you have any questions, reply to this email or contact us at</p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
      </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>
    
    </html>`;
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
        "value": loadEmailTemplate(email)
      }
    ],
    "from": {
      "email": email.senderEmail,
      "name": "Product has been re-stocked"
    },
    "reply_to": {
      "email": email.senderEmail,
      "name": "Support"
    }
  };

  return sendGridAdapter('mail/send', { data, responseType: "text" });
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

  return await sendGridAdapter('verified_senders', { data: data, responseType: "json" });
}


const saveOrUpdate = async (email: Partial<EmailDTO>) => {
  let storeInfo: any = {};
  if (!email.storeId) {
    storeInfo = await findStoreByName(email.storeName)
  } else {
    storeInfo = {
      id: email.storeId
    }
  }
  return prisma.emailConfiguartion.upsert({
    where: {
      storeId: storeInfo?.id
    },
    create: {
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
      senderId: email.senderId,
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

const updateSender = async (storeId: any, senderId: any) => {
  console.log("updateSender", { storeId, senderId });
  return await prisma.emailConfiguartion.update({
    where: {
      storeId: storeId
    },
    data: {
      senderId: senderId,
      updatedAt: new Date(),
    }
  });
}


const updateEmail = async (email: Partial<EmailDTO>) => {
  const storeInfo = await findStoreByName(email.storeName)
  let emailInfo = await prisma.emailConfiguartion.upsert({
    where: {
      storeId: storeInfo?.id
    },
    create: {
      senderEmail: email.senderEmail,
      senderName: email.senderName,
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
      createdAt: new Date(),
      updatedAt: new Date(),
      store: {
        connect: {
          id: storeInfo?.id
        }
      }
    }
  });

  try {
    let emailVerification = await sendVerificationEmail(emailInfo as unknown as EmailDTO, storeInfo as ShopifyStoreInfo);
    console.log('Verification Email Sent to :', emailVerification.id);
    emailInfo = await updateSender(storeInfo?.id, emailVerification.id);
    console.log('Sender Id captured : ', emailInfo);
    return emailInfo;
  } catch (err) {
    console.log("Error Cautght", err)
  }
}

const findByStoreName = async (storeName: any) => {
  const storeInfo = await findStoreByName(storeName)
  return await prisma.emailConfiguartion.findFirst({
    where: {
      storeId: storeInfo?.id
    },
  })
}

const isEmailVerified = async (storeName: string) => {
  const storeInfo = await findStoreByName(storeName)
  let data = await prisma.emailConfiguartion.findFirst({
    where: {
      storeId: storeInfo?.id,
      isEmailVerified: true
    },
  });
  if (data && data?.id && !data.isEmailVerified) {
    let verifiedSender = await sendGridAdapter(`verified_senders?id=${5681512}`, { responseType: "json", method: "GET" })
    if (verifiedSender.verified) {
      data.isEmailVerified = verifiedSender.verified;
      await saveOrUpdate(data);
    }
  }
  return data?.isEmailVerified;
}

const getStoreInfo = async (email: Partial<EmailDTO>) => {
  if (!email.storeId) {
    return await findStoreByName(email.storeName)
  } else {
    return {
      id: email.storeId
    }
  }
}

export { sendEmail, saveOrUpdate, findByStoreName, updateEmail, isEmailVerified }