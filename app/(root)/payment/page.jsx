import PageHeader from "@/components/user/PageHeader";
import React from "react";
import PaymentContent from "@/components/user/PaymentContent";

export const metadata = {
  title: "Payment - FaceReader",
  description:
    "Learn about Naresh Mehta, a renowned Face reader, Astrologer and Vastu consultant from India..",
  keywords: "Payment, FaceReader, Naresh Mehta, Face reading, Astrology, Vastu",
  openGraph: {
    title: "Payment - FaceReader",
    description:
      "Learn about Naresh Mehta, a renowned Face reader, Astrologer and Vastu consultant from India.",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <PageHeader title={["Pay", "Now"]} />
      <PaymentContent />
    </div>
  );
};

export default page;
