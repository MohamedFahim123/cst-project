const orders = JSON.parse(localStorage.getItem("orders"));
const currentSellerId = JSON.parse(localStorage.getItem("currentUser")).id;

const productsOfCurrentSeller = [];
orders.forEach((order) => {
  for (let i = 0; i < order.products.length; i++) {
    if (order.products[i].sellerID === currentSellerId) {
      productsOfCurrentSeller.push(order.products[i]);
    }
  }
});
