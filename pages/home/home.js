import { fetchData } from "../../actions/fetchData.js";
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
          category: btn.id,
        };
        localStorage.setItem("curr-filters", JSON.stringify(filters));
        window.scrollTo(0, 0);
        router.navigate("/shop");
      } else {
        const filters = {
          category: btn.id,
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
  const brands = localFilters?.Brands || [];

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
          brand: e.target.id.toLowerCase(),
        };
        localStorage.setItem("curr-filters", JSON.stringify(filters));
        window.scrollTo(0, 0);
        router.navigate("/shop");
      } else {
        const filters = {
          brand: e.target.id.toLowerCase(),
        };
        localStorage.setItem("curr-filters", JSON.stringify(filters));
        window.scrollTo(0, 0);
        router.navigate("/shop");
      }
    }
  });
};

export const handleRenderingRecommendedProducts = (Swiper) => {
  const products = JSON.parse(localStorage.getItem("all-products"));
  const recommendedProductsContainer = document.getElementById(
    "recommendedProductsContainer"
  );

  recommendedProductsContainer.innerHTML = "";
  products.slice(0, 8).forEach((product) => {
    recommendedProductsContainer.innerHTML += `
              <div class="swiper-slide">
                <div class="card" id="${product.id}">
                  <i class="fa-regular fa-heart position-absolute z-3"></i>
                  <span class="badge text-bg-danger position-absolute z-3">${
                    product.discountPercentage
                  }%</span>
                  <img src=${product.thumbnail} class="card-img-top" alt=${
                      product.title
                    } loading="lazy" />
                  <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text mb-1 mb-1" title="${product.description}">
                    ${product.description.slice(0, 100)}...
                    </p>
                    <div class="price">
                      <span class="me-2 fw-bold fs-5">${product.price}</span>
                      <span class="fw-light fs-6 text-decoration-line-through">${
                        (product.price +
                        product.discountPercentage * product.price).toFixed(3)
                      }</span>
                    </div>
                    <button class="addtocart">
                      Add to cart <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
  `;
  });

  recommendedProductsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("card-img-top") || e.target.classList.contains("card-title")) {
      localStorage.setItem("curr-product", e.target.closest(".card").id);
      window.scrollTo(0, 0);
      router.navigate(`/shop/product-details`);
    }
  })

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
};
