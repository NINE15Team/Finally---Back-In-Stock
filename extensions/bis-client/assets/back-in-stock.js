const API_URL = "https://finally-back-in-stock-backend-d0ae88a21a21.herokuapp.com";
class BackInStock extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector("form");
    this.messageEl = this.querySelector('.message');
    this.shopifyURL = this.dataset.store;
    this.productId = this.dataset.productId;
    this.productTitle = this.dataset.productTitle;
    this.productHandle = this.dataset.productHandle;
    this.defaultVariantId = this.dataset.variantId;
    this.variantTitle = this.dataset.variantTitle;
    this.vendor = this.dataset.vendor;
    this.productInstance = JSON.parse(document.querySelector("#bis-product-json").textContent);
    this.initializeListeners();
  }

  initializeListeners() {
    if (this.hasVariantSelectElm()) {
      let prodInstance = this.productInstance;
      let $form = this.form;
      document.querySelector("product-info variant-selects").addEventListener('change', function () {
        setTimeout(function () {
          let selectedVariant = document.querySelector('product-form form [name=id]').value;
          let isAvailable = prodInstance.variants.some(v => v.id == selectedVariant && v.available);
          if (!isAvailable) {
            $form.classList.remove('hide');
          } else {
            $form.classList.add('hide');
          }
        }, 100)
      });
    }

    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (this.messageEl) {
        this.messageEl.querySelectorAll('*').forEach(el => el.classList.add('hide'))
      }
      const formData = new FormData(e.target);
      const urlParams = new URL(document.location).searchParams;
      const variantId = urlParams.get("variant") ?? this.defaultVariantId;
      if (!this.isValidEmail(formData.get("email"))) {
        alert('Invalid Email');
        return false;
      }
      if (!this.isValidPhone(formData.get("telephone"))) {
        alert('Invalid phone format');
        return false;
      }
      let image = "";
      if (this.productInstance.featured_image) {

        image = this.productInstance.featured_image;
      } else if (this.productInstance.image) {
        image = this.productInstance.image.src;
      }
      try {
        const response = await fetch(`${API_URL}/api/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Shopify-Url": Shopify.shop
          },
          body: JSON.stringify({
            shopifyURL: this.shopifyURL,
            customerEmail: formData.get("email"),
            customerPhone: formData.get('telephone'),
            status: false,
            isNotified: false,
            isSubscribed: false,
            isActive: false,
            productInfo: {
              productHandle: this.productHandle,
              productId: this.productId,
              productTitle: this.productTitle,
              variantId: variantId,
              price: Number(this.getVariant(variantId).price) / 100,
              variantTitle: this.getVariant(variantId).title,
              imageURL: image,
              status: true,
              inStock: false,
              vendor: this.vendor
            }
          }),
        }).then(r => r.json());

        if (response?.status) {
          this.showMessage('info')
        } else {
          this.showMessage('error', response?.message)
        }
      } catch (e) {
        this.showMessage('error', "Some thing wen't wrong")
      }
    });

  }

  showMessage(type, message) {
    if (type == 'info') {
      this.messageEl.querySelector('.success').classList.remove('hide');
    } else if (type == 'error') {
      if (message) {
        this.messageEl.querySelector('.error').textContent = message;
      }
      this.messageEl.querySelector('.error').classList.remove('hide');
    }
  }

  getVariant(variantId) {
    return this.productInstance.variants.find(d => d.id == variantId);
  }

  hasVariantSelectElm() {
    return document.querySelector("product-info variant-selects") != null;
  }

  isValidEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  isValidPhone(phone) {
    const regex = /^1\s?(?:\([2-9]\d{2}\)|[2-9]\d{2})[\s.-]?[2-9]\d{2}[\s.-]?\d{4}$/;
    return regex.test(phone);
  }

  hasClass(elm, className) {
    return elm.classList.contains(className);
  }
}

if (!customElements.get("back-in-stock")) {
  customElements.define("back-in-stock", BackInStock);
}
