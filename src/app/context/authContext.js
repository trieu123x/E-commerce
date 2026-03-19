"use client";

import { createContext, use, useContext, useEffect, useState } from "react";
import instance from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const[categories, setCategories] = useState([])
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orders, setOrders] = useState([]);
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await instance.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  // Fetch user address when user state changes
  useEffect(() => {
    const fetchAddress = async () => {
      if (!user) return;
      try {
        const res = await instance.get("/address");
        if (res.data.success) {
          setAddress(res.data.data);
        } else {
          console.error("Failed to fetch address:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };
    fetchAddress();
  }, [user]);
  //Fetch Product
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await instance.get("/products");
        if (res.data.success) {
          setProducts(res.data.data);
        } else {
          console.error("Failed to fetch products:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;

      try {
        const res = await instance.get("/wishlist");
        if (res.data.success) {
          setWishlist(res.data.data);
        } else {
          console.error("Failed:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        if (res.data.success) {
        }
      }
    };

    fetchWishlist();
  }, [user]);
  // Fetch cart
  useEffect(() => {
    const fetchingCart = async () => {
      if (!user) return;
      try {
        const res = await instance.get("/cart");
        if (res.data.success) {
          setCart(res.data.cart);
        } else {
          console.log(res.data.message);
        }
      } catch (error) {
        console.log("Error fetching cart:", error);
      }
    };
    fetchingCart();
  }, [user]);
 
  // Fetch categories
  useEffect(() => {
    const fetchingCategories = async () => {
      try {
        const res = await instance.get("/categories");
        if (res.data.success) {
          setCategories(res.data.categories)
        } else {
          console.log(res.data.message)
        } 
      }catch (error) {
          console.log(error)
        }
    }
    fetchingCategories()
  }, [user])
  useEffect(() => {
    const fetchingOrders = async()=>{
      try {
        const res = await instance.get("/order/your-order")
        if (res.data.success) {
          setOrders(res.data.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchingOrders()
  }, [user])
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        address,
        setAddress,
        products,
        wishlist,
        setWishlist,
        cart,
        setCart,
        cartCount,
        setCartCount,
        wishlistCount,
        setWishlistCount,
        categories,
        setCategories,
        orders
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
