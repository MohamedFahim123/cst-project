import { showToast } from "./showToast.js";

class Cart {
  static STORAGE_KEY = "currentUser";
  #listeners = [];

  constructor() {}

  #load() {
    try {
      const userData = localStorage.getItem(Cart.STORAGE_KEY);
      if (!userData) return { cart: [] };

      const parsed = JSON.parse(userData);
      return parsed.cart ? parsed : { ...parsed, cart: [] };
    } catch (e) {
      console.error("Failed to load cart:", e);
      return { cart: [] };
    }
  }

  #save(cartData) {
    try {
      const userData = localStorage.getItem(Cart.STORAGE_KEY);
      let currentUser = userData ? JSON.parse(userData) : {};

      const updatedUser = { ...currentUser, cart: cartData };
      localStorage.setItem(Cart.STORAGE_KEY, JSON.stringify(updatedUser));
      this.#notify();
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }

  _getUserData() {
    try {
      const userData = localStorage.getItem(Cart.STORAGE_KEY);
      return userData ? JSON.parse(userData) : {};
    } catch (e) {
      console.error("Failed to get user data:", e);
      return {};
    }
  }

  _setUserData(userData) {
    try {
      localStorage.setItem(Cart.STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to set user data:", e);
    }
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

    const userData = this._getUserData();
    const cart = userData.cart || [];
    const existing = cart.find((item) => +item.id === +product.id);

    if (existing) {
      if (existing.quantity + quantity <= existing.stock) {
        existing.quantity += quantity;
      } else {
        showToast("Cannot add more than available stock", "info");
        existing.quantity = existing.stock;
      }
    } else {
      cart.push({ ...product, quantity });
    }

    this.#save(cart);
    showToast(`${product.name} added to cart`, "success");
  }

  has(productId) {
    const userData = this._getUserData();
    const cart = userData.cart || [];
    return cart.some((item) => +item.id === +productId);
  }

  remove(productId) {
    const userData = this._getUserData();
    const cart = userData.cart || [];
    const item = cart.find((i) => +i.id === +productId);

    if (item) {
      const newCart = cart.filter((item) => +item.id !== +productId);
      this.#save(newCart);
      showToast(`${item.name} removed from cart`, "error");
    }
  }

  updateQuantity(productId, quantity) {
    const userData = this._getUserData();
    const cart = userData.cart || [];
    const item = cart.find((i) => i.id.toString().toLowerCase() === productId.toString().toLowerCase());

    if (!item) return;

    if (quantity <= 0) {
      this.remove(productId);
    } else {
      item.quantity = quantity;
      this.#save(cart);
    }
  }

  clear() {
    const userData = this._getUserData();
    this.#save([]);
  }

  get allItemsCount() {
    const userData = this._getUserData();
    const cart = userData.cart || [];
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    const userData = this._getUserData();
    const cart = userData.cart || [];
    return cart.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0);
  }

  get items() {
    const userData = this._getUserData();
    return [...(userData.cart || [])];
  }
}

export const cart = new Cart();
