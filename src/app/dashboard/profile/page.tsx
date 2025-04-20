"use client";

import React, { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { useSession } from "@/contexts/SessionContext";
import { IUser } from "@/types/user";
import { formatDateToDate } from "@/helpers/Date";
import Image from "next/image";
import { getUserProfile } from "@/api/auth";
import { toast } from "react-toastify";
import UpdateUserDialog from "./_components/EditProfileDialog";
import ClientLayout from "@/components/ClientLayout";

const ProfilePage = () => {
  const { user, isAuth, isLoading: sessionLoading } = useSession();
  const [userData, setUserData] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserProfile();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching profile", error);
        toast.error("Gagal mengambil data profil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const refreshUsers = async () => {
    if (!user?.id) return;
    try {
      const updatedUser = await getUserProfile();
      setUserData(updatedUser);
    } catch (error) {
      toast.error("Gagal memperbarui data profil");
      console.error(error)
    }
  };

  if (sessionLoading) return <Loading />;

  if (!isAuth) {
    return (
      <ClientLayout>
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-600">
            You must be logged in to view this page.
          </p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h1>

        {isLoading ? (
          <Loading />
        ) : userData ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                <Image
                  src={userData.avatar || "/default_profile.png"}
                  alt="User Avatar"
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>

              <div>
                <div className="text-lg font-semibold">{userData.name}</div>
                <div className="text-sm text-gray-500">{userData.email}</div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-600 text-sm">Registered On</span>
              <span className="text-lg font-semibold">
                {formatDateToDate(userData.createdAt)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-600 text-sm">Role</span>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold">
                  {userData.role}
                </span>
              </div>
            </div>
            <UpdateUserDialog user={userData} onUserUpdated={refreshUsers} />
          </div>
        ) : (
          <p className="text-gray-600">Failed to fetch user data.</p>
        )}
      </div>
    </ClientLayout>
  );
};

export default ProfilePage;
