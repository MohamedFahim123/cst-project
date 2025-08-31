import { getTotalOrderPrice } from "../../../actions/helperFuncitons.js";

// Pagination constants
const ORDERS_PER_PAGE = 8;
let currentPage = 1;
let filteredOrders = [];
let sellerOrders = [];

export function intiateBookedOrders() {
  showBookedOrders();
  addEventListeners();
}

const showBookedOrders = () => {
  let orders = JSON.parse(localStorage.getItem("orders"));
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // clear previous seller orders
  sellerOrders = [];
  orders.forEach((order) => {
    const newProducts = [];
    order.products.forEach((product) => {
      if (product.sellerID == currentUser.id) {
        newProducts.push(product);
      }
    });
    if (newProducts.length > 0) {
      sellerOrders.push({ ...order, products: newProducts });
    }
  });

  // Initialize filtered orders and render table
  filteredOrders = [...sellerOrders];
  renderOrdersTable(filteredOrders);
};

function renderOrdersTable(filteredOrders, page = 1) {
  // Calculate pagination
  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
  const startIndex = (page - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const invoiceTableContainer = document.querySelector(".invoice-table");
  const tbody = document.getElementById("table-body");

  // Clear previous content
  tbody.innerHTML = "";

  // Update current page
  currentPage = page;

  // Check if there are no orders to display
  if (paginatedOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          <div class="empty-state">
            <div class="empty-state-icon">
              <i class="fas fa-box-open"></i>
            </div>
            <h5>No Orders Found</h5>
            <p>There are no booked orders to display at the moment.</p>
          </div>
        </td>
      </tr>
    `;
    removePagination();
    return;
  }

  // Generate table rows for paginated orders
  paginatedOrders.forEach((order, index) => {
    const orderID = String(order.id).slice(0, 5);
    const userID = String(order.userID);
    const userName = getUserNameByID(userID);
    const totalPrice = getTotalOrderPrice(order);
    const status = order.status;
    const bg = getStatusBackground(status);

    const row = `
      <tr>
        <td>#${orderID}</td>
        <td>${userID}</td>
        <td>${userName}</td>
        <td>$${totalPrice}</td>
        <td><span class="status-bg ${bg}">${status}</span></td>
        <td>
          <a href="/seller-dashboard/booked-orders-details" data-link>
            <button class="btn view-btn bo-view-btn" data-orderid="${order.id}">View</button> 
          </a>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  // Render pagination if needed
  if (totalOrders > ORDERS_PER_PAGE) {
    renderPagination(totalPages, currentPage);
  } else {
    // Remove pagination if not needed
    removePagination();
  }

  // Add event listeners after table is rendered
  attachOrderEventListeners();
}

// Function to render pagination controls
function renderPagination(totalPages, currentPage) {
  const paginationContainer =
    document.querySelector(".bo-pagination-container") || createPaginationContainer();

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  // Generate pagination numbers
  let numberdHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    numberdHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <button class="page-link bo-page-btn" data-page="${i}">${i}</button>
      </li>
    `;
  }

  // Complete pagination HTML
  let paginationHTML = `
    <nav aria-label="Booked Orders pagination">
      <ul class="pagination justify-content-center bo-pagination-list">
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
          <button class="page-link bo-page-btn" data-page="${currentPage - 1}" ${
    currentPage === 1 ? "disabled" : ""
  }>
            <i class="fa-solid fa-chevron-left"></i>
          </button>
        </li>

        ${numberdHTML}

        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
          <button class="page-link bo-page-btn" data-page="${currentPage + 1}" ${
    currentPage === totalPages ? "disabled" : ""
  }>
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>`;

  paginationContainer.innerHTML = paginationHTML;

  // Add event listeners for pagination
  attachPaginationEventListeners();
}

// Function to create pagination container if it doesn't exist
function createPaginationContainer() {
  const invoiceTableContainer = document.querySelector(".invoice-table");
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "bo-pagination-container mt-3";
  invoiceTableContainer.parentNode.appendChild(paginationContainer);
  return paginationContainer;
}

// Function to remove pagination
function removePagination() {
  const paginationContainer = document.querySelector(".bo-pagination-container");
  if (paginationContainer) {
    paginationContainer.innerHTML = "";
  }
}

// Function to attach pagination event listeners
function attachPaginationEventListeners() {
  const pageButtons = document.querySelectorAll(".bo-page-btn");

  pageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const page = parseInt(this.dataset.page);
      if (page && page !== currentPage) {
        renderOrdersTable(filteredOrders, page);
      }
    });
  });
}

// Function to attach event listeners to order buttons
function attachOrderEventListeners() {
  const viewButtons = document.querySelectorAll(".bo-view-btn");
  viewButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const orderId = e.target.dataset.orderid;
      const order = sellerOrders.find((order) => order.id == orderId);
      localStorage.setItem("selectedSellerOrder", JSON.stringify(order));
    });
  });
}

function addEventListeners() {
  const searchInput = document.querySelector(".form-control-custom");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (!searchTerm) {
      filteredOrders = [...sellerOrders];
    } else {
      filteredOrders = sellerOrders.filter(
        (order) =>
          String(order.id).toLowerCase().includes(searchTerm) ||
          getUserNameByID(order.userID).toLowerCase().includes(searchTerm) ||
          String(order.userID).toLowerCase().includes(searchTerm)
      );
    }
    renderOrdersTable(filteredOrders);
  });
}

function getUserNameByID(userID) {
  const users = JSON.parse(localStorage.getItem("users"));
  const user = users.users.find((user) => user.id == userID);
  return user ? user.username : "Unknown";
}

function getStatusBackground(status) {
  if (status == "processing") {
    return "bg-orange";
  } else if (status == "shipped") {
    return "bg-black";
  } else if (status == "delivered") {
    return "bg-green";
  } else {
    return "bg-red";
  }
}
