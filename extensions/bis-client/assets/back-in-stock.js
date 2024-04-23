const API_URL = "https://finally-back-in-stock-a2662c637241.herokuapp.com";
class BackInStock extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector("form");
    this.showModalButton = this.querySelector('.notify-button');
    this.closeModalButton = this.querySelector('.close');
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
      if (e.submitter.classList.contains('close')) {
        return false;
      }
      this.messageEl.querySelectorAll('*').forEach(el => el.classList.add('hide'))
      const formData = new FormData(e.target);
      const urlParams = new URL(document.location).searchParams;
      const variantId = urlParams.get("variant") ?? this.defaultVariantId;
      if (!this.isValidEmail(formData.get("email"))) {
        alert('Invalid Email');
        return false;
      }
      let image = "";
      if (this.productInstance.featured_image) {

        image = this.productInstance.featured_image;
      } else if (this.productInstance.image) {
        image = this.productInstance.image.src;
      }

      const response = await fetch(`${API_URL}/api/subscriber`, {
        method: "POST",
        body: JSON.stringify({
          shopifyURL: this.shopifyURL,
          productHandle: this.productHandle,
          productId: this.productId,
          productTitle: this.productTitle,
          variantId: variantId,
          imageURL: image,
          vendor: this.vendor,
          price: Number(this.getVariant(variantId).price) / 100,
          variantTitle: this.getVariant(variantId).title,
          email: formData.get("email"),
          customerPhone: formData.get('telephone')
        }),
      }).then(r => r.json());

      if (response?.status) {
        this.showMessage('info')
      } else {
        this.showMessage('error')
      }
    });

    this.showModalButton.addEventListener('click', () => {
      document.body.appendChild(this.form)
      this.form.classList.remove('hide')
    })

    this.closeModalButton.addEventListener('click', () => {
      this.form.classList.add('hide')
    })
  }

  showMessage(type) {
    if (type == 'info') {
      this.messageEl.querySelector('.success').classList.remove('hide');
    } else if (type == 'error') {
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

  hasClass(elm, className) {
    return elm.classList.contains(className);
  }
}

if (!customElements.get("back-in-stock")) {
  customElements.define("back-in-stock", BackInStock);
}
