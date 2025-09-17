"use client";
import Image from "next/image";
import React, { memo } from "react";
import { SparklesCore } from "../ui/sparkles";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { motion } from "motion/react";
import { Spotlight } from "../ui/spotlight";

const Hero = memo(() => {
  return (
    <section
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center"
      aria-label="Hero section with astrology theme"
    >
      <div className="absolute inset-0 bg-black"></div>
      <SparklesCore
        background="transparent"
        minSize={0.4}
        maxSize={1}
        particleDensity={100}
        className="w-full h-full"
        particleColor="#FFFFFF"
      />
      <Spotlight fill="#FFFFFF" className="top-0 left-0" />
      <Spotlight fill="#3B82F6" className="top-20 right-10 opacity-50" />
      <Spotlight fill="#8B5CF6" className="bottom-10 left-20 opacity-40" />
      <div className="w-full flex flex-col items-center justify-center p-10 max-w-3xl z-20 ">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          <Image
            src="/hero_logo.png"
            alt="Astrology logo - The Best Astrology brand symbol"
            width={500}
            height={500}
            className="mb-3"
            priority
            sizes="(max-width: 768px) 300px, (max-width: 1200px) 400px, 500px"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </motion.div>
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold font-roboto tracking-wide text-white mb-10"
        >
          The Best Astrology
        </motion.h1>
        <TextGenerateEffect
          words="Astrology is an ancient Indian science, which describes planetary motions and positions with the time and its effects on humans and other lives on the earth."
          className="font-norican text-center"
          role="text"
          aria-label="Description of astrology"
        />
      </div>
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="absolute -top-30 -left-40 z-20"
      >
        <Image
          src="/hand_bg.png"
          alt="Decorative mystical hand background element"
          width={500}
          height={500}
          className="animate-spin-slow will-change-transform"
          loading="lazy"
          sizes="(max-width: 768px) 300px, 500px"
        />
      </motion.div>
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
        className="absolute -bottom-40 -right-30 md:-bottom-0 md:-right-10 z-20"
      >
        <Image
          src="/hand.png"
          alt="Decorative palm reading hand illustration"
          width={400}
          height={400}
          className="opacity-60"
          loading="lazy"
          sizes="(max-width: 768px) 250px, 400px"
        />
      </motion.div>
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;
