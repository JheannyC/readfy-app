import React from "react";
import { BookFormData } from "../../types/error";
import { FieldError } from "../../types/error";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  fieldName: keyof BookFormData;
  errors: FieldError;
}

export default function SelectField({ label, value, onChange, options, fieldName, errors }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
          errors[fieldName] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {errors[fieldName] && (
        <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
      )}
    </div>
  );
}
