import dynamic from "next/dynamic";

const ProductList= dynamic(() => import("./ProductList"), { ssr: false });

export default function ProductListPage() {
  return <ProductList/>;
}
