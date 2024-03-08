import { EmailDTO } from "~/dto/email.dto";

const loadConfig = () => {
    let { EMAIL_API_URL, EMAIL_API_KEY, EMAIL_API_SECRET } = process.env;
    if (EMAIL_API_KEY == undefined) {
        throw new Error('Email API Key is missing in .env flie');
    }
    if (EMAIL_API_SECRET == undefined) {
        throw new Error('Email API Secret is missing in .env flie');
    }
    if (EMAIL_API_URL == undefined) {
        throw new Error('Email API URL is missing in .env flie');
    }
    return { EMAIL_API_URL, EMAIL_API_KEY, EMAIL_API_SECRET };
}


const loadTemplate = async () => {
};

const sendEmail = async (email: EmailDTO) => {
    let { EMAIL_API_URL, EMAIL_API_KEY, EMAIL_API_SECRET } = loadConfig();
    const data = {
        "recipients": [
            {
                "email": email.email,
                "name": email.name
            }
        ],
        "title": email.title,
        "html": email.html
    };

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-trustifi-key": EMAIL_API_KEY,
            "x-trustifi-secret": EMAIL_API_SECRET
        },
        body: JSON.stringify(data),
    } as any;

    await fetch(EMAIL_API_URL, requestOptions)
        .then((response) => response.json())
};


export { sendEmail }