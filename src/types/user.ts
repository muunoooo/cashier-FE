export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "ADMIN" | "CASHIER";
  createdAt: string;
}
