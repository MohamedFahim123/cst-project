function addProductHandler() {
  const productTitleInput = document.getElementById("productTitle");
  const availabilityStatusInput = document.getElementById("availabilityStatus");
  const brandInput = document.getElementById("brand");
  const StockQuantityInput = document.getElementById("quantityInStock");
  const descriptionInput = document.getElementById("description");
  const categoryInput = document.getElementById("category");
  const priceInput = document.getElementById("price");
  const discountInput = document.getElementById("discount");
  const ImgInput = document.getElementById("productImg");

  // get all products stored in local storage
  function getProducts() {
    const products = localStorage.getItem("all-products") || [];
    return JSON.parse(products);
  }

  function SaveTolocalStorage(productArr) {
    localStorage.setItem("all-products", JSON.stringify(productArr));
  }

  // function that validate the Product Properties before Adding to the Market
  function ValidateProductAddition(
    title,
    status,
    quantity,
    disc,
    price,
    discount
  ) {
    // object that contain validation errors
    const validationErrors = {};

    const titleRegex = /^[A-Za-z0-9\s\-']{3,45}$/;
    const discRegex = /^.{8,150}$/;

    // Title
    if (!titleRegex.test(title)) {
      validationErrors.title =
        "Please Enter a valid Product title , 3-45 characters";
    }

    // Description
    if (!discRegex.test(disc)) {
      validationErrors.disc =
        "Please Enter a valid Product Description (8-150 characters)";
    }

    // Stock & Quantity
    if (status === "inStock" && quantity === 0) {
      validationErrors.quantity =
        "Please enter a valid Stock Quantity greater than 0";
    }
    if (status === "outOfStock" && quantity > 0) {
      validationErrors.quantity =
        "Out of stock products must have quantity = 0";
    }
    if (quantity <= 0 || quantity > 1000000) {
      validationErrors.quantity = "Enter reasonable Quantity (1 - 1,000,000)";
    }

    // Price
    if (price <= 0 || price > 1000000000) {
      validationErrors.price =
        "Enter reasonable price (greater than 0, less than 1B)";
    }

    // Discount
    if (discount < 0 || discount >= 100) {
      validationErrors.discount = "Discount must be between 0 and 99%";
    }

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors,
    };
  }

  // function that Display Alerts
  function DisplayValidationAlerts(validationErrors) {
    // امسح أي Alerts قديمة
    document.querySelectorAll(".error-alert").forEach((e) => e.remove());

    // map بين أسماء ال validationErrors والـ inputs
    const inputs = {
      title: document.getElementById("productTitle"),
      status: document.getElementById("availabilityStatus"),
      quantity: document.getElementById("quantityInStock"),
      disc: document.getElementById("description"),
      category: document.getElementById("category"),
      price: document.getElementById("price"),
      discount: document.getElementById("discount"),
    };

    // Loop على كل Error
    Object.entries(validationErrors).forEach(([key, message]) => {
      const inputElement = inputs[key];

      if (inputElement) {
        const alert = document.createElement("div");
        alert.classList.add(
          "alert",
          "alert-danger",
          "mt-2",
          "p-1",
          "error-alert"
        );
        alert.innerText = message;

        // أضف ال Alert بعد الـ input
        inputElement.insertAdjacentElement("afterend", alert);
      }
    });
  }
  // function that add newProduct to Products array
  function AddProduct(
    title,
    disc,
    status,
    brand,
    quantity,
    category,
    price,
    discount,
    imgUrl
  ) {
    const newProduct = {
      id: Date.now(),
      title,
      brand,
      stock: quantity,
      description: disc,
      availabilityStatus: status,
      category,
      price: Number(price),
      discountPercentage: Number(discount),
      deletedPrice: Number(price),
      thumbnail: imgUrl,
      images: [imgUrl],
    };
    const Allproducts = getProducts();
    Allproducts.push(newProduct);
    SaveTolocalStorage(Allproducts);
    alert("added");
  }

  function sellerProducts(email) {}

  document
    .getElementById("updateProductForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const title = productTitleInput.value.trim();
      const disc = descriptionInput.value.trim();
      const status = availabilityStatusInput.value;
      const brand = brandInput.value;
      const quantity = StockQuantityInput.value;
      const category = categoryInput.value;
      const price = priceInput.value;
      const discount = discountInput.value;
      const img = ImgInput.value.trim();

      const validateResult = ValidateProductAddition(
        title,
        status,
        quantity,
        disc,
        price,
        discount
      );
      if (validateResult.isValid) {
        AddProduct(
          title,
          disc,
          status,
          brand,
          quantity,
          category,
          price,
          discount,
          img
        );
      } else {
        DisplayValidationAlerts(validateResult.errors);
      }
    });
}
export { addProductHandler };
