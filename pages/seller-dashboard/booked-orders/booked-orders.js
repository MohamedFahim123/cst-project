export const showBookedOrders = () => {
  let all_products = JSON.parse(localStorage.getItem("all-products"));
  let orders = JSON.parse(localStorage.getItem("orders"));
  let tbody = document.getElementById("table-body");

  let ids = [],
    quantity = [],
    sellerId = [],
    status = [],
    imgs = [],
    prices = [],
    brands = [],
    titles = [];

  // ! Orders
  orders.forEach((order) => {
    let numOfProductsOfOrder = order.products.length;
    for (var x = 0; x < numOfProductsOfOrder; x++) {
      status.push(order.status.charAt(0).toUpperCase() + order.status.slice(1));
    }
    order.products.forEach((prOrder) => {
      ids.push(prOrder.id);
      quantity.push(prOrder.quantity);
      sellerId.push(prOrder.sellerID);
    });
  });

  // ! Products
  all_products.forEach((product) => {
    ids.forEach((id) => {
      if (id == product["id"]) {
        imgs.push(product["images"][0]); 
        prices.push(product.price);  
        brands.push(product.brand);
        titles.push(product.title);
      }
    });
  });

  ids.forEach((id, i) => {
    // ? Row

    // * Style of status
    let bg;
    if (status[i] == "Processing") {
      bg = "bg-orange";
    } else if (status[i] == "Shipped") {
      bg = "bg-black";
    } else if (status[i] == "Delivered") {
      bg = "bg-green";
    } else {
      bg = "bg-red";
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${id}</td>
      <td><img src="${imgs[i]}" alt="${titles[i]}" style="width:40px;height:40px;object-fit:cover;"></td>
      <td>${brands[i]}</td>
      <td>${titles[i]}</td>
      <td>${quantity[i]}</td>
      <td>${prices[i]}</td>
      <td>${sellerId[i]}</td>
      <td><span id="status" class="${bg}">${status[i]}</span></td>
    `;
    tbody.appendChild(row);
  });
};
