import { showToast } from "../../../actions/showToast.js";
import { router } from "../../../js/router.js";

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let filteredCustomers = [];
let allCustomers = [];

const customerCell = (cell) => {
  return `<tr>
    <td class="text-trancate" title="${cell.id}">${cell.id ? cell.id : "N/A"}</td>
    <td class="text-trancate">${cell.username}</td>
    <td class="text-trancate">${cell.email}</td>
    <td class="text-trancate">${cell.phone ? cell.phone : "N/A"}</td>
    <td class="text-trancate">${cell.address ? cell.address : "N/A"}</td>
    <td class="d-flex gap-3 align-items-center">
      <i class="fa-solid fa-trash cursor-pointer deleteCustomerIcon" data-id="${
        cell.id
      }"></i>  
      <i class="fa-solid fa-pen-to-square cursor-pointer editCustomerIcon" data-id="${
        cell.id
      }"></i>
    </td>
  </tr>`;
};

const renderAllCustomers = (customers) => {
  const tableBody = document.getElementById("customers-table-body");
  const emptyState = document.getElementById("empty-state");
  const tableWrapper = document.getElementById("table-wrapper");
  const paginationContainer = document.getElementById("pagination-container");

  // Show empty state if no customers
  if (customers.length === 0) {
    emptyState.style.display = "block";
    tableWrapper.style.display = "none";
    paginationContainer.style.display = "none";
    return;
  }

  // Hide empty state and show table
  emptyState.style.display = "none";
  tableWrapper.style.display = "block";

  // Apply pagination
  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, customers.length);
  const paginatedCustomers = customers.slice(startIndex, endIndex);

  // Render table
  tableBody.innerHTML = "";
  paginatedCustomers.forEach((customer) => {
    tableBody.innerHTML += customerCell(customer);
  });

  // Render pagination if needed
  if (customers.length > ITEMS_PER_PAGE) {
    paginationContainer.style.display = "flex";
    renderPagination(customers.length, totalPages);
  } else {
    paginationContainer.style.display = "none";
  }

  addEditDeleteListeners();
};

const renderPagination = (totalItems, totalPages) => {
  const paginationInfo = document.getElementById("pagination-info");
  const paginationControls = document.getElementById("pagination-controls");

  // Update pagination info
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
  paginationInfo.textContent = `Showing ${startItem} to ${endItem} of ${totalItems} Customers`;

  // Create pagination controls
  let paginationHTML = "";

  // Previous button
  paginationHTML += `<button class="page-btn ${
    currentPage === 1 ? "disabled" : ""
  }" ${currentPage === 1 ? "disabled" : ""} id="prev-page">
    <i class="fas fa-chevron-left"></i>
  </button>`;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button class="page-btn ${
      currentPage === i ? "active" : ""
    }" data-page="${i}">${i}</button>`;
  }

  // Next button
  paginationHTML += `<button class="page-btn ${
    currentPage === totalPages ? "disabled" : ""
  }" ${currentPage === totalPages ? "disabled" : ""} id="next-page">
    <i class="fas fa-chevron-right"></i>
  </button>`;

  paginationControls.innerHTML = paginationHTML;

  // Add event listeners to pagination buttons
  document.querySelectorAll(".page-btn[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      currentPage = parseInt(button.dataset.page);
      renderAllCustomers(
        filteredCustomers.length > 0 ? filteredCustomers : allCustomers
      );
    });
  });

  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderAllCustomers(
        filteredCustomers.length > 0 ? filteredCustomers : allCustomers
      );
    }
  });

  document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderAllCustomers(
        filteredCustomers.length > 0 ? filteredCustomers : allCustomers
      );
    }
  });
};

export const RenderCustomers = () => {
  const users = JSON.parse(localStorage.getItem("users")).users;
  allCustomers = users.filter((user) => user.role.toLowerCase() === "customer");
  filteredCustomers = [];
  currentPage = 1;

  renderAllCustomers(allCustomers);
  addEditDeleteListeners();
};

export const customersSearch = () => {
  const searchInput = document.getElementById("customers-search");
  const users = JSON.parse(localStorage.getItem("users")).users;
  const customers = users.filter(
    (user) => user.role.toLowerCase() === "customer"
  );

  searchInput.addEventListener("input", (e) => {
    if (e.target.value) {
      filteredCustomers = customers.filter(
        (customer) =>
          customer.username &&
          customer.username.toLowerCase().includes(e.target.value.toLowerCase())
      );
      currentPage = 1;
      renderAllCustomers(filteredCustomers);
      addEditDeleteListeners();
    } else {
      filteredCustomers = [];
      currentPage = 1;
      renderAllCustomers(customers);
      addEditDeleteListeners();
    }
  });
};

const addEditDeleteListeners = () => {
  const tableBody = document.getElementById("customers-table-body");
  if (tableBody) {
    tableBody.removeEventListener("click", handleTableClick);
    tableBody.addEventListener("click", handleTableClick);
  }
};

const handleTableClick = (e) => {
  // Check if edit icon was clicked
  if (
    e.target.classList.contains("editCustomerIcon") ||
    e.target.closest(".editCustomerIcon")
  ) {
    const editIcon = e.target.classList.contains("editCustomerIcon")
      ? e.target
      : e.target.closest(".editCustomerIcon");
    const customerId = editIcon.dataset.id;
    openEditModal(customerId);
    return;
  }

  // Check if delete icon was clicked
  if (
    e.target.classList.contains("deleteCustomerIcon") ||
    e.target.closest(".deleteCustomerIcon")
  ) {
    const deleteIcon = e.target.classList.contains("deleteCustomerIcon")
      ? e.target
      : e.target.closest(".deleteCustomerIcon");
    const customerId = deleteIcon.dataset.id;
    openDeleteModal(customerId);
    return;
  }
};

const openEditModal = (customerId) => {
  const users = JSON.parse(localStorage.getItem("users")).users;
  const customer = users.find(
    (user) =>
      user.id.toString() === customerId.toString() &&
      user.role.toLowerCase() === "customer"
  );

  if (customer) {
    document.getElementById("editCustomerId").value = customer.id;
    document.getElementById("editCustomerUsername").value = customer.username;
    document.getElementById("editCustomerEmail").value = customer.email;
    document.getElementById("editCustomerPhone").value = customer.phone || "";
    document.getElementById("editCustomerAddress").value =
      customer.address || "";

    const editModal = new bootstrap.Modal(
      document.getElementById("editCustomerModal")
    );
    editModal.show();
  }
};

const openDeleteModal = (customerId) => {
  document.getElementById("deleteCustomerId").value = customerId;

  const deleteModal = new bootstrap.Modal(
    document.getElementById("deleteCustomerModal")
  );
  deleteModal.show();
};

const setupSaveCustomerHandler = () => {
  const saveBtn = document.getElementById("saveCustomerChanges");
  if (saveBtn) {
    saveBtn.removeEventListener("click", handleSaveCustomer);
    saveBtn.addEventListener("click", handleSaveCustomer);
  }
};

const handleSaveCustomer = () => {
  const customerId = document.getElementById("editCustomerId").value;
  const username = document.getElementById("editCustomerUsername").value;
  const email = document.getElementById("editCustomerEmail").value;
  const phone = document.getElementById("editCustomerPhone").value;
  const address = document.getElementById("editCustomerAddress").value;

  const usersData = JSON.parse(localStorage.getItem("users"));
  const userIndex = usersData.users.findIndex(
    (user) => user.id.toString() === customerId.toString()
  );

  if (userIndex !== -1) {
    usersData.users[userIndex].username = username;
    usersData.users[userIndex].email = email;
    usersData.users[userIndex].phone = phone;
    usersData.users[userIndex].address = address;

    localStorage.setItem("users", JSON.stringify(usersData));

    RenderCustomers();

    const editModal = bootstrap.Modal.getInstance(
      document.getElementById("editCustomerModal")
    );
    if (editModal) {
      editModal.hide();
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    showToast("Customer updated successfully!", "success");
  }
};

const setupDeleteCustomerHandler = () => {
  const deleteBtn = document.getElementById("confirmDeleteCustomer");
  if (deleteBtn) {
    deleteBtn.removeEventListener("click", handleDeleteCustomer);
    deleteBtn.addEventListener("click", handleDeleteCustomer);
  }
};

const handleDeleteCustomer = () => {
  const customerId = document.getElementById("deleteCustomerId").value;

  const usersData = JSON.parse(localStorage.getItem("users"));
  usersData.users = usersData.users.filter(
    (user) => user.id.toString() !== customerId.toString()
  );
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  localStorage.setItem("users", JSON.stringify(usersData));

  RenderCustomers();

  const deleteModal = bootstrap.Modal.getInstance(
    document.getElementById("deleteCustomerModal")
  );
  if (deleteModal) {
    deleteModal.hide();
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((backdrop) => backdrop.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  showToast("Customer deleted successfully!", "success");

  if (currentUser && currentUser.id.toString() === customerId.toString()) {
    localStorage.removeItem("currentUser");
    router.navigate("/");
  }
};

const setupModalCleanup = () => {
  const editModal = document.getElementById("editCustomerModal");
  const deleteModal = document.getElementById("deleteCustomerModal");

  if (editModal) {
    editModal.addEventListener("hidden.bs.modal", () => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    });
  }

  if (deleteModal) {
    deleteModal.addEventListener("hidden.bs.modal", () => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    });
  }
};

export const initializeCustomers = () => {
  RenderCustomers();
  customersSearch();
  setupSaveCustomerHandler();
  setupDeleteCustomerHandler();
  setupModalCleanup();
  addEditDeleteListeners();
};
