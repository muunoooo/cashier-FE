"use client";

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
import { createUser } from "@/app/api/user";
import { useSession } from "next-auth/react";
import { showToast } from "@/utils/toast-handler";
import { AddUserSchema } from "@/schema/user";
import { Plus } from "lucide-react";

interface CreateUserDialogProps {
  onUserCreated: () => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  onUserCreated,
}) => {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (
    values: { name: string; email: string; password: string },
    {
      setSubmitting,
      resetForm,
    }: FormikHelpers<{ name: string; email: string; password: string }>
  ) => {
    if (!session?.user?.accessToken) {
      showToast("Anda tidak memiliki akses", "error");
      return;
    }

    try {
      const result = await createUser(session.user.accessToken, {
        ...values,
        role: "ADMIN",
      });

      if (result) {
        showToast(`Admin "${values.name}" berhasil dibuat`, "success");
        onUserCreated();
        resetForm();
        setIsDialogOpen(false);
      } else {
        showToast("Gagal membuat pengguna", "error");
      }
    } catch (error) {
      showToast(`Terjadi kesalahan: ${error}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg bg-[#F00001]">
          <Plus /> Add New Cashier
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[380px] md:w-max">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Daftar Admin Baru
          </DialogTitle>
          <DialogDescription className="text-sm">
            Isi bidang yang diperlukan untuk membuat admin baru.
            <span className="text-red-500 font-bold"> *</span> wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
          }}
          validationSchema={AddUserSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 mt-4">
              
              <div>
                <label className="block text-sm font-medium">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <Field
                  as={Input}
                  name="name"
                  placeholder="Masukkan nama lengkap"
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
                  placeholder="Masukkan email"
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
                  Kata Sandi <span className="text-red-500">*</span>
                </label>
                <Field
                  as={Input}
                  name="password"
                  type="password"
                  placeholder="Masukkan kata sandi"
                  className="w-full"
                />
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
                  variant="destructive"
                  className="px-6 py-2 rounded-lg"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg shadow"
                >
                  {isSubmitting ? "Membuat..." : "Buat"}
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
