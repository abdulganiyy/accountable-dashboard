import React, { FC, InputHTMLAttributes } from "react";

interface EmailInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: any;
  errorMessage?: any;
}

const EmailInput: FC<EmailInputProps> = ({
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
        type="email"
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

export default EmailInput;
