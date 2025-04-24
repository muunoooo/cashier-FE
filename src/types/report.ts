export interface IReportSummary {
  totalTransaction: number;
  totalIncome: number;
  totalCash: number;
  totalDebit: number;
}

export interface IPerItemSummary {
  name: string;
  totalQty: number;
}

export interface IPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalTransactions: number;
}

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

export interface ITransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: IProduct;
}

export interface ICashier {
  name: string;
  email: string;
}

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

export interface IDailyReport {
  date: string;
  summary: IReportSummary;
  perItemSummary: IPerItemSummary[];
  transactions: ITransaction[];
  shifts: IShift[];
  pagination: IPagination;
}
