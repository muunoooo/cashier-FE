"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiTrash } from "react-icons/fi";
import { softDeleteUser } from "@/api/user";

interface DeleteUserDialogProps {
  userId: string;
  name:string
  onUserDeleted: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  userId,
  name,
  onUserDeleted,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await softDeleteUser(userId);
      onUserDeleted();
      setIsDialogOpen(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <FiTrash className="cursor-pointer text-red-500 hover:text-red-700" />
      </DialogTrigger>
      <DialogContent className="w-[380px] md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Delete User
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Are you sure you want to delete <span className="text-orange-500">{name}</span> account? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-sm text-gray-700">
            Deleting this user will remove all related data. Please ensure that
            you want to proceed.
          </p>

          {/* Delete & Cancel Buttons */}
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
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-[#A76545] hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
