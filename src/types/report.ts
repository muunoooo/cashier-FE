// export Interface untuk ringkasan transaksi harian
export interface IReportSummary {
  totalTransaction: number;
  totalIncome: number;
  totalCash: number;
  totalDebit: number;
}

// export Interface untuk ringkasan per item (produk)
export interface IPerItemSummary {
  name: string;
  totalQty: number;
}

// export Interface untuk data pagination
export interface IPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalTransactions: number;
}

// export Interface untuk detail produk dalam transaksi
export interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  category: string;
}

// Interface untuk item dalam transaksi
export interface ITransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: IProduct;
}

// Interface untuk informasi kasir
export interface ICashier {
  name: string;
  email: string;
}

// Interface untuk transaksi
export interface ITransaction {
  id: string;
  shiftId: string;
  cashierId: string;
  totalPrice: number;
  paymentMethod: string;
  cashPaid: number;
  debiCard: number | null;
  debitCardNo: string | null;
  change: number;
  createdAt: string;
  items: ITransactionItem[];
  cashier: ICashier;
}

// Interface untuk shift kasir
export interface IShift {
  cashier: ICashier;
  startedAt: string;
  endedAt: string | null;
  startCash: number;
  endCash: number | null;
  totalTransaction: number | null;
  totalCash: number | null;
  totalDebit: number | null;
}
// Interface untuk data laporan harian secara keseluruhan
export interface IDailyReport {
  date: string;
  summary: IReportSummary;
  perItemSummary: IPerItemSummary[];
  transactions: ITransaction[];
  shifts: IShift[];
  pagination: IPagination;
}
