"use client";
import React, { FC, useState, useEffect, SelectHTMLAttributes } from "react";
import { countries } from "@/utils";
import { Icon } from "@iconify/react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface SelectRoleProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  register?: any;
  setValue?: any;
}

const SelectRole: FC<SelectRoleProps> = ({
  label,
  placeholder,
  id,
  name,
  register,
  setValue,

  ...rest
}) => {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState<any>("");

  const options = [
    { value: "admin", key: "Admin", helperText: "" },
    { value: "manager", key: "Manager", helperText: "" },
  ];

  useEffect(() => {
    setValue(name, current, { shouldValidate: true });
  }, [current, setValue, name]);

  return (
    <div className="flex flex-col gap-y-2 font-normal text-sm">
      <label htmlFor={id}>{label}</label>
      <div className="border-[1px] border-[#EAEDEF] rounded-md cursor-pointer h-[48px]">
        <div
          onClick={() => setShow(!show)}
          className="px-3 py-3.5 h-full flex items-center justify-between gap-x-1 relative"
        >
          {show && (
            <div className="absolute top-full z-50 flex flex-col w-full gap-y-2 text-black right-0 border-2 p-2 bg-white border-[#EAEDEF] rounded-[16px]">
              {options?.map((option: any) => {
                return (
                  <span
                    onClick={() => {
                      setCurrent(option.value);
                    }}
                    key={option.key}
                    className="flex flex-col gap-y-2"
                  >
                    {option.key}
                    {Boolean(option?.helperText) && (
                      <span className="text-[#4C5259]">
                        {option.helperText}
                      </span>
                    )}
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

export default SelectRole;
