class StorageCollection {
  #items = [];
  #listeners = new Set();

  constructor(storageKey) {
    if (!storageKey) throw new Error("Storage key is required");
    this.storageKey = storageKey;
    this.#items = this.#load();
  }

  #load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error(`Failed to load ${this.storageKey} from storage:`, e);
      return [];
    }
  }

  #save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.#items));
    this.#emit();
  }

  onChange(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  #emit() {
    for (const listener of this.#listeners) {
      listener(this.items);
    }
  }

  _setItems(newItems) {
    this.#items = newItems;
    this.#save();
  }

  _getItems() {
    return this.#items;
  }

  clear() {
    this._setItems([]);
  }

  has(productId) {
    return this.#items.some((item) => +item.id === +productId);
  }

  get items() {
    return [...this.#items];
  }

  get allItemsCount() {
    return this.#items.length;
  }
}

export default StorageCollection;
