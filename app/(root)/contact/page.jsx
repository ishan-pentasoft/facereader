import ContactForm from "@/components/user/ContactForm";
import ContactInfoSection from "@/components/user/ContactInfoSection";
import PageHeader from "@/components/user/PageHeader";
import React from "react";

const page = () => {
  return (
    <div className="pb-20">
      <PageHeader title={["Contact", "Us"]} />

      <ContactInfoSection />
      <ContactForm />
    </div>
  );
};

export default page;
