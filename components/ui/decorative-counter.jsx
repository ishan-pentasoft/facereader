"use client";

import { motion } from "motion/react";
import { AnimatedCounter } from "./animated-counter";
import Image from "next/image";

export const DecorativeCounter = ({ title, count, suffix = "", delay = 0 }) => {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-[180px] w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {/* Background Decorative Image */}
      <div className="relative w-full max-w-xl h-[160px] flex flex-col items-center justify-center mx-auto">
        <Image
          src="/service_shape.png"
          alt="Service Shape"
          width={300}
          height={160}
          className="absolute inset-0 w-full h-full object-contain opacity-70"
          draggable={false}
        />

        {/* Title */}
        <motion.h3
          className="text-white/90 text-2xl font-medium mb-3 font-norican text-center px-3 relative z-10 leading-tight tracking-widest"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.2 }}
        >
          {title}
        </motion.h3>

        {/* Animated Counter */}
        <div className="relative z-10">
          <AnimatedCounter
            end={count}
            suffix={suffix}
            duration={2.5}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-norican leading-none"
          />
        </div>
      </div>
    </motion.div>
  );
};
