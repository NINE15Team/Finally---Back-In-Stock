class BackInStock extends HTMLElement {
  constructor() {
    super();

    this.form = this.querySelector(".out-of-stock");
    this.storeId = this.dataset.store;
    this.productId = this.dataset.productId;
    this.productTitle = this.dataset.productTitle;
    this.variantId = this.dataset.variantId;
    this.variantTitle = this.dataset.variantTitle;
    this.initializeListeners();
    console.log(this.dataset)
  }

  initializeListeners() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const urlParams = new URL(document.location).searchParams;
      console.log({
        storeId: this.storeId,
        productId: this.productId,
        productTitle: this.productTitle,
        variantId: this.variantId,
        variantTitle: this.variantTitle,
        email: formData.get("email")
      })
      // const variant = urlParams.get("variant") ?? this.defaultVariantId;
      const API_URL = "https://nowhere-people-outdoors-tales.trycloudflare.com";
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
          variantTitle: this.variantTitle,
          email: formData.get("email")
        }),
      });

      if (response.ok) alert("Submitted");
    });
  }
}

if (!customElements.get("back-in-stock"))
  customElements.define("back-in-stock", BackInStock);
