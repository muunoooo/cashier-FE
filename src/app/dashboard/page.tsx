"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminDashboard } from "./_components/AdminDashboard";
import { CashierDashboard } from "./_components/CashierDashboard";
import { useSession } from "@/contexts/SessionContext";
import ClientLayout from "@/components/ClientLayout";
import Loading from "@/components/loading";

export default function DashboardPage() {
  const { user, isAuth, isLoading } = useSession();
  const router = useRouter();

  const userRole = user?.role;

  useEffect(() => {
    if (!isLoading) {
      if (!isAuth) {
        router.push("/sign-in");
      }
    }
  }, [isLoading, isAuth, router]);

  const dashboardContent = useMemo(() => {
    if (!user || !userRole) {
      return (
        <p className="text-center text-gray-500">No valid role assigned.</p>
      );
    }

    if (userRole === "ADMIN") return <AdminDashboard />;
    if (userRole === "CASHIER") return <CashierDashboard />;

    return <p className="text-center text-gray-500">No valid role assigned.</p>;
  }, [user, userRole]);

  return (
    <ClientLayout>
      {isLoading ? (
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
          <Loading />
        </div>
      ) : (
        <div className=" max-w-5xl mx-auto">
          <div className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white">
            <h1 className="text-lg font-bold text-gray-900">
              Welcome, {user?.name || "User"}! 🐻
            </h1>
            <Image
              src="/dashboard.png"
              alt="Dashboard Illustration"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          {dashboardContent}
        </div>
      )}
    </ClientLayout>
  );
}
