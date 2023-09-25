import React, { FC, useState } from "react";

interface RadioInputTwoProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (val: any) => void;
}

const RadioInputTwo: FC<RadioInputTwoProps> = ({
  id,
  name,
  value,
  label,
  onChange,
  checked,
}) => {
  //   const [inputValue, setInputValue] = useState(currentValue);
  return (
    <label
      htmlFor={id}
      className="flex gap-x-[10px] items-center cursor-pointer"
    >
      <input
        type="radio"
        name={name}
        value={value}
        id={id}
        onChange={onChange}
        checked={checked}
        className="hidden peer w-3 h-3 border-[.5px] border-[#00085A] bg-white checked:bg-[#00085A] checked:border-[3px]"
      />
      <span className="w-3 h-3 border-[.5px] border-[#00085A] rounded-full peer-checked:border-[3px] shadow-sm inline-block"></span>
      {label}
    </label>
  );
};

export default RadioInputTwo;
