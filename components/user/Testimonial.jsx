"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Highlight } from "../ui/hero-highlight";
import Image from "next/image";
import { AnimatedTestimonials } from "../ui/animated-testimonials";

const Testimonial = () => {
  const [testimonialsData, setTestimonialsData] = useState(null);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/reviews", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTestimonialsData(data.success ? data.reviews : []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching testimonials:", err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  if (testimonialsData && testimonialsData.length > 0) {
    const testimonials = testimonialsData.map((testimonial) => ({
      name: testimonial.name,
      quote: testimonial.review,
      src: testimonial.image || "https://avatar.iran.liara.run/public",
    }));

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
            Our <Highlight className="text-white p-2">Testimonials</Highlight>
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
            Here's what some of our users have to say about us.
          </motion.p>
        </motion.div>

        <section
          className="max-w-5xl mx-auto px-8 pb-10 border border-foreground/20 rounded-xl mb-10 bg-accent/80 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          aria-label="Our Testimonials"
        >
          <AnimatedTestimonials testimonials={testimonials} />
        </section>
      </>
    );
  }
};

export default Testimonial;
