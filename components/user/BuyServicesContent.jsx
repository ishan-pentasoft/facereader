"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { HoverEffect } from "@/components/ui/services-hover-effect";
import { Skeleton } from "../ui/skeleton";

// Fetch services from the backend
async function getServices() {
  try {
    const response = await fetch(`/api/user/services`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }

    const data = await response.json();
    return data.services || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

// Format price display
function formatPrice(price, currency) {
  const currencyCode = currency || "CAD";
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  return `${currencyCode} $${formattedNumber}`;
}

// Transform backend service data to match HoverEffect component structure
function transformServiceData(services) {
  return services.map((service) => ({
    title: service.title,
    description: formatPrice(service.price, service.currency),
    link: `/services/${service.slug}`,
    icon: (
      <Image
        src={service.image || "/services/default-service.jpg"}
        alt={service.title}
        width={400}
        height={400}
        className="object-cover rounded-xl border border-foreground/15 shadow-xl h-56 w-56 bg-white"
      />
    ),
  }));
}

const BuyServicesContent = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const backendServices = await getServices();
        const transformedServices = transformServiceData(backendServices);
        setServices(transformedServices);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleRetry = () => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const backendServices = await getServices();
        const transformedServices = transformServiceData(backendServices);
        setServices(transformedServices);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  };

  return (
    <section aria-label="Our Services" className="max-w-5xl mx-auto p-5">
      {loading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <section className="w-full p-10 border border-foreground/20 rounded-xl mb-10 bg-accent/80 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
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
        </motion.div>
      ) : error ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-red-400 mb-4">
            Error Loading Services
          </h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button
            onClick={handleRetry}
            className="bg-gradient-to-r from-orange-300 to-orange-600 hover:from-orange-400 hover:to-orange-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Try Again
          </Button>
        </div>
      ) : services.length > 0 ? (
        <HoverEffect items={services} />
      ) : (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
            No Services Available
          </h3>
          <p className="text-muted-foreground">
            Please check back later or contact us for more information.
          </p>
        </div>
      )}

      <Link href="/contact" className="flex items-center justify-center">
        <Button
          type="submit"
          className="bg-gradient-to-r from-orange-300 to-orange-600 hover:from-orange-400 hover:to-orange-700 text-white px-8 py-3 h-auto text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-norican tracking-widest mb-10"
        >
          Contact Us
        </Button>
      </Link>
    </section>
  );
};

export default BuyServicesContent;
