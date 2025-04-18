"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { endShift } from "@/api/shift";
import { FiLogOut } from "react-icons/fi";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { formatToRupiah, parseRupiahString } from "@/helpers/Currency";

interface EndShiftDialogProps {
  onShiftEnded: () => void;
}

const EndShiftDialog: React.FC<EndShiftDialogProps> = ({ onShiftEnded }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full mt-6 flex gap-2 items-center justify-center bg-[#ACC572]"
        >
          <FiLogOut />
          End Shift
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Confirm End Shift
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Enter the cash currently in the machine and confirm ending your shift.
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{ endCash: 0 }}
          validationSchema={Yup.object({
            endCash: Yup.number()
              .min(0, "Cash tidak boleh negatif")
              .required("Ending cash wajib diisi"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setIsEnding(true);
              await endShift(values.endCash);
              onShiftEnded();
              setIsDialogOpen(false);
            } catch (error) {
              console.error("End shift failed:", error);
            } finally {
              setIsEnding(false);
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mt-4">
                <label className="block text-sm font-medium">Ending Cash</label>
                <Field name="endCash">
                  {({ field, form }: FieldProps<number>) => (
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={formatToRupiah(field.value)}
                      onChange={(e) => {
                        const parsed = parseRupiahString(e.target.value);
                        form.setFieldValue("endCash", parsed);
                      }}
                      placeholder="Contoh: 50.000"
                      className="mt-2"
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="endCash"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div className="flex justify-end mt-6 space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting || isEnding}
                >
                  {isEnding ? "Ending..." : "End Shift"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EndShiftDialog;
