"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useField } from "formik";

interface FloatingPasswordInputProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

export const FloatingPasswordInput: React.FC<FloatingPasswordInputProps> = ({
  name,
  label = "Password",
  required = false,
  disabled = false,
  autoComplete = "off",
}) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-6">
      <div className="relative w-full">
        <input
          {...field}
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder=" "
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`bg-black peer w-full border rounded-md px-3 pt-[1.625rem] pb-2 text-sm 
            focus:outline-none focus:ring-2 placeholder-transparent
            disabled:bg-black disabled:cursor-not-allowed
            ${meta.touched && meta.error ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-blue-500"}
          `}
        />
        <label
          htmlFor={name}
          className="absolute left-3 top-2 text-sm text-gray-500 transition-all  px-1 pointer-events-none z-10
            peer-placeholder-shown:top-[1.625rem] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
        >
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[1.625rem] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} className="text-white" /> : <Eye size={18} className="text-white"/>}
        </button>
      </div>
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};
