"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { toast } from "sonner";

import { reviewFormSchema } from "@/validation/review.schema";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Highlight } from "@/components/ui/hero-highlight";
import Image from "next/image";

const ReviewForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileUploadKey, setFileUploadKey] = useState(Date.now());

  const form = useForm({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      name: "",
      review: "",
    },
  });

  const handleFileUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image");
      }

      setUploadedImage(result.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const onSubmit = useCallback(async (data) => {
    setIsSubmitting(true);

    try {
      const reviewData = {
        name: data.name,
        review: data.review,
        image: uploadedImage || "",
      };

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit review");
      }

      toast.success("Thank you! Your review has been submitted successfully.");

      form.reset();
      setUploadedImage(null);
      setFileUploadKey(Date.now());
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  }, [uploadedImage, form]);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-norican text-3xl font-semibold tracking-widest mb-4">
            Share Your{" "}
            <Highlight className="p-2 text-white">Experience</Highlight>
          </h2>

          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="/hr.png"
              alt="Decorative line"
              width={300}
              height={20}
              className="mt-5"
              loading="lazy"
              draggable={false}
            />
          </motion.div>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your feedback helps us serve you better. Share your experience with
            our astrology services.
          </p>
        </motion.div>

        <motion.div
          className="bg-accent/90 backdrop-blur-sm border border-foreground/15 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-3">
                <div className="border bg-white border-foreground/15 rounded-lg overflow-hidden">
                  <FileUpload onChange={handleFileUpload} key={fileUploadKey} />
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-lg font-norican font-semibold tracking-widest">
                      Your Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="border-foreground/15 placeholder:text-muted-foreground h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-lg font-norican font-semibold tracking-widest">
                      Your Review
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your experience with our astrology services..."
                        className="border-foreground/15 placeholder:text-muted-foreground min-h-32 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage className="text-red-400" />
                      <span className="text-muted-foreground text-sm">
                        {field.value?.length || 0}/500 characters
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="bg-gradient-to-r from-orange-300 to-orange-600 hover:from-orange-400 hover:to-orange-700 text-white px-8 py-3 h-auto text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-norican tracking-widest"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting Review...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">Submit Review</div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewForm;
