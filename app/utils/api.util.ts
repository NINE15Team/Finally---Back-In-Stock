export const httpGet = async (uri: string, shopifyURL: string) => {
    return await fetch(`${process.env.BACKEND_API}/api/${uri}`, {
        headers: {
            "Content-Type": "application/json",
            "Shopify-Url": shopifyURL
        }
    }).then(r => r.json());
};

export const httpPost = async (uri: string, body: any, shopifyURL: string) => {
    return await fetch(`${process.env.BACKEND_API}/api/${uri}`, {
        headers: {
            "Content-Type": "application/json",
            "Shopify-Url": shopifyURL,
        },
        body: JSON.stringify(body)
    }).then(r => r.json());
};