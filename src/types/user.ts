export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "ADMIN" | "CASHIER";
  createdAt: string;
}
export interface IUserPagination {
  data: IUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IUserUpdate {
  name: string;
  email: string;
  password?: string | null
}
