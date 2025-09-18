"use client";

import Image from "next/image";
import React from "react";
import { SparklesCore } from "../ui/sparkles";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { motion } from "motion/react";
import { DecorativeCounter } from "../ui/decorative-counter";

const WhyChooseUs = () => {
  return (
    <div className="relative min-h-[calc(100vh-10rem)] w-full bg-black flex items-center justify-center py-20">
      <Image
        src="/shape.svg"
        alt="Shape"
        width={500}
        height={500}
        className="w-full h-10vh absolute rotate-180 -bottom-0.5 z-30 "
        draggable={false}
      />
      <Image
        src="/shape.svg"
        alt="Shape-2"
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
        className="w-full h-full absolute inset-0"
        particleColor="#FFFFFF"
      />

      <div className="relative z-40 text-center max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <TextGenerateEffect
          words="Why Choose Us"
          className="text-white text-center font-norican text-4xl font-semibold tracking-widest"
        />
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <Image
            src="/hr-white.png"
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
          className="text-center text-muted-foreground mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          With Decades of Experience and Thousands of Happy Clients, Your Stars
          Are in Safe Hands
        </motion.p>

        {/* Counter Stats */}
        <motion.div
          className="grid  md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 px-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <DecorativeCounter
            title="Years of Experience"
            count={40}
            suffix="+"
            delay={0.9}
          />
          <DecorativeCounter
            title="Types of Horoscopes"
            count={55}
            suffix="+"
            delay={1.0}
          />
          <DecorativeCounter
            title="Success Horoscopes"
            count={98}
            suffix="+"
            delay={1.1}
          />
          <DecorativeCounter
            title="Trusted By Million Clients"
            count={100}
            suffix="+"
            delay={1.2}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
