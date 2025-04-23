import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { formatRupiah } from "@/helpers/Currency";
  import { formatDateToDate } from "@/helpers/Date";
  import { ToTitleCase } from "@/helpers/ToTitleCase";
  import UpdateProductDialog from "./UpdateProductDialog";
  import DeleteProductDialog from "./DeleteProductDialog";
  import ProductDetailDialog from "./ProductDetailDialog";
  import { IProductPagination } from "@/types/product";
  
  interface Props {
    products: IProductPagination | null;
    currentPage: number;
    onRefresh: () => void;
  }
  
  const limit = 10;
  
  const ProductTable = ({ products, currentPage, onRefresh }: Props) => {
    return (
      <div className="w-full shadow rounded-md border border-gray-200">
        <Table className="w-full p-2">
          <TableHeader>
            <TableRow className="text-sm">
              <TableHead className="text-center">#</TableHead>
              <TableHead>PRODUCT</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead className="hidden sm:table-cell">CREATED</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.data?.map((product, index) => (
              <TableRow key={product.id} className="hover:bg-gray-50 text-sm">
                <TableCell className="text-center">
                  {(currentPage - 1) * limit + index + 1}
                </TableCell>
                <TableCell>{ToTitleCase(product.name)}</TableCell>
                <TableCell>{formatRupiah(product.price)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatDateToDate(product.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <ProductDetailDialog productId={product.id} />
                    <UpdateProductDialog product={product} onProductUpdated={onRefresh} />
                    <DeleteProductDialog productId={product.id} name={product.name} onProductDeleted={onRefresh} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  export default ProductTable;
  