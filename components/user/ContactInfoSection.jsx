"use client";

import React, { useRef, useState, useEffect } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useContactDetails } from "@/hooks/useContactDetails";

const ContactInfoCard = ({ icon: Icon, title, children }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    try {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    } catch {
      // Safari fallback
      media.addListener(update);
      return () => media.removeListener(update);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused || reduceMotion) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!reduceMotion) setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    if (!reduceMotion) setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (!reduceMotion) setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      aria-label={title}
      className="relative overflow-hidden rounded-2xl bg-accent shadow-xl ring-1 ring-black/5 p-6 sm:p-8 transition-shadow duration-300 hover:shadow-2xl motion-reduce:transition-none"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 motion-reduce:transition-none"
        aria-hidden="true"
        style={{
          opacity,
          background: `radial-gradient(300px at ${position.x}px ${position.y}px, rgba(251, 146, 60, 0.15), transparent 80%)`,
        }}
      />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shadow-sm ring-1 ring-black/5">
          <Icon className="h-6 w-6 text-orange-600" aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-xl font-extrabold tracking-tight">{title}</h3>
        <div className="mt-2 text-muted-foreground text-sm">{children}</div>
      </div>
    </div>
  );
};

const ContactInfoSection = () => {
  const { contact } = useContactDetails();

  return (
    <section aria-labelledby="contact-info-heading" className="py-14 md:py-20">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6">
        <h2 id="contact-info-heading" className="sr-only">
          Contact information
        </h2>

        {contact && contact.isLoading && (
          <p className="text-sm text-center">Loading contact info…</p>
        )}

        {contact && contact.error && (
          <p className="text-sm text-red-500 text-center">
            Error: {contact.error}
          </p>
        )}

        {contact && !contact.isLoading && (
          <div className="grid gap-6 lg:gap-8 md:grid-cols-3">
            <ContactInfoCard icon={MapPin} title="Office Location">
              <p>You are most welcome to visit office.</p>
              <address className="mt-4 not-italic text-muted-foreground font-semibold leading-relaxed">
                {contact.details.address}
              </address>
            </ContactInfoCard>

            <ContactInfoCard icon={Phone} title="Call US">
              <p>Keeping you always connected.</p>
              <ul className="mt-4 space-y-1 font-semibold tracking-tight text-muted-foreground">
                {contact.details.phone1 && (
                  <li>
                    <a
                      className="hover:underline hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 rounded"
                      href={`tel:${contact.details.phone1}`}
                    >
                      {contact.details.phone1}
                    </a>
                  </li>
                )}
                {contact.details.phone2 && (
                  <li>
                    <a
                      className="hover:underline hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 rounded"
                      href={`tel:${contact.details.phone2}`}
                    >
                      {contact.details.phone2}
                    </a>
                  </li>
                )}
              </ul>
            </ContactInfoCard>

            <ContactInfoCard icon={Mail} title="Quick Email">
              <p>Drop us a mail we will answer you asap.</p>
              <div className="mt-4 font-semibold text-muted-foreground break-all">
                <a
                  className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 rounded"
                  href={`mailto:${contact.details.email}`}
                >
                  {contact.details.email}
                </a>
              </div>
            </ContactInfoCard>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactInfoSection;
