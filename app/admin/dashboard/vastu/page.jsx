"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pageSchema } from "@/validation/page.schema";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import RichTextEditor from "@/components/ui/rich-text-editor";

const FormSchema = pageSchema;

export default function VastuPage() {
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [fileUploadKey, setFileUploadKey] = useState(Date.now());

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
    mode: "onBlur",
  });

  // Load existing about data
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/pages/vastu", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load vastu data");
        const json = await res.json();
        const data = json?.data;
        if (active && data) {
          form.reset({
            name: data.name ?? "",
            description: data.description ?? "",
            image: data.image ?? "",
          });
          setImagePreview(data.image ?? "");
          setCurrentImageUrl(data.image ?? null);
          setSelectedFile(null);
        }
      } catch (e) {
        toast.error("Could not load vastu data");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Watch image field changes for preview
  const watchedImage = form.watch("image");
  useEffect(() => {
    if (!selectedFile) {
      // Only update preview from form if no file is selected
      setImagePreview(watchedImage);
    }
  }, [watchedImage, selectedFile]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  async function onSubmit(values) {
    setIsUploading(true);

    try {
      const token = localStorage.getItem("token");
      let finalImageUrl = values.image;

      if (selectedFile) {
        // User selected a new file - delete old image and upload new one
        if (currentImageUrl && currentImageUrl.startsWith("/api/uploads/")) {
          await deleteImage(currentImageUrl);
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }

        finalImageUrl = uploadResult.url;
        toast.success("Image uploaded successfully!");
      } else if (
        !values.image &&
        currentImageUrl &&
        currentImageUrl.startsWith("/api/uploads/")
      ) {
        // User removed the image (no manual URL and no selected file) - delete the current uploaded image
        await deleteImage(currentImageUrl);
        finalImageUrl = "";
      }

      const vastuData = {
        ...values,
        image: finalImageUrl,
      };

      const res = await fetch("/api/admin/pages/vastu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(vastuData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to save vastu data");
      }

      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      setCurrentImageUrl(finalImageUrl);
      setSelectedFile(null);
      setImagePreview(finalImageUrl);
      form.setValue("image", finalImageUrl);
      setFileUploadKey(Date.now());

      toast.success("Vastu information saved successfully");
    } catch (e) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setIsUploading(false);
    }
  }
  const deleteImage = async (imageUrl) => {
    if (!imageUrl || !imageUrl.startsWith("/api/uploads/")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/uploads/delete?url=${encodeURIComponent(imageUrl)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.error("Failed to delete image:", imageUrl);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

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

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      setFileUploadKey(Date.now());
      return;
    }
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    form.setValue("image", "");
    setFileUploadKey(Date.now());

    toast.info("Image selected.");
  };

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

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Vastu Page</CardTitle>
          <CardDescription>
            Manage the Vastu page content displayed on your website.
          </CardDescription>
        </CardHeader>
        <Separator className="mb-2" />

        <CardContent>
          {loading ? (
            <div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-4">
                            {imagePreview ? (
                              /* Image Preview with Remove Button */
                              <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-64 object-contain"
                                  onError={() => {
                                    setImagePreview("");
                                    toast.error("Failed to load image preview");
                                  }}
                                />
                                {/* Cross button at top right */}
                                <button
                                  type="button"
                                  onClick={removeSelectedImage}
                                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors cursor-pointer"
                                  title="Remove image"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              /* File Upload Component */
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <FileUpload
                                  key={fileUploadKey}
                                  onChange={handleImageUpload}
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value || ""}
                            onChange={(value) => field.onChange(value)}
                            placeholder="Write about page ..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <CardFooter className="justify-end p-0 mt-10">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || isUploading}
                    className="cursor-pointer"
                  >
                    {isUploading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
