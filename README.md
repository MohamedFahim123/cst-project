# CST E-Commerce Platform

A modern, responsive e-commerce web application built with vanilla JavaScript, Bootstrap, and a clean component-based architecture. This project features a multi-role system supporting customers, sellers, and administrators with comprehensive dashboards and functionality.

## 🌟 Features

### 🛍️ **Core E-Commerce Functionality**

- **Product Catalog**: Browse products with advanced filtering and search
- **Shopping Cart**: Add, remove, and manage products with persistent storage
- **Wishlist**: Save favorite products for later
- **Checkout Process**: Secure payment flow with order management
- **Order History**: Track past purchases and order status
- **Product Details**: Detailed product information with image galleries

### 👥 **Multi-Role System**

- **Customer Dashboard**: Order history, profile management, wishlist
- **Seller Dashboard**: Product management, order tracking, sales analytics
- **Admin Dashboard**: User management, system overview, comprehensive controls

### 🔐 **Authentication & Security**

- **User Registration**: Customer and seller registration with validation
- **Secure Login**: Email/password authentication with password visibility toggle
- **Role-Based Access**: Different permissions for customers, sellers, and admins
- **Profile Management**: Update user information and avatars with IndexedDB storage

### 📱 **Responsive Design**

- **Mobile-First**: Optimized for all device sizes
- **Bootstrap Integration**: Professional UI components
- **Custom Theme**: Consistent purple color scheme throughout
- **Sidebar Navigation**: Collapsible mobile-friendly navigation

### 🚀 **Modern Web Technologies**

- **SPA Architecture**: Single Page Application with client-side routing
- **Component System**: Reusable components (navbar, footer, sidebar)
- **IndexedDB**: Modern browser storage for images and data
- **ES6+ JavaScript**: Modern JavaScript features and modules
- **CSS Custom Properties**: Maintainable theming system

## 🛠️ **Tech Stack**

### **Frontend**

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)**: Modules, async/await, classes
- **Bootstrap 5**: Responsive framework and components

### **Storage & Data**

- **localStorage**: User data and preferences
- **IndexedDB**: Image storage and management
- **JSON**: Product catalog and configuration data

### **External Libraries**

- **Font Awesome**: Icon system
- **Swiper.js**: Image carousels and sliders
- **Chart.js**: Dashboard analytics and charts

## 🚀 **Getting Started**

### **Prerequisites**

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (Live Server, HTTP Server, etc.)

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/MohamedFahim123/cst-project.git
   cd cst-project
   ```

2. **Start a local server**

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server

   # Using Live Server (VS Code extension)
   # Right-click index.html → "Open with Live Server"
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### **Default Users**

The application comes with pre-configured users for testing:

**Admin Account:**

- Email: `mohamed@fahim.com`
- Password: `mohamed1`

**Customer Account:**

- Email: `customer@example.com`
- Password: `customer1`

**Seller Account:**

- Email: `seller@example.com`
- Password: `seller12`

## 💻 **Usage**

### **For Customers**

1. **Browse Products**: Visit the shop page to view available products
2. **Search & Filter**: Use the search bar and filters to find specific items
3. **Add to Cart**: Click "Add to Cart" on product pages
4. **Manage Wishlist**: Save products for later viewing
5. **Checkout**: Complete your purchase through the checkout process
6. **View Orders**: Track your order history in the customer dashboard

### **For Sellers**

1. **Register as Seller**: Create a seller account during registration
2. **Manage Products**: Add, edit, and delete your products
3. **View Orders**: Monitor orders for your products
4. **Track Sales**: View sales analytics and performance
5. **Update Profile**: Manage your seller information

### **For Administrators**

1. **User Management**: View and manage all registered users
2. **Product Oversight**: Monitor all products across sellers
3. **Order Management**: View and manage all orders
4. **System Analytics**: Access comprehensive dashboard metrics

### **Adding New Pages**

1. Create page directory in `pages/`
2. Add HTML, CSS, and JS files
3. Register route in `js/router.js`
4. Add navigation links as needed

## 🔧 **Development**

### **Routing**

- Hash-based SPA routing
- Dynamic content loading
- History API integration
- 404 error handling

### **State Management**

- localStorage for user data
- IndexedDB for image storage
- JSON files for static data
- Component-level state

## 🌐 **Deployment**

The project is configured for deployment on Vercel:

```json
{
  "routes": [{ "handle": "filesystem" }, { "src": "/(.*)", "dest": "/index.html" }]
}
```

**Deploy to Vercel:**

```bash
npm i -g vercel
vercel
```

**Manual Deployment:**
Upload all files to your web server maintaining the directory structure.

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🎯 **Roadmap**

- [ ] Real-time notifications
- [ ] Advanced search with suggestions
- [ ] Product reviews and ratings
- [ ] Social media integration
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) features

---

**Built with ❤️ by the CST Development Team**

_Last updated: September 1, 2025_
