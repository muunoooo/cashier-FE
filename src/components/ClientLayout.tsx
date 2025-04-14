"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/auth/sign-in";

  return (
    <SidebarProvider>
      <div className={`flex flex-1 ${isLoginPage ? "" : "flex-row"}`}>
        {!isLoginPage && <AppSidebar />}

        <main className="flex-1 p-4 bg-gray-100">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
