import dynamic from "next/dynamic";

const TransactionHistoryList = dynamic(() => import("./TransactionHistoryList"), { ssr: false });

export default function TransactionHistoryListPage() {
  return <TransactionHistoryList />;
}
