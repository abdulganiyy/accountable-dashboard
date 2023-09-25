"use client";
import React, { FC, useState, useEffect, SelectHTMLAttributes } from "react";
import { countries } from "@/utils";
import { Icon } from "@iconify/react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  register?: any;
  setValue?: any;
  options?: any[];
}

const SelectTwo: FC<SelectProps> = ({
  label,
  placeholder,
  id,
  name,
  register,
  setValue,
  options,
  ...rest
}) => {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState<any>("");

  useEffect(() => {
    setValue(current);
  }, [current, setValue]);

  return (
    <div className="flex flex-col gap-y-2 font-normal text-sm">
      <label htmlFor={id}>{label}</label>
      <div className="border-[1px] border-[#EAEDEF] rounded-md cursor-pointer h-[48px]">
        <div
          onClick={() => setShow(!show)}
          className="px-3 py-3.5 h-full flex items-center justify-between gap-x-1 relative"
        >
          {show && (
            <div className="absolute top-full z-10 flex flex-col w-full gap-y-2 h-[150px] overflow-y-auto left-0 border-2 p-2 bg-white rounded-md border-[#EAEDEF]">
              {options?.map((option: any) => {
                return (
                  <span
                    onClick={() => {
                      setCurrent(option.value);
                    }}
                    key={option.key}
                    className="flex items-center gap-x-2"
                  >
                    {option.key}
                  </span>
                );
              })}
            </div>
          )}
          <span>{current ? current : placeholder}</span>
          <span className="cursor-pointer bg-[#F2F3F7] rounded-md p-1 px-2">
            <MdOutlineKeyboardArrowDown size={20} color="#A0A0A0" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectTwo;
