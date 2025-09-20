"use client";

import React, { memo } from "react";
import { Highlight } from "../ui/hero-highlight";
import Image from "next/image";
import { motion } from "motion/react";
import { HoverEffect } from "../ui/card-hover-effect";
import {
  IconBuildingPavilion,
  IconCrystalBall,
  IconHeartHandshake,
  IconUniverse,
  IconUserScan,
  IconZodiacCancer,
} from "@tabler/icons-react";

const ServiceGrid = memo(() => {
  const services = [
    {
      title: "Astrology",
      description:
        "Astrology is an ancient Indian science, which describes planetary motions.",
      link: "/astrology",
      icon: <IconUniverse className="w-12 h-12" />,
    },
    {
      title: "Vastu Shastra",
      description:
        "Vastu Shastra, science of construction, architecture is a traditional Hindu system.",
      link: "/vastu",
      icon: <IconBuildingPavilion className="w-12 h-12" />,
    },
    {
      title: "Face Reading",
      description:
        "Face Reading is a method of counselling that originated in India with the Vedas.",
      link: "/face-reading",
      icon: <IconUserScan className="w-12 h-12" />,
    },
    {
      title: "Match Making",
      description:
        "While matching Horoscopes, Boys and Girls are given consultation for their life partner.",
      link: "/kundali-dosha",
      icon: <IconHeartHandshake className="w-12 h-12" />,
    },
    {
      title: "Crystal Ball",
      description:
        "Astrology is an ancient Indian science, which describes planetary motions.",
      link: "/astrology",
      icon: <IconCrystalBall className="w-12 h-12" />,
    },
    {
      title: "Kundli Dosh",
      description:
        "While matching Horoscopes, Boys and Girls are given consultation for their life partner.",
      link: "/kundali-dosha",
      icon: <IconZodiacCancer className="w-12 h-12" />,
    },
  ];

  return (
    <>
      <motion.div
        className="pt-20 max-w-3xl mx-auto w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="font-norican text-4xl font-semibold tracking-widest text-center">
          Our <Highlight className="text-white p-2">Services</Highlight>
        </h2>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <Image
            src="/hr.png"
            alt="Decorative horizontal line separator"
            width={300}
            height={20}
            className="mt-8 mb-5"
            priority={false}
            loading="lazy"
            sizes="(max-width: 768px) 250px, 300px"
            draggable={false}
          />
        </motion.div>

        <motion.p
          className="text-center text-muted-foreground mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          We are a foremost organization engaged in providing astrological
          consultancy services. Our services are being provided by expert
          astrologers.
        </motion.p>
      </motion.div>
      <section className="max-w-5xl mx-auto px-8" aria-label="Our Services">
        <HoverEffect items={services} />
      </section>
    </>
  );
});

ServiceGrid.displayName = "ServiceGrid";

export default ServiceGrid;
