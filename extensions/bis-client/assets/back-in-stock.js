class BackInStock extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector(".out-of-stock");
    this.storeId = this.dataset.store;
    this.productId = this.dataset.productId;
    this.productTitle = this.dataset.productTitle;
    this.productHandle = this.dataset.productHandle;
    this.defaultVariantId = this.dataset.variantId;
    this.variantTitle = this.dataset.variantTitle;
    this.productInstance = JSON.parse(document.querySelector("#bis-product-json").textContent);
    this.initializeListeners();
  }

  initializeListeners() {
    console.log(this.productInstance);
    if (this.hasVariantSelectElm()) {
      document.querySelector("product-info variant-selects").addEventListener('change', function () {
        let isDisabled = this.querySelector(":checked").classList.contains('disabled');
        if (isDisabled) {
          document.querySelector(".out-of-stock").classList.remove('none');
        } else {
          document.querySelector(".out-of-stock").classList.add('none');
        }
      });
    }
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      document.querySelector(".out-of-stock .message *").classList.add("none");
      const formData = new FormData(e.target);
      const urlParams = new URL(document.location).searchParams;
      const variantId = urlParams.get("variant") ?? this.defaultVariantId;
      if (!this.isValidEmail(formData.get("email"))) {
        alert('Invalid Email');
        return false;
      }
      const API_URL = "https://finally-back-in-stock-staging-91f1859b2ef3.herokuapp.com";
      const response = await fetch(`${API_URL}/api/subscriber`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId: this.storeId,
          storeName: this.storeId,
          productHandle: this.productHandle,
          productId: this.productId,
          productTitle: this.productTitle,
          variantId: variantId,
          variantTitle: this.getVariantTitle(variantId),
          email: formData.get("email")
        }),
      });

      if (response?.ok) {
        this.showMessage('info')
      } else {
        this.showMessage('error')
      }
    });
  }

  showMessage(type) {
    if (type == 'info') {
      document.querySelector(".out-of-stock .message .success").classList.remove("none");
    } else if (type == 'error') {
      document.querySelector(".out-of-stock .message .error").classList.remove("none");
    }
  }

  getVariantTitle(variantId) {
    return this.productInstance.variants.find(d => d.id == variantId).title;
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

if (!customElements.get("back-in-stock"))
  customElements.define("back-in-stock", BackInStock);
