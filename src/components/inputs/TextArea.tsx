import React, { FC, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  register: any;
  errorMessage?: any;
}

const TextArea: FC<TextAreaProps> = ({
  label,
  placeholder,
  id,
  name,
  className: cls,
  register,
  errorMessage,
  ...rest
}) => {
  return (
    <div className={"flex flex-col gap-y-2 font-normal text-sm"}>
      <label htmlFor={id}>{label}</label>
      <textarea
        type="text"
        id={id}
        className={twMerge(
          "px-3 py-3.5 border-[1px] outline-none border-[#EAEDEF] rounded-md h-[83px]",
          cls
        )}
        placeholder={placeholder}
        {...rest}
        {...register(name)}
      />
      <p className="text-red-600">{errorMessage}</p>
    </div>
  );
};

// peer focus:outline-none focus:border-[#1B4B66] invalid:outline-none invalid:border-[#B00020] focus:shadow-sm

export default TextArea;
