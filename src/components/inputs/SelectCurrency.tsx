"use client";
import React, { FC, useState, useEffect, InputHTMLAttributes } from "react";
import { countries, currencies, currenciesDetails } from "@/utils";
import { Icon } from "@iconify/react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface SelectCurrencyProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: any;
  setValue?: any;
  errorMessage?: any;
}

const SelectCurrency: FC<SelectCurrencyProps> = ({
  label,
  placeholder,
  id,
  name,
  register,
  setValue,
  errorMessage,
  ...rest
}) => {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState("NG");
  //   const [currencyCode, setCurrencyCode] = useState("NGN");
  // `${
  //   currenciesDetails[currencies[code.toUpperCase()]]?.name.split(" ")[1]
  // }`,

  useEffect(() => {
    setValue(name, `${currencies[code.toUpperCase()]}`, {
      shouldValidate: true,
    });
  }, [code, setValue, name]);

  return (
    <div className="flex flex-col gap-y-2 font-normal text-sm">
      <label htmlFor={id}>{label}</label>
      <div className="border-[1px] border-[#EAEDEF] rounded-md cursor-pointer">
        <div
          onClick={() => setShow(!show)}
          className="px-3 py-3.5 flex items-center justify-between gap-x-1 relative"
        >
          {show && (
            <div className="absolute top-full z-10 flex flex-col w-full gap-y-2 h-[150px] overflow-y-scroll left-0 border-2 p-2 bg-white border-[#EAEDEF]">
              {countries.map((country: any) => {
                return (
                  <span
                    onClick={() => {
                      setCode(country.code);
                    }}
                    key={country.code}
                    className="flex items-center gap-x-2"
                  >
                    <Icon icon={`flag:${country.code.toLowerCase()}-1x1`} />
                    {/* {
                      currenciesDetails[currencies[country.code.toUpperCase()]]
                        .name
                    } */}
                    <span>({currencies[country.code.toUpperCase()]})</span>
                  </span>
                );
              })}
            </div>
          )}
          <span className="flex items-center gap-x-2">
            <Icon icon={`flag:${code.toLowerCase()}-1x1`} />
            {
              currenciesDetails[currencies[code.toUpperCase()]].name.split(
                " "
              )[1]
            }
            <span>({currencies[code.toUpperCase()]})</span>
          </span>
          <MdOutlineKeyboardArrowDown size={20} color="#A0A0A0" />
        </div>
      </div>
      <p className="text-red-600">{errorMessage}</p>
    </div>
  );
};

export default SelectCurrency;
