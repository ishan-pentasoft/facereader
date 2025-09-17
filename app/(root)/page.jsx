import Hero from "@/components/user/Hero";
import ServiceGrid from "@/components/user/ServiceGrid";
import React from "react";

const page = () => {
  return (
    <div className="select-none">
      <Hero />
      <ServiceGrid />
    </div>
  );
};

export default page;
