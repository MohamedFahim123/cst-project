import { getOrderedProducts, getTotalOrderPrice } from "../../actions/helperFuncitons.js";
import { showToast } from "../../actions/showToast.js";

// Initialize order details functionality
export function initializeOrderDetails() {
  loadOrderData();
  initializeEventHandlers();
}

function loadOrderData() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const orderId = localStorage.getItem("selectedOrderId");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  let order;
  if (currentUser.role == "seller") {
    order = JSON.parse(localStorage.getItem("selectedSellerOrder"));
  } else {
    order = orders.find((order) => order.id == orderId);
  }

  if (order) {
    displayOrderData(order);
  }
}

// Display order data
function displayOrderData(order) {
  // Update order header
  document.querySelector(".od-order-number").textContent = `Order #${order.id.slice(0, 5)}`;
  document.querySelector(".od-order-date").innerHTML = `
    <i class="fas fa-calendar-alt"></i>
    ${order.date}
  `;

  // Update status
  const statusElement = document.querySelector(".od-order-status");
  statusElement.className = `od-order-status od-status-${order.status}`;
  // status could be delivered, processing, shipped, cancelled
  statusElement.innerHTML = `
    <i class="fas fa-${getStatusIcon(order.status)}"></i> 
    ${order.status}
  `;

  // Update total
  const totalPrice = getTotalOrderPrice(order);
  document.querySelector(".od-total-amount").textContent = `$${totalPrice.toFixed(2)}`;

  // Update status change
  const statusSelect = document.querySelector(`.od-status-select option[value="${order.status}"]`);
  if (statusSelect) {
    statusSelect.selected = true;
  }

  // Update timeline
  displayTimeline(order.status);

  // Update items
  const orderedProducts = getOrderedProducts(order);
  displayOrderItems(orderedProducts);

  const user = getUserById(order.userID);
  // Update addresses and payment of the user
  displayShippingInfo(user);
  displayBillingInfo(user);

  // Update summary
  displayOrderSummary(totalPrice);
}

// Display timeline
function displayTimeline(status) {
  const shippedTimeline = document.querySelector(".od-shipped");
  const deliveredTimeline = document.querySelector(".od-delivered");
  if (status === "delivered") {
    shippedTimeline.classList.add("od-completed");
    deliveredTimeline.classList.add("od-completed");
  } else if (status === "shipped") {
    shippedTimeline.classList.add("od-completed");
  }
  // <p class="od-timeline-time">${item.time}</p>;
}

// Display order items
function displayOrderItems(products) {
  const itemsContainer = document.querySelector(".od-items-list");
  if (!itemsContainer) return;

  itemsContainer.innerHTML = products
    .map(
      (item) => `
    <div class="od-item">
      <div class="od-item-image">
        <img src="${item.images[0]}" alt="${item.title}" class="od-product-img">
      </div>
      <div class="od-item-details">
        <h5 class="od-item-name">${item.title}</h5>
        <p class="od-item-description">${item.description.slice(0, 60)}...</p>

      </div>
      <div class="od-item-quantity">
        <span class="od-qty-label">Qty:</span>
        <span class="od-qty-value">${item.quantity}</span>
      </div>
      <div class="od-item-price">
        <span class="od-unit-price">$${item.price.toFixed(2)}</span>
        <span class="od-total-price">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    </div>
  `
    )
    .join("");
}

// Display shipping information
function displayShippingInfo(user) {
  const shippingSection = document.querySelector(".od-info-card .od-info-content");
  if (!shippingSection) return;

  // Update shipping address
  const addressDetails = shippingSection.querySelector(".od-address-details");
  if (addressDetails) {
    addressDetails.innerHTML = `
      <p class="od-address-name">${user.username}</p>
      <p class="od-address">${user.address}</p>
      <p class="od-address-phone">
        <i class="fas fa-phone"></i>
        ${user.phone}
      </p>
    `;
  }
}

// Display billing information
function displayBillingInfo(user) {
  const billingCards = document.querySelectorAll(".od-info-card");
  const billingCard = billingCards[1]; // Second card is billing
  if (!billingCard) return;

  const billingContent = billingCard.querySelector(".od-info-content");
  if (!billingContent) return;

  // Update billing address
  const addressDetails = billingContent.querySelector(".od-address-details");
  if (addressDetails) {
    addressDetails.innerHTML = `
      <p class="od-address-name">${user.username}</p>
      <p class="od-address">${user.address}</p>
    `;
  }

  // Update payment method
  const paymentDetails = billingContent.querySelector(".od-payment-details");
  if (paymentDetails) {
    paymentDetails.innerHTML = `
      <i class="fab fa-cc-visa od-card-icon"></i>
      <span class="od-card-info">Visa ending in 1234</span>
    `;
  }
}

// Display order summary
function displayOrderSummary(total) {
  const shipping = 0; // Free shipping
  const tax = 0; // No tax

  const summaryRows = document.querySelectorAll(".od-summary-row");
  if (summaryRows.length >= 4) {
    summaryRows[0].querySelector(".od-summary-value").textContent = `$${total.toFixed(2)}`;
    summaryRows[1].querySelector(".od-summary-value").textContent = `$0.00`;
    summaryRows[2].querySelector(".od-summary-value").textContent = `$0.00`;
    summaryRows[3].querySelector(".od-summary-value").textContent = `$${total.toFixed(2)}`;
  }
}

// Initialize event handlers
function initializeEventHandlers() {
  // Contact support button
  const supportBtn = document.querySelector(".od-btn-primary");
  if (supportBtn) {
    supportBtn.addEventListener("click", handleContactSupport);
  }

  const updateStatusBtn = document.querySelector(".od-status-update-btn");
  if (updateStatusBtn) {
    updateStatusBtn.addEventListener("click", () => {
      const statusSelect = document.querySelector(".od-status-select");
      if (statusSelect) {
        const newStatus = statusSelect.value;
        const orderId = JSON.parse(localStorage.getItem("selectedSellerOrder"))?.id;
        updateOrderStatus(orderId, newStatus);
        loadOrderData();
      }
      showToast("Order status updated successfully!");
    });
  }
}
// update order status function
function updateOrderStatus(orderId, newStatus) {
  if (!orderId) return;
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = newStatus;
    localStorage.setItem("orders", JSON.stringify(orders));
  }
  const sellerOrder = JSON.parse(localStorage.getItem("selectedSellerOrder"));
  if (sellerOrder) {
    sellerOrder.status = newStatus;
  }
  localStorage.setItem("selectedSellerOrder", JSON.stringify(sellerOrder));
}

// Event handlers
function getUserById(userId) {
  return JSON.parse(localStorage.getItem("users")).users.find((user) => user.id === userId);
}

function handleContactSupport() {
  showToast("Opening support chat...");
}

// Helper functions
function getStatusIcon(status) {
  const icons = {
    delivered: "check-circle",
    processing: "clock",
    shipped: "truck",
    cancelled: "times-circle",
  };
  return icons[status] || "circle";
}
