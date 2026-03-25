"use client";

import { useSearchParams, useRouter, redirect } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import instance from "@/app/api/axios";
import { ins } from "framer-motion/client";
import { MapPin, ShoppingCart, Package, Truck, CreditCard } from "lucide-react";
export default function OrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const product_id = searchParams.get("product_id");
  const quantity = searchParams.get("quantity");  
  const payment = searchParams.get("payment");
  const type = searchParams.get("type")
  if (payment === "COD") redirect(`/order/cod?type=${type}&product_id=${product_id}&quantity=${quantity}`)
  else if(payment === "VISA") redirect(`/order/visa?type=${type}&product_id=${product_id}&quantity=${quantity}`)
  else if(payment === "MOMO") redirect(`/order/momo?type=${type}&product_id=${product_id}&quantity=${quantity}`)
  return (
   <></>
  );
}
