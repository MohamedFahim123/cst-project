import { showToast } from "../../actions/showToast.js";
import { getTotalOrderPrice } from "../../actions/helperFuncitons.js";

// Pagination constants
const ORDERS_PER_PAGE = 8;
let currentPage = 1;
let filteredOrders = [];
let orders = [];

export function initializeOrdersPage() {
  updateAllOrdersVariable();
  attachSearchListener();
  renderOrdersTable(filteredOrders);
}

function renderOrdersTable(filteredOrders, page = 1) {
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

  // current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Update current page
  currentPage = page;

  // Generate table rows for paginated orders
  const tableRows = paginatedOrders
    .map((order, index) => {
      const totalPrice = getTotalOrderPrice(order);
      const isLastRow = index === paginatedOrders.length - 1;

      return `
      <tr>
        <td${isLastRow ? ' class="cell-rad-bl"' : ""}>#${order.id.slice(0, 5)}</td>
        ${currentUser.role === "admin" ? `<td>${getUserById(order.userID)?.username || "N/A"}</td>` : ""}
        ${currentUser.role === "admin" ? `<td>${`${order.userID}`.slice(0, 5) || "N/A"}</td>` : ""}
        <td style="color: ${getStatusColor(order.status)}">${order.status || "N/A"}</td>
        <td>${formatOrderDate(order.date)}</td>
        <td class="total-amount">$${totalPrice.toFixed(2)}</td>
        <td${isLastRow ? ' class="cell-rad-br"' : ""}>
          <div class="action-buttons">
            <a
              href="/${currentUser.role}-dashboard/order-details"
              data-link
              class="btn btn-sm btn-outline-primary action-btn or-view-order-btn"
              data-order-id="${order.id}">
              <i class="fa-solid fa-eye"></i>
            </a>
            
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
          <th class="cell-rad-tl">ORDER ID</th>
          ${currentUser.role === "admin" ? `<th>USER</th>` : ""}
          ${currentUser.role === "admin" ? `<th>USER ID</th>` : ""}
          <th>STATUS</th>
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
  filteredOrders = [...orders];
  const searchInput = document.querySelector(".form-control-custom");
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    if (!query) {
      filteredOrders = [...orders];
    } else {
      filteredOrders = orders.filter((order) => String(order.id).toLowerCase().includes(query));
    }
    renderOrdersTable(filteredOrders);
  });
}
function getFilteredOrders() {
  const searchInput = document.querySelector(".form-control-custom");
  const query = searchInput.value.toLowerCase();
  if (!query) {
    return [...orders];
  } else {
    return orders.filter((order) => String(order.id).toLowerCase().includes(query));
  }
}

// Function to attach pagination event listeners
function attachPaginationEventListeners() {
  const pageButtons = document.querySelectorAll(".or-page-btn");

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
  // Add event listeners for view order buttons
  const viewOrderButtons = document.querySelectorAll(".or-view-order-btn");
  viewOrderButtons.forEach((button) => {
    button.addEventListener("click", storeOrderInStorage);
  });
}

// --------------------------------------
// ---------Helper functions-------------
// --------------------------------------
function updateAllOrdersVariable() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    return console.error("No current user found.");
  }
  if (currentUser.role == "admin") {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    orders = [...allOrders];
  } else {
    const userOrders = getOrdersByUserId(currentUser.id);
    orders = [...userOrders];
  }
}

// get admin status colors (processing - delivered - shipped)
function getStatusColor(status) {
  switch (status) {
    case "processing":
      return "orange";
    case "delivered":
      return "green";
    case "shipped":
      return "blue";
    default:
      return "black";
  }
}

// Helper function to get orders by user ID
function getOrdersByUserId(userId) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  return orders.filter((order) => order.userID === userId);
}

function getUserById(userId) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.users.find((user) => user.id === userId);
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

// function showDeleteModal(event) {
//   const orderId = event.currentTarget.dataset.orderId;
//   const deleteModal = new bootstrap.Modal(document.getElementById("deleteOrderModal"));
//   deleteModal.show();
//   // Attach event listener to confirm delete button
//   const confirmDeleteButton = document.getElementById("confirmDeleteOrder");
//   confirmDeleteButton.onclick = function () {
//     deleteOrderById(orderId);
//     deleteModal.hide();
//   };
// }

// delete order by id
function deleteOrderById(orderId) {
  const newAllOrders = orders.filter((order) => order.id != orderId);
  localStorage.setItem("orders", JSON.stringify(newAllOrders));
  updateAllOrdersVariable();
  // Re-render the table
  filteredOrders = getFilteredOrders();
  renderOrdersTable(filteredOrders);
  showToast(`Order #${orderId.slice(0, 5)} deleted successfully`, "success");
}
