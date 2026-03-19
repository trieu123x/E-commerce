# BÁO CÁO ĐỒ ÁN
## HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ (E-COMMERCE)

---

|  |  |
|---|---|
| **Tên đồ án** | Xây dựng Website Thương Mại Điện Tử |
| **Công nghệ** | Next.js, Express.js, PostgreSQL, Sequelize ORM |
| **Thời gian thực hiện** | 2025 - 2026 |

---

## MỤC LỤC

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Phân tích yêu cầu](#2-phân-tích-yêu-cầu)
3. [Kiến trúc hệ thống](#3-kiến-trúc-hệ-thống)
4. [Cơ sở dữ liệu](#4-cơ-sở-dữ-liệu)
5. [Backend – API Server](#5-backend--api-server)
6. [Frontend – Giao diện người dùng](#6-frontend--giao-diện-người-dùng)
7. [Bảo mật hệ thống](#7-bảo-mật-hệ-thống)
8. [Chức năng Admin](#8-chức-năng-admin)
9. [Kết quả và đánh giá](#9-kết-quả-và-đánh-giá)
10. [Kết luận và hướng phát triển](#10-kết-luận-và-hướng-phát-triển)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Giới thiệu

Dự án xây dựng một hệ thống thương mại điện tử (e-commerce) hoàn chỉnh cho phép người dùng mua sắm trực tuyến và quản trị viên quản lý toàn bộ hoạt động của cửa hàng. Hệ thống bao gồm đầy đủ các chức năng của một trang thương mại điện tử hiện đại: từ đăng ký/đăng nhập, duyệt sản phẩm, thêm giỏ hàng, đặt hàng, đến toàn bộ bộ tính năng quản trị như quản lý sản phẩm, danh mục, đơn hàng, người dùng và chương trình khuyến mãi.

### 1.2. Mục tiêu dự án

- Xây dựng một nền tảng mua sắm trực tuyến đầy đủ, thân thiện người dùng.
- Xây dựng hệ thống quản trị (Admin Dashboard) với báo cáo doanh thu và thống kê trực quan.
- Áp dụng kiến trúc đa tầng (Layered Architecture) chuẩn: Frontend ↔ REST API ↔ Database.
- Đảm bảo bảo mật với JWT, mã hóa mật khẩu bcrypt và phân quyền theo vai trò (RBAC).

### 1.3. Phạm vi hệ thống

| Phạm vi | Mô tả |
|---|---|
| **Người dùng** | Đăng ký, đăng nhập, xem/mua sản phẩm, giỏ hàng, đặt hàng, xem lịch sử đơn hàng |
| **Quản trị viên** | Quản lý sản phẩm, danh mục, đơn hàng, người dùng, chương trình sale, báo cáo doanh thu |
| **Hệ thống** | Tự động cập nhật trạng thái sale hết hạn, bảo mật phân quyền, xử lý giao dịch nguyên tử |

---

## 2. PHÂN TÍCH YÊU CẦU

### 2.1. Yêu cầu chức năng

#### 2.1.1. Phía khách hàng (Customer)

| Mã UC | Tên chức năng | Mô tả |
|---|---|---|
| UC01 | Đăng ký tài khoản | Tạo tài khoản mới với email, mật khẩu, họ tên |
| UC02 | Đăng nhập | Xác thực bằng email, mật khẩu; nhận JWT Token |
| UC03 | Xem danh sách sản phẩm | Tìm kiếm, lọc theo danh mục, giá, sắp xếp |
| UC04 | Xem chi tiết sản phẩm | Thông tin, ảnh, đánh giá, giá sau khuyến mãi |
| UC05 | Giỏ hàng | Thêm/xóa/cập nhật số lượng sản phẩm trong giỏ |
| UC06 | Đặt hàng | Chọn địa chỉ giao hàng, xác nhận đơn hàng |
| UC07 | Xem đơn hàng | Lịch sử và chi tiết đơn hàng |
| UC08 | Đánh giá sản phẩm | Viết đánh giá và chấm điểm sau khi mua hàng |
| UC09 | Danh sách yêu thích | Thêm/xóa sản phẩm khỏi danh sách wishlist |
| UC10 | Quản lý tài khoản | Sửa thông tin cá nhân, đổi mật khẩu, địa chỉ |

#### 2.1.2. Phía quản trị viên (Admin)

| Mã UC | Tên chức năng | Mô tả |
|---|---|---|
| UC11 | Dashboard | Thống kê tổng quan: sản phẩm, người dùng, đơn hàng |
| UC12 | Biểu đồ doanh thu | Thống kê doanh thu theo tháng/năm với biểu đồ đường |
| UC13 | Quản lý sản phẩm | Thêm, sửa, xóa (soft delete/hard delete) sản phẩm |
| UC14 | Quản lý danh mục | Tạo, chỉnh sửa, xóa danh mục sản phẩm |
| UC15 | Quản lý đơn hàng | Xem danh sách, cập nhật trạng thái đơn hàng |
| UC16 | Quản lý người dùng | Xem danh sách, khóa/mở khóa tài khoản người dùng |
| UC17 | Quản lý chương trình sale | Tạo/sửa/xóa đợt khuyến mãi, gán sản phẩm vào sale |
| UC18 | Quản lý đánh giá | Duyệt, xóa các đánh giá sản phẩm |
| UC19 | Top sản phẩm | Xem top 10 sản phẩm bán chạy nhất |

### 2.2. Yêu cầu phi chức năng

| Yêu cầu | Chi tiết |
|---|---|
| **Bảo mật** | Mã hóa mật khẩu bcrypt (salt 10), JWT hết hạn sau 7 ngày |
| **Phân quyền** | Role-Based Access Control: admin / user |
| **Hiệu năng** | Phân trang (pagination) cho mọi danh sách lớn |
| **Toàn vẹn dữ liệu** | Sử dụng Sequelize Transaction cho đặt hàng và thao tác phức tạp |
| **Tính sẵn sàng** | Background job tự động cập nhật sale hết hạn mỗi 60 giây |
| **Phản hồi** | REST API trả về chuẩn `{ success, data, message, pagination }` |

---

## 3. KIẾN TRÚC HỆ THỐNG

### 3.1. Kiến trúc tổng thể

Hệ thống được xây dựng theo mô hình **Client-Server 3 tầng** (Three-tier Architecture):

```
┌─────────────────────────────────────────────┐
│           TẦNG TRÌNH BÀY (Presentation)      │
│     Next.js 16  ·  React 19  ·  TailwindCSS  │
│         http://localhost:3000                 │
└───────────────────┬─────────────────────────┘
                    │ HTTP/REST API (Axios)
                    ▼
┌─────────────────────────────────────────────┐
│           TẦNG NGHIỆP VỤ (Business Logic)   │
│         Express.js 5  ·  Node.js            │
│              http://localhost:5000           │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │ Routes   │▶│Controllers│▶│  Services   │ │
│  └──────────┘ └──────────┘ └─────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │   Middleware: JWT · CORS · Auth · RBAC │ │
│  └────────────────────────────────────────┘ │
└───────────────────┬─────────────────────────┘
                    │ Sequelize ORM
                    ▼
┌─────────────────────────────────────────────┐
│           TẦNG DỮ LIỆU (Data Layer)         │
│              PostgreSQL Database             │
│         (13 bảng, quan hệ đầy đủ)           │
└─────────────────────────────────────────────┘
```

### 3.2. Công nghệ sử dụng

#### Frontend

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| Next.js | 16.1.2 | Framework React, SSR/CSR routing |
| React | 19.2.3 | Thư viện UI |
| TailwindCSS | ^4 | Styling utility-first |
| Recharts | ^3.7.0 | Biểu đồ doanh thu, thống kê |
| Lucide React | ^0.575.0 | Bộ icon UI |
| Axios | ^1.13.5 | HTTP Client gọi API |
| Framer Motion | ^12.34.3 | Hiệu ứng animation |
| React Select | ^5.10.2 | Dropdown select nâng cao |

#### Backend

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| Node.js | - | Runtime môi trường chạy |
| Express.js | ^5.2.1 | Web framework |
| Sequelize | ^6.37.7 | ORM quản lý model và query |
| PostgreSQL | - | Hệ quản trị cơ sở dữ liệu quan hệ |
| jsonwebtoken | ^9.0.3 | Tạo và xác thực JWT |
| bcrypt | ^6.0.0 | Mã hóa mật khẩu |
| dotenv | ^17.2.3 | Quản lý biến môi trường |
| cors | ^2.8.6 | Xử lý Cross-Origin Resource Sharing |

---

## 4. CƠ SỞ DỮ LIỆU

### 4.1. Sơ đồ thực thể quan hệ (ERD)

Hệ thống sử dụng **PostgreSQL** với **13 bảng chính**:

```
users ─────────────────────────────────────── orders
 │ (1)                                    (n) │
 │                                            │
 ├──── carts ─── cart_items                   ├──── order_items ─── products
 │         (1:n)         (n:1)                │                  (n:1)
 │                                            │
 ├──── addresses (1:n)                        └──── payments (1:1)
 │
 ├──── wishlists ─── products (n:n)
 │
 └──── reviews ─── products (n:1)

products ─── product_images (1:n)
         ─── categories (n:1)
         ─── sales (n:n via product_sales)
```

### 4.2. Chi tiết các bảng

#### Bảng `users` – Người dùng

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Khóa chính |
| email | VARCHAR | UNIQUE, NOT NULL | Email đăng nhập |
| password_hash | VARCHAR | NOT NULL | Mật khẩu đã mã hóa (bcrypt) |
| full_name | VARCHAR | NOT NULL | Họ tên đầy đủ |
| phone | VARCHAR | - | Số điện thoại |
| role | ENUM | DEFAULT 'user' | Vai trò: `user` / `admin` |
| status | ENUM | DEFAULT 'ACTIVE' | Trạng thái: `ACTIVE` / `LOCKED` |
| created_at | TIMESTAMP | - | Thời gian tạo |

#### Bảng `products` – Sản phẩm

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Khóa chính |
| name | VARCHAR | NOT NULL | Tên sản phẩm |
| description | TEXT | - | Mô tả chi tiết |
| price | DECIMAL(12,2) | NOT NULL | Giá gốc |
| stock | INTEGER | DEFAULT 0 | Số lượng tồn kho |
| category_id | BIGINT | FK → categories | Danh mục |
| status | ENUM | DEFAULT 'ACTIVE' | `ACTIVE` / `INACTIVE` |
| created_at | TIMESTAMP | - | Thời gian tạo |

#### Bảng `orders` – Đơn hàng

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Khóa chính |
| user_id | BIGINT | FK → users | Người đặt hàng |
| shipping_address | TEXT | NOT NULL | Địa chỉ giao hàng |
| total_amount | DECIMAL(12,2) | NOT NULL | Tổng tiền |
| status | ENUM | DEFAULT 'pending' | Trạng thái đơn hàng |
| created_at | TIMESTAMP | - | Thời gian đặt hàng |

> Trạng thái đơn hàng: `pending` → `processing` → `shipped` → `delivered` / `cancelled` / `COMPLETED`

#### Bảng `sales` – Chương trình khuyến mãi

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Khóa chính |
| name | VARCHAR | NOT NULL | Tên đợt sale |
| description | TEXT | - | Mô tả |
| discount_type | VARCHAR | NOT NULL | `percent` / `fixed` |
| discount_value | DECIMAL | NOT NULL | Giá trị giảm |
| start_date | DATE | - | Ngày bắt đầu |
| end_date | DATE | - | Ngày kết thúc |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |

#### Bảng `product_images` – Ảnh sản phẩm

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT | Khóa chính |
| product_id | BIGINT | FK → products |
| image_url | VARCHAR | URL ảnh |
| is_main | BOOLEAN | Ảnh chính hay phụ |

### 4.3. Các quan hệ chính

| Quan hệ | Loại | Mô tả |
|---|---|---|
| User ↔ Order | 1:N | Người dùng có nhiều đơn hàng |
| Order ↔ OrderItem | 1:N | Đơn hàng chứa nhiều sản phẩm |
| Product ↔ Sale | N:N | Sản phẩm thuộc nhiều đợt sale, thông qua `product_sales` |
| User ↔ Cart | 1:1 | Mỗi người dùng có 1 giỏ hàng |
| Product ↔ Review | 1:N | Sản phẩm nhận nhiều đánh giá |
| User ↔ Wishlist | 1:N | Người dùng có danh sách yêu thích |
| Order ↔ Payment | 1:1 | Mỗi đơn hàng có 1 thanh toán |

---

## 5. BACKEND – API SERVER

### 5.1. Cấu trúc thư mục

```
backend/
├── models/                    # Định nghĩa Sequelize Models
│   ├── index.js               # Khởi tạo DB và associations
│   ├── user.model.js
│   ├── product.model.js
│   ├── productImage.model.js
│   ├── order.model.js
│   ├── orderItem.model.js
│   ├── cart.model.js
│   ├── cartItem.model.js
│   ├── sale.model.js
│   ├── productSale.model.js
│   ├── review.model.js
│   ├── wishlist.model.js
│   ├── payment.model.js
│   └── address.model.js
│
└── src/
    ├── server.js              # Entry point, lắng nghe port + background job
    ├── app.js                 # Cấu hình Express, đăng ký routes
    ├── config/
    │   └── db.js              # Kết nối PostgreSQL
    ├── middlewares/
    │   ├── auth.middleware.js # Xác thực JWT
    │   └── role.middlewares.js# Phân quyền RBAC
    ├── controllers/           # Business logic
    │   ├── auth.controller.js
    │   ├── products.controller.js
    │   ├── cart.controller.js
    │   ├── order.controller.js
    │   ├── sale.controller.js
    │   ├── review.controller.js
    │   ├── wishlist.controller.js
    │   ├── category.controller.js
    │   ├── address.controller.js
    │   └── users.controller.js
    └── routes/
        ├── auth.routes.js
        ├── products.routes.js
        ├── cart.routes.js
        ├── order.routes.js
        ├── sale.routes.js
        ├── wishlist.routes.js
        ├── category.routes.js
        ├── address.routes.js
        └── admin/
            ├── index.js       # Admin router (authMiddleware + authorize admin)
            ├── products.routes.js
            ├── orders.routes.js
            ├── users.routes.js
            ├── reviews.routes.js
            ├── category.routes.js
            └── sale.routes.js
```

### 5.2. Danh sách API Endpoints

#### Xác thực – `/api/auth`

| Phương thức | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Đăng ký tài khoản mới | ✗ |
| POST | `/api/auth/login` | Đăng nhập, nhận JWT token | ✗ |
| GET | `/api/auth/me` | Lấy thông tin người dùng hiện tại | ✓ |
| PUT | `/api/auth/profile` | Cập nhật họ tên, số điện thoại | ✓ |
| PUT | `/api/auth/change-password` | Đổi mật khẩu | ✓ |

#### Sản phẩm – `/api/products`

| Phương thức | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/products` | Lấy danh sách sản phẩm (search, filter, sort, page) | ✗ |
| GET | `/api/products/:id` | Chi tiết sản phẩm kèm ảnh, sale, đánh giá | ✗ |

#### Giỏ hàng – `/api/cart`

| Phương thức | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/cart` | Lấy giỏ hàng hiện tại |
| POST | `/api/cart/add` | Thêm sản phẩm vào giỏ |
| PUT | `/api/cart/items/:itemId` | Cập nhật số lượng |
| DELETE | `/api/cart/items/:itemId` | Xóa một sản phẩm khỏi giỏ |
| DELETE | `/api/cart/clear` | Xóa toàn bộ giỏ hàng |
| GET | `/api/cart/count` | Đếm số sản phẩm trong giỏ |

#### Đơn hàng – `/api/order`

| Phương thức | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/order` | Tạo đơn hàng (mua ngay hoặc từ giỏ hàng) |
| GET | `/api/order/your-order` | Lịch sử đơn hàng của người dùng |
| GET | `/api/order/your-order/:id` | Chi tiết đơn hàng |

#### Chương trình Sale – `/api/sales`

| Phương thức | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/sales` | Lấy tất cả sale |
| GET | `/api/sales/active` | Lấy các sale đang hoạt động |
| GET | `/api/sales/:id` | Chi tiết sale kèm sản phẩm |

#### Admin – `/api/admin` (Cần role: admin)

| Phương thức | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/products` | Danh sách sản phẩm (hỗ trợ filter/search/sort) |
| POST | `/api/admin/products` | Tạo sản phẩm mới |
| PUT | `/api/admin/products/:id` | Cập nhật sản phẩm |
| DELETE | `/api/admin/products/:id` | Ẩn sản phẩm (soft delete) |
| DELETE | `/api/admin/products/:id/permanent` | Xóa vĩnh viễn |
| GET | `/api/admin/products/stats?year=Y` | Thống kê doanh thu theo tháng/năm |
| GET | `/api/admin/products/top-products` | Top 10 sản phẩm bán chạy |
| GET | `/api/admin/products/dashboard` | Tổng quan nhanh (đếm sản phẩm, user, đơn hàng) |
| GET/PUT/DELETE | `/api/admin/orders` | Quản lý đơn hàng |
| GET/PUT | `/api/admin/users` | Danh sách user, khóa/mở khóa |
| GET/POST/DELETE | `/api/admin/sales` | Quản lý chương trình sale |
| POST | `/api/admin/sales/:id/products` | Gán sản phẩm vào sale |
| GET/DELETE | `/api/admin/reviews` | Quản lý đánh giá |
| GET/POST/PUT/DELETE | `/api/admin/categories` | Quản lý danh mục |

### 5.3. Xử lý đặt hàng (Luồng chính)

Đặt hàng là một nghiệp vụ phức tạp, được xử lý hoàn toàn trong **Sequelize Transaction** đảm bảo tính toàn vẹn:

```
1. Nhận yêu cầu đặt hàng (items + address_id)
2. Kiểm tra địa chỉ giao hàng tồn tại và thuộc user
3. Với mỗi sản phẩm trong đơn:
   a. Lock row (SELECT FOR UPDATE) chống oversell
   b. Lấy sale đang active → tính giá sau giảm
   c. Kiểm tra đủ tồn kho
4. Tạo bản ghi Order
5. Tạo OrderItems (bulk)
6. Trừ stock của từng sản phẩm
7. COMMIT transaction → thành công
   Nếu lỗi → ROLLBACK → không có gì thay đổi
```

### 5.4. Background Job – Tự động cập nhật Sale hết hạn

Hệ thống chạy một **background interval** mỗi 60 giây để tự động đặt `is_active = false` cho các sale đã qua `end_date`:

```javascript
setInterval(async () => {
  const result = await db.Sale.update(
    { is_active: false },
    { where: { is_active: true, end_date: { [Op.lt]: now } } }
  );
}, 60 * 1000);
```

---

## 6. FRONTEND – GIAO DIỆN NGƯỜI DÙNG

### 6.1. Cấu trúc thư mục

```
src/app/
├── layout.js                 # Root layout (AuthContext)
├── page.js                   # Trang chủ
├── globals.css               # CSS toàn cục
│
├── context/
│   └── authContext.js        # Context lưu trữ user, token toàn cục
│
├── api/
│   └── axios.js              # Cấu hình Axios, interceptor gắn token
│
├── component/                # Shared components
│   ├── navbar/
│   ├── footer/
│   └── ...
│
├── login/page.js             # Đăng nhập
├── signup/page.js            # Đăng ký
├── products/page.js          # Trang danh sách sản phẩm
├── productDetail/[id]/page.js # Chi tiết sản phẩm
├── cart/page.js              # Giỏ hàng
├── checkout/page.js          # Thanh toán
├── completed/page.js         # Xác nhận đặt hàng thành công
├── your-order/page.js        # Lịch sử đơn hàng
├── order/[id]/page.js        # Chi tiết đơn hàng
├── wishlist/page.js          # Danh sách yêu thích
├── account/page.js           # Hồ sơ cá nhân
├── about/page.js             # Giới thiệu
├── contact/page.js           # Liên hệ
│
└── admin/                    # Admin pages (role: admin)
    ├── page.js               # Admin Dashboard
    ├── products/page.js      # Quản lý sản phẩm
    ├── categories/page.js    # Quản lý danh mục
    ├── orders/page.js        # Quản lý đơn hàng
    ├── users/page.js         # Quản lý người dùng
    └── sale/page.js          # Quản lý chương trình sale
```

### 6.2. Quản lý xác thực (AuthContext)

Toàn bộ thông tin đăng nhập được quản lý qua React Context (`authContext.js`):

- Lưu `user`, `token` vào `localStorage`
- Tự động gắn token vào header mọi request qua Axios Interceptor
- Kiểm tra role để bảo vệ các trang admin (`user.role === 'admin'`)
- Tự động redirect về `/login` nếu chưa đăng nhập

### 6.3. Trang Admin Dashboard

Trang tổng quan Admin (`/admin`) hiển thị:

#### Thẻ thống kê tổng quan
- **Sản phẩm**: Tổng số sản phẩm đang hoạt động
- **Danh mục**: Tổng số danh mục
- **Người dùng**: Tổng số tài khoản
- **Đơn hàng tháng này**: Số đơn hàng trong tháng hiện tại

#### Biểu đồ doanh thu theo tháng
- Biểu đồ đường (Line Chart) sử dụng thư viện **Recharts**
- Dropdown chọn năm ở góc trên bên phải (range 10 năm)
- Tự động gọi lại API `/admin/products/stats?year=YYYY` khi đổi năm
- Trục Y định dạng tiền tệ: `$1.2M`, `$500K`, v.v.

#### Top 10 sản phẩm bán chạy
- Danh sách kèm thanh progress bar thể hiện tỉ lệ bán
- Hiển thị số lượng bán và doanh thu tương ứng

### 6.4. Trang Quản lý Sale (`/admin/sale`)

Giao diện quản lý chương trình khuyến mãi gồm:

- **Form tạo sale**: Tên, loại giảm giá (%), giá trị, ngày bắt đầu, ngày kết thúc
- **Bảng danh sách sale**: Hiển thị tên, mức giảm, thời gian, trạng thái Active/Inactive
- **Modal quản lý sale**: Chỉnh sửa thông tin sale (kèm select `is_active`), gán/xóa sản phẩm ra khỏi sale với phân trang

---

## 7. BẢO MẬT HỆ THỐNG

### 7.1. Xác thực JWT (JSON Web Token)

Khi đăng nhập thành công, server tạo JWT Token chứa:

```json
{
  "id": 1,
  "email": "user@email.com",
  "role": "admin",
  "fullName": "Nguyễn Văn A"
}
```

- **Thuật toán ký**: HS256
- **Thời hạn token**: 7 ngày (`expiresIn: "7d"`)
- **Xác thực**: Middleware [authMiddleware](file:///c:/Users/admin/Downloads/code_web/e-commerce-1/backend/src/middlewares/auth.middleware.js#3-61) bắt và verify token từ header `Authorization: Bearer <token>` trước mọi route cần đăng nhập

### 7.2. Mã hóa mật khẩu bcrypt

```
Mật khẩu gốc → bcrypt.hash(password, 10) → Chuỗi hash lưu DB
Đăng nhập    → bcrypt.compare(input, hash) → true/false
```

- Salt rounds: **10** (đảm bảo mạnh, chịu được brute-force)
- Không bao giờ lưu mật khẩu dạng plaintext

### 7.3. Phân quyền theo vai trò (RBAC)

```javascript
// role.middlewares.js
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
  next();
};
```

- Mọi route `/api/admin/...` đều yêu cầu `role === 'admin'`
- Admin không thể tự khóa chính tài khoản mình

### 7.4. CORS

Cấu hình chỉ cho phép request từ `http://localhost:3000` với `credentials: true`, ngăn các domain lạ truy cập API.

---

## 8. CHỨC NĂNG ADMIN

### 8.1. Quản lý sản phẩm

Trang `/admin/products` cung cấp:

- **Danh sách sản phẩm** với thông tin: tên, giá, tồn kho, danh mục, trạng thái, số lượng đã bán
- **Tìm kiếm** theo tên, lọc theo danh mục, giá, trạng thái
- **Thêm sản phẩm**: Form nhập thông tin + upload nhiều ảnh (URL), chọn ảnh chính
- **Sửa sản phẩm**: Cập nhật thông tin, thay thế ảnh
- **Xóa mềm** (INACTIVE) hoặc **Xóa vĩnh viễn** kèm xóa ảnh liên quan
- **Sắp xếp** theo tên, giá, ngày tạo, số lượng đã bán

### 8.2. Quản lý đơn hàng

- Xem toàn bộ đơn hàng của tất cả khách hàng
- Cập nhật trạng thái: `pending → processing → shipped → delivered / cancelled`
- Xem chi tiết: danh sách sản phẩm, số lượng, giá, địa chỉ giao hàng

### 8.3. Quản lý người dùng

- Danh sách người dùng với email, tên, trạng thái
- Chức năng **khóa / mở khóa tài khoản** (toggle status ACTIVE ↔ LOCKED)
- Người dùng bị khóa không thể đăng nhập

### 8.4. Quản lý Chương trình Sale

Hệ thống hỗ trợ 2 loại giảm giá:

| Loại | Mô tả | Ví dụ |
|---|---|---|
| `percent` | Giảm theo phần trăm | 20% → sản phẩm $100 giảm còn $80 |
| `fixed` | Giảm số tiền cố định | $15 → sản phẩm $100 giảm còn $85 |

Khi nhiều sale áp dụng cho 1 sản phẩm, hệ thống tự động chọn sale cho **giá thấp nhất**.

---

## 9. KẾT QUẢ VÀ ĐÁNH GIÁ

### 9.1. Các chức năng đã hoàn thành

| STT | Chức năng | Trạng thái |
|---|---|---|
| 1 | Đăng ký, đăng nhập, quản lý tài khoản | ✅ Hoàn thành |
| 2 | Hiển thị và tìm kiếm sản phẩm | ✅ Hoàn thành |
| 3 | Giỏ hàng (thêm, sửa, xóa) | ✅ Hoàn thành |
| 4 | Đặt hàng (checkout) với xử lý transaction | ✅ Hoàn thành |
| 5 | Tích hợp giá khuyến mãi vào đơn hàng | ✅ Hoàn thành |
| 6 | Lịch sử đơn hàng & chi tiết | ✅ Hoàn thành |
| 7 | Đánh giá sản phẩm | ✅ Hoàn thành |
| 8 | Danh sách yêu thích (wishlist) | ✅ Hoàn thành |
| 9 | Admin Dashboard với biểu đồ doanh thu | ✅ Hoàn thành |
| 10 | Thống kê doanh thu theo năm (chọn năm) | ✅ Hoàn thành |
| 11 | Quản lý sản phẩm (CRUD + nhiều ảnh) | ✅ Hoàn thành |
| 12 | Quản lý đơn hàng (xem + cập nhật status) | ✅ Hoàn thành |
| 13 | Quản lý người dùng (xem + khóa/mở khóa) | ✅ Hoàn thành |
| 14 | Quản lý chương trình sale | ✅ Hoàn thành |
| 15 | Tự động vô hiệu hoá sale hết hạn | ✅ Hoàn thành |
| 16 | Phân quyền admin/user (RBAC) | ✅ Hoàn thành |
| 17 | Bảo mật JWT + bcrypt | ✅ Hoàn thành |

### 9.2. Đánh giá kỹ thuật

| Tiêu chí | Đánh giá |
|---|---|
| **Kiến trúc** | Rõ ràng, phân tách tầng tốt (Route → Controller → Model) |
| **API Design** | RESTful chuẩn, response JSON nhất quán |
| **Bảo mật** | JWT + bcrypt + RBAC đầy đủ |
| **Toàn vẹn dữ liệu** | Sử dụng Sequelize Transaction cho các nghiệp vụ phức tạp |
| **Scalability** | Phân trang đúng cách cho mọi danh sách |
| **UX** | Biểu đồ Recharts, Framer Motion animation |

---

## 10. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 10.1. Kết luận

Đồ án đã xây dựng thành công một hệ thống thương mại điện tử đầy đủ chức năng, áp dụng các công nghệ hiện đại như **Next.js 16**, **Express.js 5**, **PostgreSQL** và **Sequelize ORM**. Hệ thống đảm bảo bảo mật với JWT và bcrypt, phân quyền rõ ràng với RBAC, và xử lý các nghiệp vụ phức tạp (đặt hàng, thanh toán) bằng database transaction.

Giao diện Admin cung cấp đầy đủ công cụ quản lý với biểu đồ doanh thu trực quan, và hệ thống có cơ chế tự động cập nhật trạng thái sale hết hạn chạy ngầm mỗi phút.

### 10.2. Hướng phát triển

| Hướng | Mô tả |
|---|---|
| **Tích hợp thanh toán thực tế** | Tích hợp VNPay, Momo, Stripe cho thanh toán online |
| **Email thông báo** | Gửi email xác nhận đơn hàng, nhắc nhở qua NodeMailer |
| **Tối ưu hiệu năng** | Thêm Redis cache cho sản phẩm, session |
| **Tìm kiếm nâng cao** | Tích hợp Elasticsearch cho tìm kiếm full-text |
| **PWA / Mobile** | Chuyển đổi thành Progressive Web App hoặc React Native |
| **Deploy & CI/CD** | Deploy lên Vercel (frontend) + Railway/Render (backend) |
| **Kiểm thử** | Viết unit test (Jest) và integration test (Supertest) |
| **Cron job chuyên dụng** | Thay `setInterval` bằng `node-cron` chuyên nghiệp hơn |

---

*Báo cáo được tổng hợp từ mã nguồn dự án. Thời điểm: Tháng 3 năm 2026.*
