import { cart } from "../../actions/cart.js";

class User {
  #username;
  #email;
  #password;

  constructor(username, email, password) {
    this.#username = username;
    this.#email = email;
    this.#password = password;
  }

  get UserName() {
    return this.#username;
  }

  get Email() {
    return this.#email;
  }

  checkPassword(password) {
    return this.#password === password;
  }
  // will convert the Parsed String (localStorage) into the Obj
  static fromJSON(obj) {
    return new User(obj.username, obj.email, obj.password);
  }
  // to store the Private Values in localStorage
  toJSON() {
    return {
      username: this.#username,
      email: this.#email,
      password: this.#password,
    };
  }
}

// <===================================================================>

class Customer extends User {
  constructor(username, email, password) {
    super(username, email, password);
    this.role = "customer";
    this.cart = [];
    this.orders = [];
  }

  addToCart(productID, productName, productPrice, quantity) {
    const product = { id: productID, productName, productPrice, quantity };
    this.cart.push(product);
  }

  removeFromCart(productID) {
    this.cart = this.cart.filter((product) => +product.id !== +productID);
  }

  placeOrder() {
    if (this.cart.length === 0) {
      return;
    }
    this.orders.push([...this.cart]);

    this.cart = [];
  }

  showOrders() {}

  static fromJSON(obj) {
    const customer = new Customer(obj.username, obj.email, obj.password);
    customer.role = "customer";
    customer.cart = obj.cart || [];
    customer.orders = obj.orders || [];
    return customer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      role: this.role,
      cart: this.cart,
      orders: this.orders,
    };
  }
}

// <============================================================================>

class Seller extends Customer {
  constructor(username, email, password) {
    super(username, email, password);
    this.role = "seller";
    this.products = [];
  }

  static fromJSON(obj) {
    const seller = new Seller(obj.username, obj.email, obj.password);

    seller.role = "seller";
    seller.cart = obj.cart || [];
    seller.orders = obj.orders || [];
    seller.products = obj.products || [];
    return seller;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      role: this.role,
      products: this.products,
    };
  }
}

export { User, Customer, Seller };
