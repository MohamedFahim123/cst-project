// --- Local Storage Helpers ---
function getProducts() {
  try {
    return JSON.parse(localStorage.getItem("all-products")) || [];
  } catch {
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem("all-products", JSON.stringify(products));
}

export { getProducts, saveProducts };
