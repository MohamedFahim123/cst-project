import { showToast } from "../../../actions/showToast.js";
import { getCurrentUser } from "../../register/LocalStorageUtils.js";
import { getProducts, saveProducts } from "./helpers.js";

import {
  validateProduct,
  showEditValidationErrors,
  showValidationErrors,
} from "./validation.js";

import {
  createProductData,
  addProduct,
  deleteProduct,
  getProductDetails,
  createProductCard,
  fileToBase64,
} from "./productCrud.js";

function addProductHandler() {
  // add form inputs
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
  // edit form inputs
  const editInputs = {
    title: document.getElementById("editProductTitle"),
    status: document.getElementById("editAvailabilityStatus"),
    brand: document.getElementById("editBrand"),
    quantity: document.getElementById("editQuantityInStock"),
    description: document.getElementById("editDescription"),
    category: document.getElementById("editCategory"),
    price: document.getElementById("editPrice"),
    discount: document.getElementById("editDiscount"),
    img: document.getElementById("editProductImg"),
  };
  // forms
  const cardContainer = document.getElementById("products-cards-container");
  const addProductForm = document.getElementById("addProductForm");
  const editProductForm = document.getElementById("editProductForm");

  // number of rendered Items in Each page
  const NUMBER_ITEM_PER_PAGE = 8;

  function renderSellerProducts(sellerID, page = 1) {
    const sellerProducts = getProducts().filter((p) => p.sellerID === sellerID);
    cardContainer.innerHTML = "";

    // if there is no product to the current seller
    if (!sellerProducts.length) {
      cardContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <h5 class="text-muted">No products yet</h5>
          <p class="text-muted">Start by adding your first product 🚀</p>
        </div>
      `;
      return;
    }

    // if number of item less/equal to 8
    if (sellerProducts.length <= NUMBER_ITEM_PER_PAGE) {
      sellerProducts.forEach((product) => {
        cardContainer.insertAdjacentHTML(
          "beforeend",
          createProductCard(product)
        );
      });
    } else {
      const startIndex = (page - 1) * NUMBER_ITEM_PER_PAGE;
      const stopIndex = startIndex + NUMBER_ITEM_PER_PAGE;
      const currentPageProducts = sellerProducts.slice(startIndex, stopIndex);
      // render the Current Page Products
      currentPageProducts.forEach((product) => {
        cardContainer.insertAdjacentHTML(
          "beforeend",
          createProductCard(product)
        );
      });
      // --- Pagination ---
      const paginationContainer = document.getElementById(
        "pagination-container"
      );
      if (sellerProducts.length > NUMBER_ITEM_PER_PAGE) {
        paginationContainer.classList.remove("d-none");
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(
          sellerProducts.length / NUMBER_ITEM_PER_PAGE
        );

        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement("button");
          btn.textContent = i;
          btn.className = `btn btn-sm me-1 ${
            i === page ? "btn-purple" : "btn-secondary"
          }`;
          btn.addEventListener("click", () =>
            renderSellerProducts(sellerID, i)
          );
          paginationContainer.appendChild(btn);
        }
      } else {
        paginationContainer.innerHTML = "";
        paginationContainer.classList.add("d-none");
      }
    }
  }

  // --- Init ---
  renderSellerProducts(getCurrentUser().id);

  // images previeww handler
  inputs.img.addEventListener("change", function () {
    const previewContainer = document.querySelector(".images-view");
    previewContainer.classList.replace("d-none", "d-flex");
    previewContainer.innerHTML = "";

    // display each image in small card
    Array.from(inputs.img.files).forEach((file) => {
      const imgURL = URL.createObjectURL(file);

      const imgEl = document.createElement("img");
      imgEl.src = imgURL;
      imgEl.classList.add("me-2"); // bootstrap margin right صغيرة
      imgEl.style.width = "100px";
      imgEl.style.height = "100px";
      imgEl.style.objectFit = "cover";
      imgEl.style.borderRadius = "8px";

      previewContainer.appendChild(imgEl);
    });
  });

  editInputs.img.addEventListener("change", function () {
    const previewContainer = document.querySelector(".images-view");
    previewContainer.classList.replace("d-none", "d-flex");
    previewContainer.innerHTML = "";

    // display each image in small card
    Array.from(inputs.img.files).forEach((file) => {
      const imgURL = URL.createObjectURL(file);

      const imgEl = document.createElement("img");
      imgEl.src = imgURL;
      imgEl.classList.add("me-2"); // bootstrap margin right صغيرة
      imgEl.style.width = "100px";
      imgEl.style.height = "100px";
      imgEl.style.objectFit = "cover";
      imgEl.style.borderRadius = "8px";

      previewContainer.appendChild(imgEl);
    });
  });

  // --- Form Submit ---
  addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const files = Array.from(inputs.img.files);
    // convert images to Base64
    const base64Images = await Promise.all(
      files.map((file) => fileToBase64(file))
    );

    const productData = {
      title: inputs.title.value.trim(),
      status: inputs.status.value,
      brand: inputs.brand.value.trim(),
      quantity: inputs.quantity.value,
      description: inputs.description.value.trim(),
      category: inputs.category.value,
      price: inputs.price.value,
      discount: inputs.discount.value,
      imgs: base64Images,
    };

    const validation = validateProduct(productData);
    if (!validation.isValid) {
      showValidationErrors(validation.errors);
      return;
    }

    const newProduct = createProductData(productData);
    addProduct(newProduct);
    renderSellerProducts(getCurrentUser().id);
    // close the modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addProduct")
    );
    modal.hide();
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
  editInputs.status.addEventListener("change", function () {
    if (this.value === "outOfStock") {
      editInputs.quantity.value = 0;
      editInputs.quantity.disabled = true;
    } else {
      editInputs.quantity.disabled = false;
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

  cardContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const productId = Number(e.target.dataset.id);
      // passing the selected product to the updateproduct form
      document.getElementById("editProductId").value = productId;
      const product = getProductDetails(productId);
      if (product) {
        const {
          title,
          description,
          thumbnail,
          stock,
          price,
          discountPercentage,
          category,
          brand,
          availabilityStatus,
        } = product;
        editInputs.title.value = title;
        editInputs.description.value = description;
        editInputs.img.value = thumbnail;
        editInputs.quantity.value = stock;
        editInputs.price.value = price;
        editInputs.discount.value = discountPercentage;
        editInputs.category.value = category;
        editInputs.brand.value = brand;
        editInputs.status.value = availabilityStatus;
      }
    }
  });

  // --- Update Product Handlers ---
  editProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const files = Array.from(editInputs.img.files);
    // convert images to Base64
    const base64Images = await Promise.all(
      files.map((file) => fileToBase64(file))
    );

    // getting the productId from the Hidden Input
    const productId = Number(document.getElementById("editProductId").value);

    // getting updated values from the form
    const updatedData = {
      title: editInputs.title.value.trim(),
      status: editInputs.status.value,
      brand: editInputs.brand.value.trim(),
      quantity: editInputs.quantity.value,
      description: editInputs.description.value.trim(),
      category: editInputs.category.value,
      price: editInputs.price.value,
      discount: editInputs.discount.value,
      img: base64Images,
    };

    // 3. apply validation
    const validation = validateProduct(updatedData);
    if (!validation.isValid) {
      showEditValidationErrors(validation.errors);
      return;
    }

    // 4. getting the selected product index
    const products = getProducts();
    const index = products.findIndex((p) => p.id === productId);

    if (index !== -1) {
      // 5. apply update
      products[index] = {
        ...products[index], // خلى الـ id و sellerID زي ما هما
        title: updatedData.title,
        brand: updatedData.brand,
        stock: Number(updatedData.quantity),
        description: updatedData.description,
        availabilityStatus: updatedData.status,
        category: updatedData.category,
        price: Number(
          updatedData.price - (updatedData.price * updatedData.discount) / 100
        ),
        discountPercentage: Number(updatedData.discount),
        deletedPrice: Number(updatedData.price),
        thumbnail: updatedData.img[0],
        images: updatedData.img,
      };

      //    save back to localstorage
      saveProducts(products);

      // 7.  render
      renderSellerProducts(getCurrentUser().id);

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editProduct")
      );
      modal.hide();

      // 9. show Toast
      showToast("Product Updated Successfully ✅", "success");
    }
  });
}

export { addProductHandler };
