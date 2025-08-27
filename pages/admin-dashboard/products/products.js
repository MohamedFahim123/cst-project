import { router } from "../../../js/router.js";

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let filteredProducts = [];
let allProducts = [];

const productCell = (product) => {
  return `<tr>
    <td>${product.id ? product.id : "N/A"}</td>
    <td>
      <img src="${product.thumbnail || "https://via.placeholder.com/50"}" 
           alt="${product.title}" 
           class="product-image"
           onerror="this.src='https://via.placeholder.com/50'">
    </td>
    <td>${product.title}</td>
    <td class="ps-4">${product.sellerID || "N/A"}</td>
    <td>${product.category || "N/A"}</td>
    <td>$${product.price ? product.price.toFixed(2) : "0.00"}</td>
    <td>${product.stock !== undefined ? product.stock : "N/A"}</td>
    <td>
      <span class="status-badge ${getStatusClass(product)}">
        ${getStatusText(product)}
      </span>
    </td>
    <td class="action-buttons py-5 d-flex align-items-center">
      <button class="btn btn-action viewProductDetails btn-outline-success" title="Edit Product">
        <i class="fa-solid fa-eye viewProductEye" data-id="${product.id}"></i>
      </button>
      <button class="btn-action btn-delete" title="Delete Product" data-id="${
        product.id
      }">
        <i class="fas fa-trash"></i>
      </button>
    </td>
  </tr>`;
};

const getStatusClass = (product) => {
  if (product.status === "inactive") return "status-inactive";
  if (product.stock === 0) return "status-out-of-stock";
  if (product.stock < 10) return "status-low-stock";
  return "status-active";
};

const getStatusText = (product) => {
  if (product.status === "inactive") return "Inactive";
  if (product.stock === 0) return "Out of Stock";
  if (product.stock < 10) return "Low Stock";
  return "Active";
};

const renderAllProducts = (products) => {
  const tableBody = document.getElementById("products-table-body");
  const emptyState = document.getElementById("empty-state");
  const tableWrapper = document.getElementById("table-wrapper");
  const paginationContainer = document.getElementById("pagination-container");

  if (!tableBody || !emptyState || !tableWrapper || !paginationContainer) {
    console.error("Required DOM elements not found");
    return;
  }

  if (!products || products.length === 0) {
    emptyState.style.display = "block";
    tableWrapper.style.display = "none";
    paginationContainer.style.display = "none";
    return;
  }

  emptyState.style.display = "none";
  tableWrapper.style.display = "block";

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, products.length);
  const paginatedProducts = products.slice(startIndex, endIndex);

  tableBody.innerHTML = "";
  paginatedProducts.forEach((product) => {
    tableBody.innerHTML += productCell(product);
  });

  if (products.length > ITEMS_PER_PAGE) {
    paginationContainer.style.display = "flex";
    renderPagination(products.length, totalPages);
  } else {
    paginationContainer.style.display = "none";
  }

  addActionListeners();
};

const renderPagination = (totalItems, totalPages) => {
  const paginationInfo = document.getElementById("pagination-info");
  const paginationControls = document.getElementById("pagination-controls");

  if (!paginationInfo || !paginationControls) {
    console.error("Pagination elements not found");
    return;
  }

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
  paginationInfo.textContent = `Showing ${startItem} to ${endItem} of ${totalItems} products`;

  let paginationHTML = "";

  paginationHTML += `<button class="page-btn ${
    currentPage === 1 ? "disabled" : ""
  }" ${currentPage === 1 ? "disabled" : ""} id="prev-page">
    <i class="fas fa-chevron-left"></i>
  </button>`;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button class="page-btn ${
      currentPage === i ? "active" : ""
    }" data-page="${i}">${i}</button>`;
  }

  paginationHTML += `<button class="page-btn ${
    currentPage === totalPages ? "disabled" : ""
  }" ${currentPage === totalPages ? "disabled" : ""} id="next-page">
    <i class="fas fa-chevron-right"></i>
  </button>`;

  paginationControls.innerHTML = paginationHTML;

  document.querySelectorAll(".page-btn[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      currentPage = parseInt(button.dataset.page);
      renderAllProducts(
        filteredProducts.length > 0 ? filteredProducts : allProducts
      );
    });
  });

  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderAllProducts(
          filteredProducts.length > 0 ? filteredProducts : allProducts
        );
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderAllProducts(
          filteredProducts.length > 0 ? filteredProducts : allProducts
        );
      }
    });
  }
};

export const RenderProducts = () => {
  try {
    const productsData = JSON.parse(localStorage.getItem("all-products")) || [];
    allProducts = Array.isArray(productsData) ? productsData : [];
    filteredProducts = [];
    currentPage = 1;

    renderAllProducts(allProducts);
    addActionListeners();
  } catch (error) {
    console.error("Error loading products:", error);
    allProducts = [];
    filteredProducts = [];
    renderAllProducts([]);
  }
};

export const productsSearch = () => {
  const searchInput = document.getElementById("products-search");

  if (!searchInput) {
    console.error("Search input not found");
    return;
  }

  searchInput.addEventListener("input", (e) => {
    if (e.target.value) {
      filteredProducts = allProducts.filter(
        (product) =>
          product &&
          product.title &&
          product.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      currentPage = 1;
      renderAllProducts(filteredProducts);
    } else {
      filteredProducts = [];
      currentPage = 1;
      renderAllProducts(allProducts);
    }
  });
};

const addActionListeners = () => {
  const tableBody = document.getElementById("products-table-body");
  if (tableBody) {
    tableBody.addEventListener("click", handleAssignEventToTable);
  }
};

const handleAssignEventToTable = (e) => {
  if (
    e.target.classList.contains("btn-delete") ||
    e.target.closest(".btn-delete")
  ) {
    const deleteBtn = e.target.classList.contains("btn-delete")
      ? e.target
      : e.target.closest(".btn-delete");
    const productId = deleteBtn.dataset.id;
    openDeleteModal(productId);
    return;
  }

  if (e.target.classList.contains("viewProductDetails")) {
    const eye = e.target.querySelector(".viewProductEye");
    if (eye) {
      localStorage.setItem("curr-product", eye.dataset.id);
    }
    router.navigate("/admin-dashboard/products/product-details");
  }
  if (e.target.classList.contains("viewProductEye")) {
    localStorage.setItem("curr-product", e.target.dataset.id);
    router.navigate("/admin-dashboard/products/product-details");
  }
};

const openDeleteModal = (productId) => {
  const deleteProductIdInput = document.getElementById("deleteProductId");
  if (deleteProductIdInput) {
    deleteProductIdInput.value = productId;
  }

  const deleteModal = new bootstrap.Modal(
    document.getElementById("deleteProductModal")
  );
  deleteModal.show();
};

const setupDeleteProductHandler = () => {
  const deleteBtn = document.getElementById("confirmDeleteProduct");
  if (deleteBtn) {
    deleteBtn.removeEventListener("click", handleDeleteProduct);
    deleteBtn.addEventListener("click", handleDeleteProduct);
  }
};

const handleDeleteProduct = () => {
  const deleteProductIdInput = document.getElementById("deleteProductId");
  if (!deleteProductIdInput) return;

  const productId = deleteProductIdInput.value;

  allProducts = allProducts.filter(
    (product) =>
      product && product.id && product.id.toString() !== productId.toString()
  );
  filteredProducts = filteredProducts.filter(
    (product) =>
      product && product.id && product.id.toString() !== productId.toString()
  );

  localStorage.setItem("all-products", JSON.stringify(allProducts));

  renderAllProducts(
    filteredProducts.length > 0 ? filteredProducts : allProducts
  );

  const deleteModal = bootstrap.Modal.getInstance(
    document.getElementById("deleteProductModal")
  );
  if (deleteModal) {
    deleteModal.hide();
  }
};

export const initializeProducts = () => {
  RenderProducts();
  productsSearch();
  setupDeleteProductHandler();
  addActionListeners();
};
