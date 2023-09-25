"use client";
import React, { FC, InputHTMLAttributes, useState } from "react";
import { RxEyeClosed } from "react-icons/rx";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: any;
  errorMessage?: any;
}

const PasswordInput: FC<PasswordInputProps> = ({
  label,
  placeholder,
  id,
  name,
  register,
  errorMessage,
  ...rest
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex flex-col gap-y-2 font-normal text-sm">
      <span
        onClick={() => setShow(!show)}
        className="absolute cursor-pointer right-2 top-[35px] bg-[#F2F3F7] rounded-md p-2"
      >
        {show ? <RxEyeClosed /> : "show"}
      </span>
      <label htmlFor={id}>{label}</label>
      <input
        type={show ? "text" : "password"}
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

export default PasswordInput;
