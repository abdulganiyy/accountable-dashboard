import React, { FC, InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register: any;
  errorMessage?: any;
}

const TextInput: FC<TextInputProps> = ({
  label,
  placeholder,
  id,
  name,
  register,
  errorMessage,
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-y-2 font-normal text-sm">
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        className="px-3 py-3.5 border-[1px] outline-none border-[#EAEDEF] rounded-md"
        placeholder={placeholder}
        {...rest}
        {...register(name)}
      />
      <p className="text-red-600">{errorMessage}</p>
    </div>
  );
};

// peer focus:outline-none focus:border-[#1B4B66] invalid:outline-none invalid:border-[#B00020] focus:shadow-sm

export default TextInput;
