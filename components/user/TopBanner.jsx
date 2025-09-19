"use client";

import React from "react";
import { StickyBanner } from "../ui/sticky-banner";
import { useContactDetails } from "@/hooks/useContactDetails";
import Link from "next/link";
import { MailCheckIcon, Phone } from "lucide-react";
import { IconBrandWhatsappFilled } from "@tabler/icons-react";

const TopBanner = () => {
  const { contact } = useContactDetails();

  if (contact && contact.isLoading === false) {
    return (
      <StickyBanner className="bg-accent border-b-foreground/20 shadow-xl shadow-foreground/20">
        <div className="flex items-center justify-between px-5 w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-start gap-5">
            <Link
              href={`tel:${contact.details.phone1}`}
              className="flex items-center justify-center gap-1"
            >
              <Phone className="h-4 w-4 text-orange-500 fill-orange-500" />
              <span className="font-medium text-xs sm:text-sm hover:text-muted-foreground transition-colors">
                {contact.details.phone1}
              </span>
            </Link>
            <Link
              href={`tel:${contact.details.phone2}`}
              className="md:flex items-center justify-center gap-1 hidden"
            >
              <Phone className="h-4 w-4 text-orange-500 fill-orange-500" />
              <span className="font-medium text-sm hover:text-muted-foreground transition-colors">
                {contact.details.phone2}
              </span>
            </Link>
            <Link
              href={`https://wa.me/${contact.details.whatsapp}`}
              className="md:flex items-center justify-center gap-1 hidden"
            >
              <IconBrandWhatsappFilled className="h-5 w-5" fill="#38cb82" />
              <span className="font-medium text-sm hover:text-muted-foreground transition-colors">
                {contact.details.whatsapp}
              </span>
            </Link>
          </div>
          <Link
            href={`mailto:${contact.details.email}`}
            className="flex items-center justify-center gap-1"
          >
            <MailCheckIcon className="h-5 w-5 text-white fill-orange-500" />
            <span className="font-medium text-xs sm:text-sm hover:text-muted-foreground transition-colors">
              {contact.details.email}
            </span>
          </Link>
        </div>
      </StickyBanner>
    );
  }
  return null;
};

export default TopBanner;
