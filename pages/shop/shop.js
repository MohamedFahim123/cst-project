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
        <i data-id="${product.id}" title="Add to Wishlist" data-price="${product.price}" data-name="${product.title}" class=" ${
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
  }" data-id="${product.id}" data-name="${product.title}" data-price="${
    product.price
  }">
            <i class="fa-solid fa-cart-shopping"></i> ${
              cart.has(+product.id) ? "Remove from Cart" : "Add to Cart"
            }
          </button>
        </div>
      </div>
    </div>
  `;
};

export const initializeProductCards = () => {
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

export const renderProducts = (products) => {
  filteredProducts = products;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedProducts = products.slice(startIdx, endIdx);
  const productCountText = document.getElementById("productCountText");
  productCountText.textContent = `Showing ${paginatedProducts.length} of ${products.length} products`;

  const productsContainer = document.getElementById("product-grid-container");
  productsContainer.innerHTML = paginatedProducts
    .map((product) => productCard(product))
    .join("");

  renderPagination(products.length);
  // cartAndWishlistLogic();
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

export const handleFilterProductsIfExistFilters = () => {
  const localFilters = JSON.parse(localStorage.getItem("curr-filters"));
  if (localFilters) {
    filterProductAndRenderThem(localFilters);
  } else {
    filterProductAndRenderThem(filters);
  }
};

const updatePriceRangeText = (min, max) => {
  const priceRangeText = document.getElementById("priceRangeText");
  priceRangeText.innerHTML = `Price $${min} - $${max}`;
};

const updateMinPrice = (min, max) => {
  const minPrice = document.getElementById("minRange");
  minPrice.value = min;
  minPrice.min = min;
  minPrice.max = max;
};

const updateMaxPrice = (max, min) => {
  const maxPrice = document.getElementById("maxRange");
  maxPrice.value = max;
  maxPrice.max = max;
  maxPrice.min = min;
};

const updatePriceRange = (min, max) => {
  const customRange = document.getElementById("customRange");
  customRange.min = min;
  customRange.max = max;
  customRange.value = max;
};

export const inputsSetups = () => {
  const shopFilters = JSON.parse(localStorage.getItem("shop-filters"));
  const defaultFilters = {
    min: 0,
    max: 0,
    brand: [],
    category: [],
    ...JSON.parse(localStorage.getItem("curr-filters")),
  };
  localStorage.removeItem("curr-filters");

  if (defaultFilters) {
    filters = { ...defaultFilters };
  }

  //   Price filters
  filters.min = Math.floor(shopFilters["min-price"]);
  filters.max = Math.ceil(shopFilters["max-price"]);

  const minPrice = document.getElementById("minRange");
  const maxPrice = document.getElementById("maxRange");
  const customRange = document.getElementById("customRange");

  if (shopFilters) {
    updateMinPrice(filters.min, maxPrice.value);
    updateMaxPrice(filters.max, minPrice.value);
    updatePriceRange(filters.min, filters.max);
    updatePriceRangeText(filters.min, customRange.value);
  }

  customRange.addEventListener("input", () => {
    updateMaxPrice(customRange.value, minPrice.value);
    updateMinPrice(minPrice.value, customRange.value);
    updatePriceRangeText(minPrice.value, customRange.value);
    filters.min = minPrice.value;
    filters.max = customRange.value;
    handleFilterProductsIfExistFilters();
  });

  //   Category filters
  const categories = shopFilters.categories;
  const productCatContainer = document.getElementById(
    "productCategoriesContainer"
  );

  productCatContainer.innerHTML = "";

  categories.forEach((category) => {
    return (productCatContainer.innerHTML += filters.category.includes(
      category.toLowerCase()
    )
      ? `<div class="form-check my-1" id="cat-container">
            <input class="form-check-input c-check-purple" checked="true" type="checkbox" id="${category}">
            <label class="form-check-label text-capitalize" for="${category}">${category}</label>
        </div>`
      : `<div class="form-check my-1" id="cat-container">
            <input class="form-check-input c-check-purple" type="checkbox" id="${category}">
            <label class="form-check-label text-capitalize" for="${category}">${category}</label>
        </div> `);
  });

  productCatContainer.addEventListener("change", (e) => {
    if (e.target.classList.contains("form-check-input")) {
      if (e.target.checked) {
        filters.category = [...filters.category, e.target.id];
        handleFilterProductsIfExistFilters();
      } else if (!e.target.checked) {
        filters.category = filters.category.filter(
          (cat) => cat !== e.target.id
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
            localStorage.setItem("curr-filters", JSON.stringify(localFilters));
          }
        }
        handleFilterProductsIfExistFilters();
      }
    }
  });

  //   Brand filters
  const brands = shopFilters.brands;
  const productBrandContainer = document.getElementById(
    "productBrandsContainer"
  );

  productBrandContainer.innerHTML = "";

  brands.forEach((brand) => {
    return (productBrandContainer.innerHTML += filters.brand.includes(
      brand.toLowerCase()
    )
      ? `<div class="form-check my-1">
            <input class="form-check-input c-check-purple" checked="true" type="checkbox" id=${brand}>
            <label class="form-check-label" for=${brand}>${brand}</label>
        </div>`
      : `<div class="form-check my-1">
            <input class="form-check-input c-check-purple" type="checkbox" id=${brand}>
            <label class="form-check-label" for=${brand}>${brand}</label>
        </div> `);
  });

  productBrandContainer.addEventListener("change", (e) => {
    if (e.target.classList.contains("form-check-input")) {
      if (e.target.checked) {
        filters.brand = [...filters.brand, e.target.id.toLowerCase()];
        handleFilterProductsIfExistFilters();
      } else if (!e.target.checked) {
        filters.brand = filters.brand.filter(
          (brand) => brand !== e.target.id.toLowerCase()
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
            localStorage.setItem("curr-filters", JSON.stringify(localFilters));
          }
        }
        handleFilterProductsIfExistFilters();
      }
    }
  });
};

export const resetFilters = () => {
  const resetPriceFilterBtn1 = document.getElementById("resetPriceFilter1");
  const resetPriceFilterBtn2 = document.getElementById("resetPriceFilter2");
  const reset = () => {
    filters = { ...filters, brand: [], category: [] };
    handleFilterProductsIfExistFilters();
    inputsSetups();
  };
  resetPriceFilterBtn1.addEventListener("click", reset);
  resetPriceFilterBtn2.addEventListener("click", reset);
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
