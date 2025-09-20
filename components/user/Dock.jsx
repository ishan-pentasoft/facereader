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
      icon: (
        <Image
          src="/nav_logo.png"
          alt="Logo"
          width={20}
          height={20}
          className="h-full w-full"
        />
      ),
      href: "/",
    },
    {
      title: "About Us",
      icon: (
        <User
          width={20}
          height={20}
          className="text-orange-800 fill-orange-500"
        />
      ),
      href: "/about",
    },
    {
      title: "Astrology",
      icon: (
        <Star
          width={20}
          height={20}
          className="text-orange-800 fill-orange-500"
        />
      ),
      href: "/astrology",
    },
    {
      title: "Face Reading",
      icon: (
        <Eye
          width={20}
          height={20}
          className="text-orange-800 fill-orange-500"
        />
      ),
      href: "/face-reading",
    },
    {
      title: "Kundali Dosha",
      icon: (
        <HeartHandshake
          width={20}
          height={20}
          className="text-orange-800 fill-orange-500"
        />
      ),
      href: "/kundali-dosha",
    },
    {
      title: "Vastu",
      icon: (
        <Building2
          width={20}
          height={20}
          className="text-orange-800 fill-orange-500"
        />
      ),
      href: "/vastu",
    },
    {
      title: "Buy Service",
      icon: (
        <Package
          width={20}
          height={20}
          className="text-orange-800 fill-orange-500"
        />
      ),
      href: "/buy-services",
    },
    {
      title: "Contact Us",
      icon: (
        <Phone
          width={20}
          height={20}
          className="text-orange-800 fill-orange-500"
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
          className="text-orange-800 fill-orange-500"
        />
      ),
      href: "/payment",
    },
  ];

  return (
    <div className="fixed bottom-10 right-10 md:right-auto md:left-1/2 md:-translate-x-1/2 z-[999]">
      <FloatingDock items={links} />
    </div>
  );
};

export default Dock;
