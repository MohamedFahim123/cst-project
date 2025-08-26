import { cart } from "../../actions/cart.js";
import { wishlist } from "../../actions/wishlist.js";
import { router } from "../../js/router.js";

let filters = {
  min: 0,
  max: 0,
  brand: [],
  category: [],
};

let currentPage = 1;
let itemsPerPage = 10;
let filteredProducts = [];

const productCard = (product) => {
  return `
    <div class="product-card p-3 border border-gray" data-product-id="${
      product.id
    }">
      <div class="card-actions d-flex justify-content-between align-items-center">
        <span class="py-1 px-2 shop-card-badge text-white c-fs-8 rounded-pill">
          ${product.discountPercentage}%
        </span>
        <i data-id="${product.id}" data-thumbnail="${
    product.thumbnail
  }" title="Add to Wishlist" data-price="${product.price}" data-name="${
    product.title
  }" data-seller="${product.seller}" class=" ${
    wishlist.has(+product.id) ? "text-danger fa-solid" : "fa-regular"
  } add-to-wishlist-btn fa-heart add-to-fav  cursor-pointer fs-5"></i>
      </div>
      <div class="product-image-container">
        <img src="${product.thumbnail}"
             class="w-75 mx-auto d-block product-image cursor-pointer" 
             alt="${product.title}">
      </div>
      <div>
        <p class="my-1 c-fs-7 fw-bold product-title cursor-pointer">
          ${product.title}
        </p>
        <div class="d-flex align-items-center gap-2 fw-bold my-1">
          <p class="shop-card-price fs-4 m-0">$${Math.ceil(product.price)}</p>
          <p class="fs-6 text-decoration-line-through m-0">$${
            product.deletedPrice
          }</p>
        </div>
        <div>
          <button type="button" id="${
            product.id
          }" class="shop-cart-btn w-100 add-to-cart-btn ${
    cart.has(+product.id) ? "in-cart" : ""
  }" data-id="${product.id}" data-thumbnail="${product.thumbnail}" data-name="${
    product.title
  }" data-price="${product.price}"
            data-seller="${product.seller}"
            >
            <i class="fa-solid fa-cart-shopping"></i> ${
              cart.has(+product.id) ? "Remove from Cart" : "Add to Cart"
            }
          </button>
        </div>
      </div>
    </div>
  `;
};

const initializeProductCards = () => {
  document.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    if (!productCard) return;

    const productId = productCard.dataset.productId;

    if (
      e.target.classList.contains("product-image") ||
      e.target.closest(".product-image-container")
    ) {
      navigateToProductDetails(productId);
    }

    if (e.target.classList.contains("product-title")) {
      navigateToProductDetails(productId);
    }

    if (
      e.target.classList.contains("add-to-cart-btn") ||
      e.target.closest(".add-to-cart-btn")
    ) {
      //   addToCart(productId);
    }
  });
};

const navigateToProductDetails = (productId) => {
  localStorage.setItem("curr-product", productId);
  router.navigate("/shop/product-details");
};

const renderProducts = (products) => {
  filteredProducts = products;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedProducts = products.slice(startIdx, endIdx);

  const productCountTexts = document.querySelectorAll("#productCountText");
  productCountTexts.forEach((element) => {
    element.textContent = `Showing ${paginatedProducts.length} of ${products.length} products`;
  });

  const productsContainer = document.getElementById("product-grid-container");

  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="text-center py-5 empty-state">
        <i class="fas fa-search fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">No products found</h4>
        <p class="text-muted">Try adjusting your filters or search terms</p>
        <button class="btn btn-outline-success mt-2" id="resetFiltersBtn">
          Reset All Filters
        </button>
      </div>
    `;

    const resetBtn = document.getElementById("resetFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        filters = { min: 0, max: 0, brand: [], category: [] };
        handleFilterProductsIfExistFilters();
        inputsSetups();
      });
    }
  } else {
    productsContainer.innerHTML = paginatedProducts
      .map((product) => productCard(product))
      .join("");
  }

  renderPagination(products.length);
};

const filterProductAndRenderThem = (_localFilters) => {
  const products = JSON.parse(localStorage.getItem("all-products"));
  const localFilters = {
    min: 0,
    max: 0,
    brand: [],
    category: [],
    ..._localFilters,
  };
  if (localFilters) {
    filters = { ...localFilters };
  }
  const filteredProducts = products.filter((product) => {
    const { min, max, brand, category } = filters;

    const matchesPrice =
      (!min || Math.ceil(product.price) >= min) &&
      (!max || Math.ceil(product.price) <= max);

    const matchesBrand =
      !brand.length ||
      (Array.isArray(brand) && brand.includes(product.brand.toLowerCase()));

    const matchesCategory =
      !category.length ||
      (Array.isArray(category) &&
        category.includes(product.category.toLowerCase()));
    if (matchesPrice && matchesBrand && matchesCategory) {
      return product;
    }
  });
  currentPage = 1;
  renderProducts(filteredProducts);
};

const handleFilterProductsIfExistFilters = () => {
  const localFilters = JSON.parse(localStorage.getItem("curr-filters"));
  if (localFilters) {
    filterProductAndRenderThem(localFilters);
  } else {
    filterProductAndRenderThem(filters);
  }
};

const updatePriceRangeText = (min, max) => {
  const priceRangeTexts = document.querySelectorAll(".priceRangeText");
  priceRangeTexts.forEach((element) => {
    element.innerHTML = `Price $${min} - $${max}`;
  });
};

const updateMinPrice = (min, max) => {
  const minPrices = document.querySelectorAll(".minRange");
  minPrices.forEach((element) => {
    element.value = min;
    element.min = min;
    element.max = max;
  });
};

const updateMaxPrice = (max, min) => {
  const maxPrices = document.querySelectorAll(".maxRange");
  maxPrices.forEach((element) => {
    element.value = max;
    element.max = max;
    element.min = min;
  });
};

const updatePriceRange = (min, max) => {
  const customRanges = document.querySelectorAll(".customRange");
  customRanges.forEach((element) => {
    element.min = min;
    element.max = max;
    element.value = max;
  });
};

const updateCategoryCheckboxes = () => {
  const categoryContainers = document.querySelectorAll(
    ".productCategoriesContainer"
  );
  const shopFilters = JSON.parse(localStorage.getItem("shop-filters"));
  const categories = shopFilters.categories;

  categoryContainers.forEach((container, idx) => {
    container.innerHTML = "";

    categories.forEach((category) => {
      container.innerHTML += filters.category.includes(category.toLowerCase())
        ? `<div class="form-check my-1" id="cat-container">
              <input class="form-check-input c-check-purple" checked="true" type="checkbox" data-id="${category}" id="${category}-${
            idx + 1
          }">
              <label class="form-check-label text-capitalize" for="${category}-${
            idx + 1
          }">${category}</label>
          </div>`
        : `<div class="form-check my-1" id="cat-container">
              <input class="form-check-input c-check-purple" type="checkbox" data-id="${category}" id="${category}-${
            idx + 1
          }">
              <label class="form-check-label text-capitalize" for="${category}-${
            idx + 1
          }">${category}</label>
          </div> `;
    });
  });
};

const updateBrandCheckboxes = () => {
  const brandContainers = document.querySelectorAll(".productBrandsContainer");
  const shopFilters = JSON.parse(localStorage.getItem("shop-filters"));
  const brands = shopFilters.brands;

  brandContainers.forEach((container, idx) => {
    container.innerHTML = "";

    brands.forEach((brand) => {
      container.innerHTML += filters.brand.includes(brand.toLowerCase())
        ? `<div class="form-check my-1">
              <input class="form-check-input c-check-purple" checked="true" data-id="${brand}" type="checkbox" id="${brand}-${
            idx + 1
          }">
              <label class="form-check-label" for="${brand}-${
            idx + 1
          }">${brand}</label>
          </div>`
        : `<div class="form-check my-1">
              <input class="form-check-input c-check-purple" data-id="${brand}" type="checkbox" id="${brand}-${
            idx + 1
          }">
              <label class="form-check-label" for="${brand}-${
            idx + 1
          }">${brand}</label>
          </div> `;
    });
  });
};

const inputsSetups = () => {
  const defaultFilters = {
    min: 0,
    max: 0,
    brand: [],
    category: [],
    ...JSON.parse(localStorage.getItem("curr-filters")),
  };
  localStorage.removeItem("curr-filters");
  const products = JSON.parse(localStorage.getItem("all-products"));
  const minProductsPrice = Math.floor(
    Math.min(...products.map((product) => product.price))
  );
  const maxProductsPrice = Math.ceil(
    Math.max(...products.map((product) => product.price))
  );

  if (defaultFilters) {
    filters = { ...defaultFilters };
  }

  filters.min = Math.floor(minProductsPrice);
  filters.max = Math.ceil(maxProductsPrice);

  updateMinPrice(filters.min, filters.max);
  updateMaxPrice(filters.max, filters.min);
  updatePriceRange(filters.min, filters.max);
  updatePriceRangeText(filters.min, filters.max);

  updateCategoryCheckboxes();
  updateBrandCheckboxes();

  const customRanges = document.querySelectorAll(".customRange");
  customRanges.forEach((customRange) => {
    customRange.addEventListener("input", () => {
      const minPrices = document.querySelectorAll(".minRange");
      const minPriceValue = minPrices[0]?.value || 0;

      updateMaxPrice(customRange.value, minPriceValue);
      updateMinPrice(minPriceValue, customRange.value);
      updatePriceRangeText(minPriceValue, customRange.value);
      filters.min = parseInt(minPriceValue);
      filters.max = parseInt(customRange.value);
      handleFilterProductsIfExistFilters();
    });
  });

  const categoryContainers = document.querySelectorAll(
    ".productCategoriesContainer"
  );
  categoryContainers.forEach((container) => {
    container.addEventListener("change", (e) => {
      if (e.target.classList.contains("form-check-input")) {
        if (e.target.checked) {
          filters.category = [
            ...filters.category,
            e.target.dataset.id.toLowerCase(),
          ];
          handleFilterProductsIfExistFilters();
        } else if (!e.target.checked) {
          filters.category = filters.category.filter(
            (cat) => cat !== e.target.dataset.id.toLowerCase()
          );
          const localFilters = JSON.parse(localStorage.getItem("curr-filters"));
          if (localFilters) {
            localFilters.category = filters.category;
            if (localFilters.category.length === 0) {
              delete localFilters.category;
            }
            if (Object.keys(localFilters).length === 0) {
              localStorage.removeItem("curr-filters");
            } else {
              localStorage.setItem(
                "curr-filters",
                JSON.stringify(localFilters)
              );
            }
          }
          handleFilterProductsIfExistFilters();
        }

        updateCategoryCheckboxes();
      }
    });
  });

  const brandContainers = document.querySelectorAll(".productBrandsContainer");
  brandContainers.forEach((container) => {
    container.addEventListener("change", (e) => {
      if (e.target.classList.contains("form-check-input")) {
        if (e.target.checked) {
          filters.brand = [...filters.brand, e.target.dataset.id.toLowerCase()];
          handleFilterProductsIfExistFilters();
        } else if (!e.target.checked) {
          filters.brand = filters.brand.filter(
            (brand) => brand !== e.target.dataset.id.toLowerCase()
          );
          const localFilters = JSON.parse(localStorage.getItem("curr-filters"));
          if (localFilters) {
            localFilters.brand = filters.brand;
            if (localFilters.brand.length === 0) {
              delete localFilters.brand;
            }
            if (Object.keys(localFilters).length === 0) {
              localStorage.removeItem("curr-filters");
            } else {
              localStorage.setItem(
                "curr-filters",
                JSON.stringify(localFilters)
              );
            }
          }
          handleFilterProductsIfExistFilters();
        }
        updateBrandCheckboxes();
      }
    });
  });
};

const resetFilters = () => {
  const resetPriceFilterBtns = document.querySelectorAll(
    "[id^='resetPriceFilter']"
  );
  const reset = () => {
    filters = { ...filters, brand: [], category: [] };
    handleFilterProductsIfExistFilters();
    inputsSetups();
  };

  resetPriceFilterBtns.forEach((btn) => {
    btn.addEventListener("click", reset);
  });
};

const renderPagination = (totalItems) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.getElementById("pagination-container");

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = `
    <nav>
      <ul class="pagination">
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
          <a class="page-link" href="#" data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
          </a>
        </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
          <a class="page-link" href="#" data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  `;

  paginationContainer.innerHTML = paginationHTML;

  document.querySelectorAll(".page-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = parseInt(this.dataset.page);
      if (!isNaN(page)) {
        currentPage = page;
        renderProducts(filteredProducts);
      }
    });
  });
};

export function initializeShop() {
  handleFilterProductsIfExistFilters();
  initializeProductCards();
  inputsSetups();
  resetFilters();
}
