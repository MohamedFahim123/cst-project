import { showToast } from "./showToast.js";

class Cart {
  static STORAGE_KEY = "currentUser";
  #items = { cart: [] };
  #listeners = [];

  constructor() {
    this.#items = this.#load();
  }

  #load() {
    try {
      const saved = localStorage.getItem(Cart.STORAGE_KEY);
      return saved ? JSON.parse(saved) : { cart: [] };
    } catch (e) {
      console.error("Failed to load cart:", e);
      return { cart: [] };
    }
  }

  #save() {
    localStorage.setItem(Cart.STORAGE_KEY, JSON.stringify(this.#items));
    this.#notify();
  }

  _setItems(newItems) {
    this.#items = newItems;
    this.#save();
  }

  _getItems() {
    return this.#items;
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
    const existing = items.cart.find((item) => +item.id === +product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.cart.push({ ...product, quantity });
    }

    this._setItems(items);
    showToast(`${product.name} added to cart`, "success");
  }

  has(productId) {
    return this._getItems().cart.some((item) => +item.id === +productId);
  }

  remove(productId) {
    const items = this._getItems();
    const item = items.cart.find((i) => +i.id === +productId);
    items.cart = items.cart.filter((item) => +item.id !== +productId);
    this._setItems(items);
    showToast(`${item.name} removed from cart`, "error");
  }

  updateQuantity(productId, quantity) {
    const items = this._getItems();
    const item = items.cart.find((i) => +i.id === +productId);

    if (!item) return;

    if (quantity <= 0) {
      this.remove(productId);
    } else {
      item.quantity = quantity;
      this._setItems(items);
    }
  }

  clear() {
    this._setItems({ cart: [] });
  }

  get allItemsCount() {
    return this._getItems().cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this._getItems().cart.reduce(
      (sum, item) => sum + item.quantity * (item.price || 0),
      0
    );
  }

  get items() {
    return [...this._getItems().cart];
  }
}

export const cart = new Cart();
