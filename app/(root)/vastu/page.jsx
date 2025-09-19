import PageHeader from "@/components/user/PageHeader";
import React from "react";
import WhyChooseUs from "@/components/user/WhyChooseUs";
import VastuContent from "@/components/user/VastuContent";

export const metadata = {
  title: "Vastu - FaceReader",
  description:
    "Learn about Naresh Mehta, a renowned Face reader, Astrologer and Vastu consultant from india.",
  keywords:
    "About Us, Facereader, Naresh Mehta, Face reading, Astrology, Vastu",
  openGraph: {
    title: "Vastu - FaceReader",
    description:
      "Learn about Naresh Mehta, a renowned Face reader, Astrologer and Vastu consultant from india.",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <PageHeader title={["Vastu"]} />
      <VastuContent />
      <WhyChooseUs />
    </div>
  );
};

export default page;
