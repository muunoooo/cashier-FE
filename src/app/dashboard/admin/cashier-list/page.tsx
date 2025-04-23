import dynamic from "next/dynamic";

const CashierList = dynamic(() => import("./CashierList"), { ssr: false });

export default function CashierListPage() {
  return <CashierList />;
}
