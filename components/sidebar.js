import imageDB from "../actions/indexedDB.js";

const dasbhoardSidebarContent = {
  customer: [
    {
      path: "/customer-dashboard/profile",
      title: "Profile",
      icon: `<i class="fas fa-user pf-nav-icon"></i>`,
    },
    {
      path: "/customer-dashboard/update-profile",
      title: "Update Profile",
      icon: `<i class="fas fa-edit pf-nav-icon"></i>`,
    },
    {
      path: "/customer-dashboard/orders",
      title: "Orders",
      icon: `<i class="fas fa-shopping-bag pf-nav-icon"></i>`,
    },
  ],
  seller: [
    {
      path: "/seller-dashboard/dashboard",
      icon: `<i class="fa-solid fa-chart-bar pf-nav-icon"></i>`,
      title: "Dashboard",
    },
    {
      path: "/seller-dashboard/profile",
      icon: `<i class="fas fa-user pf-nav-icon"></i>`,
      title: "Profile",
    },
    {
      path: "/seller-dashboard/update-profile",
      icon: `<i class="fas fa-edit pf-nav-icon"></i>`,
      title: "Update Profile",
    },
    {
      path: "/seller-dashboard/orders",
      icon: `<i class="fas fa-shopping-bag pf-nav-icon"></i>`,
      title: "Orders",
    },
    {
      path: "/seller-dashboard/my-products",
      icon: `<i class="fa-solid fa-box  pf-nav-icon"></i>`,
      title: "My Products",
    },
    {
      path: "/seller-dashboard/booked-orders",
      icon: `<i class="fas fa-shopping-bag pf-nav-icon"></i>`,
      title: "Booked Orders",
    },
  ],
  admin: [
    {
      path: "/admin-dashboard/dashboard",
      icon: `<i class="fa-solid fa-chart-bar pf-nav-icon"></i>`,
      title: "Dashboard",
    },
    {
      path: "/admin-dashboard/profile",
      icon: `<i class="fas fa-user pf-nav-icon"></i>`,
      title: "Profile",
    },
    {
      path: "/admin-dashboard/update-profile",
      icon: `<i class="fas fa-edit pf-nav-icon"></i>`,
      title: "Update Profile",
    },
    {
      path: "/admin-dashboard/orders",
      icon: `<i class="fas fa-shopping-bag pf-nav-icon"></i>`,
      title: "Orders",
    },
    {
      path: "/admin-dashboard/sellers",
      icon: `<i class="fa-solid fa-shop pf-nav-icon"></i>`,
      title: "Sellers",
    },
    {
      path: "/admin-dashboard/customers",
      icon: `<i class="fa-solid fa-users pf-nav-icon"></i>`,
      title: "Customers",
    },
    {
      path: "/admin-dashboard/add-new-user",
      icon: `<i class="fa-solid fa-user-plus pf-nav-icon"></i>`,
      title: "Add New User",
    },
    {
      path: "/admin-dashboard/products",
      icon: `<i class="fa-solid fa-box  pf-nav-icon"></i>`,
      title: "Products",
    },
  ],
};

export function renderSidebarUserInfo() {}
export const handleRenderingSideBarLinks = async (path) => {
  const loginedUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!loginedUser) return;

  const sidebarName = document.querySelector("#pf-sidebar-name");
  const sidebarEmail = document.querySelector("#pf-sidebar-email");
  const avatarImage = document.querySelector("#pf-avatar-img");
  const sideLinksContainer = document.querySelector(".pf-nav-list");

  if (!sideLinksContainer || !sidebarName || !sidebarEmail || !avatarImage) return;

  // Render User Info
  sidebarName.textContent = loginedUser.username;
  sidebarEmail.textContent = loginedUser.email;
  avatarImage.src = (await imageDB.getImageBlobUrl(loginedUser.avatar)) || "../../assets/avatar.jpg";

  // Render Side List
  const sidebarLinks = dasbhoardSidebarContent[loginedUser.role.toLowerCase()];
  sidebarLinks.forEach((link) => {
    return (sideLinksContainer.innerHTML += `
      <li class="pf-nav-item">
        <a href=${link.path} class="pf-nav-link ${
      path === link.path ? "active" : ""
    }" data-link data-tab="orders">
          ${link.icon || ""}
          <span class="pf-nav-text">${link.title}</span>
        </a>
      </li>`);
  });
};
