"use client";

import React, { useEffect, useState } from "react";
import { Highlight } from "@/components/ui/hero-highlight";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

const AboutContent = () => {
  const [about, setAbout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAbout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/pages/about", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAbout(data.success ? data.about : null);
    } catch (error) {
      console.error("Error fetching about:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Loading skeleton component
  const AboutSkeleton = () => (
    <section className="max-w-5xl mx-auto p-10 border border-foreground/20 rounded-xl mb-10 bg-accent/80 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <Skeleton className="h-64 w-full rounded-3xl mb-8" />
      <div className="max-w-3xl mx-auto w-full my-15">
        <Skeleton className="h-12 w-64 mx-auto rounded-lg mb-8" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>
    </section>
  );

  return (
    <div className="p-5">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AboutSkeleton />
          </motion.div>
        ) : about ? (
          <motion.section
            key="content"
            className="max-w-5xl mx-auto p-10 border border-foreground/20 rounded-xl mb-10 bg-accent/80 shadow-[0_3px_10px_rgb(0,0,0,0.2)] relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Image
              src="/page_bg.jpg"
              alt="about-bg"
              width={500}
              height={500}
              className="absolute top-0 left-0 w-full h-full object-cover z-[-1] rounded-xl"
            />

            <motion.div variants={imageVariants}>
              <Image
                src={about.image}
                alt={about.name}
                width={500}
                height={500}
                draggable={false}
                className="h-full w-full aspect-video rounded-3xl object-cover object-center"
              />
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto w-full my-15"
              variants={itemVariants}
            >
              <h2 className="font-norican text-4xl font-semibold tracking-widest text-center">
                <Highlight className="text-white p-2 leading-15">
                  {about.name}
                </Highlight>
              </h2>
            </motion.div>

            <motion.div
              className="prose-blog text-justify"
              variants={itemVariants}
              dangerouslySetInnerHTML={{ __html: about.description }}
            />
          </motion.section>
        ) : (
          <motion.div
            key="error"
            className="max-w-5xl mx-auto p-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-muted-foreground">
              Failed to load about information.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutContent;
