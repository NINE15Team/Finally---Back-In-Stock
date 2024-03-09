import { EmailDTO } from "~/dto/email.dto";

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


const loadTemplate = async () => {
};

const sendEmail = async (email: EmailDTO) => {
    let { EMAIL_API_URL, EMAIL_API_KEY } = loadConfig();
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
                "value": email.html
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