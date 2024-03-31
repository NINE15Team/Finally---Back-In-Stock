import { register } from "@shopify/web-pixels-extension";

const API_URL = "https://play-faq-poverty-freeware.trycloudflare.com";

register(({ analytics }) => {
  // Bootstrap and insert pixel script tag here

  // Sample subscribe to page view
  analytics.subscribe('product_viewed', async (event) => {
    let params = new URL(document.location).searchParams;
    if (params.get('fbis')) {
      console.log('change', event);
      const response = await fetch(`${API_URL}/api/customer_activity`, {
        method: "POST",
        body: JSON.stringify({
          productId: event.data.productVariant.product.id,
          variantId: event.data.productVariant.id,
          browserTrackId: event.clientId,
          uuid: params.get('fbis'),
          status: 'view'
        }),
      }).then(r => r.json());
    }
  });

  analytics.subscribe('product_added_to_cart', (event) => {
    console.log('Added to cart', event);
  });

  analytics.subscribe('product_removed_from_cart', (event) => {
    console.log('Product Removed!!', event);
  });


  analytics.subscribe('checkout_completed', (event) => {
    console.log('Checkout Done!!', event);
  });



});
