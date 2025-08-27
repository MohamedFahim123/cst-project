// pass the order object and get the total price of the order
export function getTotalOrderPrice(order) {
  return order.products.reduce((total, item) => {
    const resultProduct = getProductById(item.id);
    return total + resultProduct.price * item.quantity;
  }, 0);
}

export function getOrderedProducts(order) {
  return order.products.map((item) => {
    const resultProduct = getProductById(item.id);
    return {
      ...resultProduct,
      quantity: item.quantity,
    };
  });
}

function getProductById(productId) {
  const products = JSON.parse(localStorage.getItem("all-products")) || [];
  const product = products.find((p) => p.id == productId);
  return product || { price: 0, quantity: 0 };
}
