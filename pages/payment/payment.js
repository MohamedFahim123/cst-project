import { cart } from "../../actions/cart.js";
import { generateSecureId } from "../../actions/generateId.js";
import { showToast } from "../../actions/showToast.js";


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









//  updated credit card desgin : 



// let orderz = [] ;
export function updatedCreditCaerd() {



  const cardNumber = document.getElementById("card-number");
  const cardName = document.getElementById("card-name");
  const cardMonth = document.getElementById("card-month");
  const cardYear = document.getElementById("card-year");
  const cardCvv = document.getElementById("card-cvv");
  const cardType = document.getElementById("card-type");
  const cardTypeBack = document.getElementById("card-type-back");
  const cardItem = document.getElementById("card-item");
  const bg = document.getElementById("card-bg");
  const bgBack = document.getElementById("card-bg-back");


  // Random background
  const bgNumber = Math.floor(Math.random() * 25) + 1;
  bg.src = `https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${bgNumber}.jpeg`;
  bgBack.src = bg.src;

  // Populate months & years
  const monthSelect = document.getElementById("input-month");
  const yearSelect = document.getElementById("input-year");
  for (let i = 1; i <= 12; i++) {
    let m = i < 10 ? "0" + i : i;
    monthSelect.innerHTML += `<option value="${m}">${m}</option>`;


  }
  let yearNow = new Date().getFullYear();
  for (let i = 0; i < 12; i++) {
    let y = yearNow + i;
    yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
  }

  // Detect card type
  function getCardType(number) {
    if (/^4/.test(number)) return "visa";
    if (/^(34|37)/.test(number)) return "amex";
    if (/^5[1-5]/.test(number)) return "mastercard";
    if (/^6011/.test(number)) return "discover";
    if (/^9792/.test(number)) return "troy";
    return "";
  }

  // Format card number
  function formatCardNumber(value) {
    return value.replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  }




  // Input listeners
  document.getElementById("input-number").addEventListener("input", e => {
    let rawVal = formatCardNumber(e.target.value); // النص الأصلي المنسق
    let maskedVal = rawVal.split("").map((ch, i) => {
      // نخلي أول 4 أرقام تبان والباقي يبقى #
      if ([4, 5, 6, 10, 11, 3, 14].includes(i) && ch !== " ") {
        return "#";
      }
      return ch;
    }).join("");




    cardNumber.textContent = maskedVal || "#### #### #### ####";

    let type = getCardType(rawVal); // هنا بنفحص الرقم الحقيقي مش المخفي
    if (type) {
      cardType.src = `https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${type}.png`;
      cardTypeBack.src = cardType.src;
    } else {
      cardType.src = "";
      cardTypeBack.src = "";
    }
  });


  document.getElementById("input-name").addEventListener("input", e => {

    if (e.target.value.length <= 12 && /^[a-zA-Z\s]*$/.test(e.target.value)) {
      cardName.textContent = e.target.value.toUpperCase();
    } else {
      cardName.textContent = "FULL NAME"
    }
  });

  monthSelect.addEventListener("change", e => {
    cardMonth.textContent = e.target.value || "MM";

  });

  yearSelect.addEventListener("change", e => {
    cardYear.textContent = e.target.value.slice(2) || "YY";
  });

  document.getElementById("input-cvv").addEventListener("focus", () => {
    cardItem.classList.add("-active");
  });
  document.getElementById("input-cvv").addEventListener("blur", () => {
    cardItem.classList.remove("-active");
  });
  document.getElementById("input-cvv").addEventListener("input", e => {
    cardCvv.textContent = e.target.value.replace(/./g, "*") || "***";
  });


  document.querySelector(".card-form__inner").addEventListener("submit", async function (e) {
    e.preventDefault()
    showToast("payment success", "success" )

    await sleep(3000)

    updateStock(newOrder);
    let updatedOrders = JSON.parse(localStorage.getItem("orders"));
    updatedOrders = [...updatedOrders, newOrder];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    cart.clear()
    window.location.href = "#/";


  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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