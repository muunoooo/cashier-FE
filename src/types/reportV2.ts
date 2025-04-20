export interface DailySalesResponse {
  _sum: {
    totalPrice: number;
  };
}

export interface IReportItem {
  productId: string;
  productName: string;
  subtotal: number;
  quantity: number;
}

interface Cashier {
  id: string;
  name: string;
  email: string;
}

export interface IReportShift {
  shiftId: string;
  startedAt: string;
  endedAt: string | null;
  cashier: Cashier;
  startCash: number;
  endCash: number | null;
  totalTransaction: number;
  totalDebit: number;
  totalCash: number;
  isActive: boolean;
}

export interface IShiftReportResponse {
  data: IReportShift[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}
