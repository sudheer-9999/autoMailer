import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  autoComplete?: string;
  register: UseFormRegister<any>;
  errors?: FieldError;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type,
  label,
  autoComplete,
  register,
  errors,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          {...register(name)}
          type={type}
          autoComplete={autoComplete}
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        {errors && (
          <p className="mt-2 text-sm text-red-600">{errors.message}</p>
        )}
      </div>
    </div>
  );
};

export default InputField;
