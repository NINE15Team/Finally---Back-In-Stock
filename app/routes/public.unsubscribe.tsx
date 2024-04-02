import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { unSubscribeProduct, findById } from "../services/customer-subscriber.service";
import { Link, useLoaderData } from "@remix-run/react";
import EncryptionUtil from "~/utils/encryption.util";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { AES_SECRET_KEY } = process.env;
  if (AES_SECRET_KEY == undefined) {
    throw new Error("AES_SECRET_KEY is missing in .env flie");
  }
  const token = new URL(request.url).searchParams.get("token") as string;
  let rawData = EncryptionUtil.decrypt(token, AES_SECRET_KEY);
  let obj = JSON.parse(rawData);
  let subscriber = await findById({ id: obj.sid });
  let data = await unSubscribeProduct({ id: obj.sid });
  let productURL = `https://${subscriber?.productInfo.store.shopifyURL}/products/${subscriber?.productInfo.productHandle}?variant=${subscriber?.productInfo.variantId}`
  return { data, productURL };
};

export const action = async ({ request }: ActionFunctionArgs) => {
};

export default function Index() {
  let { productURL } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#333' }}>You're Unsubscribed</h1>
      <p style={{ color: '#666' }}>You have successfully unsubscribed from our product notifications. If this was a mistake, or if you change your mind, you can always resubscribe.</p>
      <div style={{ margin: '30px 0' }}>
        <Link to={productURL} style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', display: 'inline-block' }}>
          Go Back to Product Page
        </Link>
      </div>
    </div>
  );
}
