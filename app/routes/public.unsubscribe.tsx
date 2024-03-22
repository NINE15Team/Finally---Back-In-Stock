import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { unSubscribeProduct, findById } from "../services/customer-subscriber.service";
import { Link, useLoaderData } from "@remix-run/react";
import EncryptionUtil from "~/utils/encryption.util";

//18addec7db7ec809176bd71447607cb6171165ee8b62942f866dfbd8abe5303e2c3eff1b513facb7975aeb3f53201823a437da696c4895357b0c119bfedd2974463eba3c5d0f9a56bd5d42ec8088a3d104a5989c410c8e830c79e7046f87111390d5bb7b3b8fb70f58402a8c69835b5ad83fa087b1da8669298bd1f296ee6f8997808230b28404bb2bfa5efd16db4647797009b06fd33a89739ab8c01b70e1e3bf26a9624f7f3e5db6ed38c1e6491a33718b8848485a35e780d5501218227106b6058478cba395947827c71d71c28419b24eeb2195da90f62f464d6da7f717b8651787637ff825fd4d10d6d4bf06e82f7602d797a0d19aef254a67b7659cee2cd4b55167f13a1f6aff27244c6d4d993d5dd526b8137f914cc7f979cbb910d84d
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { AES_SECRET_KEY } = process.env;
  if (AES_SECRET_KEY == undefined) {
    throw new Error("AES_SECRET_KEY is missing in .env flie");
  }
  const token = new URL(request.url).searchParams.get("token") as string;
  let rawData = EncryptionUtil.decrypt(token, AES_SECRET_KEY);
  let obj = JSON.parse(rawData);
  console.log("Decrypted Data: ", AES_SECRET_KEY);
  let subscriber = await findById({ id: obj.sid });
  let data = await unSubscribeProduct({ id: obj.sid });
  let productURL = `${subscriber?.productInfo.store.shopifyURL}/products/${subscriber?.productInfo.productHandle}`
  return { data, productURL };
};

export const action = async ({ request }: ActionFunctionArgs) => {
};

export default function Index() {
  let { data, productURL } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#333' }}>You're Unsubscribed</h1>
      <p style={{ color: '#666' }}>You have successfully unsubscribed from our product notifications. If this was a mistake, or if you change your mind, you can always resubscribe.</p>
      <div style={{ margin: '30px 0' }}>
        <Link to={{ pathname: productURL }} style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', display: 'inline-block' }}>
          Go Back to Product Page
        </Link>
      </div>
    </div>
  );
}
