# 🛒 xtraMarket - Complete E-Commerce Platform

A premium, full-featured modern E-Commerce web application built using **React 19**, **TypeScript**, and **Vite**, powered by **Redux Toolkit (RTK)** for state management and **Tailwind CSS** for clean, responsive designs. The application features a complete shopper interface (catalog, filters, shopping cart, wishlist, Stripe checkout) coupled with a secure **Admin Panel** for store management, analytics, order tracking, and review moderation.

---

## 🌟 Features

### 🛍️ Client / Shopper Portal
- **Interactive Home & Product Catalog:** Dynamic hero section, carousel blogs, and responsive product cards with hover effects and star ratings.
- **Product Details & Media:** Zoom-enabled product gallery (inner image zoom), comprehensive description, specifications, and client review section.
- **Advanced Filtering & Search:** Category-specific views, pricing sliders, pagination, and real-time query parameters.
- **Shopping Cart & Wishlist:** Real-time persistence, automatic subtotal calculation, and a visual progress indicator showing how close the customer is to unlocking free shipping.
- **Form-Validated Checkout:** Step-by-step checkout details utilizing Yup schema validation and a country selection dropdown search combobox.
- **Stripe Payments Integration:** Real-time secure checkout utilizing Stripe, leading to dynamic payment success and cancellation screens.

### 🛡️ Admin Dashboard (Protected Route)
- **Analytics & Statistics:** Sleek visualizations using **Recharts** charts tracking shop performance (sales metrics, total users, orders).
- **Product Management:** Complete Interface to list, add, edit, and update products including category, stock, tags, and pricing tags.
- **Order Tracking:** Dashboard displaying customer orders with statuses, user details, and actions.
- **Review Moderation:** View and moderate customer product reviews.
- **Route Protection:** Custom middleware (`ProtectedAdminRoute`) checking user roles from auth APIs before granting access.

---

## 🛠️ Technology Stack

| Category | Technology | Usage in Project |
| :--- | :--- | :--- |
| **Core** | React 19, TypeScript, Vite 6 | Application framework, compiler, static typing, and HMR setup |
| **State Management** | Redux Toolkit, RTK Query, Redux Persist | Global store management, API caching, persisted cart/wishlist |
| **Routing** | React Router 7 (`react-router-dom`) | Navigation, standard client routing, and nested admin routing |
| **Styling** | Tailwind CSS v4, PostCSS, Autoprefixer | Modern, mobile-first utility styling and component layout |
| **UI Components** | Radix UI Primitive, Lucide Icons, React Icons | Headless accessible components (Popover, Select, Accordion, etc.) |
| **Animations** | Framer Motion | Smooth page transitions and hover interactions |
| **Validation** | React Hook Form, Yup | Robust validation for checkout, login, and registration forms |
| **Payments** | Stripe Elements & Stripe JS | Secure client-side credit card processing and session handling |
| **Charts** | Recharts | Sales, orders, and review analytics on the admin panel |

---

## 📁 Directory Structure

```text
xtermarket/
├── public/                 # Static assets (images, logos, Lottie animations)
├── src/
│   ├── component/          # Layout, pages, client and admin modules
│   │   ├── admin/          # Admin dashboard, layout, stats, orders, reviews
│   │   ├── Header.tsx      # Main navigation header
│   │   ├── Footer.tsx      # Main footer info
│   │   ├── Home.tsx        # Shopper homepage
│   │   ├── Cart.tsx        # Shopping cart details
│   │   ├── Categories.tsx  # Product catalog and filtering
│   │   ├── Checkoutcart.tsx# Checkout form & Stripe initializer
│   │   ├── Login.tsx       # Auth Login page
│   │   ├── Signup.tsx      # Auth Registration page
│   │   └── Wishlist.tsx    # Customer wishlist
│   ├── components/
│   │   └── ui/             # Reusable UI primitives (buttons, inputs, cards, etc.)
│   ├── hooks/              # Custom React hooks (e.g., use-toast.ts)
│   ├── lib/                # Shared helper functions (e.g., cn utils)
│   ├── store/              # Redux slices, base queries, and RTK Query APIs
│   │   ├── authSlice.tsx   # Login, signup, token refresh mechanisms
│   │   ├── cartSlice.tsx   # Shopping cart sync
│   │   └── index.ts        # Store configuration
│   ├── type/               # Shared TypeScript interfaces
│   ├── App.tsx             # Root router provider
│   ├── Layout.tsx          # Main layout router and route protection
│   ├── main.tsx            # React application mount
│   └── index.css           # Global CSS, Google Fonts, and Tailwind imports
├── tsconfig.json           # TypeScript configuration
├── postcss.config.js       # PostCSS config for CSS preprocessors
├── tailwind.config.js      # Custom utility class overrides & design tokens
└── package.json            # Scripts, dependencies, and devDependencies
```

---

## 🚀 Getting Started

To run **xtraMarket** locally on your machine, follow these simple setup steps:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Clone and Install Dependencies
```bash
# Install package dependencies
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the root directory (or update the existing one) with the backend API service:
```env
VITE_BASE_URL="https://xtramarket-production.up.railway.app/api"
```

### 4. Running the Development Server
Launch the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Building for Production
To build the application for hosting/production deployment:
```bash
npm run build
```
This compiles optimized files to the `/dist` directory. To test the build locally:
```bash
npm run preview
```
