import React from "react";
import Image from "next/image";
import { FloatingDock } from "../ui/floating-dock";
import {
  Building2,
  CreditCard,
  Eye,
  HeartHandshake,
  Package,
  Phone,
  Star,
  User,
} from "lucide-react";

const Dock = () => {
  const links = [
    {
      title: "Home",
      icon: <Image src="/nav_logo.png" alt="Logo" width={20} height={20} />,
      href: "/",
    },
    {
      title: "About Us",
      icon: (
        <User
          width={20}
          height={20}
          fill="#510056"
          className="text-[#510056]"
        />
      ),
      href: "/",
    },
    {
      title: "Astrology",
      icon: (
        <Star
          width={20}
          height={20}
          fill="#510056"
          className="text-[#510056]"
        />
      ),
      href: "/",
    },
    {
      title: "Face Reading",
      icon: (
        <Eye width={20} height={20} fill="#510056" className="text-[#6f2d72]" />
      ),
      href: "/",
    },
    {
      title: "Match Making Compatibility / Kundali Dosha",
      icon: (
        <HeartHandshake
          width={20}
          height={20}
          fill="#510056"
          className="text-[#6f2d72]"
        />
      ),
      href: "/",
    },
    {
      title: "Vastu",
      icon: (
        <Building2
          width={20}
          height={20}
          fill="#510056"
          className="text-[#6f2d72]"
        />
      ),
      href: "/",
    },
    {
      title: "Buy Service",
      icon: (
        <Package
          width={20}
          height={20}
          fill="#510056"
          className="text-[#6f2d72]"
        />
      ),
      href: "/",
    },
    {
      title: "Contact Us",
      icon: (
        <Phone
          width={20}
          height={20}
          fill="#510056"
          className="text-[#6f2d72]"
        />
      ),
      href: "/",
    },
    {
      title: "Pay Now",
      icon: (
        <CreditCard
          width={20}
          height={20}
          fill="#510056"
          className="text-[#6f2d72]"
        />
      ),
      href: "/",
    },
  ];

  return (
    <div className="fixed bottom-10 right-10 md:right-auto md:left-1/2 md:-translate-x-1/2 z-[999]">
      <FloatingDock items={links} />
    </div>
  );
};

export default Dock;
