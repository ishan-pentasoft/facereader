import BuyServicesContent from "@/components/user/BuyServicesContent";
import PageHeader from "@/components/user/PageHeader";
import WhyChooseUs from "@/components/user/WhyChooseUs";

import React from "react";

export const metadata = {
  title: "Buy Services - FaceReader",
  description: "Buy Services - FaceReader",
  keywords: "Buy Services, FaceReader, Horoscope, Astrology",
};

const page = async () => {
  return (
    <div>
      <PageHeader title={["Buy", "Services"]} />
      <BuyServicesContent />
      <WhyChooseUs />
    </div>
  );
};

export default page;
