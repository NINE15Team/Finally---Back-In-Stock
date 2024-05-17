import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { unSubscribeProduct, findById } from "../services/customer-subscriber.service";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {

  const token = new URL(request.url).searchParams.get("token") as string;
  let subscriberObj = {} as any;
  let parseFail = false;
  try {
    subscriberObj = JSON.parse(atob(token));
  } catch (elm) {
    parseFail = true;
  }
  let subscriber = await findById({ id: subscriberObj.sid });
  let data = await unSubscribeProduct({ id: subscriberObj.sid });
  let productURL = `https://${subscriber?.productInfo.store.shopifyURL}/products/${subscriber?.productInfo.productHandle}?variant=${subscriber?.productInfo.variantId}`
  return { data, productURL, parseFail };
};

export const action = async ({ request }: ActionFunctionArgs) => {
};

export default function Index() {
  let { productURL, parseFail } = useLoaderData<typeof loader>();

  return (
    <>
      {parseFail ? (
        <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
          <p>An error occurred. Please try again later.</p>
        </div>
      ) : (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '20px' }}>
          <h1 style={{ color: '#333' }}>You're Unsubscribed</h1>
          <p style={{ color: '#666' }}>You have successfully unsubscribed from our product notifications. If this was a mistake, or if you change your mind, you can always resubscribe.</p>
          <div style={{ margin: '30px 0' }}>
            <Link to={productURL} style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', display: 'inline-block' }}>
              Go Back to Product Page
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
