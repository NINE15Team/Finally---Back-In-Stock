import { register } from "@shopify/web-pixels-extension";

register(({ configuration, analytics, browser }) => {
  // Bootstrap and insert pixel script tag here

  // Sample subscribe to page view
  analytics.subscribe('product_viewed', (event) => {
    console.log('Product viewed', event);
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
