document.addEventListener("DOMContentLoaded", function () {

  // Search functionality
  const searchInput = document.getElementById("customers-search");
  const tableRows = document.querySelectorAll(".customers-table tbody tr");

  searchInput.addEventListener("input", function () {
    const searchText = this.value.toLowerCase();

    tableRows.forEach((row) => {
      const name = row.cells[1].textContent.toLowerCase();
      const email = row.cells[2].textContent.toLowerCase();
      const address = row.cells[4].textContent.toLowerCase();

      if (name.includes(searchText) || email.includes(searchText) || address.includes(searchText)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});

