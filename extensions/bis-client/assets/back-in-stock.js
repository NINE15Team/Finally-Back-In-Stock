const API_URL = "https://matches-virgin-isa-peru.trycloudflare.com";
class BackInStock extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector(".out-of-stock");
    this.shopifyURL = this.dataset.store;
    this.productId = this.dataset.productId;
    this.productTitle = this.dataset.productTitle;
    this.productHandle = this.dataset.productHandle;
    this.defaultVariantId = this.dataset.variantId;
    this.variantTitle = this.dataset.variantTitle;
    this.productInstance = JSON.parse(document.querySelector("#bis-product-json").textContent);
    this.initializeListeners();
  }

  initializeListeners() {
    console.log(this.productInstance, this.hasVariantSelectElm());
    if (this.hasVariantSelectElm()) {
      let prodInstance = this.productInstance;
      let $form = this.form;
      document.querySelector("product-info variant-selects").addEventListener('change', function () {
        setTimeout(function () {
          let selectedVariant = document.querySelector('product-form form [name=id]').value;
          let isAvailable = prodInstance.variants.some(v => v.id == selectedVariant && v.available);
          if (!isAvailable) {
            $form.classList.remove('none');
          } else {
            $form.classList.add('none');
          }
        }, 100)
      });
    }

    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.querySelector(".message *").classList.add("none");
      const formData = new FormData(e.target);
      const urlParams = new URL(document.location).searchParams;
      const variantId = urlParams.get("variant") ?? this.defaultVariantId;
      if (!this.isValidEmail(formData.get("email"))) {
        alert('Invalid Email');
        return false;
      }
      const API_URL = "https://forward-tied-contests-alerts.trycloudflare.com";
      const body = {
        shopifyURL: this.shopifyURL,
        productHandle: this.productHandle,
        productId: this.productId,
        productTitle: this.productTitle,
        variantId: variantId,
        imageURL: this.productInstance.featured_image,
        price: this.getVariant(variantId).price,
        variantTitle: this.getVariant(variantId).title,
        email: formData.get("email"),
      }

      const telephone = formData.get('telephone')
      if(telephone) {
        if(!isNaN(telephone) && telephone.length == 11) {
          body.tel = telephone
        } else {
          alert('Invalid Phone number');
          return false;
        }
      }
      const response = await fetch(`${API_URL}/api/subscriber`, {
        method: "POST",
        body: JSON.stringify(body),
      }).then(r => r.json());

      if (response?.status) {
        this.showMessage('info')
      } else {
        this.showMessage('error')
      }
    });
  }

  showMessage(type) {
    if (type == 'info') {
      this.form.querySelector(".message .success").classList.remove("none");
    } else if (type == 'error') {
      this.form.querySelector(".message .error").classList.remove("none");
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
