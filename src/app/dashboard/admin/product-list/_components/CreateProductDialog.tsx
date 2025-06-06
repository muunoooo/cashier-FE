import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FieldProps,
} from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { createProduct } from "@/api/product";
import { formatToRupiah, parseRupiahString } from "@/helpers/Currency";
import { CreateProductSchema } from "@/lib/schema";

type FormValues = {
  name: string;
  price: number;
  stock: number;
  category: string;
};

interface CreateProductDialogProps {
  onProductCreated: () => void;
}



const CreateProductDialog: React.FC<CreateProductDialogProps> = ({
  onProductCreated,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (
    values: { name: string; price: number; stock: number; category: string },
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price.toString());
      formData.append("stock", values.stock.toString());
      formData.append("category", values.category);
      if (selectedFile) formData.append("file", selectedFile);

      await createProduct(formData);

      toast.success(`Product "${values.name}" created susccesfully`);
      onProductCreated();
      resetForm();
      setSelectedFile(null);
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);

      toast.error("Failed Created Product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg bg-[#A76545]">
          <Plus /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[380px] md:w-max">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Add New Product
          </DialogTitle>
          <DialogDescription className="text-sm">
            Fill in the required fields to create a new product.
            <span className="text-red-500 font-bold"> *</span> is required.
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            name: "",
            price: 0,
            stock: 0,
            category: "",
          }}
          validationSchema={CreateProductSchema}
          onSubmit={handleSubmit}
          validateOnBlur={true}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium">
                  Product Name<span className="text-red-500">*</span>
                </label>
                <Field as={Input} name="name" placeholder="Product Name" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Price<span className="text-red-500">*</span>
                </label>
                <Field name="price">
                  {({ field, form }: FieldProps<number>) => (
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={formatToRupiah(field.value)}
                      onChange={(e) => {
                        const parsed = parseRupiahString(e.target.value);
                        form.setFieldValue("price", parsed);
                      }}
                      placeholder="Contoh: 10.000"
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Stock<span className="text-red-500">*</span>
                </label>
                <Field
                  as={Input}
                  type="number"
                  name="stock"
                  placeholder="Jumlah Stok"
                />
                <ErrorMessage
                  name="stock"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Category<span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="category"
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Choose Category</option>
                  <option value="FOOD">Food</option>
                  <option value="DRINK">Drink</option>
                </Field>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Product Photo<span className="text-red-500">*</span>
                </label>
                <Input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    if (e.currentTarget.files?.[0]) {
                      setSelectedFile(e.currentTarget.files[0]);
                    }
                  }}
                  required
                />
              </div>

              <div className="flex justify-end mt-6 space-x-4">
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg bg-[#A76545] hover:bg-red-700 text-white"
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDialog;
