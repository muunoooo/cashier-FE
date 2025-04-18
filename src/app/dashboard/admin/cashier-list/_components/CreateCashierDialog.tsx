import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { registerUser } from "@/api/auth";
import { RegisterSchema } from "@/lib/schema";
import { useSession } from "@/contexts/SessionContext";

interface CreateUserDialogProps {
  onUserCreated: () => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  onUserCreated,
}) => {
  const { user } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: { name: string; email: string; password: string },
    {
      setSubmitting,
      resetForm,
    }: FormikHelpers<{ name: string; email: string; password: string }>
  ) => {
    if (!user) {
      toast("No user session found. Please log in first.");
      return;
    }

    try {
      const result = await registerUser(values);

      if (result) {
        toast(`Cashier "${values.name}" was successfully created`);
        onUserCreated();
        resetForm();
        setIsDialogOpen(false);
      } else {
        toast("Failed to create user");
      }
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg bg-[#A76545]">
          <Plus /> Add Cashier
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[380px] md:w-max">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Add New Cashier
          </DialogTitle>
          <DialogDescription className="text-sm">
            Fill in the required fields to create a new admin.
            <span className="text-red-500 font-bold"> *</span> is required.
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <Field
                  as={Input}
                  name="name"
                  placeholder="Input name..."
                  className="w-full"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <Field
                  as={Input}
                  name="email"
                  type="email"
                  placeholder="Input email..."
                  className="w-full"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Kata Sandi */}
              <div>
                <label className="block text-sm font-medium">
                  Password <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Field
                    as={Input}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Input password..."
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Tombol Submit & Batal */}
              <div className="flex justify-end mt-6 space-x-4">
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6 py-2 rounded-lg"
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

export default CreateUserDialog;
