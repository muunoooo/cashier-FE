import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
});

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("New password is required")
    .min(5, "Password must be at least 5 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const AddressSchema = Yup.object().shape({
  street: Yup.string().required("Street required"),
  city: Yup.string().required("City required"),
});

export const RequestOrderSchema = Yup.object().shape({
  addressId: Yup.number().required("Reuired"),
});

export const UpdateEmailSchema = Yup.object().shape({
  newEmail: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const CreateProductSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  price: Yup.number().required("Price is required"),
  stock: Yup.number().required("Stock is required"),
  category: Yup.string()
    .oneOf(["FOOD", "DRINK"])
    .required("Category is required"),
});
