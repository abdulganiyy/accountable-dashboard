"use client";
import React, { FC, useState, useEffect, InputHTMLAttributes } from "react";
import { countries } from "@/utils";
import { Icon } from "@iconify/react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: any;
  setValue?: any;
  trigger?: any;
  error?: any;
}

const PhoneInput: FC<PhoneInputProps> = ({
  label,
  placeholder,
  id,
  name,
  register,
  setValue,
  trigger,
  error,
  ...rest
}) => {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState("NG");
  const [phone, setPhone] = useState("234");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    setValue("phone", `${phone}${phoneNumber}`, {
      shouldValidate: true,
      shouldTouch: true,
      shouldDirty: true,
    });
  }, [setValue, phone, phoneNumber, trigger]);

  return (
    <div className="flex flex-col gap-y-2 font-normal text-sm">
      <label htmlFor={id}>{label}</label>
      <div className="flex border-[1px] border-[#EAEDEF] rounded-md cursor-pointer">
        <div
          onClick={() => setShow(!show)}
          className="border-r-[1px] px-3 py-3.5 flex items-center gap-x-1 relative"
        >
          {show && (
            <div className="absolute top-full z-10 flex flex-col w-[100px] gap-y-2 h-[100px] overflow-y-scroll left-0 border-2 p-2 bg-[#EAEDEF] border-[#EAEDEF]">
              {countries.map((country: any) => {
                return (
                  <span
                    onClick={() => {
                      setCode(country.code);
                      setPhone(country.phone);
                    }}
                    key={country.code}
                    className="flex items-center"
                  >
                    <Icon icon={`flag:${country.code.toLowerCase()}-1x1`} />+
                    {country.phone}
                  </span>
                );
              })}
            </div>
          )}
          <Icon icon={`flag:${code.toLowerCase()}-1x1`} />+{phone}
          <MdOutlineKeyboardArrowDown size={20} color="#A0A0A0" />
        </div>
        <input
          type="text"
          id={id}
          className="px-3 py-3.5 outline-none"
          placeholder={placeholder}
          {...rest}
          //   {...register(name)}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      {error && <span className="text-red-600">{error.message}</span>}
    </div>
  );
};

export default PhoneInput;
