export const dashboardInit = () => {
  // Sales Chart
  const salesCtx = document.getElementById("salesChart").getContext("2d");
  const overviewCtx = document.getElementById("dataChart").getContext("2d");

  const salesChart = new Chart(salesCtx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Sales",
          data: [7500, 8100, 7800, 9500, 10552, 9900, 11000],
          borderColor: "#634c9f",
          backgroundColor: "rgba(99, 76, 159, 0.1)",
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

  let ordersLength = JSON.parse(localStorage.getItem("orders")).length;
  let allProducts = JSON.parse(localStorage.getItem("all-products")).length;
  let users = JSON.parse(localStorage.getItem("users"))["users"];

  let customers = 0;
  let sellers = 0;

  users.forEach((u) => {
    if (u.role == "customer") {
      customers++;
    } else if (u.role == "seller") {
      sellers++;
    }
  });

  const overviewChart = new Chart(overviewCtx, {
    type: "doughnut",
    data: {
      labels: ["Customers", "Sellers", "Products", "Orders"],
      datasets: [
        {
          label: "E-commerce Overview",
          data: [customers, sellers, allProducts, ordersLength], // Example values
          backgroundColor: [
            "#634c9f", // Customers
            "#ff6384", // Sellers
            "#36a2eb", // Products
            "#ffce56", // Orders
          ],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.label || "";
              let value = context.parsed;
              return `${label}: ${value}`;
            },
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
};
