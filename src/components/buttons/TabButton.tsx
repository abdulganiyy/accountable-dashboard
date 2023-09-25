import React, { FC, ButtonHTMLAttributes } from "react";
import { ClipLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";

interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  active?: boolean;
}

const TabButton: FC<TabButtonProps> = ({
  children,
  active = false,
  className: cls,
  ...rest
}) => {
  return (
    <button
      className={twMerge(
        "py-2 px-4 rounded-[12px] flex items-center justify-center bg-[#F3F3F3] text-[#060809]",
        active && "bg-[#E58A7B] text-[#FFFFFF]",
        cls
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default TabButton;
