"use client";

import * as React from "react";
import {
  Users,
  Home,
  UserPen,
  Apple,
} from "lucide-react";
import { TbTransactionDollar } from "react-icons/tb";
import { FaHistory } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
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
import { useSession } from "@/contexts/SessionContext";

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
      icon: Users,
    },
    {
      title: "Product List",
      url: "/dashboard/admin/product-list",
      icon: Apple,
    },
    {
      title: "Report",
      url: "/dashboard/admin/report",
      icon: HiDocumentReport,
    },
  ];
  const CashierMenu = [
    {
      title: "Transaction",
      url: "/dashboard/cashier/transaction",
      icon: TbTransactionDollar,
    },
    {
      title: "Transaction History",
      url: "/dashboard/cashier/transaction-history",
      icon: FaHistory ,
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
          <Image src="/MisterBear.jpeg" alt="Logo" width={40} height={40} />

          <span className="text-base text-black whitespace-nowrap sidebar-expanded:block sidebar-collapsed:hidden">
            Mister Bear
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
                        ? "text-orange-900 font-bold"
                        : "text-gray-800"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        pathname === item.url
                          ? "text-orange-900"
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
            <SidebarGroupLabel>CONTENT</SidebarGroupLabel>
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
                              ? "text-orange-900 font-bold"
                              : "text-gray-800"
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 ${
                              isActive ? "text-orange-900" : "text-gray-600"
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
            <SidebarGroupLabel>CONTENT</SidebarGroupLabel>
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
                              ? "text-orange-900 font-bold"
                              : "text-gray-800"
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 ${
                              isActive ? "text-orange-900" : "text-gray-600"
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
        <NavUser
          user={{
            name: user?.name || "User",
            email: user?.email || "user@example.com",
            avatar: user?.avatar || "/default_profile.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
