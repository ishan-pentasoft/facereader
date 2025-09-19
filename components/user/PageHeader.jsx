import React from "react";
import { SparklesCore } from "../ui/sparkles";
import Image from "next/image";
import { TypewriterEffect } from "../ui/typewriter-effect";

const PageHeader = ({ title }) => {
  const formattedWords = title.map((word) => ({
    text: word,
    className: "text-orange-500",
  }));

  return (
    <section className="relative pb-20 md:pb-30 pt-30 xl:py-40 w-full bg-black flex items-center justify-start overflow-hidden">
      <SparklesCore
        background="transparent"
        minSize={0.4}
        maxSize={1}
        particleDensity={100}
        className="w-full h-full absolute inset-0"
        particleColor="#FFFFFF"
      />
      <Image
        src="/shape.svg"
        alt="Shape"
        width={500}
        height={500}
        className="w-full h-10vh absolute rotate-180 -bottom-0.5 z-30 "
        draggable={false}
      />
      <Image
        src="/hand_bg.png"
        alt="Shape"
        width={900}
        height={900}
        className="absolute -right-50 md:-right-90 animate-spin-slow"
        draggable={false}
      />

      <TypewriterEffect
        words={formattedWords}
        className="font-norican font-semibold tracking-widest max-w-6xl px-10 text-start mx-auto w-full"
      />
    </section>
  );
};

export default PageHeader;
