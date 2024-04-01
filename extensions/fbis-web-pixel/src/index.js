import { register } from "@shopify/web-pixels-extension";

const API_URL = "https://finally-back-in-stock-dev-2db9466211f6.herokuapp.com";

register(({ configuration, analytics, browser, init }) => {

  // Sample subscribe to page view
  analytics.subscribe('product_viewed', async (event) => {
    console.log('i am viewied local', init, browser);
    let params = new URL(init.document.location).searchParams;
    if (params.get('fbis')) {
      let uuid = params.get('fbis');
      console.log('demo', event, isCookieExist(`${uuid}_view`));
      if (!isCookieExist(`${uuid}_view`)) {
        let variantId = event.data.productVariant.id;
        let productId = event.data.productVariant.product.id;
        const response = await fetch(`${API_URL}/api/customer_activity`, {
          method: "POST",
          body: JSON.stringify([{
            productId: productId,
            variantId: variantId,
            shopifyURL: location.host,
            uuid: uuid,
            browserTrackId: event.clientId,
            status: 'view'
          }]),
        }).then(r => r.json());
        setCookie(`${uuid}_view`, variantId, 30);
        setCookie(variantId, uuid);
        captureActivity(event.clientId, 'fbis_viewed', productId, variantId, uuid);
      } else {
        console.log("View!!")
      }
    }

  });

  analytics.subscribe('product_added_to_cart', async (event) => {
    console.log(event);
    let variantId = event.data.cartLine.merchandise.id;
    let productId = event.data.cartLine.merchandise.product.id;
    let uuid = getCookie(variantId);
    let targetVariant = getCookie(`${uuid}_view`);
    if (uuid && !isCookieExist(`${uuid}_cart`) && targetVariant == variantId) {
      const response = await fetch(`${API_URL}/api/customer_activity`, {
        method: "POST",
        body: JSON.stringify([{
          productId: productId,
          variantId: event.data.cartLine.merchandise.id,
          shopifyURL: location.host,
          uuid: uuid,
          browserTrackId: event.clientId,
          status: 'add_to_cart'
        }]),
      }).then(r => r.json());
      setCookie(`${uuid}_cart`, variantId, 30);
      captureActivity(event.clientId, 'fbis_added_to_cart', productId, variantId, uuid);
    } else {
      console.log("Add to Cart!!")
    }
  });

  analytics.subscribe('product_removed_from_cart', (event) => {
    console.log('Product Removed!!', event);
  });


  analytics.subscribe('checkout_completed', async (event) => {
    let activities = getActivity(event.clientId, 'fbis_added_to_cart');
    if (activities) {
      let data = [];
      activities.forEach(elm => {
        data.push({
          productId: elm.productId,
          variantId: elm.variantId,
          shopifyURL: location.host,
          uuid: elm.uuid,
          browserTrackId: event.clientId,
          status: 'completed'
        })
      })
      const response = await fetch(`${API_URL}/api/customer_activity`, {
        method: "POST",
        body: JSON.stringify(data),
      }).then(r => r.json());
      deleteActivity(event.clientId);
    }
    console.log(event);
  });

  function setCookie(name, value, daysToExpire, path = '/') {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=${path}`;
  }

  function isCookieExist(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('=');
      if (cookie[0] === name) {
        return true;
      }
    }
    return false;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null; // Or return an empty string if you prefer
  }


  function captureActivity(key, status, productId, variantId, uuid) {
    try {
      const obj = JSON.parse(sessionStorage.getItem(key)) || {};
      if (!obj[status]) {
        obj[status] = [];
      }
      obj[status].push({ uuid, productId, variantId });
      sessionStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
      console.error('Data error', e);
    }
  }

  function getActivity(key, status) {
    const objectString = sessionStorage.getItem(key);
    if (objectString) {
      const obj = JSON.parse(objectString);
      return obj[status];
    }
  }

  function deleteActivity(key) {
    sessionStorage.removeItem(key);
  }

});
