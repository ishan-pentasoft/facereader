import PageHeader from "@/components/user/PageHeader";
import React from "react";
import WhyChooseUs from "@/components/user/WhyChooseUs";
import FaceReadingContent from "@/components/user/FaceReadingContent";

export const metadata = {
  title: "Face Reading - FaceReader",
  description:
    "Learn about Naresh Mehta, a renowned Face reader, Astrologer and Vastu consultant from India..",
  keywords:
    "About Us, FaceReader, Naresh Mehta, Face reading, Astrology, Vastu",
  openGraph: {
    title: "Face Reading - FaceReader",
    description:
      "Learn about Naresh Mehta, a renowned Face reader, Astrologer and Vastu consultant from India.",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <PageHeader title={["Face", "Reading"]} />
      <FaceReadingContent />
      <WhyChooseUs />
    </div>
  );
};

export default page;
