import StorageCollection from "./storageCollection.js";

class Cart extends StorageCollection {
  static STORAGE_KEY = "cart-items";
  #listeners = [];

  constructor() {
    super(Cart.STORAGE_KEY);
  }

  onChange(callback) {
    this.#listeners.push(callback);
  }

  #notify() {
    this.#listeners.forEach((cb) => cb(this.items));
  }

  add(product, quantity = 1) {
    if (!product?.id) {
      console.warn("Invalid product object. Must contain an id.");
      return;
    }

    const items = this._getItems();
    const existing = items.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ ...product, quantity });
    }

    this._setItems(items);
  }

  remove(productId) {
    this._setItems(this._getItems().filter((item) => item.id !== productId));
  }

  updateQuantity(productId, quantity) {
    const items = this._getItems();
    const item = items.find((i) => i.id === productId);

    if (!item) return;

    if (quantity <= 0) {
      this.remove(productId);
    } else {
      item.quantity = quantity;
      this._setItems(items);
    }
  }

  get itemCount() {
    return this._getItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this._getItems().reduce(
      (sum, item) => sum + item.quantity * (item.price || 0),
      0
    );
  }
}

export const cart = new Cart();
