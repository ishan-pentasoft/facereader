import AppointmentForm from "@/components/user/AppointmentForm";
import PageHeader from "@/components/user/PageHeader";

import React from "react";

export const metadata = {
  title: "Book Appointment - FaceReader",
  description: "Book an appointment for astrology consultation services",
  keywords: "Appointment, Booking, FaceReader, Horoscope, Astrology",
};

const page = async () => {
  return (
    <div>
      <PageHeader title={["Book", "Appointment"]} />
      <AppointmentForm />
    </div>
  );
};

export default page;
