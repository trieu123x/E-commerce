# 🛍️ E-Commerce Platform

A full-stack e-commerce application built with modern web technologies, featuring advanced inventory management, dynamic pricing, and comprehensive analytics.

---

## 📋 Table of Contents
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Core Features](#-core-features)
- [Advanced Features](#-advanced-features)
- [Getting Started](#-getting-started)
- [Skills Demonstrated](#-skills-demonstrated)

---

## ✨ Key Features

### 🎯 Core E-Commerce
- **Product Catalog**: Browse products with filtering, searching, and sorting
- **Shopping Cart**: Add/remove items, manage quantities with real-time updates
- **Order Management**: Create orders, track status, view order history
- **Payment Integration**: COD, VNPay, Stripe payment methods
- **User Accounts**: Authentication, profile management, order history

### 💰 Advanced Pricing
- **Dynamic Sales System**: Create promotions with discount percentages
- **Sale-Based Pricing**: Products automatically show discounted prices during active sales
- **Time-Based Promotions**: Set start/end dates for sales campaigns
- **Real-time Price Updates**: Frontend automatically displays best available price

### 📦 Inventory Management
- **Stock Validation**: 
  - Disable "Buy Now" button when product is out of stock
  - Check cart items stock before checkout
  - Backend validation prevents overselling
- **Real-time Stock Updates**: Stock decreases when orders are placed
- **Out of Stock Alerts**: Users notified with specific error messages

### 📊 Admin Analytics Dashboard
- **Revenue Statistics by Time Period**:
  - Monthly breakdown with year filter
  - Weekly breakdown with month filter
  - Daily breakdown with month filter
- **Payment Method Breakdown**: Visualize COD, VNPay, and Stripe revenue
- **Interactive Charts**: Stacked bar charts with tooltips and legends
- **Category Analytics**: Product counts including child categories

### 👥 User Management
- **Admin Panel**: Manage users, view email/name/role/status/VIP status
- **User Filtering**: Search by email or name in real-time
- **Account Actions**: Lock/unlock users, delete accounts
- **Spending Tracking**: View total spending per user

### ⭐ Advanced Features
- **Wishlist**: Save favorite products for later
- **Product Reviews**: Rate and review purchased products
- **Rating System**: View product ratings and reviews from other users
- **VIP Program**: Track VIP status and benefits
- **Address Management**: Multiple delivery addresses with default selection

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 13+**: React framework with App Router
- **React Hooks**: State management (useState, useContext)
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Interactive data visualization and charts
- **Axios**: HTTP client for API requests
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Icon library

### Backend
- **Node.js + Express.js**: REST API server
- **Sequelize 6.37.7**: ORM for database queries
- **PostgreSQL**: Relational database
- **JWT**: Authentication and authorization
- **Bcrypt**: Password hashing and security
- **Stripe & VNPay**: Payment gateway integration

### Database
- **PostgreSQL**: Main database
- **Relationships**: Complex associations between users, products, orders, payments
- **Migrations**: Version control for database schema changes

---

## 🏗️ Architecture

### Project Structure
```
e-commerce-1/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # API endpoints
│   │   ├── middlewares/     # Authentication, authorization
│   │   ├── migrations/      # Database schema changes
│   │   └── app.js           # Express app setup
│   └── models/              # Sequelize ORM models
├── src/app/                 # Next.js frontend
│   ├── admin/               # Admin dashboard
│   ├── productDetail/       # Product page
│   ├── order/               # Order & checkout pages
│   ├── cart/                # Shopping cart
│   ├── component/           # Reusable components
│   └── context/             # React context (Auth, Cart)
└── database/                # SQL seeds and schemas
```

### API Endpoints

**Products**
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Product details
- `GET /api/products/top-products` - Top selling products

**Orders**
- `POST /api/order` - Create order (buyNow or cart)
- `GET /api/order/your-order` - User's orders
- `GET /api/order/your-order/:id` - Order details

**Admin Analytics**
- `GET /api/admin/products/stats` - Monthly revenue
- `GET /api/admin/products/stats-weekly` - Weekly revenue
- `GET /api/admin/products/stats-daily` - Daily revenue
- `GET /api/admin/products/stats-sales` - Sales-based product revenue

**Cart**
- `POST /api/cart` - Add to cart
- `GET /api/cart` - Get cart items
- `DELETE /api/cart/:id` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

---

## 🎯 Core Features in Detail

### 1. Product Management
- Filter by category, price range, status
- Sort by created date, popularity, sold quantity
- View product images, descriptions, prices
- Real-time sold quantity tracking
- Sale badge display for discounted products

### 2. Shopping Cart
- Add/remove items with quantity control
- Real-time price calculation
- Cart persistence in context
- Check stock before adding
- Visual cart count in header

### 3. Order Processing
- Select multiple payment methods
- Choose delivery address
- Order validation and confirmation
- Automatic stock deduction
- Order status tracking (PENDING, COMPLETED, etc.)

### 4. Payment Integration
- COD (Cash on Delivery): Instant order confirmation
- VNPay: Vietnamese payment gateway
- Stripe: International credit/debit card payments
- Payment status tracking per order

---

## 🚀 Advanced Features in Detail

### Revenue Analytics System
**Three-Level Time Analysis:**
1. **Monthly View** - Full year breakdown by month
2. **Weekly View** - Monthly breakdown into weeks
3. **Daily View** - Monthly breakdown into daily reports

**Features:**
- Stacked bar chart showing payment method distribution
- Color-coded: Green (COD), Blue (VNPay), Purple (Stripe)
- Hover tooltips showing exact amounts
- Responsive to filter changes
- Proper date ordering with SQL aggregation

### Stock Validation Pipeline
**Frontend Layer:**
- Product page: Disable buy buttons when out of stock
- Cart page: Validate total quantity matches available stock
- Clear error messages with exact stock remaining

**Backend Layer:**
- Database transaction safety with row-level locking
- Atomic stock updates with order creation
- Prevent race conditions with locks

### Dynamic Pricing System
**Workflow:**
1. Product has base price
2. Admin creates sale with discount percentage
3. Products linked to sale
4. Frontend displays `price_after` automatically
5. Orders use sale price if valid time period

---

## 📈 Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Installation

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Frontend:**
```bash
npm install
npm run dev
```

### Database Setup
```bash
npm run migrate
```

---

## 💻 Skills Demonstrated

### Backend Development
- ✅ **RESTful API Design** - Proper endpoint structure and HTTP methods
- ✅ **Database Design** - Complex relationships, proper normalization
- ✅ **ORM Expertise** - Advanced Sequelize queries, transactions, associations
- ✅ **Authentication** - JWT tokens, middleware authorization, role-based access
- ✅ **Business Logic** - Payment processing, order management, inventory control
- ✅ **Error Handling** - Comprehensive error messages, proper HTTP status codes
- ✅ **Database Migrations** - Version control for schema changes
- ✅ **Query Optimization** - Proper indexing, efficient SQL queries
- ✅ **Transaction Management** - ACID properties, row-level locking

### Frontend Development
- ✅ **React Hooks** - useState, useContext for state management
- ✅ **Next.js App Router** - Modern routing and SSR capabilities
- ✅ **Component Architecture** - Reusable, maintainable components
- ✅ **Data Visualization** - Recharts for interactive analytics
- ✅ **Form Handling** - Input validation, error messages
- ✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- ✅ **API Integration** - Axios for backend communication
- ✅ **State Management** - Context API for global state
- ✅ **Animation** - Framer Motion for smooth transitions

### Full-Stack Skills
- ✅ **System Design** - Scalable architecture with separation of concerns
- ✅ **Payment Integration** - Multiple payment gateway support (COD, VNPay, Stripe)
- ✅ **Real-time Updates** - Stock validation, price calculations
- ✅ **Data Analytics** - Revenue tracking, business insights dashboard
- ✅ **Security** - Password hashing, JWT authentication, input validation
- ✅ **Problem Solving** - Fixed ordering bugs, implemented complex features
- ✅ **Code Quality** - Clean code, meaningful variable names, DRY principles
- ✅ **Database Optimization** - Query tuning, proper joins, aggregation functions

### Advanced Concepts
- **Transaction Management**: Database transactions for atomic operations
- **Stock Locking**: Row-level locking to prevent overselling
- **Time-Based Logic**: Sales with start/end dates, automatic price calculations
- **Aggregation Queries**: Complex GROUP BY for multi-level analytics
- **Error Recovery**: Proper transaction rollback on failure
- **Concurrency Control**: Prevent race conditions with database locks

---

## 📊 Project Statistics

- **Total API Endpoints**: 40+
- **Database Tables**: 14
- **Components**: 30+
- **Features Implemented**: 20+
- **Payment Methods**: 3
- **Admin Features**: 5
- **Analytics Views**: 3 (Monthly/Weekly/Daily)

---

## 🔮 Future Enhancements

- [ ] Email notifications for orders
- [ ] Inventory alerts for low stock
- [ ] Advanced search with Elasticsearch
- [ ] Product recommendations
- [ ] Refund/return management
- [ ] Bulk import products
- [ ] Email marketing campaigns
- [ ] Mobile app (React Native)

---

## 📝 License

This project is part of a portfolio demonstration.

---

**Built with ❤️ for modern e-commerce**
