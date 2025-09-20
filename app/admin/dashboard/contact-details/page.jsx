"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactDetailsSchema } from "@/validation/contact.schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const FormSchema = contactDetailsSchema;

export default function ContactDetailsPage() {
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone1: "",
      phone2: "",
      whatsapp: "",
      email: "",
      address: "",
    },
    mode: "onBlur",
  });

  // Load existing contact details
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/contact-details", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load contact details");
        const json = await res.json();
        const data = json?.data;
        if (active && data) {
          form.reset({
            phone1: data.phone1 ?? "",
            phone2: data.phone2 ?? "",
            whatsapp: data.whatsapp ?? "",
            email: data.email ?? "",
            address: data.address ?? "",
          });
        }
      } catch (e) {
        toast.error("Could not load contact details");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values) {
    try {
      const res = await fetch("/api/admin/contact-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to save contact details");
      }

      toast.success("Contact details saved");
    } catch (e) {
      toast.error(e.message || "Something went wrong");
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Contact Details</CardTitle>
          <CardDescription>
            Manage public-facing contact information.
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
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="phone1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Primary phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Secondary phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="WhatsApp number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            placeholder="Business address"
                            {...field}
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
                    disabled={form.formState.isSubmitting}
                    className="cursor-pointer"
                  >
                    {form.formState.isSubmitting ? "Saving..." : "Save"}
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
