"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceFormSchema } from "@/validation/service.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";

const ServiceForm = ({ service = null, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(service?.image || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fileUploadKey, setFileUploadKey] = useState(Date.now());

  const isEditing = !!service;

  const form = useForm({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: service?.title || "",
      price: service?.price || 0,
      currency: service?.currency || "CAD",
      image: service?.image || "",
      slug: service?.slug || "",
    },
  });

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Watch title changes to auto-generate slug
  const watchedTitle = form.watch("title");
  useEffect(() => {
    if (watchedTitle && !isEditing) {
      const slug = generateSlug(watchedTitle);
      form.setValue("slug", slug);
    }
  }, [watchedTitle, form, isEditing]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle image upload from FileUpload component
  const handleImageUpload = (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select a valid image file (JPEG, PNG, WebP, GIF, or SVG)"
      );
      setFileUploadKey(Date.now());
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      setFileUploadKey(Date.now());
      return;
    }

    // Clean up previous blob URL
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    form.setValue("image", "");
    setFileUploadKey(Date.now());
  };

  // Remove selected image
  const removeSelectedImage = () => {
    // Clean up blob URL if it exists
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    // Clear selected file and preview
    setSelectedFile(null);
    setImagePreview("");
    form.setValue("image", "");
    setFileUploadKey(Date.now());
  };

  // Upload file to server
  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to upload image");
    }

    return data.url;
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setUploadingImage(true);

      let finalImageUrl = data.image;

      // Upload file if one is selected
      if (selectedFile) {
        try {
          finalImageUrl = await uploadFileToServer(selectedFile);
          // Clean up blob URL
          if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
          }
          setSelectedFile(null);
          setImagePreview(finalImageUrl);
          form.setValue("image", finalImageUrl);
          setFileUploadKey(Date.now());
        } catch (uploadError) {
          toast.error("Failed to upload image");
          return;
        }
      }

      const url = isEditing
        ? `/api/admin/services/${service.id}`
        : "/api/admin/services";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          image: finalImageUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess?.();
      } else {
        toast.error(
          result.error || `Failed to ${isEditing ? "update" : "create"} service`
        );
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} service:`,
        error
      );
      toast.error(`Error ${isEditing ? "updating" : "creating"} service`);
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Service Image</Label>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Service preview"
                  className="w-full h-64 object-contain"
                  onError={() => {
                    setImagePreview("");
                    toast.error("Failed to load image preview");
                  }}
                />
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors cursor-pointer"
                  title="Remove image"
                  disabled={uploadingImage}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <FileUpload key={fileUploadKey} onChange={handleImageUpload} />
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter service title"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                The name of your astrology service
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price and Currency */}
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Service price in the selected currency
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="cursor-pointer w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CAD" className="cursor-pointer">
                    CAD
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="service-url-slug"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                URL-friendly identifier for the service (lowercase, hyphens
                only)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden image field */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => <input type="hidden" {...field} />}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || uploadingImage}
            className="cursor-pointer"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
