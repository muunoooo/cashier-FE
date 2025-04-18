export interface ITransaction {
  id: string;
  totalPrice: number; 
  paymentMethod: string;
  cashPaid: number | null;
  change: number | null;
  createdAt: string;
  cashier: {
    id: string;
    name: string;
  };
  shift: {
    id: string;
    startedAt: string;
    endedAt: string | null;
  };
  items: ITransactionItem[];
}

export interface ITransactionItem {
  id: string; 
  productId: string;
  productName: string; 
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ITransactionPagination {
  data: ITransaction[];
  pagination: {
    total: number; 
    page: number;
    limit: number;
    totalPages: number;
  };
}
