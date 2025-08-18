let filters = {
  min: 0,
  max: 0,
  brand: [],
  category: [],
};

const productCard = (product) => {
  return `
        <div class="col container  p-3  border border-gray">
            <div class="card-actions d-flex justify-content-between align-items-center">
                <span class="py-1 px-2 shop-card-badge text-white c-fs-8 rounded-pill">${
                  product.discountPercentage
                }%</span>
                <i class="fa-regular fa-heart add-to-fav cursor-pointer fs-5"></i>
            </div>
            <div>
                <img src="${product.thumbnail}"
                    class="w-75 mx-auto d-block" alt="${product.title}">
            </div>
            <div>
                <p class="my-1 c-fs-7 fw-bold">${product.title}</p>
                <div class="d-flex align-items-center gap-2 fw-bold my-1">
                    <p class="shop-card-price  fs-4 m-0">$${Math.ceil(
                      product.price
                    )}</p>
                    <p class="fs-6  text-decoration-line-through m-0">$${
                      product.deletedPrice
                    }</p>
                </div>
                <div>
                    <button id="${
                      product.id
                    }" class="shop-cart-btn w-100"> <i class="fa-solid fa-cart-shopping"></i> Add to Cart</button>
                </div>
            </div>
        </div>
    `;
};

export const renderProducts = (products) => {
  const productsContainer = document.getElementById("product-grid-container");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    productsContainer.innerHTML += productCard(product);
  });
};

const filterProductAndRenderThem = (_localFilters) => {
  console.log(_localFilters);
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
  console.log(filteredProducts);
  renderProducts(filteredProducts);
};

export const handleFilterProductsIfExistFilters = () => {
  const localFilters = JSON.parse(localStorage.getItem("curr-filters"));
  if (localFilters) {
    filterProductAndRenderThem(localFilters);
  } else {
    console.log(filters)
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

  productCatContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("form-check-input")) {
      if (e.target.checked) {
        filters.category = [...filters.category, e.target.id];
        handleFilterProductsIfExistFilters();
      } else if (!e.target.checked) {
        filters.category = filters.category.filter(
          (cat) => cat !== e.target.id
        );
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

  productBrandContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("form-check-input")) {
      if (e.target.checked) {
        filters.brand = [...filters.brand, e.target.id.toLowerCase()];
        handleFilterProductsIfExistFilters();
      } else if (!e.target.checked) {
        filters.brand = filters.brand.filter((brand) => brand !== e.target.id);
        handleFilterProductsIfExistFilters();
      }
    }
  });
};
