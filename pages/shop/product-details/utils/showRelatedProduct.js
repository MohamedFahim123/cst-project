// Related Products Functionality
export async function initializeRelatedProducts(Swiper) {
  const products = JSON.parse(localStorage.getItem("all-products")) || [];
  const currentProductId = +localStorage.getItem("curr-product");
  const currentProduct = products.find(
    (product) => product.id === currentProductId
  );
  let relatedProducts = [];
  if (currentProduct) {
    relatedProducts = products.filter(
      (product) =>
        product.brand === currentProduct.brand &&
        product.id !== currentProductId
    );
    relatedProducts = extractRandomList(relatedProducts, 4);
  }

  renderRelatedProducts(relatedProducts, Swiper);
}

function renderRelatedProducts(products, Swiper) {
  const relatedProductsContainer = document.getElementById("relatedContainer");
  if (!relatedProductsContainer) return;

  relatedProductsContainer.innerHTML = products
    .map((product) => {
      return `
      <div class="swiper-slide">
        <div class="card" id="${product.id}">
          <i  
            class="add-to-wishlist-btn fa-regular fa-heart position-absolute z-3 pt-2 pe-3 end-0 top-0"
            data-id="${product.id}"
            data-thumbnail="${product.thumbnail}"
            data-name="${product.title}"
            data-price="${product.price}"
              data-seller="${product.seller}"
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
            data-thumbnail="${product.thumbnail}"
              data-name="${product.title}" 
              data-price="${product.price}" 
              data-seller="${product.seller}"
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
    })
    .join("");

  const relatedProducts = document.getElementById("relatedProducts");

  relatedProducts.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("card-img-top") ||
      e.target.classList.contains("card-title")
    ) {
      localStorage.setItem("curr-product", e.target.closest(".card").id);
      window.scrollTo(0, 0);
      window.location.reload();
    }
  });

  new Swiper(relatedProducts, {
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
}

// ---------- Resuable Functions ----------

// receive array and length of list needed and returns a random sample from this array
function extractRandomList(items = [], count = 5) {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
