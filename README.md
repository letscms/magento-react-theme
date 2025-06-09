# LetsCMS Magento React Theme

A modern, React-based front-end theme that integrates with **Magento 2** as the backend. It delivers a clean, responsive, single-page checkout and shopping experience by leveraging Magento's **GraphQL APIs**. Built for performance, flexibility, and an enhanced user journey.

---

## 🌟 Overview

This theme provides a fast and modern storefront for your Magento 2 e-commerce platform. It's designed to be easily customizable and developer-friendly, allowing you to create a unique shopping experience for your customers.

---

## 📦 Features

- ⚡ **Single-Page Checkout**: A seamless and intuitive step-by-step checkout process.
- 🔗 **Magento GraphQL API Integration**: Ensures real-time data synchronization with your Magento backend.
- 🎨 **Responsive & Clean UI**: Built with React and designed to look great on all devices.
- 🛒 **Guest & Logged-In User Checkout**: Supports both guest users and registered customers, with address pre-fill for logged-in users.
- 🎁 **Coupon Code Management**: Allows customers to apply coupon codes with live updates to the order summary.
- 📦 **Real-Time Order Summary**: Dynamically updates cart items, shipping costs, payment details, and discounts.
- 🔒 **Secure Order Placement**: Utilizes GraphQL mutations for secure order processing.
- 💾 **Custom React Hooks & Context API**: For efficient state management and reusable logic.
- 🏠 **Homepage**: Engaging homepage to showcase products and promotions.
- 🛍️ **Category & Product Pages**: Well-structured pages for browsing categories and viewing product details.
- 👤 **Customer Account**: Dedicated sections for order history, address management, and account details.
- 🔍 **Search Functionality**: Allows users to easily find products.
- ❤️ **Wishlist**: Customers can save products to their wishlist.

---

## ⚙️ Tech Stack

- **Frontend**:
    - [React](https://reactjs.org/)
    - [React Router DOM](https://reactrouter.com/) for navigation
    - [Apollo Client](https://www.apollographql.com/docs/react/) for GraphQL communication
    - [TailwindCSS](https://tailwindcss.com/) for styling (easily replaceable with your preferred CSS solution)
    - [SweetAlert2](https://sweetalert2.github.io/) for notifications
- **Backend**:
    - Magento 2 (communicates via GraphQL)
- **Development**:
    - [Vite](https://vitejs.dev/) for fast development and optimized builds
    - [ESLint](https://eslint.org/) for code linting

---

## 🚀 Getting Started

Follow these instructions to get the theme up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)
- A running Magento 2 instance with GraphQL API accessible.

### Installation & Setup

1.  **Clone the repository (or download the theme files):**
    ```bash
    git clone https://github.com/letscms/magento-react-theme.git
    cd magento-react-theme
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

3.  **Configure Magento GraphQL API Endpoint:**
    Create a `.env` file in the root of your project by copying the example or creating a new one:
    ```bash
    cp .env.example .env 
    ```
    If `.env.example` doesn't exist, create `.env` and add the following line, replacing `https://your-magento-site/graphql` with your actual Magento GraphQL endpoint URL:
    ```env
    VITE_MAGENTO_API_URL=https://your-magento-site/graphql
    VITE_BASE_URL=https://your-magento-site/
    ```
    *Note: The variable name is `VITE_MAGENTO_API_URL` because we are using Vite.*

### Running the Development Server

Once the setup is complete, you can start the development server:

Using npm:
```bash
npm run dev
```
Or using yarn:
```bash
yarn dev
```
This will typically start the application on `http://localhost:5173` (or another port if 5173 is busy). Open your browser and navigate to this URL to see the theme in action. The server will automatically reload when you make changes to the code.

### Building for Production

To create an optimized build of the application for deployment:

Using npm:
```bash
npm run build
```
Or using yarn:
```bash
yarn build
```
This command will generate a `dist` folder in your project root, containing the static assets for your theme. You can then deploy this `dist` folder to your preferred hosting provider or integrate it into your Magento deployment process.

---

## 📁 Project Structure

Here's a brief overview of the key directories and files:

```plaintext
public/                 # Static assets (index.html, favicons, etc.)
src/
├── api/                # GraphQL queries, mutations, and Apollo Client setup
├── assets/             # Static assets like images, fonts
├── components/         # Reusable UI components (buttons, forms, layout elements)
│   ├── account/        # Components for customer account sections
│   ├── cart/           # Cart related components
│   ├── category/       # Category listing and filtering components
│   ├── checkout/       # Legacy checkout components (if any)
│   ├── forms/          # Form components (login, registration)
│   ├── layouts/        # Header, Footer, Navbar
│   ├── onePageCheckout/ # Components for the single-page checkout flow
│   ├── product/        # Product cards, details, options, reviews
│   ├── Seo/            # SEO related components
│   └── ui/             # Basic UI elements (Breadcrumbs, Spinners, Modals)
├── constants/          # Application-wide constants (e.g., storage keys)
├── context/            # React Context API for global state (Auth, Cart, Wishlist)
├── graphql/            # GraphQL query and mutation definitions (.gql or .js files)
├── hooks/              # Custom React Hooks for reusable logic (e.g., useAuth, useCart)
├── pages/              # Top-level page components (HomePage, ProductDetailPage, CartPage)
├── routes/             # Application routing configuration (AppRoutes.jsx)
├── styles/             # Global styles, TailwindCSS configuration, component-specific CSS
├── utils/              # Utility functions and helpers
├── App.jsx             # Main React application component (may be main.jsx or App.jsx)
├── main.jsx            # Entry point of the React application
.env                    # Environment variables (MAGENTO_API_URL) - DO NOT COMMIT SENSITIVE KEYS
.gitignore              # Specifies intentionally untracked files that Git should ignore
eslint.config.js        # ESLint configuration
index.html              # Main HTML file (often in public/ or root for Vite)
package.json            # Project metadata, dependencies, and scripts
postcss.config.js       # PostCSS configuration (used by TailwindCSS)
tailwind.config.js      # TailwindCSS configuration
vite.config.js          # Vite build tool configuration
README.md               # This file!
```

---

## 🎨 Customization

This theme is built to be customizable. Here are a few areas you might want to modify:

-   **Styling**:
    -   Modify [`tailwind.config.js`](tailwind.config.js:1) to change theme colors, fonts, spacing, etc.
    -   Update global styles in [`src/styles/index.css`](src/styles/index.css:1) or [`src/styles/App.css`](src/styles/App.css:1).
    -   Customize component-specific styles directly within the component files or their dedicated CSS modules.
-   **Components**:
    -   Modify existing components in the [`src/components/`](src/components/:1) directory.
    -   Create new components to add custom features or sections.
-   **GraphQL Queries**:
    -   Adjust GraphQL queries in [`src/api/`](src/api/:1) or [`src/graphql/`](src/graphql/:1) to fetch different data or modify existing data structures.
-   **Static Content**:
    -   Change text, images, and links directly within the relevant JSX components.
-   **Environment Variables**:
    -   Ensure your [`VITE_MAGENTO_API_URL`](.env:1) in the [`.env`](.env:1) file points to your Magento instance.

---

## 🛒 Checkout Workflow

The single-page checkout process is designed for a smooth user experience:

1.  **Cart Review**: User reviews items in their cart.
2.  **Address Information**:
    -   **Guest Users**: Enter shipping and billing addresses.
    -   **Logged-in Users**: Select from saved addresses or add a new one.
3.  **Shipping Method Selection**: Choose from available shipping options.
4.  **Payment Method Selection**: Select a payment method.
5.  **Apply Coupon (Optional)**: Enter and apply discount codes.
6.  **Order Review**: A final review of all order details (items, addresses, shipping, payment, totals).
7.  **Order Placement**: User confirms and places the order.
8.  **Order Confirmation**: Display of order success message and order details.

All these steps are managed within a single page, with components dynamically updating as the user progresses.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to the development of this theme, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them with clear, descriptive messages.
4.  Push your changes to your forked repository.
5.  Create a pull request to the main repository, detailing the changes you've made.

Please ensure your code adheres to the existing coding style and passes any linting checks.

---
🖥️ Live Demo

👉 Checkout Live Demo:
https://m24bmm.askjitendra.com/pub/theme/index

You can explore the working implementation of this Magento React Theme integrated with a live Magento 2 backend.
Note: Some demo features like order placement or payments might be disabled for security reasons.
---

📑 Final Summary

    Project Name: LetsCMS Magento React Theme

    Demo URL: https://m24bmm.askjitendra.com/pub/theme/index

    Developed By: LetsCMS Pvt Ltd
---

## 📄 License

This project is licensed under the [MIT License](LICENSE.md).

Developed by **LetsCMS Pvt Ltd**.

---

Happy Coding! If you have any questions or run into issues, please feel free to open an issue on the GitHub repository.
