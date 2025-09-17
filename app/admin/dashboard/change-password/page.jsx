"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePasswordSchema } from "@/validation/admin.schema";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function ChangePasswordPage() {
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, changePassword } = useAdminAuth();

  useEffect(() => {
    if (user) {
      form.setValue("email", user.email);
    }
  }, [user, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await changePassword(values);
      toast.success("Password updated successfully");
      form.reset({
        email: form.getValues("email"),
        password: "",
        confirmPassword: "",
      });
      setShowPassword(false);
      setShowConfirm(false);
    } catch (err) {
      const message = err?.message || "Failed to update password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 md:px-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-center">
        Change Password
      </h1>

      <div className="mt-6 w-full max-w-md rounded-xl border bg-background p-6 sm:p-8 shadow-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="admin@example.com"
                      readOnly
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        spellCheck={false}
                        aria-required
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute inset-y-0 right-2 flex items-center p-2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff
                            className="size-5 cursor-pointer"
                            aria-hidden
                          />
                        ) : (
                          <Eye className="size-5 cursor-pointer" aria-hidden />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        spellCheck={false}
                        aria-required
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute inset-y-0 right-2 flex items-center p-2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showConfirm ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirm ? (
                          <EyeOff
                            className="size-5 cursor-pointer"
                            aria-hidden
                          />
                        ) : (
                          <Eye className="size-5 cursor-pointer" aria-hidden />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer"
                aria-busy={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
