class BackInStock extends HTMLElement {
  constructor() {
    super();

    this.form = this.querySelector(".out-of-stock");
    this.storeId = this.dataset.store;
    this.productId = this.dataset.productId;
    this.productTitle = this.dataset.productTitle;
    this.defaultVariantId = this.dataset.variantId;
    this.variantTitle = this.dataset.variantTitle;
    this.initializeListeners();
    console.log(this.dataset)
  }

  initializeListeners() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const urlParams = new URL(document.location).searchParams;
      const variantId = urlParams.get("variant") ?? this.defaultVariantId;
      console.log({
        storeId: this.storeId,
        productId: this.productId,
        productTitle: this.productTitle,
        variantId: variantId,
        variantTitle: document.querySelector(".js.product-form__input :checked").value,
        email: formData.get("email")
      });
      if (!this.isValidEmail(formData.get("email"))) {
        alert('Invalid Email');
        return false;
      }
      const API_URL = "https://encounter-yale-weight-longer.trycloudflare.com";
      const response = await fetch(`${API_URL}/api/subscriber`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId: this.storeId,
          productId: this.productId,
          productTitle: this.productTitle,
          variantId: this.variantId,
          variantTitle: document.querySelector(".js.product-form__input :checked").value,
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
    document.querySelector(".out-of-stock .message *").classList.add("none");
    if (type == 'info') {
      document.querySelector(".out-of-stock .message .success").classList.remove("none");
    } else if (type == 'error') {
      document.querySelector(".out-of-stock .message .error").classList.remove("none");
    }

  }
  isValidEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }
}

if (!customElements.get("back-in-stock"))
  customElements.define("back-in-stock", BackInStock);
