"use client";
import { redirect } from "next/navigation";

export default function Account() {
  redirect("/account/profile");
  return (
    <div className="container">
      
    </div>
  );
}