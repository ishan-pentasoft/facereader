"use client";

import Image from "next/image";
import React from "react";
import { SparklesCore } from "../ui/sparkles";
import { useContactDetails } from "@/hooks/useContactDetails";
import Link from "next/link";
import { MailCheckIcon, Phone } from "lucide-react";
import { IconBrandWhatsappFilled } from "@tabler/icons-react";

const Footer = () => {
  const { contact } = useContactDetails();

  return (
    <div className="bg-black relative inset-0">
      <Image
        src="/shape.svg"
        alt="Shape"
        width={500}
        height={500}
        className="w-full h-10vh absolute -top-0.5 z-30"
        draggable={false}
      />
      <SparklesCore
        background="transparent"
        minSize={0.4}
        maxSize={1}
        particleDensity={100}
        className="w-full h-full"
        particleColor="#FFFFFF"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-20 pb-10 max-w-7xl mx-auto px-5 z-20">
        <div className="flex flex-col items-start justify-center">
          <Image src="/footer_logo.png" alt="Logo" width={250} height={250} />
          <p className="text-white text-justify font-sm mt-5">
            Boys and girls are given consultation for their life partner choice.
            Selection of their partners, how to make their marriage successful
            with exclusive astrological point matching process by 8 different
            astrological point study.
          </p>
        </div>
        <div className="hidden lg:block"></div>
        <div className="hidden lg:block"></div>
        <div className="flex flex-col items-start justify-center gap-2 z-30">
          <h2 className="text-white font-bold text-xl">Contact Us</h2>
          <div className="h-0.5 bg-white w-[50%]" />
          <p className="text-white text-justify font-sm mt-5">
            {contact?.details?.address}
          </p>
          <Link
            href={`tel:${contact?.details?.phone1}`}
            className="flex items-center justify-center gap-1"
          >
            <Phone className="h-4 w-4 text-orange-500 fill-orange-500" />
            <span className="font-medium text-xs sm:text-sm text-white hover:text-orange-500 transition-colors">
              {contact?.details?.phone1}
            </span>
          </Link>
          <Link
            href={`tel:${contact?.details?.phone2}`}
            className="flex items-center justify-center gap-1"
          >
            <Phone className="h-4 w-4 text-orange-500 fill-orange-500" />
            <span className="font-medium text-sm text-white hover:text-orange-500 transition-colors">
              {contact?.details?.phone2}
            </span>
          </Link>
          <Link
            href={`https://wa.me/${contact?.details?.whatsapp}`}
            className="flex items-center justify-center gap-1"
          >
            <IconBrandWhatsappFilled className="h-5 w-5" fill="#38cb82" />
            <span className="font-medium text-sm text-white hover:text-orange-500 transition-colors">
              {contact?.details?.whatsapp}
            </span>
          </Link>
          <Link
            href={`mailto:${contact?.details?.email}`}
            className="flex items-center justify-center gap-1"
          >
            <MailCheckIcon className="h-5 w-5 text-white fill-orange-500" />
            <span className="font-medium text-xs sm:text-sm text-white hover:text-orange-500 transition-colors">
              {contact?.details?.email}
            </span>
          </Link>
        </div>
      </div>
      <hr className="h-0.5 bg-muted-foreground w-full" />

      <div className="p-5 max-w-xl mx-auto">
        <p className="text-muted-foreground text-center font-sm">
          © {new Date().getFullYear()} FaceReader. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
