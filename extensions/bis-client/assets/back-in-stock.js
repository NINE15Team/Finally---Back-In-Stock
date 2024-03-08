class BackInStock extends HTMLElement {
  constructor() {
    super();

    this.form = this.querySelector(".out-of-stock");
    this.storeId = this.dataset.store;
    this.productId = this.dataset.product;
    this.defaultVariantId = this.dataset.variant;
    this.initializeListeners();
  }

  initializeListeners() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const urlParams = new URL(document.location).searchParams;

      const variant = urlParams.get("variant") ?? this.defaultVariantId;

      const response = await fetch("https://earn-come-preferred-dim.trycloudflare.com/api/subscriber", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId: this.storeId,
          productId: this.productId,
          variantId: variant,
          email: formData.get("email")
        }),
      });

      if (response.ok) alert("Submitted");
    });
  }
}

if (!customElements.get("back-in-stock"))
  customElements.define("back-in-stock", BackInStock);
