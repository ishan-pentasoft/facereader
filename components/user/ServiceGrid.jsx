"use client";

import React from "react";
import { Highlight } from "../ui/hero-highlight";
import Image from "next/image";
import { motion } from "motion/react";

const ServiceGrid = () => {
  return (
    <motion.div
      className="py-20 max-w-3xl mx-auto w-full"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.p
        className="font-norican text-4xl font-semibold tracking-widest text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        Our <Highlight className="text-white p-2">Services</Highlight>
      </motion.p>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
      >
        <Image
          src="/hr.png"
          alt="hr"
          width={300}
          height={20}
          className="mt-8 mb-5"
        />
      </motion.div>

      <motion.p
        className="text-center text-muted-foreground mb-20"
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
  );
};

export default ServiceGrid;
