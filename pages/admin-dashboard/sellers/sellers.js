import { showToast } from "../../../actions/showToast.js";
import { router } from "../../../js/router.js";

// Pagination configuration
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let filteredSellers = [];
let allSellers = [];

const sellerCell = (cell) => {
  return `<tr>
    <td class="text-trancate" title="${cell.id}">${cell.id ? cell.id : "N/A"}</td>
    <td class="text-trancate">${cell.username}</td>
    <td class="text-trancate">${cell.email}</td>
    <td class="text-trancate">${cell.phone ? cell.phone : "N/A"}</td>
    <td class="text-trancate">${cell.address ? cell.address : "N/A"}</td>
    <td class="d-flex gap-3 align-items-center">
      <i class="fa-solid fa-trash cursor-pointer deleteIcon" data-id="${
        cell.id
      }"></i>  
      <i class="fa-solid fa-pen-to-square cursor-pointer editIcon" data-id="${
        cell.id
      }"></i>
    </td>
  </tr>`;
};

const renderAllSellers = (sellers) => {
  const tableBody = document.getElementById("sellers-table-body");
  const emptyState = document.getElementById("empty-state");
  const tableWrapper = document.getElementById("table-wrapper");
  const paginationContainer = document.getElementById("pagination-container");

  if (sellers.length === 0) {
    emptyState.style.display = "block";
    tableWrapper.style.display = "none";
    paginationContainer.style.display = "none";
    return;
  }

  emptyState.style.display = "none";
  tableWrapper.style.display = "block";

  const totalPages = Math.ceil(sellers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, sellers.length);
  const paginatedSellers = sellers.slice(startIndex, endIndex);

  tableBody.innerHTML = "";
  paginatedSellers.forEach((seller) => {
    tableBody.innerHTML += sellerCell(seller);
  });

  if (sellers.length > ITEMS_PER_PAGE) {
    paginationContainer.style.display = "flex";
    renderPagination(sellers.length, totalPages);
  } else {
    paginationContainer.style.display = "none";
  }

  addEditDeleteListeners();
};

const renderPagination = (totalItems, totalPages) => {
  const paginationInfo = document.getElementById("pagination-info");
  const paginationControls = document.getElementById("pagination-controls");

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
  paginationInfo.textContent = `Showing ${startItem} to ${endItem} of ${totalItems} entries`;

  let paginationHTML = "";

  paginationHTML += `<button class="page-btn ${
    currentPage === 1 ? "disabled" : ""
  }" ${currentPage === 1 ? "disabled" : ""} id="prev-page">
    <i class="fas fa-chevron-left"></i>
  </button>`;

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
      renderAllSellers(
        filteredSellers.length > 0 ? filteredSellers : allSellers
      );
    });
  });

  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderAllSellers(
        filteredSellers.length > 0 ? filteredSellers : allSellers
      );
    }
  });

  document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderAllSellers(
        filteredSellers.length > 0 ? filteredSellers : allSellers
      );
    }
  });
};

export const RenderSellers = () => {
  const users = JSON.parse(localStorage.getItem("users")).users;
  allSellers = users.filter((user) => user.role.toLowerCase() === "seller");
  filteredSellers = [];
  currentPage = 1;

  renderAllSellers(allSellers);
  addEditDeleteListeners();
};

export const sellersSearch = () => {
  const searchInput = document.getElementById("sellers-search");
  const users = JSON.parse(localStorage.getItem("users")).users;
  const sellers = users.filter((user) => user.role.toLowerCase() === "seller");

  searchInput.addEventListener("input", (e) => {
    if (e.target.value) {
      filteredSellers = sellers.filter(
        (seller) =>
          seller.username &&
          seller.username.toLowerCase().includes(e.target.value.toLowerCase())
      );
      currentPage = 1;
      renderAllSellers(filteredSellers);
      addEditDeleteListeners();
    } else {
      filteredSellers = [];
      currentPage = 1;
      renderAllSellers(sellers);
      addEditDeleteListeners();
    }
  });
};

const addEditDeleteListeners = () => {
  const tableBody = document.getElementById("sellers-table-body");
  if (tableBody) {
    tableBody.removeEventListener("click", handleTableClick);
    tableBody.addEventListener("click", handleTableClick);
  }
};

const handleTableClick = (e) => {
  if (
    e.target.classList.contains("editIcon") ||
    e.target.closest(".editIcon")
  ) {
    const editIcon = e.target.classList.contains("editIcon")
      ? e.target
      : e.target.closest(".editIcon");
    const sellerId = editIcon.dataset.id;
    openEditModal(sellerId);
    return;
  }

  if (
    e.target.classList.contains("deleteIcon") ||
    e.target.closest(".deleteIcon")
  ) {
    const deleteIcon = e.target.classList.contains("deleteIcon")
      ? e.target
      : e.target.closest(".deleteIcon");
    const sellerId = deleteIcon.dataset.id;
    openDeleteModal(sellerId);
    return;
  }
};

const openEditModal = (sellerId) => {
  const users = JSON.parse(localStorage.getItem("users")).users;
  const seller = users.find(
    (user) =>
      user.id.toString() === sellerId.toString() &&
      user.role.toLowerCase() === "seller"
  );

  if (seller) {
    document.getElementById("editSellerId").value = seller.id;
    document.getElementById("editSellerUsername").value = seller.username;
    document.getElementById("editSellerEmail").value = seller.email;
    document.getElementById("editSellerPhone").value = seller.phone || "";
    document.getElementById("editSellerAddress").value = seller.address || "";

    const editModal = new bootstrap.Modal(
      document.getElementById("editSellerModal")
    );
    editModal.show();
  }
};

const openDeleteModal = (sellerId) => {
  document.getElementById("deleteSellerId").value = sellerId;

  const deleteModal = new bootstrap.Modal(
    document.getElementById("deleteSellerModal")
  );
  deleteModal.show();
};

const setupSaveSellerHandler = () => {
  const saveBtn = document.getElementById("saveSellerChanges");
  if (saveBtn) {
    saveBtn.removeEventListener("click", handleSaveSeller);
    saveBtn.addEventListener("click", handleSaveSeller);
  }
};

const handleSaveSeller = () => {
  const sellerId = document.getElementById("editSellerId").value;
  const username = document.getElementById("editSellerUsername").value;
  const email = document.getElementById("editSellerEmail").value;
  const phone = document.getElementById("editSellerPhone").value;
  const address = document.getElementById("editSellerAddress").value;

  const usersData = JSON.parse(localStorage.getItem("users"));
  const userIndex = usersData.users.findIndex(
    (user) => user.id.toString() === sellerId.toString()
  );

  if (userIndex !== -1) {
    usersData.users[userIndex].username = username;
    usersData.users[userIndex].email = email;
    usersData.users[userIndex].phone = phone;
    usersData.users[userIndex].address = address;

    localStorage.setItem("users", JSON.stringify(usersData));

    RenderSellers();

    // Close the modal properly
    const editModal = bootstrap.Modal.getInstance(
      document.getElementById("editSellerModal")
    );
    if (editModal) {
      editModal.hide();
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    // Show success message
    showToast("Seller updated successfully!", "success");
  }
};

// Delete seller
const setupDeleteSellerHandler = () => {
  const deleteBtn = document.getElementById("confirmDeleteSeller");
  if (deleteBtn) {
    deleteBtn.removeEventListener("click", handleDeleteSeller);
    deleteBtn.addEventListener("click", handleDeleteSeller);
  }
};

const handleDeleteSeller = () => {
  const sellerId = document.getElementById("deleteSellerId").value;

  const usersData = JSON.parse(localStorage.getItem("users"));
  usersData.users = usersData.users.filter(
    (user) => user.id.toString() !== sellerId.toString()
  );
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  localStorage.setItem("users", JSON.stringify(usersData));

  // Refresh the table
  RenderSellers();

  // Close the modal properly
  const deleteModal = bootstrap.Modal.getInstance(
    document.getElementById("deleteSellerModal")
  );
  if (deleteModal) {
    deleteModal.hide();
    // Manually remove backdrop if needed
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((backdrop) => backdrop.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  // Show success message
  showToast("Seller deleted successfully!", "success");

  if (currentUser && currentUser.id.toString() === sellerId.toString()) {
    localStorage.removeItem("currentUser");
    router.navigate("/");
  }
};

// Clean up modal backdrops when modals are hidden
const setupModalCleanup = () => {
  const editModal = document.getElementById("editSellerModal");
  const deleteModal = document.getElementById("deleteSellerModal");

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

// Initialize sellers functionality
export const initializeSellers = () => {
  RenderSellers();
  sellersSearch();
  setupSaveSellerHandler();
  setupDeleteSellerHandler();
  setupModalCleanup();
  addEditDeleteListeners();
};
