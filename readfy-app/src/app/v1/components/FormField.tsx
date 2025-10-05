import React from "react";
import { BookFormData, FieldError } from "../../types/error";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  fieldName: keyof BookFormData;
  errors: FieldError;
  min?: string | number;
  max?: string | number;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}

export default function FormField({
  label,
  type,
  value,
  onChange,
  fieldName,
  errors,
  min,
  max,
  placeholder,
  maxLength,
  required = false,
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (maxLength) {
      val = val.slice(0, maxLength);
    }

    onChange(val);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        placeholder={placeholder}
        maxLength={type !== "number" ? maxLength : undefined}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
          errors[fieldName] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {errors[fieldName] && (
        <p className="text-red-500 mt-1" style={{ fontSize: "12px" }}>
          {errors[fieldName]}
        </p>
      )}
    </div>
  );
}
