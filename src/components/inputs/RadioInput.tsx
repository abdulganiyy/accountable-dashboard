import React, { FC, InputHTMLAttributes } from "react";

interface RadioInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: any;
}

const RadioInput: FC<RadioInputProps> = ({
  label,
  placeholder,
  id,
  name,
  register,
  ...rest
}) => {
  return (
    <label
      htmlFor={id}
      className="flex gap-x-2 items-center font-normal text-sm cursor-pointer"
    >
      <input
        type="radio"
        id={id}
        className="hidden peer w-3 h-3 border-[.5px] border-[#00085A] bg-white checked:bg-[#00085A] checked:border-[3px]"
        placeholder={placeholder}
        {...rest}
        {...register(name)}
      />
      <span className="w-3 h-3 border-[.5px] border-[#00085A] rounded-full peer-checked:border-[3px] shadow-sm"></span>
      <span>{label && <span className="text-[#555555]">{label}</span>}</span>
    </label>
  );
};

export default RadioInput;
