// pass the order object and get the total price of the order
export function getTotalOrderPrice(order) {
  return order.products.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
}
