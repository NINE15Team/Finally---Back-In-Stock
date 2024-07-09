import { register } from "@shopify/web-pixels-extension";

const API_URL = "https://finally-back-in-stock-a2662c637241.herokuapp.com";

register(({ configuration, analytics, browser, init }) => {

  analytics.subscribe('product_viewed', async (event) => {

    let uuid = getParamVal(init.context.document.location.search, "fbis");
    let email = getParamVal(init.context.document.location.search, "email");
    let cookieStatus = await isCookieExist(`${uuid}_view`);
    console.log(uuid, email)
    if (uuid) {
      if (!cookieStatus) {
        let variantId = event.data.productVariant.id;
        let productId = event.data.productVariant.product.id;
        const response = await fetch(`${API_URL}/api/customer_activity`, {
          method: "POST",
          body: JSON.stringify([{
            productId: productId,
            variantId: variantId,
            shopifyURL: location.host,
            uuid: uuid,
            customerEmail: email,
            browserTrackId: event.clientId,
            activity: 'view'
          }]),
        }).then(r => r.json());
        if (response.success) {
          await setCookie(`${uuid}_view`, variantId, 30);
          await setCookie(`${uuid}_view_email`, email, 30);
          await setCookie(variantId, uuid);
          await captureActivity(event.clientId, 'fbis_viewed', productId, variantId, uuid, email);
        } else {
          console.error(response.message);
        }
      } else {
        console.log("View!!")
      }
    }

  });


  analytics.subscribe('product_added_to_cart', async (event) => {
    console.log(event);
    let variantId = event.data.cartLine.merchandise.id;
    let productId = event.data.cartLine.merchandise.product.id;
    let uuid = await getCookie(variantId);
    let targetVariant = await getCookie(`${uuid}_view`);
    let email = await getCookie(`${uuid}_view_email`);
    let cookieStatus = await isCookieExist(`${uuid}_cart`);
    console.log(uuid, targetVariant, email, !cookieStatus, variantId, targetVariant == variantId);
    if (uuid && !cookieStatus && targetVariant == variantId) {
      const response = await fetch(`${API_URL}/api/customer_activity`, {
        method: "POST",
        body: JSON.stringify([{
          productId: productId,
          variantId: event.data.cartLine.merchandise.id,
          shopifyURL: location.host,
          uuid: uuid,
          browserTrackId: event.clientId,
          customerEmail: email,
          activity: 'add_to_cart'
        }]),
      }).then(r => r.json());
      if (response.success) {
        await setCookie(`${uuid}_cart`, variantId, 30);
        await captureActivity(event.clientId, 'fbis_added_to_cart', productId, variantId, uuid, email);
      } else {
        console.error(response.message);
      }
    } else {
      console.log("Add to Cart!!")
    }
  });

  analytics.subscribe('product_removed_from_cart', (event) => {
    console.log('Product Removed!!', event);
  });


  analytics.subscribe('checkout_completed', async (event) => {
    let activities = await getActivity(event.clientId, 'fbis_added_to_cart');
    if (activities) {
      let data = [];
      activities.forEach(elm => {
        data.push({
          productId: elm.productId,
          variantId: elm.variantId,
          shopifyURL: location.host,
          uuid: elm.uuid,
          browserTrackId: event.clientId,
          customerEmail: elm.email,
          activity: 'completed'
        })
      })
      const response = await fetch(`${API_URL}/api/customer_activity`, {
        method: "POST",
        body: JSON.stringify(data),
      }).then(r => r.json());
      await deleteActivity(event.clientId);
    }
    console.log(event);
  });

  function getParamVal(queryString, key) {
    const pairs = queryString.substring(1).split('&');
    const params = {};
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      params[key] = value;
    });
    return params[key];
  }

  async function setCookie(name, value, daysToExpire, path = '/') {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    await browser.cookie.set(`${name}=${value}; ${expires}; path=${path}`);
  }

  async function isCookieExist(name) {
    const val = await browser.cookie.get(name);
    return val != null && val != undefined && val.length > 0;
  }

  async function getCookie(name) {
    let val = await browser.cookie.get(name);
    return val;
  }


  async function captureActivity(key, status, productId, variantId, uuid, email) {
    try {
      const obj = JSON.parse(await browser.sessionStorage.getItem(key)) || {};
      if (!obj[status]) {
        obj[status] = [];
      }
      obj[status].push({ uuid, productId, variantId, email });
      await browser.sessionStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
      console.error('Data error', e);
    }
  }

  async function getActivity(key, status) {
    const objectString = await browser.sessionStorage.getItem(key);
    if (objectString) {
      const obj = JSON.parse(objectString);
      return obj[status];
    }
  }

  async function deleteActivity(key) {
    await browser.sessionStorage.removeItem(key);
  }




});
