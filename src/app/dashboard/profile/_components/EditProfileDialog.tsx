"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/api/user";
import { IUser, IUserUpdate } from "@/types/user";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { useSession } from "@/contexts/SessionContext";
import Image from "next/image";

interface UpdateUserDialogProps {
  user: IUser;
  onUserUpdated: () => void;
}

const UpdateUserDialog: React.FC<UpdateUserDialogProps> = ({
  user,
  onUserUpdated,
}) => {
  const { token } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isDialogOpen) {
      setPreviewUrl(null);
      setAvatar(null);
    }
  }, [isDialogOpen]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Token not found, sign in first");
      return;
    }

    const updatedUser: IUserUpdate = {
      name,
      email,
      password: password || null,
      avatar: avatar || null,
    };

    try {
      setIsSubmitting(true);
      await updateUser(user.id, updatedUser, token);
      toast("User updated successfully!");
      onUserUpdated();
      setIsDialogOpen(false);
    } catch (error) {
      toast("Failed to update user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer text-blue-500 hover:text-blue-700">
          <FiEdit className="text-lg" />
          <span className="text-sm font-semibold">Edit Profile</span>
        </div>
      </DialogTrigger>

      <DialogContent className="w-[380px] md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Update User
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update the user details below. If you want to change the password or
            profile picture, provide the new one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium">Profile Picture</label>

            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                width={96}
                height={96}
                className="rounded-full object-cover mb-2"
              />
            ) : user.avatar ? (
              <Image
                src={user.avatar}
                alt="Current avatar"
                width={96}
                height={96}
                className="rounded-full object-cover mb-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-2">
                No Image
              </div>
            )}
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter new password (optional)"
            />
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <Button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#A76545] hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserDialog;
