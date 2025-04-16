"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IProduct } from "@/types/product";
import { getProductById } from "@/api/product";
import { Button } from "@/components/ui/button";
import { formatDateToDate } from "@/helpers/Date";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/helpers/Currency";
import { GiAppleSeeds } from "react-icons/gi";

interface ProductDetailDialogProps {
  productId: string;
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  productId,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductDetail = async () => {
    setIsLoading(true);
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err) {
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      fetchProductDetail();
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <GiAppleSeeds className="cursor-pointer text-green-500 hover:text-green-700" />
      </DialogTrigger>
      <DialogContent className="w-[420px] md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Product Details
          </DialogTitle>
          <DialogDescription>
            Complete information about the product
          </DialogDescription>
        </DialogHeader>

        {isLoading || !product ? (
          <div className="space-y-3 mt-4">
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
          </div>
        ) : (
          <div className="mt-4 flex flex-col md:flex-row gap-4 text-sm">
            <div className="flex-1 space-y-2">
              <div>
                <strong>Product Name:</strong> {product.name}
              </div>
              <div>
                <strong>Price:</strong> {formatRupiah(product.price)}
              </div>
              <div>
                <strong>Stock:</strong> {product.stock}
              </div>
              <div>
                <strong>Category:</strong> {product.category}
              </div>
              <div>
                <strong>Created At:</strong>{" "}
                {formatDateToDate(product.createdAt)}
              </div>
            </div>

            {product.imageUrl && (
              <div className="w-full md:w-48 flex justify-center items-start">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="rounded-md max-h-48 object-contain border"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDialogOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
