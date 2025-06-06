export interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: "FOOD" | "DRINK";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface IProductPagination {
  data: IProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: "FOOD" | "DRINK";
  sortBy?: "name" | "price" | "stock" | "createdAt";
  order?: "asc" | "desc";
}