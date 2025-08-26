import { showToast } from "../../../actions/showToast.js";
import { getCurrentUser } from "../../register/LocalStorageUtils.js";

function addProductHandler() {
  // form inputs
  const inputs = {
    title: document.getElementById("productTitle"),
    status: document.getElementById("availabilityStatus"),
    brand: document.getElementById("brand"),
    quantity: document.getElementById("quantityInStock"),
    description: document.getElementById("description"),
    category: document.getElementById("category"),
    price: document.getElementById("price"),
    discount: document.getElementById("discount"),
    img: document.getElementById("productImg"),
  };

  const cardContainer = document.getElementById("products-cards-container");

  // --- Local Storage Helpers ---
  function getProducts() {
    try {
      return JSON.parse(localStorage.getItem("all-products")) || [];
    } catch {
      return [];
    }
  }

  function saveProducts(products) {
    localStorage.setItem("all-products", JSON.stringify(products));
  }

  // --- Validation ---
  function validateProduct({
    title,
    status,
    quantity,
    description,
    price,
    discount,
  }) {
    const errors = {};
    const titleRegex = /^[A-Za-z0-9\s\-']{3,45}$/;
    const descRegex = /^.{8,150}$/;

    if (!titleRegex.test(title)) {
      errors.title =
        "Title must be 3–45 characters (letters, numbers, spaces, - ' allowed)";
    }
    if (!descRegex.test(description)) {
      errors.description = "Description must be 8–150 characters long";
    }

    quantity = Number(quantity);
    if (status === "inStock" && quantity === 0) {
      errors.quantity = "Quantity must be greater than 0 if in stock";
    }
    if (quantity < 0 || quantity > 1_000_000) {
      errors.quantity = "Quantity must be between 1 and 1,000,000";
    }

    price = Number(price);
    if (price <= 0 || price > 1_000_000_000) {
      errors.price = "Price must be greater than 0 and less than 1B";
    }

    discount = Number(discount);
    if (discount < 0 || discount >= 100) {
      errors.discount = "Discount must be between 0–99%";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  function showValidationErrors(errors) {
    // remove old alerts
    document.querySelectorAll(".error-alert").forEach((e) => e.remove());

    Object.entries(errors).forEach(([key, message]) => {
      const inputEl = inputs[key];
      if (inputEl) {
        const alert = document.createElement("div");
        alert.className = "alert alert-danger mt-2 p-1 error-alert";
        alert.innerText = message;
        inputEl.insertAdjacentElement("afterend", alert);
      }
    });
  }

  // --- Product-CRUD ---
  function createProductData({
    title,
    brand,
    quantity,
    description,
    status,
    category,
    price,
    discount,
    img,
  }) {
    return {
      id: Date.now(),
      title,
      brand,
      stock: Number(quantity),
      description,
      availabilityStatus: status,
      category,
      price: Number(price - (price * discount) / 100), // ✅ corrected discount logic
      discountPercentage: Number(discount),
      deletedPrice: Number(price),
      thumbnail: img,
      images: [img],
      sellerID: getCurrentUser().id,
    };
  }

  function addProduct(product) {
    const products = getProducts();
    products.push(product);
    saveProducts(products);
    showToast("Product Added Successfully", "success");
  }

  function deleteProduct(productID) {
    const deleteConfirm = confirm(
      "are You sure you want to Delete this product"
    );
    if (!deleteConfirm) return;
    const products = getProducts();
    const updatedProducts = products.filter(
      (product) => product.id !== productID
    );
    saveProducts(updatedProducts);
  }
  function getProductDetails(productID) {
    const productDetails = getProducts().filter(
      (product) => product.id === productID
    );
    return productDetails;
  }

  // --- Rendering ---
  function createProductCard(product) {
    return `
      <div class="col-lg-3 col-md-6">
        <div class="product-card">
         <button class="delete-btn" data-id="${product.id}">&times;</button>
          <img src="${product.thumbnail}" alt="${product.title}">
          <h6 class="mb-0">${product.title}</h6>
          <div>
            <span class="text-muted text-decoration-line-through">${product.deletedPrice}</span>
            <span class="fw-bold ms-2">${product.price}</span>
          </div>
          <button class="edit-btn mt-auto" data-id=${product.id} data-bs-toggle="modal" data-bs-target="#editProduct" >Edit Product</button>
        </div>
      </div>
    `;
  }

  function renderSellerProducts(sellerID) {
    const sellerProducts = getProducts().filter((p) => p.sellerID === sellerID);
    cardContainer.innerHTML = "";

    if (!sellerProducts.length) {
      cardContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <h5 class="text-muted">No products yet</h5>
          <p class="text-muted">Start by adding your first product 🚀</p>
        </div>
      `;
      return;
    }

    sellerProducts.forEach((product) => {
      cardContainer.insertAdjacentHTML("beforeend", createProductCard(product));
    });
  }

  // --- Init ---
  renderSellerProducts(getCurrentUser().id);

  // --- Form Submit ---
  document.getElementById("addProductForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const productData = {
      title: inputs.title.value.trim(),
      status: inputs.status.value,
      brand: inputs.brand.value.trim(),
      quantity: inputs.quantity.value,
      description: inputs.description.value.trim(),
      category: inputs.category.value,
      price: inputs.price.value,
      discount: inputs.discount.value,
      img: inputs.img.value.trim(),
    };

    const validation = validateProduct(productData);
    if (!validation.isValid) {
      showValidationErrors(validation.errors);
      return;
    }

    const newProduct = createProductData(productData);
    addProduct(newProduct);
    renderSellerProducts(getCurrentUser().id);
  });

  // --- Stock Availability ---
  inputs.status.addEventListener("change", function () {
    if (this.value === "outOfStock") {
      inputs.quantity.value = 0;
      inputs.quantity.disabled = true;
    } else {
      inputs.quantity.disabled = false;
    }
  });
  // ---------Delete Btn Handler -----------
  cardContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const productID = Number(e.target.dataset.id);
      deleteProduct(productID);
      renderSellerProducts(getCurrentUser().id);
    }
  });
  // -------------UpdateBtn Handler --------------
  document
    .getElementById("editProductForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (e.target.dataset.id) {
        console.log(e.target.dataset.id);
      }
    });
}

export { addProductHandler };
