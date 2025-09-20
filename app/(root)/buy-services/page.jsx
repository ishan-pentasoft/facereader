import { Button } from "@/components/ui/button";
import { HoverEffect } from "@/components/ui/services-hover-effect";
import PageHeader from "@/components/user/PageHeader";
import WhyChooseUs from "@/components/user/WhyChooseUs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Buy Services - FaceReader",
  description: "Buy Services - FaceReader",
  keywords: "Buy Services, FaceReader, Horoscope, Astrology",
};

const page = () => {
  const services = [
    {
      title: "Astrology",
      description: "CAN 75",
      link: "/astrology",
      icon: (
        <Image
          src="/services/astrology.jpg"
          alt="Astrology"
          width={400}
          height={400}
          className="object-cover rounded-xl border border-foreground/15 shadow-xl h-56 w-56 bg-white"
        />
      ),
    },
    {
      title: "Astro Vastu",
      description: "CAN 1000",
      link: "/vastu-shastra",
      icon: (
        <Image
          src="/services/astro-vastu.jpg"
          alt="Astrology"
          width={400}
          height={400}
          className="object-cover rounded-xl border border-foreground/15 shadow-xl h-56 w-56 bg-white"
        />
      ),
    },
    {
      title: "Face Reading",
      description: "CAN 100",
      link: "/face-reading",
      icon: (
        <Image
          src="/services/face-reading.jpg"
          alt="Astrology"
          width={400}
          height={400}
          className="object-cover rounded-xl border border-foreground/15 shadow-xl h-56 w-56 bg-white"
        />
      ),
    },
    {
      title: "Match Making Compatibility For One",
      description: "CAN 75",
      link: "/match-making",
      icon: (
        <Image
          src="/services/match-making.jpg"
          alt="Astrology"
          width={400}
          height={400}
          className="object-cover rounded-xl border border-foreground/15 shadow-xl h-56 w-56 bg-white"
        />
      ),
    },
    {
      title: "Match Making Compatibility Upto Three",
      description: "CAN 150",
      link: "/crystal-ball",
      icon: (
        <Image
          src="/services/match-making-multiple.jpg"
          alt="Astrology"
          width={400}
          height={400}
          className="object-cover rounded-xl border border-foreground/15 shadow-xl h-56 w-56 bg-white"
        />
      ),
    },
    {
      title:
        "One Year All Services , Will Be Entertained As Per Availability On Priority For One Family.",
      description: "CAN 1000",
      link: "/kundli-dosh",
      icon: (
        <Image
          src="/services/special-services.png"
          alt="Astrology"
          width={400}
          height={400}
          className="object-cover rounded-xl border border-foreground/15 shadow-xl h-56 w-56 bg-white"
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title={["Buy", "Services"]} />

      <section
        className="max-w-5xl mx-auto px-8 flex flex-col items-center justify-center"
        aria-label="Our Services"
      >
        <HoverEffect items={services} />

        <Link href="/contact">
          <Button
            type="submit"
            className="bg-gradient-to-r from-orange-300 to-orange-600 hover:from-orange-400 hover:to-orange-700 text-white px-8 py-3 h-auto text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-norican tracking-widest mb-10"
          >
            Contact Us
          </Button>
        </Link>
      </section>

      <WhyChooseUs />
    </div>
  );
};

export default page;
