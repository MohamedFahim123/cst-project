import { showToast } from "../../../actions/showToast.js";
import { getCurrentUser } from "../../register/LocalStorageUtils.js";
import { getProducts, saveProducts } from "./helpers.js";

// --- Product-CRUD ---
function createProductData({
  title,
  brand,
  quantity,
  description,
  status,
  category,
  price,
  discount,
  imgs,
}) {
  return {
    id: Date.now(),
    title,
    brand,
    stock: Number(quantity),
    description,
    availabilityStatus: status,
    category,
    price: Number(price - (price * discount) / 100),
    discountPercentage: Number(discount),
    deletedPrice: Number(price),
    thumbnail: imgs[0],
    images: imgs,
    sellerID: getCurrentUser().id,
  };
}

function addProduct(product) {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
  showToast("Product Added Successfully", "success");
}

function deleteProduct(productID) {
  const deleteConfirm = confirm("are You sure you want to Delete this product");
  if (!deleteConfirm) return;
  const products = getProducts();
  const updatedProducts = products.filter(
    (product) => product.id !== productID
  );
  saveProducts(updatedProducts);
}
// function that return Product detailed Obj
function getProductDetails(productID) {
  const productDetails = getProducts().filter(
    (product) => product.id === productID
  )[0];
  return productDetails;
}
// convert images to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// --- Rendering ---
function createProductCard(product) {
  return `
      <div class="col-lg-3 col-md-6">
        <div class="product-card">
         <button class="delete-btn" data-id="${product.id}">&times;</button>
          <img src="${product.thumbnail}" alt="${product.title}" class="product-img">
          <h6 class="mb-0">${product.title}</h6>
          <div>
            <span class="text-muted text-decoration-line-through">${product.deletedPrice}</span>
            <span class="fw-bold ms-2">${product.price}</span>
          </div>
          <button class="edit-btn mt-auto" data-id=${product.id} data-bs-toggle="modal" data-bs-target="#editProduct" >Edit Product</button>
        </div>
      </div>
    `;
}

export {
  createProductData,
  addProduct,
  deleteProduct,
  getProductDetails,
  createProductCard,
  fileToBase64,
};
