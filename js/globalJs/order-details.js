import { getTotalOrderPrice } from "../../actions/helperFuncitons.js";
// Temporary order data for demonstration
const odOrderData = {
  id: "ORD-2024-001",
  date: "2023-10-01T12:00:00Z",
  status: "delivered", // delivered, processing, shipped, cancelled
  total: 299.98,
  items: [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      description: "Premium noise-canceling headphones with 30-hour battery life",
      image: "../../../assets/product-img1.jpeg",
      price: 149.99,
      quantity: 1,
      specs: {
        color: "Black",
        size: "Standard",
      },
    },
  ],
  shipping: {
    address: {
      name: "John Doe",
      line1: "123 Main Street, Apt 4B",
      city: "New York, NY 10001",
      phone: "+1 (555) 123-4567",
    },
  },
  billing: {
    address: {
      name: "John Doe",
      line1: "123 Main Street, Apt 4B",
      city: "New York, NY 10001",
    },
    payment: {
      method: "Visa ending in 1234",
      icon: "fab fa-cc-visa",
    },
  },
  timeline: [
    {
      title: "Order Placed",
      time: "January 15, 2024 - 10:30 AM",
      completed: true,
    },
    {
      title: "Payment Confirmed",
      time: "January 15, 2024 - 10:32 AM",
      completed: true,
    },
    {
      title: "Order Processed",
      time: "January 16, 2024 - 9:15 AM",
      completed: true,
    },
    {
      title: "Shipped",
      time: "January 17, 2024 - 2:45 PM",
      completed: true,
    },
    {
      title: "Delivered",
      time: "January 20, 2024 - 3:20 PM",
      completed: true,
    },
  ],
};

// Initialize order details functionality
export function initializeOrderDetails() {
  loadOrderData();
  initializeEventHandlers();
}

function loadOrderData() {
  // OrderId from localStorage
  const orderId = localStorage.getItem("selectedOrder") || odOrderData.id;
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find((order) => order.id === +orderId);
  console.log(orders, "hellooooooooo", order);
  displayOrderData(order);
}

// Display order data
function displayOrderData(order) {
  // Update order header
  document.querySelector(".od-order-number").textContent = `Order #${order.id}`;
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
  document.querySelector(".od-total-amount").textContent = `$${getTotalOrderPrice(order)}`;

  // Update timeline
  displayTimeline(order.timeline);

  // Update items
  displayOrderItems(order.items);

  // Update addresses and payment
  displayShippingInfo(order.shipping);
  displayBillingInfo(order.billing);

  // Update summary
  displayOrderSummary(order);
}

// Display timeline
function displayTimeline(timeline) {
  const timelineContainer = document.querySelector(".od-progress-timeline");
  if (!timelineContainer) return;

  timelineContainer.innerHTML = timeline
    .map(
      (item) => `
    <div class="od-timeline-item ${item.completed ? "od-completed" : ""}">
      <div class="od-timeline-marker">
        <i class="fas fa-${item.completed ? "check" : "circle"}"></i>
      </div>
      <div class="od-timeline-content">
        <h6 class="od-timeline-title">${item.title}</h6>
        <p class="od-timeline-time">${item.time}</p>
      </div>
    </div>
  `
    )
    .join("");
}

// Display order items
function displayOrderItems(items) {
  const itemsContainer = document.querySelector(".od-items-list");
  if (!itemsContainer) return;

  itemsContainer.innerHTML = items
    .map(
      (item) => `
    <div class="od-item">
      <div class="od-item-image">
        <img src="${item.image}" alt="${item.name}" class="od-product-img">
      </div>
      <div class="od-item-details">
        <h5 class="od-item-name">${item.name}</h5>
        <p class="od-item-description">${item.description}</p>
        <div class="od-item-specs">
          ${Object.entries(item.specs)
            .map(([key, value]) => `<span class="od-spec-item">${key}: ${value}</span>`)
            .join("")}
        </div>
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
function displayShippingInfo(shipping) {
  const shippingSection = document.querySelector(".od-info-card .od-info-content");
  if (!shippingSection) return;

  // Update shipping address
  const addressDetails = shippingSection.querySelector(".od-address-details");
  if (addressDetails) {
    addressDetails.innerHTML = `
      <p class="od-address-name">${shipping.address.name}</p>
      <p class="od-address-line">${shipping.address.line1}</p>
      <p class="od-address-city">${shipping.address.city}</p>
      <p class="od-address-phone">
        <i class="fas fa-phone"></i>
        ${shipping.address.phone}
      </p>
    `;
  }
}

// Display billing information
function displayBillingInfo(billing) {
  const billingCards = document.querySelectorAll(".od-info-card");
  const billingCard = billingCards[1]; // Second card is billing
  if (!billingCard) return;

  const billingContent = billingCard.querySelector(".od-info-content");
  if (!billingContent) return;

  // Update billing address
  const addressDetails = billingContent.querySelector(".od-address-details");
  if (addressDetails) {
    addressDetails.innerHTML = `
      <p class="od-address-name">${billing.address.name}</p>
      <p class="od-address-line">${billing.address.line1}</p>
      <p class="od-address-city">${billing.address.city}</p>
    `;
  }

  // Update payment method
  const paymentDetails = billingContent.querySelector(".od-payment-details");
  if (paymentDetails) {
    paymentDetails.innerHTML = `
      <i class="${billing.payment.icon} od-card-icon"></i>
      <span class="od-card-info">${billing.payment.method}</span>
    `;
  }
}

// Display order summary
function displayOrderSummary(order) {
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const tax = 0; // No tax
  const total = subtotal + shipping + tax;

  const summaryRows = document.querySelectorAll(".od-summary-row");
  if (summaryRows.length >= 4) {
    summaryRows[0].querySelector(".od-summary-value").textContent = `$${subtotal.toFixed(2)}`;
    summaryRows[1].querySelector(".od-summary-value").textContent = `$${shipping.toFixed(2)}`;
    summaryRows[2].querySelector(".od-summary-value").textContent = `$${tax.toFixed(2)}`;
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
}

// Event handlers

function handleContactSupport() {
  alert("Opening support chat...");
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
