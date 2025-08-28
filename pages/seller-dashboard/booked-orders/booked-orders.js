export const showBookedOrders = () => {
  let tbody = document.getElementById("table-body");
  let products = JSON.parse(localStorage.getItem("all-products"));
  let orders = JSON.parse(localStorage.getItem("orders"));

  tbody.innerHTML = `<tr>
                          <td>122</td>
                          <td>Apple</td>
                          <td>i phone 5s</td>
                          <td class="total-amount">$238.00</td>
                          <td>Shipped</td>
                      </tr>`;
};
