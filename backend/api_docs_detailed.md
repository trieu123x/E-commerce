# API Documentation (Enriched)

This document contains an automatically generated list of all API routes found in the backend, including middlewares and inputs.

| Category | Method | Endpoint | Middlewares | Inputs (req.body/params/query) |
| -------- | ------ | -------- | ----------- | ------------------------------ |
| address | `POST` | `/api/address` | authMiddleware | - |
| address | `GET` | `/api/address` | authMiddleware | - |
| address | `GET` | `/api/address/:id` | authMiddleware | - |
| address | `PUT` | `/api/address/:id` | authMiddleware | - |
| address | `DELETE` | `/api/address/:id` | authMiddleware | - |
| address | `PUT` | `/api/address/:id/set-default` | authMiddleware | - |
| admin/admin | `GET` | `/api/admin/admin/dashboard` | authMiddleware, authorize(admin | - |
| admin/admin | `GET` | `/api/admin/admin/top-products` | authMiddleware, authorize(admin | **Query:** limit |
| admin/admin | `GET` | `/api/admin/admin/users` | authMiddleware, authorize(admin | - |
| admin/admin | `PUT` | `/api/admin/admin/users/:id/toggle-lock` | authMiddleware, authorize(admin | **Params:** id |
| admin/category | `POST` | `/api/admin/category` | - | **Params:** id<br>**Body:** name, parent_id |
| admin/category | `GET` | `/api/admin/category` | - | **Params:** id<br>**Body:** name, parent_id |
| admin/category | `GET` | `/api/admin/category/:id` | - | **Params:** id<br>**Body:** name, parent_id, move_to_category_id |
| admin/category | `PUT` | `/api/admin/category/:id` | - | **Params:** id<br>**Body:** name, parent_id, move_to_category_id |
| admin/category | `DELETE` | `/api/admin/category/:id` | - | **Params:** id<br>**Body:** move_to_category_id |
| admin/category | `GET` | `/api/admin/category/:id/check-delete` | - | **Params:** id |
| admin/index | `GET` | `/api/admin/index/top-products` | authMiddleware, authorize(admin, /categories, categoryRoutes, /products, productsRoutes, /orders, ordersRoutes, /reviews, reviewsRoutes, /users, usersRoutes, /sales, saleRoutes | **Query:** limit |
| admin/index | `GET` | `/api/admin/index/users` | authMiddleware, authorize(admin, /categories, categoryRoutes, /products, productsRoutes, /orders, ordersRoutes, /reviews, reviewsRoutes, /users, usersRoutes, /sales, saleRoutes | - |
| admin/index | `PUT` | `/api/admin/index/users/:id/toggle-lock` | authMiddleware, authorize(admin, /categories, categoryRoutes, /products, productsRoutes, /orders, ordersRoutes, /reviews, reviewsRoutes, /users, usersRoutes, /sales, saleRoutes | **Params:** id |
| admin/orders | `GET` | `/api/admin/orders` | - | **Query:** page, limit, status, search |
| admin/orders | `GET` | `/api/admin/orders/:id` | - | **Params:** id |
| admin/orders | `PATCH` | `/api/admin/orders/:id` | - | **Params:** id<br>**Body:** status |
| admin/orders | `DELETE` | `/api/admin/orders/:id` | - | **Params:** id |
| admin/products | `GET` | `/api/admin/products` | - | **Query:** page, limit, search, category_id, min_price, max_price, status, sort_by, sort_order |
| admin/products | `POST` | `/api/admin/products` | - | **Body:** name, description, price, stock, category_id, images |
| admin/products | `GET` | `/api/admin/products/:id` | - | **Params:** id |
| admin/products | `PUT` | `/api/admin/products/:id` | - | **Params:** id<br>**Body:** name, description, price, stock, category_id, status, images // Mảng URL ảnh mới (nếu có sẽ thay thế toàn bộ ảnh cũ) |
| admin/products | `DELETE` | `/api/admin/products/:id` | - | **Params:** id |
| admin/products | `POST` | `/api/admin/products/:id/images` | - | **Params:** id<br>**Body:** images |
| admin/products | `DELETE` | `/api/admin/products/:id/images/:imageId` | - | **Params:** id, imageId |
| admin/products | `PUT` | `/api/admin/products/:id/images/:imageId/set-main` | - | **Params:** id, imageId |
| admin/products | `DELETE` | `/api/admin/products/:id/permanent` | - | **Params:** id |
| admin/products | `DELETE` | `/api/admin/products/:id/permanent` | - | **Params:** id |
| admin/products | `PATCH` | `/api/admin/products/:id/status` | - | **Params:** id<br>**Body:** status |
| admin/products | `PUT` | `/api/admin/products/:id/stock` | - | **Params:** id<br>**Body:** stock |
| admin/products | `GET` | `/api/admin/products/dashboard` | - | - |
| admin/products | `GET` | `/api/admin/products/stats` | - | **Query:** year |
| admin/products | `GET` | `/api/admin/products/top-products` | - | **Query:** limit |
| admin/reviews | `GET` | `/api/admin/reviews` | - | **Query:** page, limit, rating, product_id, search |
| admin/reviews | `GET` | `/api/admin/reviews/:id` | - | **Params:** id |
| admin/reviews | `PUT` | `/api/admin/reviews/:id` | - | **Params:** id<br>**Body:** rating, comment |
| admin/reviews | `DELETE` | `/api/admin/reviews/:id` | - | **Params:** id |
| admin/sale | `POST` | `/api/admin/sale` | - | **Params:** id<br>**Body:** name, description, discount_type, discount_value, start_date, end_date, is_active |
| admin/sale | `GET` | `/api/admin/sale` | - | **Params:** id |
| admin/sale | `GET` | `/api/admin/sale/:id` | - | **Params:** id |
| admin/sale | `PUT` | `/api/admin/sale/:id` | - | **Params:** id, saleId<br>**Body:** productIds |
| admin/sale | `DELETE` | `/api/admin/sale/:id` | - | **Params:** id, saleId<br>**Body:** productIds |
| admin/sale | `DELETE` | `/api/admin/sale/:saleId/:productId` | - | **Params:** saleId, productId |
| admin/sale | `POST` | `/api/admin/sale/:saleId/products` | - | **Params:** saleId<br>**Body:** productIds |
| admin/sale | `GET` | `/api/admin/sale/active` | - | **Params:** saleId, productId |
| admin/users | `GET` | `/api/admin/users` | - | **Query:** page, limit, role, status, search |
| admin/users | `GET` | `/api/admin/users/:id` | - | **Params:** id |
| admin/users | `PUT` | `/api/admin/users/:id` | - | **Params:** id<br>**Body:** full_name, phone |
| admin/users | `DELETE` | `/api/admin/users/:id` | - | **Params:** id |
| admin/users | `PATCH` | `/api/admin/users/:id/lock` | - | **Params:** id |
| admin/users | `PATCH` | `/api/admin/users/:id/role` | - | **Params:** id<br>**Body:** role |
| admin/users | `PATCH` | `/api/admin/users/:id/unlock` | - | **Params:** id |
| auth | `PUT` | `/api/auth/change-password` | authMiddleware | **Body:** currentPassword, newPassword |
| auth | `POST` | `/api/auth/login` | - | **Body:** email, password, fullName, phone |
| auth | `GET` | `/api/auth/me` | authMiddleware | **Body:** fullName, phone, currentPassword, newPassword |
| auth | `PUT` | `/api/auth/profile` | authMiddleware | **Body:** fullName, phone, currentPassword, newPassword |
| auth | `POST` | `/api/auth/register` | - | **Body:** email, password, fullName |
| cart | `GET` | `/api/cart` | authMiddleware | - |
| cart | `POST` | `/api/cart/add` | authMiddleware | **Body:** productId, quantity |
| cart | `DELETE` | `/api/cart/clear` | authMiddleware | - |
| cart | `GET` | `/api/cart/count` | authMiddleware | - |
| cart | `PUT` | `/api/cart/items/:itemId` | authMiddleware | **Params:** itemId<br>**Body:** quantity |
| cart | `DELETE` | `/api/cart/items/:itemId` | authMiddleware | **Params:** itemId |
| category | `GET` | `/api/category` | - | **Params:** id<br>**Body:** name, parent_id |
| category | `GET` | `/api/category/:id` | - | **Params:** id<br>**Body:** name, parent_id, move_to_category_id |
| category | `GET` | `/api/category/parents` | - | - |
| customer | `PUT` | `/api/customer/change-password` | authMiddleware, authorize(admin, customer | **Body:** currentPassword, newPassword |
| customer | `GET` | `/api/customer/profile` | authMiddleware, authorize(admin, customer | - |
| customer | `PUT` | `/api/customer/profile` | authMiddleware, authorize(admin, customer | **Body:** fullName, phone |
| customer | `GET` | `/api/customer/profile/detail` | authMiddleware, authorize(admin, customer | - |
| customer | `GET` | `/api/customer/test` | authMiddleware, authorize(admin, customer | - |
| order | `POST` | `/api/order` | authMiddleware | **Query:** page, limit, sort_by, sort_order<br>**Body:** product_id, quantity, address_id, items, payment_method |
| order | `GET` | `/api/order/your-order` | authMiddleware | **Params:** id<br>**Query:** page, limit, sort_by, sort_order |
| order | `GET` | `/api/order/your-order/:id` | authMiddleware | **Params:** id |
| payment | `POST` | `/api/payment/momo/create` | express.json(, authMiddleware | **Query:** resultCode, orderId<br>**Body:** orderId, redirectUrl, resultCode |
| payment | `POST` | `/api/payment/momo/ipn` | express.json( | **Body:** orderId, resultCode, bankCode |
| payment | `GET` | `/api/payment/momo/return` | express.json( | **Query:** resultCode, orderId<br>**Body:** orderId, resultCode, bankCode |
| payment | `POST` | `/api/payment/stripe/create` | express.json(, authMiddleware | **Body:** orderId, toString |
| payment | `POST` | `/api/payment/stripe/webhook` | express.json(, express.raw | **Body:** toString |
| payment | `POST` | `/api/payment/vnpay/create` | express.json(, authMiddleware | **Body:** orderId, bankCode |
| payment | `GET` | `/api/payment/vnpay/ipn` | express.json( | **Body:** orderId |
| payment | `GET` | `/api/payment/vnpay/return` | express.json( | - |
| products | `GET` | `/api/products` | - | **Query:** page, limit, search, category_id, min_price, max_price, sort_by, sort_order, sale |
| products | `GET` | `/api/products/:id` | - | **Params:** id |
| products | `POST` | `/api/products/:product_id/reviews` | authMiddleware | **Params:** product_id<br>**Body:** rating, comment |
| products | `GET` | `/api/products/:product_id/reviews` | - | **Params:** product_id, review_id<br>**Body:** rating, comment |
| products | `PUT` | `/api/products/:product_id/reviews/:review_id` | authMiddleware | **Params:** review_id<br>**Body:** rating, comment |
| products | `DELETE` | `/api/products/reviews/:review_id` | authMiddleware | **Params:** review_id<br>**Body:** rating, comment |
| sale | `GET` | `/api/sale` | - | **Params:** id |
| sale | `GET` | `/api/sale/:id` | - | **Params:** id |
| sale | `GET` | `/api/sale/active` | - | **Params:** saleId, productId |
| users | `GET` | `/api/users` | - | - |
| wishlist | `GET` | `/api/wishlist` | authMiddleware | - |
| wishlist | `POST` | `/api/wishlist` | authMiddleware | **Params:** product_id<br>**Body:** product_id |
| wishlist | `DELETE` | `/api/wishlist/:product_id` | authMiddleware | **Params:** product_id |
