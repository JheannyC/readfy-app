import React from "react";
import { BookFormData, FieldError } from "../../types/error";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  fieldName: keyof BookFormData;
  errors: FieldError;
  required?: boolean;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  fieldName,
  errors,
  required = false,
}: SelectFieldProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {/* select com seta customizada */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-lg px-3 pr-10 py-2 appearance-none focus:outline-none focus:ring-2 focus:border-transparent ${
            errors[fieldName]
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* ícone da seta — posicionado com Tailwind */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="h-4 w-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {errors[fieldName] && (
        <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
      )}
    </div>
  );
}
