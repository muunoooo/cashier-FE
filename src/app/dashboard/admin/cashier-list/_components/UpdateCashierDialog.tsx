"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/api/user";
import { IUser, IUserUpdate } from "@/types/user";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";

interface UpdateUserDialogProps {
  user: IUser;
  onUserUpdated: () => void;
}

const UpdateUserDialog: React.FC<UpdateUserDialogProps> = ({ user, onUserUpdated }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const updatedUser: IUserUpdate = {
      name,
      email,
      password: password || null, 
    };

    try {
      setIsSubmitting(true);
      await updateUser(user.id, updatedUser);
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
      <FiEdit className="cursor-pointer text-blue-500 hover:text-blue-700" />
      </DialogTrigger>
      <DialogContent className="w-[380px] md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">Perbarui Pengguna</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Perbarui detail pengguna di bawah ini. Jika ingin mengganti kata sandi, isi dengan yang baru.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium">Nama Lengkap <span className="text-red-500">*</span></label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Masukkan email"
              className="w-full"
            />
          </div>

          {/* Kata Sandi */}
          <div>
            <label className="block text-sm font-medium">Kata Sandi</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Masukkan kata sandi baru (opsional)"
              className="w-full"
            />
          </div>

          {/* Tombol Submit & Batal */}
          <div className="flex justify-end mt-6 space-x-4">
            <Button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              variant="secondary"
              className="px-6 py-2 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-[#A76545] hover:bg-red-700 text-white"
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
