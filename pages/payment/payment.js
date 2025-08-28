import { cart } from "../../actions/cart.js";
import { generateSecureId } from "../../actions/generateId.js";
import { showToast } from "../../actions/showToast.js";

export async function initializePayment() {
  // Load PayPal SDK dynamically
  const paypalScript = document.createElement("script");
  paypalScript.src =
    "https://www.sandbox.paypal.com/sdk/js?client-id=AWwGica7qOijXlw0dsQ_OYl-Tft5VkdJTDPPM5_cchS4tD-0Dk0Jayd0C53wHKoXHdsIbsqsOaAwzfSq&currency=USD";

  paypalScript.onload = () => {
    if (window.paypal) {
      paypal
        .Buttons({
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  description: "Ecommerce Checkout",
                  amount: {
                    currency_code: "USD",
                    value: "15.89", // fixed test total
                  },
                },
              ],
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
              alert("✅ Payment completed by " + details.payer.name.given_name);
            });
          },
          onError: function (err) {
            console.error("PayPal Error:", err);
            alert("❌ PayPal Checkout failed: " + err.message);
          },
        })
        .render("#paypal-button-container");
    }
  };
  document.body.appendChild(paypalScript);
}

export function paypalGateway() {
  const total = 15.89;

  paypal
    .Buttons({
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              description: "Ecommerce Checkout",
              amount: {
                currency_code: "USD", // force USD
                value: total.toFixed(2), // force 15.89
              },
            },
          ],
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          alert("✅ Payment completed by " + details.payer.name.given_name);
        });
      },
      onError: function (err) {
        console.error(err);
        alert("PayPal Checkout failed: " + err.message);
      },
    })
    .render("#paypal-button-container");
}

// ///////////        display order summary          ////////////////////////////////////////

let newOrder;

export default function displayProductSummary() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userProductsItems = user.cart;
  const tbody = document.querySelector("tbody");

  const newProducts = userProductsItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    sellerID: item.sellerID,
  }));

  // ✅ Create ONE new order object
  newOrder = {
    id: generateSecureId(),
    userID: user.id,
    date: new Date().toISOString(), // optional for history
    status: "processing",
    products: [...newProducts],
  };

  // Clear old rows first
  tbody.innerHTML = "";

  let grandTotal = 0;

  userProductsItems.forEach((product) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = product.name;

    const qtyCell = document.createElement("td");
    qtyCell.textContent = product.quantity;

    const priceCell = document.createElement("td");
    priceCell.textContent = `$${product.price.toFixed(2)}`;

    const totalCell = document.createElement("td");
    const productTotal = product.quantity * product.price;
    totalCell.textContent = `$${productTotal.toFixed(2)}`;

    grandTotal += productTotal;

    row.appendChild(nameCell);
    row.appendChild(qtyCell);
    row.appendChild(priceCell);
    row.appendChild(totalCell);

    tbody.appendChild(row);
  });

  // Create Grand Total row
  const totalRow = document.createElement("tr");

  const labelCell = document.createElement("td");
  labelCell.setAttribute("colspan", "3");
  labelCell.style.textAlign = "right";
  labelCell.style.fontWeight = "bold";
  labelCell.style.color = "#634c9f";
  labelCell.textContent = "Grand Total:";

  const grandTotalCell = document.createElement("td");
  grandTotalCell.style.fontWeight = "bold";
  grandTotalCell.innerHTML = `<span style="color: green;">$${grandTotal.toFixed(2)}</span>`;

  totalRow.appendChild(labelCell);
  totalRow.appendChild(grandTotalCell);

  tbody.appendChild(totalRow);
}

// ✅ Save order to history on payment success
export function paymentStutusFn() {
  const paymentStatusBtn = document.getElementById("paymentStatusBtn");
  const popup = document.getElementById("popup");

  const createdOverlay = document.createElement("div");
  createdOverlay.style.width = "100vw";
  createdOverlay.style.height = "100vh";
  createdOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  createdOverlay.style.position = "fixed";
  createdOverlay.style.top = "0";
  createdOverlay.style.left = "0";
  createdOverlay.style.zIndex = "9999999";
  createdOverlay.style.display = "flex";
  createdOverlay.style.alignItems = "center";
  createdOverlay.style.justifyContent = "center";

  const createdPopupBox = document.createElement("div");
  createdPopupBox.style.width = "600px";
  createdPopupBox.style.minHeight = "400px";
  createdPopupBox.style.borderRadius = "20px";
  createdPopupBox.style.padding = "30px";
  createdPopupBox.style.backgroundColor = "var(--bg-light)";
  createdPopupBox.style.color = "var(--title-main-color)";
  createdPopupBox.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  createdPopupBox.style.textAlign = "center";
  createdPopupBox.style.display = "flex";
  createdPopupBox.style.flexDirection = "column";
  createdPopupBox.style.justifyContent = "center";
  createdPopupBox.style.alignItems = "center";
  createdPopupBox.style.opacity = "0";
  createdPopupBox.style.transition = "all 1s";

  // Wait a tiny bit then show
  setTimeout(() => {
    createdPopupBox.style.opacity = "1";
  }, 10);

  const message = document.createElement("h2");
  message.innerText = "✅ Payment Successful!";
  message.style.color = "var(--title-second-color)";
  message.style.marginBottom = "20px";

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Close";
  closeBtn.style.padding = "10px 20px";
  closeBtn.style.border = "none";
  closeBtn.style.borderRadius = "10px";
  closeBtn.style.backgroundColor = "var(--bg-main-color)";
  closeBtn.style.color = "#fff";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "16px";

  closeBtn.addEventListener("click", () => {
    createdOverlay.remove();
    window.location.href = "/";
    cart.clear();
  });

  createdPopupBox.appendChild(message);
  createdPopupBox.appendChild(closeBtn);
  createdOverlay.appendChild(createdPopupBox);

  paymentStatusBtn.addEventListener("click", function () {
    // get existing history
    let existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    updateStock(newOrder);

    // append the new order(s)
    let updatedOrders = [...existingOrders, newOrder];

    // save to localStorage
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    popup.appendChild(createdOverlay);
  });
}

export function validateBuiltPayment() {
  // don't apply it for make testing easy and save time ;
}

function updateStock(order) {
  const orderProducts = order.products;
  const allProducts = JSON.parse(localStorage.getItem("all-products")) || [];

  orderProducts.forEach((product) => {
    const { id, quantity } = product;
    // Find the product in the inventory and reduce the stock
    const inventoryItem = allProducts.find((item) => item.id === id);
    if (inventoryItem && inventoryItem.stock >= quantity) {
      inventoryItem.stock -= quantity;
      localStorage.setItem("all-products", JSON.stringify(allProducts));
    }
  });
}
