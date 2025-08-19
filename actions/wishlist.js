import StorageCollection from "./storageCollection.js";

class Wishlist extends StorageCollection {
  static STORAGE_KEY = "wishlist-items";

  constructor() {
    super(Wishlist.STORAGE_KEY);
  }

  add(product) {
    if (!product?.id) {
      console.warn("Invalid product object. Must contain an id.");
      return;
    }

    if (!this.has(product.id)) {
      const items = this._getItems();
      items.push({ ...product });
      this._setItems(items);
    }
  }

  remove(productId) {
    this._setItems(this._getItems().filter((item) => item.id !== productId));
  }

  get itemCount() {
    return this._getItems().length;
  }

  get totalPrice() {
    return this._getItems().reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
  }
}

export const wishlist = new Wishlist();
