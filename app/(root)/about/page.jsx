import PageHeader from "@/components/user/PageHeader";
import React from "react";
import WhyChooseUs from "@/components/user/WhyChooseUs";
import AboutContent from "@/components/user/AboutContent";

export const metadata = {
  title: "About Us - FaceReader",
  description:
    "Learn about Naresh Mehta, a renowned Face reader, Astrologer and Vastu consultant from India..",
  keywords:
    "About Us, FaceReader, Naresh Mehta, Face reading, Astrology, Vastu",
  openGraph: {
    title: "About Us - FaceReader",
    description:
      "Learn about Naresh Mehta, a renowned Face reader, Astrologer and Vastu consultant from India.",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <PageHeader title={["About", "Us"]} />
      <AboutContent />
      <WhyChooseUs />
    </div>
  );
};

export default page;
