const dasbhoardSidebarContent = {
  customer: [
    {
      path: "/customer-dashboard/profile",
      title: "Profile",
      icon: `<i class="fas fa-user pf-nav-icon"></i>`,
    },
    {
      path: "/customer-dashboard/orders",
      title: "Orders",
      icon: `<i class="fas fa-shopping-bag pf-nav-icon"></i>`,
    },
    {
      path: "/customer-dashboard/update-profile",
      title: "Update Profile",
      icon: `<i class="fas fa-edit pf-nav-icon"></i>`,
    },
  ],
  seller: [
    {
      path: "/seller-dashboard/profile",
      title: "Profile",
    },
    {
      path: "/seller-dashboard/orders",
      title: "Orders",
    },
    {
      path: "/seller-dashboard/update-profile",
      title: "Update Profile",
    },
    {
      path: "/seller-dashboard/order-details",
      title: "Order Details",
    },
  ],
};

export const handleRenderingSideBarLinks = (path) => {
  const sideLinksContainer = document.querySelector(".pf-nav-list");
  const loginedUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!loginedUser) return;
  if (!sideLinksContainer) return;

  const sidebarLinks = dasbhoardSidebarContent[loginedUser.role.toLowerCase()];
  sidebarLinks.forEach((link) => {
    return (sideLinksContainer.innerHTML += `<li class="pf-nav-item">
        <a href=${link.path} class="pf-nav-link ${
      path === link.path ? "active" : ""
    }" data-link data-tab="orders">
          ${link.icon || ""}
          <span class="pf-nav-text">${link.title}</span>
        </a>
      </li>`);
  });
};

/*
  id for container of ALl Dashboards => dashboard-grid 
  id for the container of sidebar =>   pf-sidebar-wrappe
  class for list of links => .pf-nav-list
*/
