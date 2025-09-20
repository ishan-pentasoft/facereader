import AppointmentForm from "@/components/user/AppointmentForm";
import PageHeader from "@/components/user/PageHeader";

import React, { Suspense } from "react";

export const metadata = {
  title: "Book Appointment - FaceReader",
  description: "Book an appointment for astrology consultation services",
  keywords: "Appointment, Booking, FaceReader, Horoscope, Astrology",
};

const page = async () => {
  return (
    <div>
      <PageHeader title={["Book", "Appointment"]} />
      <Suspense fallback={
        <div className="max-w-2xl mx-auto p-6 pb-20">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading appointment form...</p>
            </div>
          </div>
        </div>
      }>
        <AppointmentForm />
      </Suspense>
    </div>
  );
};

export default page;
