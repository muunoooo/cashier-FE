"use client";

import * as React from "react";
import {
  Users,
  PersonStanding,
  Briefcase,
  SquareUser,
  MountainSnow,
  Shield,
  UserPen,
} from "lucide-react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useSession from "@/hooks/useSession";
import Home from "@/app/page";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSession();
  const pathname = usePathname();

  const userRole = user?.role;

  const MenuItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Profile", url: "/dashboard/profile", icon: UserPen },
  ];

  const AdminMenu = [
    {
      title: "Cashier List",
      url: "/dashboard/admin/cashier-list",
      icon: Shield,
    },
    { title: "Product", url: "/dashboard/admin/product", icon: Users },
  ];
  const CashierMenu = [
    {
      title: "Daftar Official",
      url: "/dashboard/admin/official-list",
      icon: Briefcase,
    },
  ];

  return (
    <Sidebar
      className="w-64 bg-white border-r shadow-md min-h-screen flex flex-col"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 p-2 overflow-hidden transition-all duration-300">
          <Image src="/Logo-SMS.png" alt="Logo" width={40} height={40} />

          <span className="text-base text-red-600 whitespace-nowrap sidebar-expanded:block sidebar-collapsed:hidden">
            Liga Anak Indonesia
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu>
            {MenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={`flex items-center gap-3 px-3 rounded-md ${
                      pathname === item.url
                        ? "text-red-600 font-bold"
                        : "text-gray-800"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        pathname === item.url
                          ? "text-[#F00001]"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {userRole === "CASHIER" && (
          <SidebarGroup>
            <SidebarGroupLabel>AKUN</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {CashierMenu.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`flex items-center gap-3 p-3 rounded-md ${
                            isActive
                              ? "text-red-600 font-bold"
                              : "text-gray-800"
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 ${
                              isActive ? "text-red-600" : "text-gray-600"
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {userRole === "ADMIN" && (
          <SidebarGroup>
            <SidebarGroupLabel>AKUN</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {AdminMenu.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`flex items-center gap-3 p-3 rounded-md ${
                            isActive
                              ? "text-red-600 font-bold"
                              : "text-gray-800"
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 ${
                              isActive ? "text-red-600" : "text-gray-600"
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2 p-2 overflow-hidden transition-all duration-300">
          <Link
            href="/"
            className="text-blue-600 text-sm flex items-center gap-2 hover:underline"
          >
            ⬅
            <span className="text-base whitespace-nowrap sidebar-expanded:block sidebar-collapsed:hidden">
              Kembali ke Beranda
            </span>
          </Link>
        </div>
        <NavUser
          user={{
            name: user?.name || "User",
            email: user?.email || "user@example.com",
            avatar: "/default_profile.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
