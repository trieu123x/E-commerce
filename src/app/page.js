"use client";
import Image from "next/image";
import Banner from "./component/banner";
import Featured from "./component/featured";
import Footer from "./component/footer";
import axios from "./api/axios";
import { useEffect } from "react";
import instance from "./api/axios";
import ProductSection from "./component/productSection";
import { useAuth } from "./context/authContext";
import SaleProducts from "./component/saleProducts"
export default function Home() {
  const { products } = useAuth();
  return (
    <>
      <Banner />
      <SaleProducts></SaleProducts>
      <ProductSection products={products} />
      <Featured />
    </>
  );
}
