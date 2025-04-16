"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiTrash2 } from "react-icons/fi";
import { deleteProduct } from "@/api/product";

interface DeleteProductDialogProps {
  productId: string;
  name: string;
  onProductDeleted: () => void;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  productId,
  name,
  onProductDeleted,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProduct(productId);
      onProductDeleted();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <FiTrash2 className="cursor-pointer text-red-500 hover:text-red-700" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Delete Product
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Are you sure you want to delete the product <strong>{name}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mt-6 space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
