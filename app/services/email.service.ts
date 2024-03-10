import { EmailDTO } from "~/dto/email.dto";
import { ProductInfo } from "~/models/product-info.model";

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
    let { EMAIL_API_URL, EMAIL_API_KEY } = loadConfig();
    console.log(email);
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

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${EMAIL_API_KEY}`
        },
        body: JSON.stringify(data),
    };

    return await fetch(EMAIL_API_URL, requestOptions)
        .then((response) => response.text())
};



export { sendEmail }