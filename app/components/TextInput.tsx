import React from 'react';
import { useFormContext } from 'react-hook-form';

export const TextInput = ({
  name,
  placeholder,
  label,
}: {
  label: string;
  name: string;
  placeholder: string;
}) => {
  const { register, formState } = useFormContext();
  return (
    <div>
      <p>{label}</p>
      <input
        type='text'
        {...register(name)}
        placeholder={placeholder}
        className={`border border-1 px-2 py-1 outline-0 rounded-lg w-[450px] ${
          formState.errors[name] ? 'border-red-600' : ''
        }`}
      />
    </div>
  );
};
