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
import { Input } from "@/components/ui/input";
import { IProduct } from "@/types/product";
import { updateProduct } from "@/api/product";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { formatToRupiah, parseRupiahString } from "@/helpers/Currency";

interface UpdateProductDialogProps {
  product: IProduct;
  onProductUpdated: () => void;
}

const UpdateProductDialog: React.FC<UpdateProductDialogProps> = ({
  product,
  onProductUpdated,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [priceDisplay, setPriceDisplay] = useState(
    formatToRupiah(product.price)
  );
  const [stock, setStock] = useState(product.stock);
  const [category, setCategory] = useState(product.category);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const price = parseRupiahString(priceDisplay);

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price.toString());
      formData.append("stock", stock.toString());
      formData.append("category", category);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await updateProduct(product.id, formData);
      toast.success("Product updated successfully!");
      onProductUpdated();
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product.");
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
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Update Product
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update the product details below. Uploading a new image will replace
            the existing one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <Input
              value={priceDisplay}
              onChange={(e) => setPriceDisplay(formatToRupiah(e.target.value))}
              placeholder="Rp 10,000"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Stock</label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              placeholder="Stock quantity"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "FOOD" | "DRINK")}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Category</option>
              <option value="FOOD">FOOD</option>
              <option value="DRINK">DRINK</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Upload New Product Image
            </label>
            <Input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) setSelectedFile(file);
              }}
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

export default UpdateProductDialog;
