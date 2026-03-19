"use client";

import Image from "next/image";
import {
  Store,
  DollarSign,
  Users,
  BadgeDollarSign,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import daden from "./daden.png";
import Tom from "./image 46.png"
import Emma from "./image 47.png"
import Will from "./image 51.png"
export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8 text-sm text-gray-500">
        Home / <span className="text-black font-medium">About</span>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-8">Our Story</h1>

          <p className="text-gray-600 leading-7 mb-6">
            Launched in 2015, Exclusive is South Asia’s premier online shopping
            marketplace with an active presence in Bangladesh. Supported by
            wide range of tailored marketing, data and service solutions,
            Exclusive has 10,500 sellers and 300 brands and serves 3 millions
            customers across the region.
          </p>

          <p className="text-gray-600 leading-7">
            Exclusive has more than 1 Million products to offer, growing at a
            very fast. Exclusive offers a diverse assortment in categories
            ranging from consumer.
          </p>
        </div>

        <div className="relative w-full h-125">
          <Image
            src={daden} // bạn thay bằng ảnh của bạn
            alt="About"
            fill
            className="object-cover "
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <StatCard
          icon={<Store size={28} />}
          number="10.5k"
          label="Sellers active our site"
        />

        <StatCard
          icon={<DollarSign size={28} />}
          number="33k"
          label="Monthly Product Sale"
        />

        <StatCard
          icon={<Users size={28} />}
          number="45.5k"
          label="Customer active in our site"
        />

        <StatCard
          icon={<BadgeDollarSign size={28} />}
          number="25k"
          label="Annual gross sale in our site"
        />
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
        <TeamCard
          image={Tom}
          name="Tom Cruise"
          role="Founder & Chairman"
        />
        <TeamCard
          image={Emma}
          name="Emma Watson"
          role="Managing Director"
        />
        <TeamCard
          image={Will}
          name="Will Smith"
          role="Product Designer"
        />
      </div>
    </div>
  );
}

/* ------------------ COMPONENTS ------------------ */

function StatCard({ icon, number, label }) {
  return (
    <div
      className="group border border-gray-200 bg-white rounded-lg p-8 text-center 
                 transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:shadow-lg"
    >
      <div
        className="w-14 h-14 mx-auto flex items-center justify-center 
                   rounded-full mb-6 bg-gray-100 text-black 
                   transition-all duration-300
                   group-hover:bg-white group-hover:text-red-500"
      >
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-2 transition-colors duration-300 group-hover:text-white">
        {number}
      </h3>

      <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-white">
        {label}
      </p>
    </div>
  );
}

function TeamCard({ image, name, role }) {
  return (
   <div className="group text-center bg-white rounded-xl p-6 
                transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

  {/* Image Box */}
 <div className="relative w-full h-95 bg-gray-100 
                rounded-lg flex items-end justify-center overflow-hidden">
  <Image
    src={image}
    alt={name}
    width={260}
    height={340}
    className="object-contain h-full w-auto 
               transition duration-300 group-hover:scale-105"
  />
</div>

  {/* Info */}
  <h3 className="text-xl font-semibold mb-1">{name}</h3>
  <p className="text-gray-500 text-sm mb-4">{role}</p>

  {/* Social */}
  <div className="flex justify-center gap-5">
    <SocialIcon>
      <Twitter size={16} />
    </SocialIcon>

    <SocialIcon>
      <Instagram size={16} />
    </SocialIcon>

    <SocialIcon>
      <Linkedin size={16} />
    </SocialIcon>
  </div>
</div>
  );
}
function SocialIcon({ children }) {
  return (
    <div className="w-9 h-9 flex items-center justify-center 
                    rounded-full border border-gray-300 
                    text-gray-600 cursor-pointer
                    transition-all duration-300
                    hover:bg-red-500 hover:text-white hover:border-red-500">
      {children}
    </div>
  );
}