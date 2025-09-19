import PageHeader from "@/components/user/PageHeader";
import React from "react";
import WhyChooseUs from "@/components/user/WhyChooseUs";
import AstrologyContent from "@/components/user/AstrologyContent";

export const metadata = {
  title: "Astrology - FaceReader",
  description:
    "Learn about Naresh Mehta, a renowned Face reader, Astrologer and Vastu consultant from India..",
  keywords:
    "About Us, FaceReader, Naresh Mehta, Face reading, Astrology, Vastu",
  openGraph: {
    title: "Astrology - FaceReader",
    description:
      "Learn about Naresh Mehta, a renowned Face reader, Astrologer and Vastu consultant from India.",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <PageHeader title={["Astrology"]} />
      <AstrologyContent />
      <WhyChooseUs />
    </div>
  );
};

export default page;
