import { cart } from "../../actions/cart.js";
import { fetchData } from "../../actions/fetchData.js";
import { wishlist } from "../../actions/wishlist.js";
import { router } from "../../js/router.js";

export const getAllProducts = async () => {
  const products = await fetchData("/json/products.json");
  return products;
};

export const getShopFilters = async () => {
  const filters = await fetchData("/json/shopFilters.json");
  return filters;
};

export const getAllUsers = async () => {
  const users = await fetchData("/json/allusers.json");
  return users;
};

export const getCategories = async () => {
  const catBtns = document.querySelectorAll(".home-banner-category");
  catBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      let filters = JSON.parse(localStorage.getItem("curr-filters"));
      if (filters) {
        filters = {
          category: [btn.id],
        };
        localStorage.setItem("curr-filters", JSON.stringify(filters));
        window.scrollTo(0, 0);
        router.navigate("/shop");
      } else {
        const filters = {
          category: [btn.id],
        };
        localStorage.setItem("curr-filters", JSON.stringify(filters));
        window.scrollTo(0, 0);
        router.navigate("/shop");
      }
    });
  });
};

export const renderBrands = (Swiper) => {
  const brandsContainer = document.getElementById("brandsContainer");
  const localFilters = JSON.parse(localStorage.getItem("shop-filters"));
  const brands = localFilters?.brands || [];

  brandsContainer.innerHTML = "";
  brands.forEach((brand) => {
    brandsContainer.innerHTML += `
    <div class="swiper-slide text-center">
      <div class="p-3 border rounded shadow-sm">
        <p class="fs-5 fw-medium m-0 cursor-pointer brand-slide" id="${brand}">${brand}</p>
      </div>
    </div>
  `;
  });

  new Swiper(document.getElementById("brandsSlider"), {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      320: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 },
    },
  });

  brandsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("brand-slide")) {
      let filters = JSON.parse(localStorage.getItem("curr-filters"));
      if (filters) {
        filters = {
          brand: [e.target.id.toLowerCase()],
        };
        localStorage.setItem("curr-filters", JSON.stringify(filters));
        window.scrollTo(0, 0);
        router.navigate("/shop");
      } else {
        const filters = {
          brand: [e.target.id.toLowerCase()],
        };
        localStorage.setItem("curr-filters", JSON.stringify(filters));
        window.scrollTo(0, 0);
        router.navigate("/shop");
      }
    }
  });
};

const productCard = (product) => {
  return `
      <div class="swiper-slide">
        <div class="card" id="${product.id}">
          <i  
            class="add-to-wishlist-btn fa-regular fa-heart position-absolute z-3"
            data-id="${product.id}"
            data-name="${product.title}"
            data-price="${product.price}"
          ></i>

          <span class="badge text-bg-danger position-absolute z-3">
            ${product.discountPercentage}%
          </span>

          <img src="${product.thumbnail}" class="card-img-top" alt="${
    product.title
  }" loading="lazy" />

          <div class="card-body">
            <h5 class="card-title fs-6" title="${product.title}">
              ${
                product.title.length > 30
                  ? product.title.slice(0, 30) + "..."
                  : product.title
              }
            </h5>

            <p class="card-text fs-6 text-secondary mb-1" title="${
              product.description
            }">
              ${product.description.slice(0, 95)}...
            </p>

            <div class="price">
              <span class="me-2 fw-bold fs-5">${Math.ceil(product.price)}</span>
              <span class="fw-light fs-6 text-decoration-line-through">${
                product.deletedPrice
              }</span>
            </div>

            <button 
              data-id="${product.id}" 
              data-name="${product.title}" 
              data-price="${product.price}" 
              type="button" 
              title="Add to cart" 
              class="addtocart add-to-cart-btn"
            >
              Add to cart <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
  `;
};

export const handleRenderingRecommendedProducts = (Swiper) => {
  const products = JSON.parse(localStorage.getItem("all-products"));
  const recommendedProductsContainer = document.getElementById(
    "recommendedProductsContainer"
  );

  recommendedProductsContainer.innerHTML = "";
  const mobiles = products
    .filter((product) => product.category === "smartphones")
    .slice(0, 3);
  const tablets = products
    .filter((product) => product.category === "tablets")
    .slice(0, 3);
  const laptops = products
    .filter((product) => product.category === "laptops")
    .slice(0, 3);
  const desktops = products
    .filter((product) => product.category === "desktops")
    .slice(0, 3);

  mobiles.forEach((product) => {
    recommendedProductsContainer.innerHTML += productCard(product);
  });

  tablets.forEach((product) => {
    recommendedProductsContainer.innerHTML += productCard(product);
  });

  laptops.forEach((product) => {
    recommendedProductsContainer.innerHTML += productCard(product);
  });

  desktops.forEach((product) => {
    recommendedProductsContainer.innerHTML += productCard(product);
  });

  recommendedProductsContainer.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("card-img-top") ||
      e.target.classList.contains("card-title")
    ) {
      localStorage.setItem("curr-product", e.target.closest(".card").id);
      window.scrollTo(0, 0);
      router.navigate(`/shop/product-details`);
    }
  });

  const recommendedSlider = document.getElementById("recommendedSlider");
  new Swiper(recommendedSlider, {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      576: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    },
  });
  // cartAndWishlistLogic();
};

export const bestSellingProducts = (Swiper) => {
  const bestSellingProductsContainer = document.getElementById(
    "bestsellerContainer"
  );
  const products = JSON.parse(localStorage.getItem("all-products"));
  products.sort((a, b) => b.rating - a.rating);
  bestSellingProductsContainer.innerHTML = "";
  products.slice(0, 8).forEach((product) => {
    bestSellingProductsContainer.innerHTML += productCard(product);
  });

  const bestSellingSlider = document.getElementById("bestsellerProducts");
  bestSellingSlider.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("card-img-top") ||
      e.target.classList.contains("card-title")
    ) {
      localStorage.setItem("curr-product", e.target.closest(".card").id);
      window.scrollTo(0, 0);
      router.navigate(`/shop/product-details`);
    }
  });
  new Swiper(bestSellingSlider, {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      576: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    },
  });
};