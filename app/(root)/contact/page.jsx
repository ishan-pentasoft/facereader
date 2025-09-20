import ContactInfoSection from "@/components/user/ContactInfoSection";
import PageHeader from "@/components/user/PageHeader";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHeader title={["Contact", "Us"]} />

      <ContactInfoSection />
    </div>
  );
};

export default page;
