import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

import { useState } from "react";

export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <motion.div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-5 py-10",
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {items.map((item, idx) => (
        <motion.a
          href={item?.link}
          key={item?.link}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          variants={{
            hidden: {
              opacity: 0,
              y: 50,
              scale: 0.9,
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.6,
                ease: "easeOut",
              },
            },
          }}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-orange-200 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardIcon>{item.icon}</CardIcon>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </motion.a>
      ))}
    </motion.div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-2 overflow-hidden bg-accent hover:bg-gradient-to-br from-orange-200 to-orange-500 border border-foreground/20 relative z-20 transition-colors hover:text-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
      <Image
        src="/hand_bg.png"
        alt="src-bg"
        width={200}
        height={200}
        className="absolute inset-0 animate-spin-slow h-full w-full object-contain hidden group-hover:block opacity-70 z-10 transition-opacity"
      />
    </div>
  );
};
export const CardTitle = ({ className, children }) => {
  return (
    <h4
      className={cn(
        "font-bold font-norican text-2xl text-center tracking-wider mt-4 group-hover:text-white transition-colors",
        className
      )}
    >
      {children}
    </h4>
  );
};
export const CardIcon = ({ className, children }) => {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className="w-12 h-12 flex items-center justify-center text-orange-500 group-hover:text-white transition-colors">
        {children}
      </div>
    </div>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p
      className={cn(
        "mt-4 text-justify font-roboto text-muted-foreground group-hover:text-white tracking-wide leading-relaxed text-sm transition-colors",
        className
      )}
    >
      {children}
    </p>
  );
};
