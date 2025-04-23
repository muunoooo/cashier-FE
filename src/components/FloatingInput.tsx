"use client";

import React from "react";
import { useField } from "formik";

interface FloatingInputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  name,
  label,
  type = "text",
  required = false,
  autoComplete = "off",
  disabled = false,
}) => {
  const [field, meta] = useField(name);

  return (
    <div className="mb-6">
      <div className="relative w-full">
        <input
          {...field}
          id={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder=" "
          className={`bg-black peer w-full border rounded-md px-3 pt-[1.625rem] pb-2 text-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent 
            disabled:bg-black disabled:cursor-not-allowed 
            ${meta.touched && meta.error ? "border-red-500 focus:ring-red-500" : "border-black"}
          `}
        />
        <label
          htmlFor={name}
          className="absolute left-3 top-2 text-sm text-gray-500 transition-all px-1 pointer-events-none z-10
            peer-placeholder-shown:top-[1.625rem] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
        >
          {label}
        </label>
      </div>
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};
