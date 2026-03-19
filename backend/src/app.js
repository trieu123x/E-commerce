import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/users.routes.js"
import authRoutes from "./routes/auth.routes.js"
import adminRoutes from "./routes/admin/index.js"
import customerRoutes from "./routes/customer.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import addressRoutes from "./routes/address.routes.js"
import wishlistRoutes from "./routes/wishlist.routes.js"
import categoryRoutes from "./routes/category.routes.js";
import orderRoutes from "./routes/order.routes.js"
import saleRoutes from "./routes/sale.routes.js"
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/users", usersRoutes)
app.use("/api/auth", authRoutes)

app.use("/api/admin",adminRoutes)

app.use("/api/customer", customerRoutes)
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/order", orderRoutes)
app.use("/api/sales", saleRoutes)


export default app;
