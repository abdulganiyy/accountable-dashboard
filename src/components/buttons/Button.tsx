import React, { FC, ButtonHTMLAttributes } from "react";
import { ClipLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  isLoading,
  className: cls,
  ...rest
}) => {
  return (
    <button
      className={twMerge(
        "h-[48px] w-full rounded-md flex items-center justify-center bg-[#071A7E] text-white disabled:opacity-50",
        cls
      )}
      {...rest}
    >
      {isLoading ? <ClipLoader color="#FF8C4B" /> : children}
    </button>
  );
};

export default Button;
