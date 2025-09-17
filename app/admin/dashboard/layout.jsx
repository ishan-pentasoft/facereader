"use client";
import AppSidebar from "@/components/user/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

export default function AdminLayout({ children }) {
  const { isLoading, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="relative">
          <SidebarTrigger className="absolute left-2 top-2 cursor-pointer" />
        </div>
        {children}
        <Toaster position="top-center" />
      </SidebarInset>
    </SidebarProvider>
  );
}
