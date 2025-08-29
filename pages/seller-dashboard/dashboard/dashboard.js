export const dashboardInitSeller = () => {
  // Sales Chart
  const salesCtx = document.getElementById("salesChart").getContext("2d");

  const salesChart = new Chart(salesCtx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Sales",
          data: [7500, 8100, 7800, 9500, 10552, 9900, 11000],
          borderColor: "#634c9f",
          backgroundColor: "#7962b3ff",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#634c9f",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            drawBorder: false,
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });

  // Add animations to cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Slide up the card
  document.querySelectorAll(".pf-slide-up").forEach((card) => {
    card.style.opacity = 0;
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(card);
  });

  // Hover effects to cards
  const cards = document.querySelectorAll(".pf-card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-5px)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });
  });

  let all_products = JSON.parse(localStorage.getItem("all-products"));
  let orders = JSON.parse(localStorage.getItem("orders"));
  let pfCard = document.getElementById("pfCard");

  let ids = [],
    imgs = [],
    titles = [],
    brands = [],
    prices = [];

  // ! Orders
  orders.forEach((order) => {
    order.products.forEach((prOrder) => {
      ids.push(prOrder.id);
    });
  });

  // ! Products
  all_products.forEach((product) => {
    ids.forEach((id) => {
      if (id == product["id"]) {
        imgs.push(product["images"][0]);
        prices.push(product.price);
        brands.push(product.brand);
        titles.push(product.title);
      }
    });
  });

  // ! Show last three orderas
  for (var x = ids.length - 1; x > 7; x--) {
    let produxtItem = document.createElement("div");
    produxtItem.className = "pf-product-item";
    produxtItem.innerHTML = `
                              <div class="pf-product-icon">
                                  <img src="${imgs[x]}" alt="${titles[x]}" style="width:40px;height:40px;object-fit:cover;">
                              </div>
                              <div class="pf-product-info">
                                  <h4>${titles[x]}</h4>
                                  <p>${brands[x]}</p>
                              </div>
                              <div class="pf-product-amount">${prices[x]}</div>`;
    pfCard.appendChild(produxtItem);
  }
};
