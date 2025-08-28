import { showToast } from "../../actions/showToast.js";
import { getTotalOrderPrice } from "../../actions/helperFuncitons.js";

// Pagination constants
const ORDERS_PER_PAGE = 8;
let currentPage = 1;
let filteredOrders = [];

export function initializeOrdersPage() {
  attachSearchListener();
  renderOrdersTable();
}

function renderOrdersTable(page = 1) {
  // Calculate pagination
  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
  const startIndex = (page - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const emptyState = document.getElementById("or-empty-state");
  const invoiceTableContainer = document.querySelector(".invoice-table");
  if (paginatedOrders.length === 0) {
    emptyState.style.display = "block";
    invoiceTableContainer.style.display = "none";
  } else {
    emptyState.style.display = "none";
    invoiceTableContainer.style.display = "block";
  }

  // Update current page
  currentPage = page;

  // Generate table rows for paginated orders
  const tableRows = paginatedOrders
    .map((order, index) => {
      const totalPrice = getTotalOrderPrice(order);
      const isLastRow = index === paginatedOrders.length - 1;

      return `
      <tr>
        <td${isLastRow ? ' class="cell-rad-bl"' : ""}>#${order.id.slice(-5)}</td>
        <td>${formatOrderDate(order.date)}</td>
        <td class="total-amount">$${totalPrice.toFixed(2)}</td>
        <td${isLastRow ? ' class="cell-rad-br"' : ""}>
          <div class="action-buttons">
            <a
              href="/customer-dashboard/order-details"
              data-link
              class="btn btn-sm btn-outline-primary action-btn or-view-order-btn"
              data-order-id="${order.id}">
              <i class="fa-solid fa-eye"></i>
            </a>
            <button class="btn btn-sm btn-outline-danger action-btn or-delete-order-btn"
                    data-order-id="${order.id}">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");

  // Create the complete table structure
  const tableHTML = `
    <table class="table table-hover mb-0">
      <thead>
        <tr>
          <th class="cell-rad-tl">ID</th>
          <th>DATE</th>
          <th>TOTAL</th>
          <th class="cell-rad-tr">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;

  // Inject the table into the container
  invoiceTableContainer.innerHTML = tableHTML;

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
    document.querySelector(".or-pagination-container") || createPaginationContainer();

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  // Generate pagination numbers
  let numberdHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    numberdHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <button class="page-link or-page-btn" data-page="${i}">${i}</button>
      </li>
    `;
  }

  // Next button
  let paginationHTML = `
    <nav aria-label="Orders pagination"><ul class="pagination justify-content-center or-pagination-list">
      <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
        <button class="page-link or-page-btn" data-page="${currentPage - 1}" ${
    currentPage === 1 ? "disabled" : ""
  }>
          <i class="fa-solid fa-chevron-left"></i>
        </button>
      </li>

      ${numberdHTML}

    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <button class="page-link or-page-btn" data-page="${currentPage + 1}" ${
    currentPage === totalPages ? "disabled" : ""
  }>
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </li>
  </ul></nav>`;

  paginationContainer.innerHTML = paginationHTML;

  // Add event listeners for pagination
  attachPaginationEventListeners();
}

// Function to create pagination container if it doesn't exist
function createPaginationContainer() {
  const invoiceTableContainer = document.querySelector(".invoice-table");
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "or-pagination-container mt-3";
  invoiceTableContainer.parentNode.appendChild(paginationContainer);
  return paginationContainer;
}

// Function to remove pagination
function removePagination() {
  const paginationContainer = document.querySelector(".or-pagination-container");
  if (paginationContainer) {
    paginationContainer.innerHTML = "";
  }
}

// Function to attach search listener
function attachSearchListener() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    return console.error("No current user found.");
  }
  const userOrders = getOrdersByUserId(currentUser.id);
  console.log("🔥🔥", userOrders);
  filteredOrders = [...userOrders];

  const searchInput = document.querySelector(".form-control-custom");
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    filteredOrders = userOrders.filter((order) => String(order.id).toLowerCase().includes(query));
    renderOrdersTable();
  });
}

// Function to attach pagination event listeners
function attachPaginationEventListeners() {
  const pageButtons = document.querySelectorAll(".or-page-btn");

  pageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const page = parseInt(this.dataset.page);
      if (page && page !== currentPage) {
        renderOrdersTable(page);
      }
    });
  });
}

// Function to attach event listeners to order buttons
function attachOrderEventListeners() {
  // Add event listeners for view order buttons
  const viewOrderButtons = document.querySelectorAll(".or-view-order-btn");
  viewOrderButtons.forEach((button) => {
    button.addEventListener("click", storeOrderInStorage);
  });

  // Add event listeners for delete order buttons
  const deleteOrderButtons = document.querySelectorAll(".or-delete-order-btn");
  deleteOrderButtons.forEach((button) => {
    button.addEventListener("click", handleDeleteOrder);
  });
}

// --------------------------------------
// ---------Helper functions-------------
// --------------------------------------

// Helper function to get orders by user ID
function getOrdersByUserId(userId) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  return orders.filter((order) => order.userID === userId);
}

// Helper function to format order date
function formatOrderDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Handle view order button click to store order id in localstorage
function storeOrderInStorage(event) {
  event.preventDefault();
  const orderId = event.currentTarget.dataset.orderId;

  // Store order in localStorage for the order details page
  localStorage.setItem("selectedOrderId", orderId);
}

// Handle delete order button click
function handleDeleteOrder(event) {
  const orderId = event.currentTarget.dataset.orderId;
  deleteOrderById(orderId);
}

// delete order by id
function deleteOrderById(orderId) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders = orders.filter((order) => order.id !== +orderId);
  localStorage.setItem("orders", JSON.stringify(orders));
  // Re-render the table
  renderOrdersTable();
  showToast(`Order #${orderId} deleted successfully`);
}
