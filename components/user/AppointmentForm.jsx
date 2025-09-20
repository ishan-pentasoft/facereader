"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { appointmentFormSchema } from "@/validation/appointment.schema";

const AppointmentForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceSlug: searchParams.get("slug") || "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    additionalNotes: "",
  });

  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Get service details from URL params or fetch from API
  useEffect(() => {
    const serviceTitle = searchParams.get("title");
    const servicePrice = searchParams.get("price");
    const serviceSlug = searchParams.get("slug");

    if (serviceTitle && servicePrice && serviceSlug) {
      // Parse price from formatted string (e.g., "CAD $50.00")
      const priceMatch = servicePrice.match(/([A-Z]{3})\s*\$?([\d,]+\.?\d*)/);
      if (priceMatch) {
        setServiceDetails({
          title: decodeURIComponent(serviceTitle),
          price: parseFloat(priceMatch[2].replace(/,/g, "")),
          currency: priceMatch[1],
          slug: serviceSlug,
        });
        // Update form data with slug
        setFormData((prev) => ({ ...prev, serviceSlug }));
      }
    } else if (serviceSlug) {
      // Fetch service details from API using slug
      fetchServiceDetailsBySlug(serviceSlug);
    }
  }, [searchParams]);

  const fetchServiceDetailsBySlug = async (slug) => {
    try {
      const response = await fetch(`/api/user/services/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setServiceDetails(data.service);
      }
    } catch (error) {
      console.error("Error fetching service details:", error);
      toast.error("Failed to load service details");
    }
  };

  // Validate form
  useEffect(() => {
    try {
      appointmentFormSchema.parse(formData);
      setIsFormValid(true);
      setErrors({});
    } catch (error) {
      setIsFormValid(false);
      const fieldErrors = {};
      error.errors?.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookAppointment = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        ...formData,
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(
          "Appointment booked successfully! We will contact you soon."
        );
        // Redirect back to buy services page after a short delay
        setTimeout(() => {
          router.push("/buy-services");
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!serviceDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6 pb-20">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Loading service details...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 pb-20"
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-norican text-center">
            Book Your Appointment
          </CardTitle>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-orange-600">
              {serviceDetails.title}
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {serviceDetails.currency} ${serviceDetails.price.toFixed(2)}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Birth Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Birth Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="timeOfBirth">Time of Birth *</Label>
                <Input
                  id="timeOfBirth"
                  name="timeOfBirth"
                  type="time"
                  value={formData.timeOfBirth}
                  onChange={handleInputChange}
                  placeholder="HH:MM"
                  className={errors.timeOfBirth ? "border-red-500" : ""}
                />
                {errors.timeOfBirth && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.timeOfBirth}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="placeOfBirth">Place of Birth *</Label>
              <Input
                id="placeOfBirth"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleInputChange}
                placeholder="City, State/Province, Country"
                className={errors.placeOfBirth ? "border-red-500" : ""}
              />
              {errors.placeOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.placeOfBirth}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Additional Notes */}
          <div>
            <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              placeholder="Any specific questions or requirements..."
              rows={3}
              className={errors.additionalNotes ? "border-red-500" : ""}
            />
            {errors.additionalNotes && (
              <p className="text-red-500 text-sm mt-1">
                {errors.additionalNotes}
              </p>
            )}
          </div>

          <Separator />

          {/* Service Summary & Booking */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Service Summary</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Service Price:</span>
                <span className="text-xl font-bold text-green-600">
                  {serviceDetails.currency} ${serviceDetails.price.toFixed(2)}
                </span>
              </div>

              {/* Book Appointment Button */}
              <Button
                onClick={handleBookAppointment}
                disabled={!isFormValid || loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 text-lg"
                size="lg"
              >
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            </div>
          </div>

          {!isFormValid && (
            <div className="text-center text-red-500 text-sm">
              Please fill in all required fields correctly before booking your
              appointment.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AppointmentForm;
