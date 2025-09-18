import Hero from "@/components/user/Hero";
import ServiceGrid from "@/components/user/ServiceGrid";
import WhyChooseUs from "@/components/user/WhyChooseUs";
import ReviewForm from "@/components/user/ReviewForm";
import React from "react";

const page = () => {
  return (
    <div className="select-none">
      <Hero />
      <ServiceGrid />
      <WhyChooseUs />
      <ReviewForm />
    </div>
  );
};

export default page;
