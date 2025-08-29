import { getTotalOrderPrice } from "../../../actions/helperFuncitons.js";

let sellerOrders = [];

export function intiateBookedOrders() {
  showBookedOrders();
  addEventListeners();
}

const showBookedOrders = () => {
  let orders = JSON.parse(localStorage.getItem("orders"));
  let tbody = document.getElementById("table-body");
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

  sellerOrders.forEach((order) => {
    const orderID = order.id.slice(0, 5);
    const userID = order.userID;
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
        <td><span id="status" class="${bg}">${status}</span></td>
        <td>
          <a href="/seller-dashboard/booked-orders-details" data-link>
            <button class="btn btn-primary bo-view-btn" data-orderid="${order.id}">View</button>
          </a>
        </td>
      </tr>
      `;
    tbody.innerHTML += row;
  });
};

function addEventListeners() {
  const viewButtons = document.querySelectorAll(".bo-view-btn");
  viewButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const orderId = e.target.dataset.orderid;
      const order = sellerOrders.find((order) => order.id === orderId);
      localStorage.setItem("selectedSellerOrder", JSON.stringify(order));
    });
  });
}

function getUserNameByID(userID) {
  const users = JSON.parse(localStorage.getItem("users"));
  const user = users.users.find((user) => user.id === userID);
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
