"use client";

import React from "react";
import Script from "next/script";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, MessageSquare, NotebookPen } from "lucide-react";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { z } from "zod";
import { Highlight } from "../ui/hero-highlight";
import Image from "next/image";

export default function ContactForm() {
  const ContactSchema = z.object({
    fullName: z.string().min(2, "Please enter your full name"),
    subject: z.string().min(2, "Please add a subject"),
    phone: z.string().min(10, "Phone Number must be at least 10 characters"),
    email: z.email("Please enter a valid email address"),
    message: z.string().min(10, "Message should be at least 10 characters"),
  });

  const contactDefaultValues = {
    fullName: "",
    subject: "",
    phone: "",
    email: "",
    message: "",
  };

  const captchaRef = React.useRef(null);
  const widgetIdRef = React.useRef(null);
  const form = useForm({
    resolver: zodResolver(ContactSchema),
    defaultValues: contactDefaultValues,
    mode: "onTouched",
  });

  // Explicitly render reCAPTCHA v2 when script is available
  React.useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const tryRender = () => {
      if (!captchaRef.current || !window?.grecaptcha || !siteKey) return;
      try {
        if (widgetIdRef.current != null) return;
        widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: siteKey,
          theme: "light",
          size: "normal",
        });
      } catch {}
    };
    const id = window.setInterval(() => {
      if (window?.grecaptcha) {
        tryRender();
        if (widgetIdRef.current != null) window.clearInterval(id);
      }
    }, 200);
    tryRender();
    return () => window.clearInterval(id);
  }, []);

  const onSubmit = async (values) => {
    try {
      // Get reCAPTCHA v2 Checkbox token (user must complete)
      let captchaToken;
      if (typeof window !== "undefined" && window.grecaptcha) {
        const wid = widgetIdRef.current;
        captchaToken =
          wid != null
            ? window.grecaptcha.getResponse(wid)
            : window.grecaptcha.getResponse();
      }
      if (!captchaToken) {
        toast.error("Please complete the reCAPTCHA before submitting.");
        return;
      }

      const res = await fetch("/api/contact/contactForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, captchaToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // If invalid or high risk, reset captcha and form, and show friendlier message
        if (
          data?.code === "high_risk" ||
          data?.code === "invalid" ||
          data?.code === "phone_validation_failed"
        ) {
          try {
            const wid = widgetIdRef.current;
            if (window.grecaptcha) {
              if (wid != null) window.grecaptcha.reset(wid);
              else window.grecaptcha.reset();
            }
          } catch {}
          form.reset(contactDefaultValues);
          throw new Error("Please enter a valid phone number.");
        }
        throw new Error(data?.error || "Failed to send message");
      }
      toast.success("Thanks for reaching out! We'll get back to you shortly.");
      try {
        const wid = widgetIdRef.current;
        if (window.grecaptcha) {
          if (wid != null) window.grecaptcha.reset(wid);
          else window.grecaptcha.reset();
        }
      } catch {}
      form.reset(contactDefaultValues);
    } catch (err) {
      console.error("Contact submit failed", err);
      toast.error(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <section aria-labelledby="contact-form-heading" className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 id="contact-form-heading" className="sr-only">
            Contact form
          </h2>
          <h2 className="font-norican text-4xl font-semibold tracking-widest text-center">
            Get In<Highlight className="text-white p-2">Touch</Highlight>
          </h2>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <Image
              src="/hr.png"
              alt="Decorative horizontal line separator"
              width={300}
              height={20}
              className="mt-8 mb-5"
              priority={false}
              loading="lazy"
              sizes="(max-width: 768px) 250px, 300px"
              draggable={false}
            />
          </motion.div>

          <Card className="shadow-2xl shadow-foreground/10 relative">
            <Image
              src="/page_bg.jpg"
              alt="Page background"
              height={500}
              width={500}
              className="absolute rounded-xl h-full w-full top-0 left-0 object-cover object-center inset-0 opacity-20"
            />
            <CardHeader className="space-y-1">
              <CardDescription className="text-center">
                Fill out the form below and we'll get back to you as soon as
                possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="font-semibold font-norican tracking-widest"
                      >
                        Full Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          autoComplete="name"
                          {...form.register("fullName")}
                          className={
                            form.formState.errors.fullName
                              ? "border-red-500 pr-10"
                              : "pr-10"
                          }
                        />
                        <User className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      {form.formState.errors.fullName && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        className="font-semibold font-norican tracking-widest"
                      >
                        Subject
                      </Label>
                      <div className="relative">
                        <Input
                          id="subject"
                          placeholder="Enter subject"
                          autoComplete="off"
                          {...form.register("subject")}
                          className={
                            form.formState.errors.subject
                              ? "border-red-500 pr-10"
                              : "pr-10"
                          }
                        />
                        <NotebookPen className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      {form.formState.errors.subject && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="font-semibold font-norican tracking-widest"
                      >
                        Phone Number
                      </Label>
                      <div className="phone-input-container">
                        <Controller
                          name="phone"
                          control={form.control}
                          render={({ field }) => (
                            <PhoneInput
                              international
                              countryCallingCodeEditable={false}
                              defaultCountry="IN"
                              value={field.value || ""}
                              onChange={(val) => field.onChange(val)}
                              onBlur={field.onBlur}
                              placeholder="Enter Phone"
                              disabled={form.formState.isSubmitting}
                              className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-muted"
                            />
                          )}
                        />
                      </div>
                      {form.formState.errors.phone && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="font-semibold font-norican tracking-widest"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          autoComplete="email"
                          {...form.register("email")}
                          className={
                            form.formState.errors.email
                              ? "border-red-500 pr-10"
                              : "pr-10"
                          }
                        />
                        <Mail className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="font-semibold font-norican tracking-widest"
                    >
                      Message
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="message"
                        rows={6}
                        placeholder="Enter your message"
                        {...form.register("message")}
                        className={
                          form.formState.errors.message
                            ? "border-red-500 pr-10"
                            : "pr-10"
                        }
                      />
                      <MessageSquare className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                    {form.formState.errors.message && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Visible reCAPTCHA v2 Checkbox */}
                  <div className="mt-2">
                    <div ref={captchaRef} className="recaptcha-container" />
                  </div>

                  <div className="pt-2 flex items-center justify-center">
                    <Button
                      type="submit"
                      className="w-fit cursor-pointer font-norican text-xl bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Sending..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />
      <style jsx global>{`
        .phone-input-container .PhoneInputInput {
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          flex: 1;
        }
        .phone-input-container .PhoneInputCountrySelect {
          border: none;
          background: transparent;
          margin-right: 8px;
        }
        .phone-input-container .PhoneInputCountrySelectArrow {
          opacity: 0.5;
        }
      `}</style>
    </>
  );
}
